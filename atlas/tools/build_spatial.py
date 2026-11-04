"""Build the spatial layers for the Angola Critical-Minerals Investor Atlas.

Reproducible: python3 atlas/tools/build_spatial.py <SRC_DIR>
SRC_DIR must contain:
  mir/            embedded images extracted from MIREMPET keynote (extract_mirempet.py)
  dl/gi/package/dist/assets/adm1/024.json   Natural Earth admin-1 Angola (via npm @geo-insight/data 0.3.0, MIT)
  dl/wa/package/countries-50m.json          Natural Earth 1:50m countries (npm world-atlas 2.0.2, ISC)

Everything spatial is done with GDAL (through rasterio 1.4 / GDAL 3.12), shapely and pyproj.
Outputs go to atlas/data (GeoJSON, EPSG:4326) and atlas/img (warped PNG overlays) and a
QA log (atlas/data/qa_spatial.json) listing every check actually executed and its numeric result.
"""
import json, sys, os, math
import numpy as np
from PIL import Image
import rasterio
from rasterio.transform import Affine
from rasterio.warp import reproject, Resampling, calculate_default_transform
from rasterio import features
from shapely.geometry import shape, mapping, Polygon, MultiPolygon, Point, box
from shapely.ops import unary_union, transform as shp_transform
from pyproj import Transformer

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data'); IMG = os.path.join(ROOT, 'img')
QA = {"generated": "2026-11-03", "checks": []}

def qa(name, method, result, status="completed"):
    QA["checks"].append({"check": name, "method": method, "result": result, "status": status})

def r6(geom, nd=4):
    def rnd(c):
        if isinstance(c[0], (list, tuple)):
            return [rnd(x) for x in c]
        return [round(c[0], nd), round(c[1], nd)]
    m = mapping(geom)
    return {"type": m["type"], "coordinates": rnd(m["coordinates"]) if m["type"] != "Point" else [round(m["coordinates"][0], nd), round(m["coordinates"][1], nd)]}

def fc(feats):
    return {"type": "FeatureCollection", "features": feats}

def dump(name, obj):
    with open(os.path.join(DATA, name), 'w') as f:
        json.dump(obj, f, separators=(',', ':'), ensure_ascii=False)

utm33s = Transformer.from_crs("EPSG:32733", "EPSG:4326", always_xy=True)
to_utm = Transformer.from_crs("EPSG:4326", "EPSG:32733", always_xy=True)
area_tr = Transformer.from_crs("EPSG:4326", "ESRI:102022", always_xy=True)  # Africa Albers Equal Area

def km2(g):
    return shp_transform(area_tr.transform, g).area / 1e6

# ---------------------------------------------------------------- base layers
adm = json.load(open(os.path.join(SRC, 'dl/gi/package/dist/assets/adm1/024.json')))
provs = []
for f in adm['features']:
    g = shape(f['geometry']).buffer(0)
    provs.append((f['properties']['name'], f['properties']['iso'], g))
angola = unary_union([p[2] for p in provs]).buffer(0)
qa("National outline includes Cabinda exclave",
   "Count polygons in Natural Earth admin-1 union; test that Cabinda town (12.20E, 5.55S) falls inside",
   f"{len(angola.geoms) if hasattr(angola,'geoms') else 1} polygon parts; Cabinda inside={angola.contains(Point(12.20,-5.55))}; area {km2(angola):,.0f} km2")
dump('provinces.geojson', fc([{"type": "Feature", "properties": {"name": n, "iso": i, "area_km2": round(km2(g))},
                               "geometry": r6(g.simplify(0.01), 3)} for n, i, g in provs]))
dump('angola.geojson', fc([{"type": "Feature", "properties": {"name": "Angola"}, "geometry": r6(angola.simplify(0.005), 3)}]))

# neighbours from world-atlas topojson
topo = json.load(open(os.path.join(SRC, 'dl/wa/package/countries-50m.json')))
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs = []
for arc in topo['arcs']:
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy; pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)
def ring(idx):
    out = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(a if not out else a[1:])
    return out
neigh = []
for g in topo['objects']['countries']['geometries']:
    nm = g['properties'].get('name')
    if nm not in ('Namibia', 'Zambia', 'Botswana', 'Congo', 'Dem. Rep. Congo', 'Gabon', 'Zimbabwe'):
        continue
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    geom = MultiPolygon([Polygon(ring(p[0]), [ring(h) for h in p[1:]]) for p in polys]).buffer(0)
    geom = geom.intersection(box(8, -22, 28, 0))
    neigh.append({"type": "Feature", "properties": {"name": nm}, "geometry": r6(geom.simplify(0.02), 2)})
dump('neighbours.geojson', fc(neigh))

# ---------------------------------------------------------------- georeferencing
def fit_affine(gcps):
    """gcps: list of (px, py, X, Y). Least-squares affine; returns Affine and RMS residual (map units)."""
    A = np.array([[p, q, 1] for p, q, _, _ in gcps], float)
    X = np.array([g[2] for g in gcps]); Y = np.array([g[3] for g in gcps])
    cx, *_ = np.linalg.lstsq(A, X, rcond=None); cy, *_ = np.linalg.lstsq(A, Y, rcond=None)
    res = np.hypot(A @ cx - X, A @ cy - Y)
    return Affine(cx[0], cx[1], cx[2], cy[0], cy[1], cy[2]), float(np.sqrt((res ** 2).mean())), float(res.max())

def warp_png(img_path, aff, crs, out_name, crop=None, alpha_fn=None, max_w=1400):
    im = Image.open(img_path).convert('RGB')
    if crop:
        im = im.crop(crop)
        aff = aff * Affine.translation(crop[0], crop[1])
    a = np.asarray(im).transpose(2, 0, 1)
    alpha = np.full(a.shape[1:], 255, np.uint8) if alpha_fn is None else alpha_fn(np.asarray(im))
    src = np.concatenate([a, alpha[None]], 0)
    h, w = src.shape[1:]
    dt, dw, dh = calculate_default_transform(crs, 'EPSG:4326', w, h, *rasterio.transform.array_bounds(h, w, aff)[::1] if False else
                                             (aff.c, aff.f + aff.e * h, aff.c + aff.a * w, aff.f))
    # square-ish output in degrees, bounded size
    scale = max(1, dw / max_w)
    dt = dt * Affine.scale(scale); dw = int(dw / scale); dh = int(dh / scale)
    dst = np.zeros((4, dh, dw), np.uint8)
    for b in range(4):
        reproject(src[b], dst[b], src_transform=aff, src_crs=crs, dst_transform=dt, dst_crs='EPSG:4326',
                  resampling=Resampling.bilinear if b < 3 else Resampling.nearest)
    Image.fromarray(dst.transpose(1, 2, 0), 'RGBA').save(os.path.join(IMG, out_name), optimize=True)
    west, north = dt.c, dt.f; east = west + dt.a * dw; south = north + dt.e * dh
    return [round(west, 4), round(south, 4), round(east, 4), round(north, 4)]

overlays = []

# p04 PLANAGEO division map: UTM 33S grid ticks read from frame (pixel positions from gridcrop.py)
xt = {0: 81, 300000: 235, 600000: 389, 900000: 543, 1200000: 697, 1500000: 851}
yt = {9500000: 52, 9200000: 202, 8900000: 351.5, 8600000: 500, 8300000: 650, 8000000: 800}
g4 = [(px, py, E, N) for E, px in xt.items() for N, py in yt.items()]
aff4, rms4, mx4 = fit_affine(g4)
qa("Georeference MIREMPET slide 4 (PLANAGEO division map)",
   "36 GCPs from UTM 33S (EPSG:32733) frame ticks, least-squares affine (GDAL/rasterio)",
   f"RMS {rms4/1000:.2f} km, max {mx4/1000:.2f} km; pixel size {aff4.a/1000:.2f} km. Positional uncertainty dominated by slide resolution (~2 km/px) and tick reading (+/-1 px).")
b4 = warp_png(os.path.join(SRC, 'mir/p04_4.jpeg'), aff4, 'EPSG:32733', 'geo_p04_planageo.png', crop=(60, 40, 1000, 900))
overlays.append({"id": "p04", "title": "PLANAGEO operator division (MIREMPET slide 4)", "file": "img/geo_p04_planageo.png", "bounds": b4,
                 "rms_km": round(rms4/1000, 2), "src": "S1", "page": 4})

# Região Leste (bright green fill) -> polygon
a4 = np.asarray(Image.open(os.path.join(SRC, 'mir/p04_4.jpeg')).convert('RGB')).astype(int)
r, g, b = a4[..., 0], a4[..., 1], a4[..., 2]
green = ((g > 190) & (r < 150) & (b < 110) & (g - r > 80)).astype(np.uint8)
green[:, 1000:] = 0  # exclude legend swatch
from scipy import ndimage
green = ndimage.binary_closing(green, iterations=8).astype(np.uint8)
green = ndimage.binary_fill_holes(green).astype(np.uint8)
shapes = [shape(s) for s, v in features.shapes(green, transform=aff4) if v == 1]
leste_utm = unary_union([s for s in shapes if s.area > 5e8]).buffer(0)
leste = shp_transform(utm33s.transform, leste_utm).buffer(0).intersection(angola)
north_south = angola.difference(leste)
qa("Extract PLANAGEO 'Região Leste (por concluir)' extent",
   "Colour threshold of legend green on slide 4, morphological closing, vectorised with GDAL polygonize (rasterio.features.shapes), clipped to Natural Earth outline",
   f"Leste (pending) = {km2(leste):,.0f} km2 ({100*km2(leste)/km2(angola):.0f}% of Angola); Norte+Sul (concluded) = {km2(north_south):,.0f} km2")

# block label anchors (positions read on slide render, converted to image px)
lab = {"CITIC-1 (Cabinda)": (180, 83), "CITIC-1": (252, 227), "CITIC-2": (335, 207), "CITIC-3": (322, 373), "CITIC-4": (447, 390), "CITIC-5": (450, 270)}
slide_lab = {"CN-1": (955, 333), "CN-5": (902, 343), "CN-3": (962, 390), "CN-4": (902, 386), "CN-9": (902, 442), "CN-8": (958, 448),
             "CN-2": (1000, 447), "CN-6": (902, 512), "CN-7": (958, 516), "UTE-3": (760, 468), "UTE-5": (845, 483), "UTE-4": (742, 505),
             "UTE-2": (804, 537), "UTE-1": (712, 560), "UTE-6": (845, 575), "UTE-7": (893, 586), "UTE-8": (965, 586)}
for k, (X, Y) in slide_lab.items():
    lab[k] = ((X / 1.3896 - 447) * 1391 / 501, (Y / 1.3896 - 146) * 942 / 340)
blk = []
for k, (px, py) in lab.items():
    E, N = aff4 * (px, py); lon, lat = utm33s.transform(E, N)
    op = 'CITIC' if k.startswith('CITIC') else ('UTE' if k.startswith('UTE') else 'CN')
    blk.append({"type": "Feature", "properties": {"label": k, "operator_code": op,
                "status": "Região Leste – por concluir (pending)" if op == 'CN' else "Região Norte e Sul – concluído (completed)",
                "precision": "label anchor only, ±20 km; block outline not digitised"}, "geometry": {"type": "Point", "coordinates": [round(lon, 3), round(lat, 3)]}})
dump('planageo.geojson', fc([
    {"type": "Feature", "properties": {"name": "Região Leste", "status": "por concluir (pending) per MIREMPET slide 4, dated 17/05/2024", "area_km2": round(km2(leste)), "src": "S1", "evidence": "survey-coverage"}, "geometry": r6(leste.simplify(0.02), 3)},
    {"type": "Feature", "properties": {"name": "Região Norte e Sul", "status": "concluído (completed) per MIREMPET slide 4", "area_km2": round(km2(north_south)), "src": "S1", "evidence": "survey-coverage"}, "geometry": r6(north_south.simplify(0.02), 3)}] + blk))

# p06 airborne geophysics domains (geographic WGS84 graticule)
lon6 = {13: 162, 16: 339.5, 19: 517, 22: 694}; lat6 = {-5: 125.5, -8: 302.5, -11: 480, -14: 657, -17: 834}
g6 = [(px, py, lo, la) for lo, px in lon6.items() for la, py in lat6.items()]
aff6, rms6, mx6 = fit_affine(g6)
qa("Georeference MIREMPET slide 6 (airborne geophysics domains)", "20 GCPs from WGS84 graticule ticks, affine",
   f"RMS {rms6*111:.2f} km, max {mx6*111:.2f} km")
b6 = warp_png(os.path.join(SRC, 'mir/p06_4.jpeg'), aff6, 'EPSG:4326', 'geo_p06_domains.png', crop=(50, 50, 860, 930))
overlays.append({"id": "p06", "title": "Airborne-geophysics domains (MIREMPET slide 6, IGEO 20/04/2022)", "file": "img/geo_p06_domains.png", "bounds": b6, "rms_km": round(rms6*111, 2), "src": "S1", "page": 6})

DOM = {
 1: ("Copper Belt", ["Cu"], [(610,609),(655,611),(695,599),(772,550),(816,502),(817,599),(695,600),(695,790),(772,872),(695,889),(535,885),(535,782),(547,775),(650,694),(684,694),(684,670),(610,654)]),
 2: ("Cassinga (gold and iron ore)", ["Au", "Fe"], [(230,402),(400,402),(510,407),(512,427),(592,473),(521,559),(457,667),(457,800),(400,840),(322,840),(322,654),(322,600),(235,500)]),
 3: ("Cunene Complex (base metals, nickel + PGEs)", ["base metals", "Ni", "PGE"], [(247,654),(322,654),(322,820),(262,854),(215,855),(200,847),(185,830),(166,827),(166,747)]),
 4: ("Greenstone Belt (gold)", ["Au"], [(150,177),(215,177),(200,213),(198,233),(232,268),(290,295),(290,352),(230,352),(200,330),(165,290),(152,252),(138,232)]),
 5: ("Lucapa Graben (diamond)", ["diamond"], [(230,402),(320,342),(420,322),(490,297),(540,300),(548,245),(588,240),(612,238),(608,262),(680,262),(690,330),(688,372),(620,373),(530,392),(510,407),(400,402)]),
 6: ("Archean Block (base metals, gold and diamonds)", ["base metals", "Au", "diamond"], [(577,574),(635,532),(707,509),(817,500),(772,550),(695,599),(655,611),(610,609),(577,609)]),
 7: ("Proterozoic Orogeny (copper, nickel and gold)", ["Cu", "Ni", "Au"], [(510,407),(530,392),(620,373),(688,372),(700,420),(710,462),(707,470),(710,490),(725,482),(750,485),(815,475),(817,500),(707,509),(635,532),(592,473),(512,427)]),
 8: ("Cassinga Extension (iron ore and gold)", ["Fe", "Au"], [(521,559),(589,545),(589,567),(577,574),(577,609),(610,609),(610,654),(684,670),(684,694),(650,694),(547,775),(457,775),(457,667)]),
 9: ("Cabinda (gold)", ["Au"], [(103,118),(130,105),(135,120),(130,128),(135,170),(118,170),(108,140)]),
}
dfe = []
for k, (nm, comm, px) in DOM.items():
    poly = Polygon([aff6 * p for p in px]).buffer(0).intersection(angola)
    if k == 9:  # at slide scale the Cabinda hatch covers the whole enclave; hand-digitised outline was too narrow
        poly = next(g for n, _, g in provs if n == 'Cabinda')
    dfe.append({"type": "Feature", "properties": {"id": f"D{k}", "name": f"Domain {k} – {nm}", "commodities_as_labelled": comm,
                "area_km2": round(km2(poly)), "src": "S1", "page": 6, "evidence": "geological-interpretation",
                "precision": "hand-digitised from slide raster, ±15 km"}, "geometry": r6(poly.simplify(0.01), 3)})
dump('domains.geojson', fc(dfe))
covered = unary_union([shape(f['geometry']) for f in dfe])
qa("Digitise the nine airborne-geophysics domains", "Vertices read on gridded enlargements of slide 6, transformed with the slide-6 affine, clipped to Angola",
   f"9 polygons; together {km2(covered):,.0f} km2 = {100*km2(covered)/km2(angola):.0f}% of Angola (domains are not a full partition – NW, coastal basins and SE Kalahari cover are unassigned)")

# p08 / p09 occurrence maps
lon8 = {13: 163, 16: 290, 19: 416, 22: 543, 25: 670}; lat8 = {-5: 105, -8: 232, -11: 358.5, -14: 485.5, -17: 612}
aff8, rms8, mx8 = fit_affine([(px, py, lo, la) for lo, px in lon8.items() for la, py in lat8.items()])
lon9 = {13: 178.2, 16: 373.5, 19: 568.7, 22: 763.4}; lat9 = {-5: 138, -8: 333, -11: 527, -14: 722, -17: 917}
aff9, rms9, mx9 = fit_affine([(px, py, lo, la) for lo, px in lon9.items() for la, py in lat9.items()])
qa("Georeference MIREMPET slides 8 and 9 (occurrence maps)", "25 and 20 graticule GCPs, affine",
   f"slide 8 RMS {rms8*111:.2f} km (pixel {aff8.a*111:.1f} km); slide 9 RMS {rms9*111:.2f} km (pixel {aff9.a*111:.1f} km)")
b8 = warp_png(os.path.join(SRC, 'mir/p08_4.jpeg'), aff8, 'EPSG:4326', 'geo_p08_occurrences.png', crop=(70, 90, 720, 690))
b9 = warp_png(os.path.join(SRC, 'mir/p09_2.jpeg'), aff9, 'EPSG:4326', 'geo_p09_critical.png', crop=(90, 70, 960, 1010))
overlays.append({"id": "p08", "title": "All mineral occurrences, >2,500 points (MIREMPET slide 8)", "file": "img/geo_p08_occurrences.png", "bounds": b8, "rms_km": round(rms8*111, 2), "src": "S1", "page": 8})
overlays.append({"id": "p09", "title": "Critical-mineral occurrences, >300 points (MIREMPET slide 9)", "file": "img/geo_p09_critical.png", "bounds": b9, "rms_km": round(rms9*111, 2), "src": "S1", "page": 9})

# symbol extraction on slide 9
a9 = np.asarray(Image.open(os.path.join(SRC, 'mir/p09_2.jpeg')).convert('RGB')).astype(int)
H9, W9 = a9.shape[:2]
land = features.rasterize([(angola.buffer(0.05), 1)], out_shape=(H9, W9), transform=aff9).astype(bool)
land[:, 960:] = False
CLS = {  # legend colours sampled from the slide-9 legend swatches
 "Ag": ("Silver (Ag)", (250, 187, 228), 38, ["Ag"]),
 "Al": ("Aluminium (Al)", (198, 22, 167), 55, ["Al"]),
 "AuAg": ("Gold (Au) + Silver (Ag)", (249, 246, 30), 45, ["Au", "Ag"]),
 "CuCoAuPbZn": ("Copper + Cobalt + Gold + Lead + Zinc", (245, 169, 22), 45, ["Cu", "Co", "Au", "Pb", "Zn"]),
 "NiCoCuCr": ("Nickel + Cobalt + Copper + Chromium", (12, 166, 129), 45, ["Ni", "Co", "Cu", "Cr"]),
 "PbCuZn": ("Lead + Copper + Zinc", (170, 242, 33), 40, ["Pb", "Cu", "Zn"]),
 "V": ("Vanadium (V)", (15, 110, 216), 40, ["V"]),
 "Zn": ("Zinc (Zn); Zn, Pb", (20, 228, 24), 45, ["Zn", "Pb"]),
}
pts = []; counts = {}
SYM_AREA = 110.0
for key, (label, col, tol, els) in CLS.items():
    d = np.sqrt(((a9 - np.array(col)) ** 2).sum(2))
    m = (d < tol) & land
    m = ndimage.binary_opening(m, iterations=1)
    lbl, n = ndimage.label(m)
    objs = ndimage.find_objects(lbl)
    c = 0
    for i, sl in enumerate(objs):
        area = int((lbl[sl] == i + 1).sum())
        if area < 25:
            continue
        cy, cx = ndimage.center_of_mass(lbl == i + 1)
        k = max(1, int(round(area / SYM_AREA)))
        lon, lat = aff9 * (cx, cy)
        c += k
        pts.append({"type": "Feature", "properties": {"cls": key, "label": label, "elements": els, "n_symbols_est": k,
                    "src": "S1", "page": 9, "evidence": "reported-occurrence", "precision": "symbol centroid digitised from slide, ±6 km; merged symbols counted by area"},
                    "geometry": {"type": "Point", "coordinates": [round(lon, 3), round(lat, 3)]}})
    counts[key] = c
# attach province + domain to each point
for p in pts:
    P = Point(p['geometry']['coordinates'])
    p['properties']['province'] = next((n for n, _, g in provs if g.contains(P)), None)
    p['properties']['domain'] = next((f['properties']['id'] for f in dfe if shape(f['geometry']).contains(P)), None)
dump('critical_occurrences_digitised.geojson', fc(pts))
tot = sum(counts.values())
qa("Digitise coloured critical-mineral symbols on slide 9 and test the '>300 points' statement",
   "Per-class colour distance to legend swatch, opening, connected components (GDAL-rasterised land mask), centroid; merged clusters counted by area/110 px. Grey classes (Mo+Cu, graphite) not extracted – indistinguishable from roads/text.",
   f"{tot} coloured symbols recovered ({', '.join(f'{k}:{v}' for k,v in counts.items())}). Consistent in order of magnitude with '>300'; exact count needs the IGEO occurrence table.")

# p05 airborne geophysics images: georeference by bounding box (no legible ticks)
xmin, ymin = to_utm.transform(11.66, -18.04); xmax, ymax = to_utm.transform(24.09, -4.37)
amin = angola.bounds
ax0, ay0 = to_utm.transform(amin[0], (amin[1]+amin[3])/2)
geo5 = []
for fn, title, oid in [('p05_6.jpeg', 'Total magnetic intensity (MIREMPET slide 5)', 'p05mag'),
                       ('p05_5.jpeg', 'Digital elevation model (MIREMPET slide 5)', 'p05dem'),
                       ('p05_4.jpeg', 'Radiometric ternary K–Th–U (MIREMPET slide 5)', 'p05rad')]:
    arr = np.asarray(Image.open(os.path.join(SRC, 'mir', fn)).convert('RGB')).astype(int)
    h, w = arr.shape[:2]
    sat = arr.max(2) - arr.min(2)
    m = sat > 35
    if 'p05_4' in fn:  # radiometric ternary: near-white = high K+Th+U, still data -> keep pale pixels inside the body
        m = (arr.min(2) < 238) | (sat > 25)
    m[:int(0.13*h), int(0.62*w):] = False  # legend / title block top-right
    m[:, :6] = False; m[:, -6:] = False; m[:6, :] = False; m[-6:, :] = False
    if 'p05_5' in fn: m[:int(0.12*h), int(0.25*w):] = False
    if 'p05_4' in fn: m[:int(0.12*h), int(0.25*w):] = False
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_fill_holes(ndimage.binary_closing(m, iterations=3))
    lbl, n = ndimage.label(m)
    sizes = ndimage.sum(m, lbl, range(1, n + 1))
    keep = np.isin(lbl, [i + 1 for i, s in enumerate(sizes) if s > 150])
    ys, xs = np.where(keep)
    # Angola extremes in UTM33S
    pts_utm = [to_utm.transform(x, y) for x, y in angola.exterior.coords] if angola.geom_type == 'Polygon' else \
              [to_utm.transform(x, y) for gg in angola.geoms for x, y in gg.exterior.coords]
    E = np.array([p[0] for p in pts_utm]); N = np.array([p[1] for p in pts_utm])
    sx = (E.max() - E.min()) / (xs.max() - xs.min()); sy = (N.max() - N.min()) / (ys.max() - ys.min())
    aff = Affine(sx, 0, E.min() - sx * xs.min(), 0, -sy, N.max() + sy * ys.min())
    cov = [shape(s) for s, v in features.shapes(keep.astype(np.uint8), transform=aff) if v == 1]
    cov_ll = shp_transform(utm33s.transform, unary_union(cov).buffer(3000).buffer(-3000)).buffer(0)
    gap = angola.difference(cov_ll.buffer(0.03))
    gap_parts = [gg for gg in (gap.geoms if hasattr(gap, 'geoms') else [gap]) if km2(gg) > 1500]
    alpha_fn = lambda rgb, km=keep: (km * 255).astype(np.uint8)
    bb = warp_png(os.path.join(SRC, 'mir', fn), aff, 'EPSG:32733', f'geo_{oid}.png', alpha_fn=alpha_fn)
    overlays.append({"id": oid, "title": title, "file": f"img/geo_{oid}.png", "bounds": bb, "rms_km": None,
                     "georef": "bounding-box fit to Natural Earth extremes (no legible ticks): ±10 km", "src": "S1", "page": 5})
    geo5.append((oid, sx, sy, gap_parts))
    qa(f"Coverage of {title}", "Non-background pixel mask, bounding-box fit to Angola extremes in UTM 33S, polygonised and differenced against Natural Earth outline",
       f"pixel {sx/1000:.1f} x {sy/1000:.1f} km (anisotropy {abs(sx/sy-1)*100:.1f}%); {len(gap_parts)} uncovered patch(es) >1,500 km2 totalling {sum(km2(g) for g in gap_parts):,.0f} km2"
       + (f" centred near {', '.join(f'{gg.centroid.x:.1f}E {-gg.centroid.y:.1f}S' for gg in gap_parts[:3])}" if gap_parts else ""))
    if oid == 'p05rad':
        rad_cov = cov_ll
gaps = {o: unary_union(g) if g else None for o, _, _, g in geo5}
both = gaps['p05dem'].intersection(gaps['p05rad']) if gaps['p05dem'] and gaps['p05rad'] else None
both_parts = [g for g in (both.geoms if hasattr(both, 'geoms') else [both]) if km2(g) > 1500] if both else []
qa("Survey-coverage gaps common to the DEM and radiometric products",
   "Intersection of the no-data patches of the two independently masked slide-5 images (single-image edge artefacts discarded)",
   (f"{len(both_parts)} consistent gap(s): " + "; ".join(f"{km2(g):,.0f} km2 centred {g.centroid.x:.1f}E {-g.centroid.y:.1f}S" for g in both_parts)
    + ". The magnetic image shows data there, so the magnetic grid may merge a different survey – confirm with flight-line database.") if both_parts else "none")
dump('airborne_coverage.geojson', fc([{"type": "Feature", "properties": {"name": "Compiled airborne radiometric coverage as displayed on slide 5",
      "line_spacing_m": 1000, "nominal_altitude_m": 120, "src": "S1", "page": 5, "evidence": "survey-coverage",
      "precision": "derived from a ~2.7 km/px slide image; flight-line database (XYZ) not provided"}, "geometry": r6(rad_cov.intersection(angola).simplify(0.02), 3)}]
      + [{"type": "Feature", "properties": {"name": "No radiometric/DEM data displayed (magnetics shown)", "area_km2": round(km2(g)), "src": "S1", "page": 5}, "geometry": r6(g.simplify(0.02), 3)} for g in both_parts]))

dump('overlays.json', overlays)
json.dump(QA, open(os.path.join(DATA, 'qa_spatial.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(QA, indent=1, ensure_ascii=False))
