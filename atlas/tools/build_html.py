"""Inline atlas.json and the GeoJSON layers into the page template.

usage: python3 atlas/tools/build_html.py [ARTIFACT_OUT_DIR]
Writes atlas/index.html (standalone document, open directly in a browser) and, if given,
ARTIFACT_OUT_DIR/index.html (body-only variant for hosted publishing) plus a copy of img/.
"""
import json, os, sys, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda n: json.load(open(os.path.join(ROOT, 'data', n)))
atlas = D('atlas.json')
geo = dict(angola=D('angola.geojson'), provinces=D('provinces.geojson'), neighbours=D('neighbours.geojson'), planageo=D('planageo.geojson'),
           coverage=D('airborne_coverage.geojson'), domains=D('domains.geojson'), occ=D('critical_occurrences_digitised.geojson'), s2=D('s2_areas.geojson'),
           occ8=D('vec_occurrences_all.geojson'), usgs=D('vec_usgs_sites.geojson'), geology=D('vec_namibe_geology.geojson'), namocc=D('vec_namibe_occurrences.geojson'),
           chipindo=D('vec_chipindo_samples.geojson'), lithium=D('vec_namibe_lithium.geojson'), infra=D('vec_infrastructure.geojson'))
grids = {k: D(f'grid_{k}.json') for k in ('mag', 'dem', 'rad', 'th_ute4')}
js = "window.ATLAS=" + json.dumps(atlas, ensure_ascii=False, separators=(',', ':')) + ";\nwindow.GEO=" + json.dumps(geo, ensure_ascii=False, separators=(',', ':')) + ";\nwindow.GRIDS=" + json.dumps(grids, separators=(',', ':')) + ";"
js = js.replace("</", "<\\/")
tpl = open(os.path.join(ROOT, 'src', 'atlas.template.html')).read()
body = tpl.replace("/*__DATA__*/", js)
head, rest = body.split("<style>", 1)
standalone = ("<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n"
              + head + "<style>" + rest.split("</style>", 1)[0] + "</style>\n</head>\n<body>\n" + rest.split("</style>", 1)[1] + "\n</body>\n</html>\n")
open(os.path.join(ROOT, 'index.html'), 'w').write(standalone)
if len(sys.argv) > 1:
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w').write(body)
    if os.path.exists(os.path.join(out, 'img')): shutil.rmtree(os.path.join(out, 'img'))
    shutil.copytree(os.path.join(ROOT, 'img'), os.path.join(out, 'img'), ignore=shutil.ignore_patterns('geo_*'))
print("index.html", round(len(standalone) / 1024), "KB")
