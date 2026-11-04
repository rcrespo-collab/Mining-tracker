"""Extract the embedded map images of the Portfolio study PDF at native resolution.

usage: python3 -I atlas/tools/extract_s2.py <PORTFOLIO_PDF> <OUT_DIR>/s2
"""
import sys, os, pymupdf
pdf, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
d = pymupdf.open(pdf)
for i, p in enumerate(d):
    for j, x in enumerate(p.get_images(full=True)):
        im = d.extract_image(x[0])
        open(os.path.join(out, f"p{i+1:02d}_{j}.{im['ext']}"), 'wb').write(im['image'])
