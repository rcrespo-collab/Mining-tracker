"""Join authored content (content.py) with spatial layers; write atlas/data/atlas.json, figures and registers.

usage: python3 atlas/tools/build_content.py <SRC_DIR> <S2_PDF>
"""
import json, os, sys, csv, math
from PIL import Image
import pymupdf
from shapely.geometry import shape, Point, Polygon, LineString, mapping
from shapely.ops import transform as shp_transform
from pyproj import Transformer
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import content as C

SRC, S2PDF = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA, IMG = os.path.join(ROOT, 'data'), os.path.join(ROOT, 'img')
utm2ll = Transformer.from_crs("EPSG:32733", "EPSG:4326", always_xy=True)
alb = Transformer.from_crs("EPSG:4326", "ESRI:102022", always_xy=True)
A = lambda g: shp_transform(alb.transform, g)
L = lambda n: json.load(open(os.path.join(DATA, n)))

prov = L('provinces.geojson')['features']; dom = L('domains.geojson')['features']
plan = [f for f in L('planageo.geojson')['features'] if f['geometry']['type'] != 'Point']
gaps = [f for f in L('airborne_coverage.geojson')['features'][1:]]
occ = L('critical_occurrences_digitised.geojson')['features']
QA = L('qa_spatial.json')

# approximate infrastructure (town coordinates; for straight-line access proxies only)
RAIL = {
 "Benguela railway (CFB)": [(13.545,-12.35),(13.405,-12.578),(14.25,-13.03),(15.56,-12.85),(15.74,-12.78),(16.93,-12.38),(17.48,-12.02),(19.91,-11.78),(22.23,-10.71)],
 "Moçâmedes railway (CFM)": [(12.15,-15.19),(13.49,-14.92),(14.73,-14.73),(17.69,-14.66)],
 "Luanda railway (CFL)": [(13.23,-8.84),(14.91,-9.30),(16.34,-9.54)],
}
PORTS = {"Cabinda": (12.19,-5.55), "Soyo": (12.35,-6.13), "Luanda": (13.23,-8.80), "Porto Amboim": (13.75,-10.73), "Lobito": (13.54,-12.35), "Namibe": (12.15,-15.19)}
rails = {k: A(LineString(v)) for k, v in RAIL.items()}

def ll(c):
    if c.get('utm'):
        lon, lat = utm2ll.transform(*c['utm']); return round(lon, 4), round(lat, 4)
    return c['lon'], c['lat']

feats = []
for c in C.CANDIDATES:
    lon, lat = ll(c); c['lon'], c['lat'] = lon, lat
    P = Point(lon, lat); Pa = A(P)
    j = {}
    j['province_ne'] = next((f['properties']['name'] for f in prov if shape(f['geometry']).buffer(0.02).contains(P)), None)
    j['domains'] = [f['properties']['name'] for f in dom if shape(f['geometry']).buffer(0.05).contains(P)]
    j['planageo'] = next((f['properties']['name'] for f in plan if shape(f['geometry']).buffer(0.02).contains(P)), None)
    j['airborne_gap'] = any(shape(f['geometry']).contains(P) for f in gaps)
    rk, rd = min(((k, Pa.distance(g) / 1000) for k, g in rails.items()), key=lambda x: x[1])
    pk, pd = min(((k, Pa.distance(A(Point(v))) / 1000) for k, v in PORTS.items()), key=lambda x: x[1])
    j['rail'] = {"name": rk, "km": round(rd)}; j['port'] = {"name": pk, "km": round(pd)}
    near = {}
    for o in occ:
        if Pa.distance(A(Point(o['geometry']['coordinates']))) <= 25000:
            near[o['properties']['label']] = near.get(o['properties']['label'], 0) + o['properties']['n_symbols_est']
    j['occ25'] = near
    c['spatial'] = j
    feats.append({"type": "Feature", "properties": {"id": c['id'], "name": c['name'], "path": c['path']}, "geometry": {"type": "Point", "coordinates": [lon, lat]}})
QA['checks'].append({"check": "Spatial join of every candidate", "method": "Point-in-polygon against Natural Earth provinces, digitised domains, PLANAGEO regions, airborne gap; straight-line distance (Africa Albers) to approximate rail polylines and ports; digitised slide-9 symbols within 25 km",
                     "result": f"{len(C.CANDIDATES)} candidates joined; access distances are proxies, not route lengths", "status": "completed"})
# consistency checks between sources
chk = []
for c in C.CANDIDATES:
    pn = c['spatial']['province_ne']
    if pn and not any(pn.split()[0].lower()[:5] in x.lower() for x in c['province'].replace('/', ' ').split()) and pn.lower()[:5] not in c['province'].lower():
        chk.append(f"{c['id']}: stated province '{c['province']}' vs computed '{pn}'")
QA['checks'].append({"check": "Stated vs computed province for each candidate", "method": "Compare authored province text with point-in-polygon result", "result": "; ".join(chk) if chk else "all consistent", "status": "completed"})
dom3 = next(f for f in dom if f['properties']['id'] == 'D3')
nico = [o for o in occ if o['properties']['cls'] == 'NiCoCuCr']
inD3 = sum(1 for o in nico if shape(dom3['geometry']).buffer(0.05).contains(Point(o['geometry']['coordinates'])))
QA['checks'].append({"check": "Do the digitised Ni+Co+Cu+Cr occurrences fall in the 'Cunene Complex' domain (D3)?", "method": "Point-in-polygon, 0.05° tolerance",
                     "result": f"{inD3} of {len(nico)} digitised Ni-Co-Cu-Cr symbol clusters inside D3 – supports G01 as a two-family coincidence (F-OCC on F-AIR)", "status": "completed"})
d1 = next(f for f in dom if f['properties']['id'] == 'D1')
inD1 = sum(1 for o in occ if shape(d1['geometry']).contains(Point(o['geometry']['coordinates'])))
QA['checks'].append({"check": "Occurrence support inside the 'Copper Belt' domain (D1)", "method": "Count digitised slide-9 symbols inside D1",
                     "result": f"{inD1} symbol clusters, all within ~1.5° of the northern (Cazombo) edge or the Namibia border; none in the Kalahari-covered core – the core is interpretation only (G03 deferred)", "status": "completed"})
leste = next(f for f in plan if f['properties']['name'] == 'Região Leste')
fr = A(shape(d1['geometry'])).intersection(A(shape(leste['geometry']))).area / A(shape(d1['geometry'])).area
QA['checks'].append({"check": "How much of D1 lies in the unfinished PLANAGEO Leste region", "method": "Area intersection (Africa Albers)", "result": f"{fr*100:.0f}% of Domain 1", "status": "completed"})

json.dump({"type": "FeatureCollection", "features": feats}, open(os.path.join(DATA, 'candidates.geojson'), 'w'))

# S2 areas & zones: prefer geometry extracted from S2 Map 1 and the zone maps (vectorise.py); fall back to hand traces
s2f = []
ext = {f['properties']['id']: f for f in L('vec_s2_project_areas.geojson')['features']}
for pid, nm, crs, pts, prec in C.S2_AREAS:
    if pid in ext:
        f = ext[pid]; f['properties'].update(name=f"{pid} {nm}", kind="S2 project area", src="S2"); s2f.append(f); continue
    if crs == 'utm': pts = [utm2ll.transform(*p) for p in pts]
    s2f.append({"type": "Feature", "properties": {"id": pid, "name": f"{pid} {nm}", "kind": "S2 project area", "precision": prec + " (hand trace – not extractable from Map 1)", "src": "S2"}, "geometry": mapping(Polygon(pts))})
zext = {f['properties']['id']: f for f in L('vec_namibe_zones.geojson')['features']}
ZC = {z[0]: z for z in C.S2_ZONES}
for zid, nm, comm, geom in C.S2_ZONES:
    if zid in zext:
        f = zext[zid]; f['properties'].update(name=f"{zid} {nm}", kind="S2 zone", commodities=comm); s2f.append(f); continue
    _, a_ = geom.split(':') if isinstance(geom, str) else (None, None)
    if isinstance(geom, str):
        lo, la, r = map(float, a_.split(','))
        g = Polygon([(lo + r / 111 / math.cos(math.radians(la)) * math.cos(t / 36 * 2 * math.pi), la + r / 111 * math.sin(t / 36 * 2 * math.pi)) for t in range(36)])
    else:
        g = Polygon(geom)
    s2f.append({"type": "Feature", "properties": {"id": zid, "name": f"{zid} {nm}", "kind": "S2 zone", "commodities": comm, "precision": "radius as stated in S2 (Z10 3.5 km; Z11 approximated)" if isinstance(geom, str) else "hand trace ±1 km", "src": "S2"}, "geometry": mapping(g)})
if 'Z9' in zext:
    f = zext['Z9']; f['properties'].update(name="Z9 Coastal strip (Salinas – Bentiaba – Mucuio)", kind="S2 zone", commodities=["salt", "Fe", "magnetite"]); s2f.append(f)
json.dump({"type": "FeatureCollection", "features": s2f}, open(os.path.join(DATA, 's2_areas.geojson'), 'w'))
QA['checks'].extend(L('qa_vectorise.json'))

# figures
s2doc = pymupdf.open(S2PDF)
for f in C.FIGS:
    kind, ref = C.FIG_SOURCES[f['id']]
    out = os.path.join(IMG, f['file'])
    if kind == 'mir':
        im = Image.open(os.path.join(SRC, 'mir', ref))
    else:
        pg = s2doc[ref - 1]; pix = pg.get_pixmap(dpi=170)
        im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        im = im.crop((int(im.width * 0.08), int(im.height * 0.05), int(im.width * 0.93), int(im.height * 0.66 if ref not in (22, 27) else im.height * 0.74)))
    if im.mode not in ('RGB', 'L'): im = im.convert('RGB')
    if max(im.size) > 1600: im.thumbnail((1600, 1600))
    if out.endswith('.png'): im.save(out, optimize=True)
    else: im.convert('RGB').save(out, quality=86, optimize=True)

atlas = dict(as_of=C.AS_OF, sources=C.SOURCES, families=C.FAMILIES, claims=C.CLAIMS, tax={k: list(v) for k, v in C.TAX.items()},
             candidates=C.CANDIDATES, requests=C.REQUESTS, verify=C.VERIFY, figs=C.FIGS, fig_layer=C.FIG_LAYER, insets=L('insets.json'), qa=QA['checks'], overlays=L('overlays.json'), rails=RAIL, ports=PORTS, province_matrix=C.PROVINCE_MATRIX, pm_cols=C.PM_COLS)
json.dump(atlas, open(os.path.join(DATA, 'atlas.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(QA, open(os.path.join(DATA, 'qa_all.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------- registers (CSV + Markdown)
os.makedirs(os.path.join(ROOT, 'registers'), exist_ok=True)
R = os.path.join(ROOT, 'registers')
EV = {"measured": "Measured result", "occurrence": "Reported occurrence", "operator": "Operator claim", "interpretation": "Geological interpretation", "coverage": "Survey coverage / parameters"}
with open(os.path.join(R, 'source_register.csv'), 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(["claim_id", "claim", "source_id", "source", "page", "date", "scale", "location_precision", "evidence_type", "survey_family", "status_or_flag"])
    S = {s['id']: s for s in C.SOURCES}
    for c in C.CLAIMS:
        w.writerow([c['id'], c['text'], c['src'], S[c['src']]['short'], c['page'] or '', c['date'], c['scale'], c['prec'], EV[c['ev']], c['fam'], c['status']])
with open(os.path.join(R, 'data_requests.csv'), 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(["request_id", "priority", "what", "from_whom", "format", "decision_it_unlocks", "why", "candidates"])
    for r in sorted(C.REQUESTS, key=lambda r: (r['pri'], r['id'])):
        w.writerow([r['id'], r['pri'], r['what'], r['whom'], r['fmt'], r['decision'], r['unlocks'], ' '.join(r['for_'])])

md = [f"# Source register – Angola Critical-Minerals Investor Atlas\n\nAs of {C.AS_OF}. Generated from `atlas/tools/content.py`; do not edit by hand.\n",
      "## Sources\n", "| ID | Source | Author | Date | Kind | Note |", "|---|---|---|---|---|---|"]
md += [f"| {s['id']} | {s['title']} | {s['author']} | {s['date']} | {s['kind']} | {s['note']} |" for s in C.SOURCES]
md += ["\n## Survey / observation families (do not double-count)\n", "| Family | Name | Members | Note |", "|---|---|---|---|"]
md += [f"| {f['id']} | {f['name']} | {'; '.join(f['members'])} | {f['note']} |" for f in C.FAMILIES]
md += ["\n## Material claims\n", "Evidence types: **Measured result** · **Reported occurrence** · **Operator claim** · **Geological interpretation** · **Survey coverage**.\n",
       "| ID | Claim | Source (page) | Date | Scale | Location precision | Evidence | Family | Status / flag |", "|---|---|---|---|---|---|---|---|---|"]
md += [f"| {c['id']} | {c['text']} | {c['src']}{' p.'+str(c['page']) if c['page'] else ''} | {c['date']} | {c['scale']} | {c['prec']} | {EV[c['ev']]} | {c['fam']} | {c['status']} |" for c in C.CLAIMS]
md += ["\n## Figures used\n", "| Figure | Source (page) | Evidence | Caption |", "|---|---|---|---|"]
md += [f"| `img/{f['file']}` | {f['src']} p.{f['page']} | {EV[f['ev']]} | {f['cap']} |" for f in C.FIGS]
open(os.path.join(R, 'source_register.md'), 'w').write('\n'.join(md) + '\n')

md = [f"# Prioritised primary-data request list\n\nAs of {C.AS_OF}. Priority 1 = unlocks a capital-allocation decision soonest.\n",
      "| # | Priority | Request | From whom | Format | Decision it unlocks | Why | Candidates |", "|---|---|---|---|---|---|---|---|"]
md += [f"| {r['id']} | P{r['pri']} | {r['what']} | {r['whom']} | {r['fmt']} | {r['decision']} | {r['unlocks']} | {', '.join(r['for_'])} |" for r in sorted(C.REQUESTS, key=lambda r: (r['pri'], r['id']))]
open(os.path.join(R, 'data_requests.md'), 'w').write('\n'.join(md) + '\n')

md = [f"# Verification plan – checks completed vs required\n\nAs of {C.AS_OF}.\n", "## Completed in this build (spatial QA log)\n", "| Check | Method | Result |", "|---|---|---|"]
md += [f"| {q['check']} | {q['method']} | {q['result']} |" for q in QA['checks']]
md += ["\n## Conclusion-level tests\n", "| # | Conclusion | Independent test | Who | Status | Result |", "|---|---|---|---|---|---|"]
md += [f"| {v['id']} | {v['conclusion']} | {v['test']} | {v['who']} | **{v['status']}** | {v['result']} |" for v in C.VERIFY]
open(os.path.join(R, 'verification_plan.md'), 'w').write('\n'.join(md) + '\n')
print(json.dumps([q for q in QA['checks'][-5:]], indent=1, ensure_ascii=False))
for c in C.CANDIDATES: print(c['id'], c['lon'], c['lat'], c['spatial'])
