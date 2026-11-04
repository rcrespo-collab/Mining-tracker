"""Render a crop of an image enlarged with a labelled pixel grid, for reading GCP pixel positions.
usage: gridcrop.py IMG x0 y0 x1 y1 scale step OUT"""
import sys
from PIL import Image, ImageDraw
img, x0, y0, x1, y1, sc, step, out = sys.argv[1], *map(int, sys.argv[2:8]), sys.argv[8]
im = Image.open(img).convert('RGB').crop((x0, y0, x1, y1))
im = im.resize((im.width * sc, im.height * sc), Image.NEAREST)
d = ImageDraw.Draw(im)
for x in range((x0 // step + 1) * step, x1, step):
    X = (x - x0) * sc
    d.line([(X, 0), (X, im.height)], fill=(255, 0, 255), width=1)
    d.text((X + 2, 2), str(x), fill=(255, 0, 255))
for y in range((y0 // step + 1) * step, y1, step):
    Y = (y - y0) * sc
    d.line([(0, Y), (im.width, Y)], fill=(0, 160, 255), width=1)
    d.text((2, Y + 2), str(y), fill=(0, 120, 255))
im.save(out)
