"""Extract every embedded raster from the MIREMPET keynote at native resolution (no resampling).

usage: python3 -I atlas/tools/extract_mirempet.py <MIREMPET_PDF> <OUT_DIR>/mir
Header/footer logos and banner strips are skipped. Files are named p<page>_<index>.<ext>.
"""
import sys, os, pymupdf
pdf, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
SKIP = {(1347, 139), (1345, 81), (763, 88), (3508, 40), (1341, 139), (1339, 81)}
d = pymupdf.open(pdf)
for i, p in enumerate(d):
    for j, x in enumerate(p.get_images(full=True)):
        if (x[2], x[3]) in SKIP:
            continue
        im = d.extract_image(x[0])
        open(os.path.join(out, f"p{i+1:02d}_{j}.{im['ext']}"), 'wb').write(im['image'])
