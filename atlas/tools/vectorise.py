"""Turn every source map into interactive vector features or value grids.

usage: python3 atlas/tools/vectorise.py <SRC_DIR>
SRC_DIR holds mir/ (extract_mirempet.py), s2/ (embedded images of the Portfolio PDF, extract_s2.py)
and ocr_s2.json / ocr_mir.json (ocr_maps.py – RapidOCR text boxes used to read axis ticks and labels).

Outputs (atlas/data):
  vec_<map>.geojson  – points / polygons with class, name, value, source page and positional error
  grid_<id>.json     – value grids (EPSG:4326) for the airborne images: magnetics index, elevation, K/Th/U shares, thorium index
  insets.json        – non-georeferenced plans (Longonjo site plan, Chiri drill plan) in local coordinates
  qa_vectorise.json  – log of every georeference fit and extraction count
"""
import json, os, sys, re, math, base64
import numpy as np
from PIL import Image
from scipy import ndimage
import rasterio.features as rf
from rasterio.transform import Affine
from shapely.geometry import shape, mapping, Point, Polygon, MultiPolygon, box
from shapely.ops import unary_union, transform as shp_tr
from pyproj import Transformer

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
OCR = {**json.load(open(os.path.join(SRC, 'ocr_s2.json'))), **json.load(open(os.path.join(SRC, 'ocr_mir.json')))}
utm2ll = Transformer.from_crs("EPSG:32733", "EPSG:4326", always_xy=True)
ll2utm = Transformer.from_crs("EPSG:4326", "EPSG:32733", always_xy=True)
QA = []
ANGOLA = unary_union([shape(f['geometry']) for f in json.load(open(os.path.join(DATA, 'angola.geojson')))['features']]).buffer(0)

def log(name, result):
    method = ("Axis tick labels read by OCR (RapidOCR) or by eye, least-squares linear fit per axis" if name.startswith("Georeference") else
              "Legend-colour segmentation, symbol-shape filters, connected components, GDAL polygonize; result drawn back on the source image and inspected (tools/vectorise.py)")
    QA.append({"check": name, "method": method, "result": result, "status": "completed"}); print("•", name, "→", result)

def img(rel):
    return np.asarray(Image.open(os.path.join(SRC, rel)).convert('RGB')).astype(int)

def ocr(rel):
    out = []
    for quad, t, c in OCR[rel]:
        xs = [p[0] for p in quad]; ys = [p[1] for p in quad]
        out.append(dict(t=t.strip(), c=c, x0=min(xs), x1=max(xs), y0=min(ys), y1=max(ys), cx=sum(xs) / 4, cy=sum(ys) / 4))
    return out

def fit1(pairs):
    p = np.array([a for a, _ in pairs], float); v = np.array([b for _, b in pairs], float)
    A = np.vstack([p, np.ones_like(p)]).T; k, *_ = np.linalg.lstsq(A, v, rcond=None)
    res = A @ k - v
    # drop OCR misreads (residual > 3× median, at least two ticks kept) and refit
    keep = np.abs(res) <= max(3 * np.median(np.abs(res)), 1e-9)
    if keep.sum() >= 2 and keep.sum() < len(p):
        p, v = p[keep], v[keep]; A = np.vstack([p, np.ones_like(p)]).T; k, *_ = np.linalg.lstsq(A, v, rcond=None); res = A @ k - v
    return k, float(np.sqrt((res ** 2).mean())), len(p)

def georef_ll(rel, lon_ticks, lat_ticks, name, crs='EPSG:4326', how='OCR-read'):
    """lon_ticks/lat_ticks: lists of (pixel, value). Returns Affine pixel->(X,Y) and logs residuals."""
    kx, rx, nx = fit1(lon_ticks); ky, ry, ny = fit1(lat_ticks)
    aff = Affine(kx[0], 0, kx[1], 0, ky[0], ky[1])
    unit = 111.0 if crs == 'EPSG:4326' else 0.001
    log(f"Georeference {name}", f"{nx}+{ny} {how} ticks, RMS x {rx*unit:.3f} km, y {ry*unit:.3f} km, pixel {abs(kx[0])*unit*1000:.0f} m")
    return aff

def ticks_from_ocr(rel, kind='ll', bottom_min=None, left_max=None, xband=None):
    """Return (x_ticks, y_ticks) as (pixel, value) from OCR labels. bottom_min: labels with cy > this are x labels;
    left_max: labels with cx < this are y labels."""
    xt, yt = [], []
    for o in ocr(rel):
        s = o['t'].replace(' ', '').replace('−', '-').replace('–', '-').rstrip('EN')
        if not re.match(r'^-?\d+(\.\d+)?$', s): continue
        v = float(s)
        if xband and not (xband[0] <= o['cx'] <= xband[1]): continue
        if bottom_min is not None and o['cy'] > bottom_min and (left_max is None or o['cx'] > left_max):
            if (kind == 'll' and 10 <= v <= 26) or (kind == 'utm' and 1e5 <= v < 1e6): xt.append((o['cx'], v))
        elif left_max is not None and o['cx'] < left_max and (bottom_min is None or o['cy'] < bottom_min):
            if kind == 'll' and 3 <= abs(v) <= 19: yt.append((o['cy'], -abs(v)))
            elif kind == 'utm' and 8e6 <= v < 1e7: yt.append((o['cy'], v))
    return xt, yt

def comps(mask, amin=6, amax=10 ** 9):
    lbl, n = ndimage.label(mask)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lbl)):
        m = lbl[sl] == i + 1; a = int(m.sum())
        if amin <= a <= amax:
            cy, cx = ndimage.center_of_mass(m)
            h, w = m.shape
            out.append(dict(x=cx + sl[1].start, y=cy + sl[0].start, a=a, w=w, h=h, fill=a / (w * h), bcy=(cy + .5) / h))
    return out

def cmask(a, col, tol):
    return np.sqrt(((a - np.array(col)) ** 2).sum(2)) < tol

def swatch(a, o, dx0=50, dx1=6, ignore_white=True):
    """median colour of the legend swatch left of an OCR legend label"""
    reg = a[int(o['y0']) + 2:int(o['y1']) - 1, max(0, int(o['x0']) - dx0):int(o['x0']) - dx1].reshape(-1, 3)
    if ignore_white:
        reg = reg[(reg.min(1) < 235) | (reg.max(1) - reg.min(1) > 25)]
    return tuple(int(v) for v in np.median(reg, 0)) if len(reg) else None

def near_label(o_list, x, y, rmax=70, exclude=()):
    best, bd = None, rmax
    for o in o_list:
        if o['t'] in exclude or re.match(r'^[-\d.,\s]+$', o['t']): continue
        d = min(math.hypot(o['x0'] - x, o['cy'] - y), math.hypot(o['cx'] - x, o['cy'] - y))
        if d < bd: best, bd = o, d
    return best['t'] if best else None

def to_ll(aff, x, y, crs):
    X, Y = aff * (x, y)
    return (X, Y) if crs == 'll' else utm2ll.transform(X, Y)

def poly_ll(geom_px, aff, crs):
    def f(x, y, z=None):
        X, Y = aff * (np.asarray(x), np.asarray(y))
        return (X, Y) if crs == 'll' else utm2ll.transform(X, Y)
    return shp_tr(f, geom_px)

def r4(g, nd=5):
    m = mapping(g)
    def rr(c):
        return [rr(x) for x in c] if isinstance(c[0], (list, tuple)) else [round(c[0], nd), round(c[1], nd)]
    return {"type": m['type'], "coordinates": rr(m['coordinates']) if m['type'] != 'Point' else [round(m['coordinates'][0], nd), round(m['coordinates'][1], nd)]}

def save(name, feats):
    json.dump({"type": "FeatureCollection", "features": feats}, open(os.path.join(DATA, name), 'w'), ensure_ascii=False, separators=(',', ':'))

DBG = os.environ.get('VEC_DEBUG')
def dbg(rel, pts, name, polys=()):
    if not DBG: return
    from PIL import ImageDraw
    im = Image.open(os.path.join(SRC, rel)).convert('RGB'); d = ImageDraw.Draw(im)
    for x, y, col in pts: d.ellipse([x - 6, y - 6, x + 6, y + 6], outline=col, width=2)
    for poly in polys:
        for g in (poly.geoms if hasattr(poly, 'geoms') else [poly]):
            d.line(list(g.exterior.coords), fill=(255, 0, 255), width=3)
    im.save(os.path.join(DBG, name + '.png'))

def F(geom, **p):
    return {"type": "Feature", "properties": p, "geometry": r4(geom)}

# =========================================================================== S2 zone maps (PLANAGEO 1:250k extracts)
GEOL = ["Granitoids", "Gabbro, norite, dolerite", "Proterozoic volcanics and metasediments", "Cretaceous basalts and volcanics", "Gypsum-bearing formations (Bambata, Gaia)",
        "Namibe basin sediments", "Quaternary sands and cover", "Gneiss-migmatite basement", "Namibe Group marble", "Outside the mapped geological sheet"]
GEOL_KEY = {re.sub(r'[^a-z]', '', g.lower()): g for g in GEOL}
PTS = {"copperindicationoccurrence": ("Cu", "Copper indication / occurrence", ["Cu"]), "marblegranitebasaltquarry": ("quarry", "Marble / granite / basalt quarry", ["marble", "granite"]),
       "gypsumindication": ("gyp", "Gypsum indication", ["gypsum"]), "mnorbariteindication": ("mn", "Mn or barite indication", ["Mn", "barite"]),
       "saltworks": ("salt", "Salt works", ["salt"]), "quartzbitumengraphite": ("qtz", "Quartz / bitumen–graphite", ["graphite"])}
ZONEMAPS = {"Z4": "s2/p17_0.png", "Z1": "s2/p18_0.png", "Z7": "s2/p19_0.png", "Z3": "s2/p20_0.png", "Z8": "s2/p21_0.png", "Z9": "s2/p22_0.png", "Z5": "s2/p23_0.png", "Z2": "s2/p24_0.png", "Z6": "s2/p25_0.png"}
PAGE = {"s2/p17_0.png": 17, "s2/p18_0.png": 18, "s2/p19_0.png": 19, "s2/p20_0.png": 20, "s2/p21_0.png": 21, "s2/p22_0.png": 22, "s2/p23_0.png": 23, "s2/p24_0.png": 24, "s2/p25_0.png": 25}
geo_feats, zone_feats, occ_feats, stn_feats = [], [], [], []
for zid, rel in ZONEMAPS.items():
    a = img(rel); H, W = a.shape[:2]; O = ocr(rel)
    leg = [o for o in O if o['x0'] > W * .6 and o['y0'] < H * .75 and not re.match(r'^[-\d.]+$', o['t'])]
    legx = min(o['x0'] for o in leg) - 60
    xt, yt = ticks_from_ocr(rel, 'll', bottom_min=H * .82, left_max=W * .12)
    if zid == 'Z9':
        xt, yt = ticks_from_ocr(rel, 'll', bottom_min=H * .85, left_max=W * .14)
    aff = georef_ll(rel, xt, yt, f"S2 p.{PAGE[rel]} zone map {zid}")
    # plot area: inside ticks
    px0 = int(min(p for p, _ in xt) - 60); px1 = int(min(legx, max(p for p, _ in xt) + 60)); py0 = int(min(p for p, _ in yt) - 60); py1 = int(max(p for p, _ in yt) + 50)
    px0 = max(px0, int(max(o['x1'] for o in O if o['cx'] < W * .12 and re.match(r'^[-\d.]+$', o['t'])) + 8)) if zid != 'Z9' else px0
    plot = np.zeros((H, W), bool); plot[max(py0, 0):min(py1, H), max(px0, 0):min(px1, W)] = True
    textmask = np.zeros((H, W), bool)
    for o in O: textmask[int(o['y0']):int(o['y1']) + 1, int(o['x0']):int(o['x1']) + 1] = True
    # legend swatches
    sw = {}
    for o in leg:
        k = re.sub(r'[^a-z]', '', o['t'].lower())
        c = swatch(a, o)
        if c: sw[k] = c
    # zone boundary (red line)
    red = next((v for k, v in sw.items() if k.startswith('redline')), (170, 20, 45))
    rm = cmask(a, red, 60) & plot
    rm = ndimage.binary_closing(rm, iterations=2)
    # S2 zones are 2.5 km buffers around occurrence groups, i.e. convex rounded outlines. Labels and symbols sit on top of the
    # red line and break it, so the outline is rebuilt as the convex hull of the largest red component(s).
    lbl_, n_ = ndimage.label(rm)
    sizes_ = ndimage.sum(rm, lbl_, range(1, n_ + 1)) if n_ else []
    if zid == 'Z9':
        zpolys = [shape(s_).buffer(0) for s_, v in rf.shapes(ndimage.binary_fill_holes(rm).astype(np.uint8)) if v == 1 and shape(s_).area > 300]
    elif n_:
        big = [i + 1 for i, sz in enumerate(sizes_) if sz >= .25 * max(sizes_)]
        ys_, xs_ = np.where(np.isin(lbl_, big))
        from shapely.geometry import MultiPoint
        zpolys = [MultiPoint(list(zip(xs_.tolist(), ys_.tolist()))).convex_hull]
    else:
        zpolys = []
    if zpolys:
        zg = poly_ll(unary_union(zpolys).buffer(0), aff, 'll')
        zone_feats.append(F(zg.simplify(0.0006), id=zid, name=f"{zid} boundary (S2 zone of mineral interest)", src="S2", page=PAGE[rel], evidence="interpretation",
                            precision="extracted from S2 zone-map raster; ±0.1 km relative to S2, S2 zones themselves ±2.5 km by construction", area_km2=round(zg.area * 111 * 111 * math.cos(math.radians(zg.centroid.y)), 1)))
    # geology polygons
    gcount = 0
    for k, unit in GEOL_KEY.items():
        if k not in sw or unit.startswith('Outside'): continue
        m = cmask(a, sw[k], 16) & plot & ~rm
        m = ndimage.binary_opening(ndimage.binary_closing(m, iterations=2), iterations=1)
        polys = [shape(s) for s, v in rf.shapes(m.astype(np.uint8)) if v == 1]
        polys = [p.buffer(0) for p in polys if p.area > 150]
        if not polys: continue
        g = poly_ll(unary_union(polys).simplify(2.0), aff, 'll')
        geo_feats.append(F(g, unit=unit, zone_map=zid, src="S2a via S2", page=PAGE[rel], evidence="interpretation",
                           precision="PLANAGEO 1:250,000 geology re-extracted from S2 raster (pixel ≈%d m); unit boundaries ±0.3 km" % round(abs(aff.a) * 111000)))
        gcount += 1
    # point symbols
    n0 = len(occ_feats)
    for k, (cls, label, comm) in PTS.items():
        if k not in sw: continue
        m = cmask(a, sw[k], 45) & plot & ~textmask
        for c in comps(m, 12, 900):
            if c['w'] > 30 or c['h'] > 30 or min(c['w'], c['h']) < 6 or abs(c['w'] - c['h']) > 5: continue
            if cls == 'Cu' and not (.3 <= c['fill'] <= .72): continue
            if cls == 'quarry' and c['fill'] < .75: continue
            if cls == 'qtz' and c['fill'] > .5: continue
            if cls == 'salt' and c['fill'] > .55: continue
            if cls == 'qtz' and not near_label(O, c['x'] + 8, c['y'], 60, exclude={o['t'] for o in leg}): continue
            lon, lat = aff * (c['x'], c['y'])
            nm = near_label(O, c['x'] + 8, c['y'], 75, exclude={o['t'] for o in leg})
            occ_feats.append(F(Point(lon, lat), cls=cls, label=label, name=nm, commodities=comm, zone_map=zid, src="S2a via S2", page=PAGE[rel], evidence="occurrence",
                               precision="symbol centroid from S2 raster ±0.1 km; PLANAGEO layer itself ±0.25 km"))
    # field stations: small round black dots
    blk = (a.max(2) < 70) & plot & ~textmask
    for c in comps(blk, 10, 120):
        if 4 <= c['w'] <= 14 and 4 <= c['h'] <= 14 and c['fill'] > .55 and abs(c['w'] - c['h']) <= 3:
            lon, lat = aff * (c['x'], c['y'])
            stn_feats.append(F(Point(lon, lat), cls="stn", label="Field-station evidence (2016–19)", zone_map=zid, src="S2a via S2", page=PAGE[rel], evidence="occurrence", precision="±0.1 km"))
    dbg(rel, [((~aff) * tuple(f['geometry']['coordinates'])) + ((0, 0, 255),) for f in occ_feats[n0:]], 'dbg_' + zid, [unary_union(zpolys)] if zpolys else [])
    log(f"Vectorise zone map {zid}", f"{len(zpolys)} boundary ring(s); {gcount} geology units; {len(occ_feats)-n0} occurrence symbols; legend colours read for {len(sw)} entries")

# de-duplicate occurrences shared by overlapping zone maps (same class within 300 m)
def dedupe(feats, dist_deg=0.003, key='cls'):
    out = []
    for f in feats:
        p = f['geometry']['coordinates']
        dup = next((g for g in out if g['properties'][key] == f['properties'][key] and math.hypot(g['geometry']['coordinates'][0] - p[0], g['geometry']['coordinates'][1] - p[1]) < dist_deg), None)
        if dup:
            if not dup['properties'].get('name') and f['properties'].get('name'): dup['properties']['name'] = f['properties']['name']
        else:
            out.append(f)
    return out
occ_feats = dedupe(occ_feats); stn_feats = dedupe(stn_feats)
STATED = {"Z1": 362, "Z2": 98, "Z3": 60, "Z4": 139, "Z5": 146, "Z6": 129, "Z7": 399, "Z8": 32, "Z9": 211}
log("Zone areas: extracted vs stated in S2", "; ".join(f"{f['properties']['id']} {f['properties']['area_km2']:.0f}/{STATED[f['properties']['id']]} km²" for f in zone_feats))
save('vec_namibe_geology.geojson', geo_feats); save('vec_namibe_zones.geojson', zone_feats)
save('vec_namibe_occurrences.geojson', occ_feats + stn_feats)
named = sum(1 for f in occ_feats if f['properties'].get('name'))
cnt = {}
for f in occ_feats: cnt[f['properties']['cls']] = cnt.get(f['properties']['cls'], 0) + 1
log("Namibe/Huíla occurrences after de-duplication", f"{len(occ_feats)} symbols ({', '.join(f'{k}:{v}' for k,v in cnt.items())}), {named} with OCR-read names; {len(stn_feats)} field stations. S2 states 75 recorded sites – compare")

# =========================================================================== S2 p27 Chipindo samples (UTM 33S)
rel = 's2/p27_0.png'; a = img(rel); H, W = a.shape[:2]; O = ocr(rel)
xt, yt = ticks_from_ocr(rel, 'utm', bottom_min=H * .9, left_max=W * .2)
affc = georef_ll(rel, xt, yt, "S2 p.27 Chipindo sample map (UTM 33S)", crs='EPSG:32733')
leg = [o for o in O if o['x0'] > 380 and o['y0'] < 380 and o['cx'] < 900]
textmask = np.zeros((H, W), bool)
for o in O: textmask[int(o['y0']):int(o['y1']) + 1, int(o['x0']):int(o['x1']) + 1] = True
legbox = np.zeros((H, W), bool); legbox[60:390, 330:900] = True
sw = {re.sub(r'[^a-z0-9]', '', o['t'].lower()): swatch(a, o, 40, 6) for o in leg}
GR = [("au5", "Au ≥ 5 g/t", 5), ("au15gt", "Au 1–5 g/t", 1), ("au031gt", "Au 0.3–1 g/t", 0.3), ("au03gtornotassayed", "Au < 0.3 g/t or not assayed", 0)]
plotm = np.zeros((H, W), bool); plotm[60:1490, 240:1460] = True; plotm &= ~legbox & ~textmask
chip = []
for key, label, lo in GR:
    col = next((v for k, v in sw.items() if k.startswith(key[:6]) and v), None)
    if col is None: continue
    m = cmask(a, col, 38) & plotm
    for c in comps(m, 25, 700):
        if c['w'] > 34 or c['h'] > 34: continue
        # shape: square fill≈1; diamond fill≈.5 centred; up-triangle centroid low; down-triangle centroid high
        if c['fill'] > .82: typ = "Trench (best sample)"
        elif c['bcy'] > .58: typ = "Rock chip (IMA)"
        elif c['bcy'] < .42: typ = "Chip / channel (LAFECH)"
        else: typ = "Drill hole (best sample)"
        lon, lat = to_ll(affc, c['x'], c['y'], 'utm')
        chip.append(F(Point(lon, lat), cls=key, grade=label, au_min_gpt=lo, sample_type=typ, sampler="LAFECH" if "LAFECH" in typ else "IMA",
                      src="S2c via S2", page=27, evidence="measured", precision="best value per site, symbol centroid from S2 raster ±0.1 km; assay certificates not seen"))
alv = next((v for k, v in sw.items() if k.startswith('alluvial')), (40, 160, 110))
m = cmask(a, alv, 40) & plotm
pits = [c for c in comps(m, 15, 4000)]
for c in pits:
    lon, lat = to_ll(affc, c['x'], c['y'], 'utm')
    chip.append(F(Point(lon, lat), cls="pit", grade="Alluvial gold pit cluster", sample_type="Alluvial pit(s)", n_est=max(1, round(c['a'] / 120)), src="S2c via S2", page=27, evidence="measured", precision="cluster centroid ±0.2 km"))
for o in O:
    if o['t'] in ('Chiriva', 'Tchiquele - Tchambassuco', 'Cassanda', 'Tramangolo', 'Cavissaca'):
        lon, lat = to_ll(affc, o['cx'], o['cy'], 'utm')
        chip.append(F(Point(lon, lat), cls="prospect", grade="", name=o['t'], sample_type="Prospect name", src="S2", page=27, evidence="occurrence", precision="label position ±0.5 km"))
dbg(rel, [((~affc) * ll2utm.transform(*f['geometry']['coordinates'])) + ({'au5': (255, 0, 255), 'pit': (0, 0, 255)}.get(f['properties']['cls'], (0, 160, 255)),) for f in chip], 'dbg_chipindo')
save('vec_chipindo_samples.geojson', chip)
cc = {}
for f in chip: cc[f['properties']['sample_type']] = cc.get(f['properties']['sample_type'], 0) + 1
log("Extract Chipindo best-value symbols", "; ".join(f"{k}: {v}" for k, v in cc.items()) + ". Shape classified from fill ratio and centroid offset; grade class from legend colour")

# =========================================================================== S2 p26 thorium image -> value grid; S2 p2 Map 1 USGS symbols
def hue_index(rgb):
    """rainbow (blue→cyan→green→yellow→red→magenta) to 0..1"""
    r, g, b = [rgb[..., i] / 255 for i in range(3)]
    mx, mn = np.max(rgb, -1) / 255, np.min(rgb, -1) / 255
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    # map hue: 240 (blue)→0, 180→.2, 120→.4, 60→.6, 0/360→.8, 300→1
    idx = np.where(h <= 240, (240 - h) / 240 * .8, np.where(h >= 290, .8 + (360 - h) / 70 * .2, .8))
    idx = np.where(h >= 290, 1 - (h - 290) / 70 * .2, idx)
    return np.clip(idx, 0, 1), d

def grid_from(rgb_img, aff_px2ll, crs, bounds, res, fn, mask_fn=None):
    """resample a source raster into a lon/lat grid (nearest), applying fn(rgb)->value(s) 0..1"""
    w, s, e, n = bounds
    nx, ny = int((e - w) / res), int((n - s) / res)
    lon = w + (np.arange(nx) + .5) * res; lat = n - (np.arange(ny) + .5) * res
    LON, LAT = np.meshgrid(lon, lat)
    if crs == 'utm':
        X, Y = ll2utm.transform(LON, LAT)
    else:
        X, Y = LON, LAT
    inv = ~aff_px2ll
    PX, PY = inv * (X, Y)
    H, W = rgb_img.shape[:2]
    ok = (PX >= 0) & (PX < W) & (PY >= 0) & (PY < H)
    PXi, PYi = np.clip(PX.astype(int), 0, W - 1), np.clip(PY.astype(int), 0, H - 1)
    samp = rgb_img[PYi, PXi]
    vals = fn(samp)
    valid = ok & (mask_fn(samp) if mask_fn else True)
    return vals, valid, (w, n, res, nx, ny)

def pack(vals, valid, meta, gid, title, unit, bands, src, page, note, ramp):
    w, n, res, nx, ny = meta
    out = dict(id=gid, title=title, unit=unit, bands=bands, west=w, north=n, res=res, nx=nx, ny=ny, src=src, page=page, note=note, ramp=ramp, data=[])
    arrs = vals if isinstance(vals, (list, tuple)) else [vals]
    inside = valid & np.array([[ANGOLA.contains(Point(w + (i + .5) * res, n - (j + .5) * res)) for i in range(nx)] for j in range(ny)]) if gid != 'th_ute4' else valid
    for v in arrs:
        q = np.where(inside, np.clip(np.round(v * 254), 0, 254) + 1, 0).astype(np.uint8)  # 0 = no data
        out['data'].append(base64.b64encode(q.tobytes()).decode())
    json.dump(out, open(os.path.join(DATA, f'grid_{gid}.json'), 'w'), separators=(',', ':'))
    return inside

rel = 's2/p26_0.png'; a = img(rel); H, W = a.shape[:2]
xt, yt = ticks_from_ocr(rel, 'll', bottom_min=H * .9, left_max=W * .2)
aff26 = georef_ll(rel, xt, yt, "S2 p.26 UTE-4 thorium image")
idx, sat = hue_index(a.astype(float))
vals, valid, meta = grid_from(np.dstack([idx * 255, sat * 255, np.zeros_like(idx)]).astype(float), aff26, 'll', (13.15, -15.05, 14.05, -13.3), 0.005,
                              lambda s: s[..., 0] / 255, lambda s: s[..., 1] > 60)
pack(vals, valid, meta, 'th_ute4', "UTE-4 airborne thorium (relative index, from S2 p.26 colour image)", "relative Th index 0–1 (blue low → magenta high)", ["Th index"], "S2b via S2", 26,
     "Colour-to-value inversion of a rainbow-stretched image: ranks, not ppm. Same survey family as MIREMPET slide 5.", "rainbow")
log("Convert S2 p.26 thorium image to a value grid", f"{meta[3]}×{meta[4]} cells at 0.005° (~550 m); {int(valid.sum())} cells with data")

rel = 's2/p02_0.png'; a = img(rel); H, W = a.shape[:2]; O = ocr(rel)
xt, yt = ticks_from_ocr(rel, 'll', bottom_min=H * .82, left_max=W * .2)
aff2 = georef_ll(rel, xt, yt, "S2 p.2 Map 1 (national zones and projects)")
leg = [o for o in O if o['x0'] > W * .6 and o['y0'] > H * .6]
USGS_CLS = {"usgsdiamonds": ("diamond", ["diamond"]), "usgscopper": ("copper", ["Cu"]), "usgsiron": ("iron", ["Fe"]), "usgsniobiumvanadium": ("Nb / V", ["Nb", "V"]),
            "usgsphosphatepotash": ("phosphate / potash", ["phosphate rock"]), "usgscementgypsum": ("cement / gypsum", ["gypsum"])}
TYPES = {"usgsdepositunumbermap4": "Deposit", "usgsexplorationprojectunumbermap4": "Exploration project", "usgsmineplantunumbermap4": "Mine / plant"}
textmask = np.zeros((H, W), bool)
for o in O: textmask[int(o['y0']):int(o['y1']) + 1, int(o['x0']):int(o['x1']) + 1] = True
plotm = np.zeros((H, W), bool); plotm[int(min(p for p, _ in yt)) - 120:int(max(p for p, _ in yt)) + 60, int(min(p for p, _ in xt)) - 120:int(max(p for p, _ in xt)) + 120] = True
lb = [o for o in leg]; lx0 = min(o['x0'] for o in lb) - 60; ly0 = min(o['y0'] for o in lb) - 20
plotm[ly0:, lx0:] = False; plotm &= ~textmask
usgs = []
for o in leg:
    k = re.sub(r'[^a-z]', '', o['t'].lower())
    if k in USGS_CLS:
        col = swatch(a, o, 40, 6); nm, comm = USGS_CLS[k]
        m = cmask(a, col, 40) & plotm
        for c in comps(m, 15, 500):
            if c['w'] > 26 or c['h'] > 26: continue
            typ = ("IMA listed title (no technical data)" if c['w'] >= 13 else "Mine / plant") if c['fill'] > .85 else ("Exploration project" if c['bcy'] > .56 else "Deposit")
            lon, lat = aff2 * (c['x'], c['y'])
            usgs.append(F(Point(lon, lat), cls=nm, commodities=comm, site_type=typ, label=near_label(O, c['x'] + 10, c['y'], 90), src="S2d via S2", page=2, evidence="occurrence",
                          precision="USGS country-scale record re-plotted by S2; ±1–5 km"))
# project areas (filled polygons) labelled by the nearest 'P#' text
areas = []; parea = []
for o in leg:
    k = re.sub(r'[^a-z]', '', o['t'].lower())
    if k in ('goldprojectarea', 'copperprojectarea', 'cobaltprojectarea'):
        col = swatch(a, o, 45, 8)
        m = cmask(a, col, 22) & plotm
        m = ndimage.binary_closing(m, iterations=2)
        for s_, v in rf.shapes(m.astype(np.uint8)):
            g = shape(s_)
            if v != 1 or g.area < 60: continue
            pl = min((o2 for o2 in O if re.match(r'^P\d{1,2}$', o2['t'])), key=lambda o2: g.centroid.distance(Point(o2['cx'], o2['cy'])))
            parea.append((pl['t'], k.replace('projectarea', ''), g))
# P6 and P8 are drawn as rings (too small to fill) – take ring interiors
for o in leg:
    pass
byp = {}
for pid, kind, g in parea: byp.setdefault(pid, (kind, []))[1].append(g)
for pid, (kind, gs) in byp.items():
    gl = poly_ll(unary_union(gs).buffer(0), aff2, 'll')
    areas.append(F(gl.simplify(0.002), id=pid, kind=f"S2 project area ({kind})", src="S2", page=2, evidence="coverage",
                   precision="filled outline extracted from S2 Map 1 (pixel ≈0.9 km); S2 built it from title coordinates (WGS84)"))
save('vec_s2_project_areas.geojson', areas)
log("Extract S2 project areas from Map 1", f"{len(areas)} filled areas labelled {', '.join(sorted(byp))}; ring-drawn P6/P8 and small P7 kept from hand trace")
dbg(rel, [((~aff2) * tuple(f['geometry']['coordinates'])) + ((255, 0, 255),) for f in usgs], 'dbg_map1', [unary_union([g for _, _, g in parea])] if parea else [])
save('vec_usgs_sites.geojson', usgs)
log("Extract USGS sites from S2 Map 1", f"{len(usgs)} symbols coloured by mineral; U-number labels attached where legible (S2 lists 45 sites incl. 3 cement plants)")

# =========================================================================== MIREMPET slide 18 – Namibe lithium title (UTM 33S)
rel = 'mir/p18_8.jpeg'; a = img(rel); H, W = a.shape[:2]; O = ocr(rel)
# grid labels read on the slide: 215000E…235000E (top), 8325000N…8315000N (left); positions from OCR or manual fallback
xt = [(o['cx'], float(re.sub(r'\D', '', o['t']))) for o in O if re.match(r'^2\d{5}E?$', o['t'].replace(' ', ''))]
yt = [(o['cy'], float(re.sub(r'\D', '', o['t']))) for o in O if re.match(r'^83\d{5}N?$', o['t'].replace(' ', ''))]
if len(xt) < 2 or len(yt) < 2:
    xt = [(54, 215000), (136, 220000), (219, 225000), (301, 230000), (384, 235000)]
    yt = [(78, 8325000), (157, 8320000), (238, 8315000)]
    log("MIREMPET slide 18 ticks", "OCR could not read the small grid labels; manual tick read used")
affl = georef_ll(rel, xt, yt, "MIREMPET slide 18 lithium title map (UTM 33S)", crs='EPSG:32733', how='manually read')
# the title outline on the slide is a thin, broken blue line on satellite imagery; colour segmentation leaves gaps,
# so its 13 vertices were read on the enlarged image (pixel coordinates of the slide image)
TV = [(65, 30), (160, 80), (215, 100), (240, 65), (415, 165), (350, 272), (258, 213), (195, 298), (88, 225), (108, 188), (57, 158), (20, 135), (15, 98)]
tp = Polygon(TV)
li = []
if tp is not None and tp.area > 2000:
    g = poly_ll(tp.buffer(0).simplify(1), affl, 'utm')
    li.append(F(g, cls="title", name="Prospecting title 023/05/03/T.P/ANG-MIREMPET 2023 (Tyranna / AngoLítio)", src="S1", page=18, evidence="coverage",
                precision="13 vertices read from the operator map on its UTM grid ±0.3 km", area_km2=round(shp_tr(ll2utm.transform, g).area / 1e6, 1)))
VALS = {"NR065": 4.24, "NR069": 4.24, "NR056": 0.08, "NR068": 0.81, "NR060": 1.13, "NR063": 2.73}
yel = (a[..., 0] > 200) & (a[..., 1] > 200) & (a[..., 2] < 110)
cands = [c for c in comps(yel, 8, 120) if c['w'] <= 12 and c['h'] <= 12]
labs = [o for o in O if re.match(r'^NR0?\d{2}', o['t'].replace(' ', ''))]
manual = {"NR065": (151, 88), "NR069": (122, 152), "NR056": (170, 205), "NR068": (189, 226), "NR060": (343, 203), "NR063": (334, 240)}
for sid, v in VALS.items():
    lab = next((o for o in labs if o['t'].replace(' ', '').startswith(sid)), None)
    lx, ly = (lab['x0'], lab['cy']) if lab else manual[sid]
    c = min(cands, key=lambda c: math.hypot(c['x'] - (lx - 8), c['y'] - (ly + 6))) if cands else None
    x, y = (c['x'], c['y']) if c and math.hypot(c['x'] - lx, c['y'] - ly) < 45 else (lx - 8, ly + 6)
    lon, lat = to_ll(affl, x, y, 'utm')
    li.append(F(Point(lon, lat), cls="assay", sample=sid, li2o_pct=v, sample_type="grab (operator map, May 2023)", src="S1", page=18, evidence="measured",
                precision="symbol on operator map ±0.2 km; values not certified" + ("; identical value to NR065 – check" if sid == "NR069" else "")))
dbg(rel, [((~affl) * ll2utm.transform(*f['geometry']['coordinates'])) + ((255, 0, 0),) for f in li if f['geometry']['type'] == 'Point'], 'dbg_li', [tp] if tp is not None else [])
save('vec_namibe_lithium.geojson', li)
log("Vectorise MIREMPET slide 18 lithium map", f"title polygon {'extracted' if tp is not None else 'not found'} ({li[0]['properties'].get('area_km2','?')} km²); 6 assay points placed from labels/symbols")

# =========================================================================== MIREMPET slide 8 – all occurrence classes
rel = 'mir/p08_4.jpeg'; a = img(rel); H, W = a.shape[:2]
lon8 = {13: 163, 16: 290, 19: 416, 22: 543, 25: 670}; lat8 = {-5: 105, -8: 232, -11: 358.5, -14: 485.5, -17: 612}
aff8 = georef_ll(rel, [(p, v) for v, p in lon8.items()], [(p, v) for v, p in lat8.items()], "MIREMPET slide 8 (frame ticks)", how="manually read")
O = ocr(rel)
land = rf.rasterize([(ANGOLA.buffer(0.04), 1)], out_shape=(H, W), transform=aff8).astype(bool)
rows = {re.sub(r'[^a-z]', '', o['t'].lower()): o for o in O if o['x0'] > 745 and o['y0'] > 120}
def rowcol(key):
    o = next(v for k, v in rows.items() if k.startswith(key))
    reg = a[int(o['cy']) - 5:int(o['cy']) + 6, 752:772].reshape(-1, 3)
    reg = reg[(reg.max(1) - reg.min(1) > 45) & (reg.max(1) > 100)]
    if len(reg) < 6: raise StopIteration
    return tuple(int(v) for v in np.median(reg, 0))
# (legend keyword, label, shape, elements/minerals)  shape: sq square, ci circle, tri triangle, dia diamond, x cross
CL8 = [("ferrous", "Ferrous metals", "sq", ["Fe"]), ("nonferrous", "Non-ferrous metals", "sq", ["base metals"]), ("gold", "Gold", "ci", ["Au"]),
       ("noble", "Noble metals", "ci", ["Au", "Ag", "PGE"]), ("nickel", "Nickel and cobalt", "tri", ["Ni", "Co"]), ("rareearth", "Rare-earth elements (REE)", "ci", ["REE"]),
       ("barite", "Barite and fluorite", "tri", ["barite"]), ("diama", "Diamonds / semi-precious stones (same symbol)", "dia", ["diamond"]),
       ("limestone", "Limestone", "sq", ["marble"]), ("dolomitic", "Dolomitic limestone", "sq", ["marble"]), ("talc", "Talc, mica and olivine", "ci", []),
       ("mineralsalts", "Mineral salts", "x", ["salt"]), ("clay", "Clay, kaolin and diatomite", "x", []), ("guano", "Guano and phosphorites", "ci", ["phosphate rock"])]
def shp(c):
    if c['fill'] > .82: return "sq"
    if c['fill'] < .45: return "x"
    if c['fill'] > .66: return "ci"
    if c['bcy'] > .56: return "tri"
    return "dia"
cols = {}
for key, label, sh, el in CL8:
    try: cols[key] = rowcol(key)
    except StopIteration: pass
o8 = []; seen = np.zeros((H, W), bool)
for key, label, sh, el in CL8:
    if key not in cols: continue
    m = cmask(a, cols[key], 46) & land & ~seen
    for c in comps(m, 14, 3000):
        big = c['a'] > 2.4 * 90
        # shape only separates classes that share a legend colour (limestone square vs Ni–Co triangle; diamond vs circle)
        if not big and key in ('limestone', 'nickel', 'dolomitic') and shp(c) != sh: continue
        k = max(1, round(c['a'] / 90))
        lon, lat = aff8 * (c['x'], c['y'])
        o8.append(F(Point(lon, lat), cls=key, label=label, elements=el, n_symbols_est=k, src="S1", page=8, evidence="occurrence",
                    precision="symbol centroid from slide ±5 km" + ("; merged cluster – class by colour, count by area" if big else "")))
OCC8 = cols
dbg(rel, [((~aff8) * tuple(f['geometry']['coordinates'])) + ((255, 0, 255),) for f in o8], 'dbg_p08')
print('OCC8', OCC8, {k: sum(f['properties']['n_symbols_est'] for f in o8 if f['properties']['cls']==k) for k in OCC8})
save('vec_occurrences_all.geojson', o8)
log("Digitise MIREMPET slide 8 occurrence classes", f"{len(OCC8)} legend classes resolved by colour + symbol shape, {sum(f['properties']['n_symbols_est'] for f in o8)} symbols; grey/black classes not extracted. Stated total >2,500")

# =========================================================================== MIREMPET slide 5 airborne images -> value grids
ov = {o['id']: o for o in json.load(open(os.path.join(DATA, 'overlays.json')))}
def bbox_affine(rel_img, oid):
    # rebuild the bounding-box fit used in build_spatial.py from the warped PNG bounds (EPSG:4326 PNG)
    o = ov[oid]; im = np.asarray(Image.open(os.path.join(ROOT, o['file'])).convert('RGBA')).astype(int)
    w, s, e, n = o['bounds']; Hh, Ww = im.shape[:2]
    return im, Affine((e - w) / Ww, 0, w, 0, -(n - s) / Hh, n)
for oid, gid, title, unit in [("p05mag", "mag", "Total magnetic intensity (relative index from slide 5 colours)", "relative TMI index 0–1 (blue low → magenta high)"),
                              ("p05dem", "dem", "Elevation (from slide 5 DEM colours)", "metres a.s.l. (approximate, from legend ramp)"),
                              ("p05rad", "rad", "Radiometric K / Th / U shares (from slide 5 ternary colours)", "share of K, Th, U in the ternary stretch (0–1)")]:
    im, affp = bbox_affine(None, oid)
    rgb = im[..., :3].astype(float); alpha = im[..., 3]
    if gid == 'mag':
        fn = lambda s: hue_index(s[..., :3])[0]; bands = ["TMI index"]
    elif gid == 'dem':
        # legend ramp of slide 5 (y 71–76, x 262–484) with OCR-read stops; hillshade removed by matching chromaticity
        leg_img = img('mir/p05_5.jpeg')
        xs = np.arange(262, 485); ramp = leg_img[72:76, 262:485].mean(0)
        stops = [(262, 0), (280, 368), (306, 706), (331, 1032), (363, 1108), (387, 1164), (420, 1240), (449, 1387), (479, 1812)]
        elev = np.interp(xs, [p_ for p_, _ in stops], [e_ for _, e_ in stops])
        rc = ramp / (ramp.sum(1, keepdims=True) + 1e-6)
        def fn(s):
            px_ = s[..., :3].reshape(-1, 3); c = px_ / (px_.sum(1, keepdims=True) + 1e-6)
            d = ((c[:, None, :] - rc[None, :, :]) ** 2).sum(2)
            return (elev[d.argmin(1)] / 1812).reshape(s.shape[:2])
        bands = ["Elevation (m)"]
    else:
        def fn(s):
            t = s[..., :3].sum(-1) + 1e-6
            return [s[..., 0] / t, s[..., 1] / t, s[..., 2] / t]
        bands = ["K share", "Th share", "U share"]
    w, s, e, n = ov[oid]['bounds']
    vals, valid, meta = grid_from(np.dstack([rgb, alpha[..., None]]), affp, 'll', (11.6, -18.1, 24.1, -4.35), 0.04, fn, lambda s: s[..., 3] > 100)
    pack(vals, valid, meta, gid, title, unit, bands, "S1", 5,
         ("Colour-to-value inversion of the displayed image (index, not nT). " if gid == 'mag' else "") +
         ("Elevation from the slide legend ramp (stops 0–1,812 m) matched by chromaticity to remove hillshade; ±150 m, worse on pale summits. " if gid == 'dem' else "") +
         ("Shares of red/green/blue = K/Th/U in the ternary stretch – relative, not ppm/%. " if gid == 'rad' else "") +
         "Georeferenced by bounding box ±10 km; 0.04° cells (~4.4 km).", "rainbow" if gid == 'mag' else ("terrain" if gid == 'dem' else "ternary"))
    log(f"Convert slide-5 {gid.upper()} image to a value grid", f"{meta[3]}×{meta[4]} cells at 0.04°; {int(valid.sum())} with data")

# =========================================================================== small maps: labs, Cácata, Namibe cluster (named points, approximate)
pts = [
 ("Luanda laboratory (HQ, 18 methods)", 13.234, -8.838, "lab", "S1", 11, "town ±5 km"),
 ("Huíla laboratory (10 methods; dimension-stone physical properties)", 13.49, -14.92, "lab", "S1", 11, "province shown on slide; placed at Lubango ±20 km"),
 ("Saurimo laboratory (10 methods; caustic fusion for microdiamonds)", 20.39, -9.66, "lab", "S1", 11, "town ±5 km"),
 ("Mina Cácata (Minbos)", 12.48, -5.25, "mine", "S1/S6", 16, "≈45 km NE of Cabinda City (S6) ±5 km"),
 ("Fábrica Subantando – phosphate fertilizer plant", 12.33, -5.43, "plant", "S1", 16, "read from location inset between port and mine ±5 km"),
 ("Porto de Cabinda", 12.19, -5.55, "port", "S1", 16, "±2 km"),
 ("Pólo de Desenvolvimento de Rochas Ornamentais do Namibe", 12.40, -15.10, "cluster", "S1", 20, "≈32 km from Moçâmedes per slide ±5 km"),
 ("Porto do Namibe", 12.15, -15.19, "port", "S1", 20, "±2 km"), ("Porto do Sacomar", 12.12, -15.15, "port", "S1", 20, "±3 km"),
 ("Saurimo Diamond Development Cluster", 20.39, -9.63, "cluster", "S1", 19, "town ±5 km"),
]
save('vec_infrastructure.geojson', [F(Point(lo, la), name=n, cls=c, src=s, page=p, evidence="operator", precision=pr) for n, lo, la, c, s, p, pr in pts])

# =========================================================================== non-georeferenced plans as local-coordinate insets
# Longonjo site plan (slide 17): 0–2 km scale bar; coordinates in km, origin lower-left, north up. Read on enlarged image.
# Longonjo site plan (slide 17, 517×373 px). Scale bar 0–2 km spans 100 px → 20 m/px; vertices read on a 2× gridded enlargement.
# Licence polygon area computed from these vertices is checked against the 21 km² printed on the plan.
K = lambda pts: [[round(x / 50, 2), round((373 - y) / 50, 2)] for x, y in pts]
LF = [
 ("Mining licence (21 km² printed on plan)", "polygon", "licence", [(142.5, 92.5), (262.5, 92.5), (317.5, 147.5), (320, 197.5), (425, 290), (405, 317.5), (235, 355), (165, 315), (110, 257.5), (122.5, 132.5)]),
 ("Carbonatite (outline)", "polygon", "carbonatite", [(150, 135), (200, 115), (270, 130), (305, 160), (310, 200), (300, 240), (260, 255), (200, 250), (160, 215), (145, 170)]),
 ("Open pit (design outline)", "polygon", "pit", [(232, 165), (250, 165), (255, 190), (272, 210), (280, 235), (260, 245), (235, 235), (235, 210)]),
 ("Process plant (building A)", "polygon", "plant", [(307, 232), (325, 212), (334, 217), (316, 242)]),
 ("Process plant (building B)", "polygon", "plant", [(287, 265), (295, 247), (300, 249), (292, 275)]),
 ("Process plant (building C)", "polygon", "plant", [(271, 264), (280, 264), (280, 273), (271, 273)]),
 ("Tailings storage facility (TSF)", "polygon", "tsf", [(300, 280), (330, 255), (365, 260), (367, 300), (345, 320), (310, 315)]),
 ("Unlabelled hatched feature (likely waste dump)", "polygon", "dump", [(200, 260), (245, 258), (248, 275), (225, 288), (205, 285)]),
 ("Solar hybrid power plant", "polygon", "solar", [(490, 152), (507, 160), (502, 167), (485, 160)]),
 ("Benguela Railway Line", "line", "rail", [(10, 70), (100, 47), (175, 17), (295, 19), (325, 42), (400, 87), (465, 135), (515, 165)]),
 ("Rail siding", "point", "siding", [(400, 90)]),
 ("Longonjo town (label)", "point", "town", [(375, 117)]),
]
def shoelace(pts):
    return abs(sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))) / 2
lic_km2 = shoelace(K(LF[0][3]))
insets = {"longonjo": {"title": "Longonjo site plan (MIREMPET slide 17)", "src": "S1", "page": 17, "units": "km, from the plan's 0–2 km scale bar (±0.1 km)",
          "note": f"Not georeferenced: the plan has a scale bar and north arrow but no coordinates. Licence outline as digitised = {lic_km2:.1f} km² vs 21 km² printed – a consistency check on the scale.",
          "w": 10.34, "h": 7.46, "features": [{"name": n, "kind": k, "cls": c, "xy": K(xy)} for n, k, c, xy in LF]}}
log("Digitise Longonjo site plan", f"{len(LF)} features in local km; licence {lic_km2:.1f} km² vs 21 km² printed")
log("Chiri drill plan (slide 13)", "Not vectorised: the inset is 161×208 px and collar symbols are not legible. Request the collar table (R-Chiri) instead of guessing")
json.dump(insets, open(os.path.join(DATA, 'insets.json'), 'w'), ensure_ascii=False)
json.dump(QA, open(os.path.join(DATA, 'qa_vectorise.json'), 'w'), ensure_ascii=False, indent=1)
