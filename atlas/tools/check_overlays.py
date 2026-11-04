"""Visual QA: draw the Natural Earth outline, domains and Leste polygon over each warped overlay."""
import json, sys, os
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out = sys.argv[1]
ov = json.load(open(f'{D}/data/overlays.json'))
ang = json.load(open(f'{D}/data/angola.geojson'))['features'][0]['geometry']
prov = json.load(open(f'{D}/data/provinces.geojson'))['features']
for o in ov:
    im = Image.open(f"{D}/{o['file']}").convert('RGBA')
    bg = Image.new('RGBA', im.size, 'white'); bg.alpha_composite(im); im = bg
    w, s, e, n = o['bounds']; W, H = im.size
    d = ImageDraw.Draw(im)
    P = lambda c: ((c[0]-w)/(e-w)*W, (n-c[1])/(n-s)*H)
    def rings(g):
        cs = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        for poly in cs:
            for r in poly: yield r
    for f in prov:
        for r in rings(f['geometry']): d.line([P(c) for c in r], fill=(0, 0, 0, 255), width=1)
    for r in rings(ang): d.line([P(c) for c in r], fill=(255, 0, 0, 255), width=2)
    im.convert('RGB').save(f"{out}/chk_{o['id']}.png")
