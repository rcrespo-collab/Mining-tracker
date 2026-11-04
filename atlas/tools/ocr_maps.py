"""Read text boxes on map images with RapidOCR (axis ticks, labels, legends).

usage: python3 atlas/tools/ocr_maps.py <OUT.json> <image> [<image> ...]
"""
import sys, json
from rapidocr_onnxruntime import RapidOCR
o = RapidOCR(); out = {}
for f in sys.argv[2:]:
    r, _ = o(f)
    out[f] = [[[round(c) for c in pt] for pt in b], t, round(float(c), 3)] if False else [[[[round(c) for c in pt] for pt in b], t, round(float(c), 3)] for b, t, c in (r or [])]
json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False)
