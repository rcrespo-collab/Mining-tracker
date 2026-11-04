# Angola Critical-Minerals Atlas (investor edition)

Interactive atlas for an investment committee deciding which Angolan areas deserve a **data request**, a **field visit** or a **first exploration budget**. It has two paths – *evaluate existing projects* and *originate greenfield targets* – and keeps geological potential, evidence confidence and commercial accessibility on separate axes.

Open `atlas/index.html` in any browser (no server, no build step). It is deliberately **outside** the Astro site (`src/`, `public/`), so it is not deployed with nyawiraconsulting.com.

## What is in it

| Path | Content |
|---|---|
| `index.html` | The atlas (data inlined; images in `img/`). Views: Atlas · Side-by-side · Source register · Data requests · Verification · Figures |
| `registers/source_register.md` / `.csv` | Every material claim → source, page, date, scale, location precision, evidence type, survey family, flag |
| `registers/data_requests.md` / `.csv` | Prioritised primary-data requests: what, from whom, format, decision unlocked |
| `registers/verification_plan.md` | Spatial QA log (completed) and conclusion-level tests (completed vs still required) |
| `data/*.geojson` | EPSG:4326 layers – open directly in QGIS |
| `data/qa_spatial.json` | Machine-readable log of every spatial check executed |
| `data/vec_*.geojson` | Every source map rebuilt as vector features (see *Interactive layers* below) |
| `data/grid_*.json` | Value grids inverted from the airborne images (magnetic index, elevation in m, K/Th/U shares, UTE-4 thorium index) |
| `data/insets.json` | Longonjo site plan in local km (no coordinates on the source) |
| `img/fig_*` | The original figures, kept as audit thumbnails beside each interactive layer; photographs stay as images |
| `tools/` | Reproducible build scripts |

## Evidence vocabulary

* **Measured result** – a laboratory or instrument value (assay, intercept, grid).
* **Reported occurrence** – catalogued or observed presence, no grade or size.
* **Operator claim** – a holder's statement, including when a government slide relays it.
* **Geological interpretation** – domains, provinces, "probable" ratings, deposit hypotheses.
* **Survey coverage** – extent/parameters of a survey, not a result.

Items from the same **survey family** (e.g. the PLANAGEO airborne survey and the domains interpreted from it; MIREMPET slides 8 and 9 and the Portfolio's PLANAGEO occurrence layer) are never counted as corroborating each other. Families are listed in the source register.

Commodities carry a class: **E** element, **M** mineral species, **G** commodity group, **P** proposed product.

## Interactive layers (no map is shown as a picture)

| Source map | Rebuilt as | How | Check against the source |
|---|---|---|---|
| MIREMPET slide 4 – PLANAGEO division | Região Leste / Norte-Sul polygons, block labels | colour segmentation + GDAL polygonize | 36 GCPs, RMS 0.75 km |
| Slide 5 – magnetics, DEM, K–Th–U | value grids, 0.04° | colour-to-value inversion (DEM from its legend ramp, hillshade removed by chromaticity) | DEM reads Namibe 43 m, Saurimo 1,063 m, Malanje 1,134 m, Menongue 1,363 m |
| Slide 6 – geophysics domains | 9 polygons | hand digitised | ±15 km |
| Slides 8 and 9 – occurrences | 396 + 190 symbols by class | legend colour + symbol shape | counts vs ">2,500" / ">300" stated |
| Slide 11, 16, 19, 20 – labs, Cácata, clusters | named points | read from insets | ±2–20 km stated per point |
| Slide 17 – Longonjo site plan | 12 features in local km | vertices from the 0–2 km scale bar | licence 21.6 km² vs 21 km² printed |
| Slide 18 – Namibe lithium | title polygon + 6 assay points with Li₂O | UTM grid, 13 vertices | title ≈211 km² |
| Portfolio Map 1 | USGS sites by mineral, IMA titles, project areas | OCR ticks, legend colours | RMS 0.1–0.2 km |
| Portfolio zone maps Z1–Z9 | zone outlines, 1:250k geology units, 54 named occurrences, 25 field stations | OCR ticks, legend colours, convex hull of zone line | zone areas within 3% of stated (Z7 clipped at sheet edge) |
| Portfolio p.26 – UTE-4 thorium | value grid, 0.005° | colour inversion | — |
| Portfolio p.27 – Chipindo | 208 best-value sites by grade class and sample type, 17 pit clusters | UTM ticks, colour + shape | — |

Not vectorised: slide 7 metallogenic map (grid illegible, province colours collide with geology – request R03); slide 13 Chiri drill plan (161×208 px – request R14). Every map supports hover details, class filters, a click point-query (all layers at that spot) and side-by-side comparison with a same-survey warning.

## Rebuild

```bash
pip install rasterio shapely pyproj pymupdf scipy pillow pyogrio   # GDAL 3.12 ships inside the rasterio wheel
SRC=/path/to/workdir
python3 -I atlas/tools/extract_mirempet.py 4-1_KeyNote_MIREMPET.pdf $SRC/mir
# base cartography (npm tarballs, data only – no code executed):
#   world-atlas 2.0.2 → $SRC/dl/wa/package/countries-50m.json
#   @geo-insight/data 0.3.0 → $SRC/dl/gi/package/dist/assets/adm1/024.json (Natural Earth admin-1, Angola)
python3 -I atlas/tools/extract_s2.py Angola_Mineral_Zones_and_Project_Portfolio.pdf $SRC/s2
pip install rapidocr-onnxruntime   # OCR for axis ticks and labels
python3 atlas/tools/ocr_maps.py $SRC/ocr_s2.json $SRC/s2/p*.png
python3 atlas/tools/ocr_maps.py $SRC/ocr_mir.json $SRC/mir/p18_8.jpeg $SRC/mir/p05_5.jpeg $SRC/mir/p08_4.jpeg
python3 atlas/tools/build_spatial.py $SRC
VEC_DEBUG=/tmp/dbg python3 atlas/tools/vectorise.py $SRC   # VEC_DEBUG draws each extraction back on its source image
python3 atlas/tools/build_content.py $SRC Angola_Mineral_Zones_and_Project_Portfolio.pdf
python3 atlas/tools/build_html.py
```

Authored content (claims, candidates, requests, tests) lives in `tools/content.py`; the registers and `index.html` are generated from it.

## Spatial methods and their limits

* Map ticks of the Portfolio figures were read with OCR and fitted per axis with outlier rejection; residuals are logged in `data/qa_vectorise.json`.
* Slides 4, 6, 8 and 9 were georeferenced with least-squares affine fits to 20–36 frame-tick GCPs (RMS 0.35–0.75 km; pixel size 1.7–2.6 km). Slide-5 geophysics images have no legible ticks and were fitted by bounding box (±10 km). Slide 7 (metallogenic map) was not georeferenced.
* The PLANAGEO Região Leste extent was extracted by colour segmentation and GDAL polygonize; the nine geophysics domains were hand-digitised (±15 km); Domain 9 is taken as the Cabinda enclave.
* Critical-mineral symbols on slide 9 were extracted by legend-colour matching (190 symbols; grey Mo–Cu and graphite classes not extracted). These are screening positions only.
* QGIS was not available in the build environment. All checks ran in GDAL/rasterio, shapely and pyproj; the GeoJSON layers are ready for an independent QGIS re-check.
* No line data, drill collars or certificates were available, so no geophysical re-processing and no 3-D model was produced. Chipindo (66 holes) is the only area where a 3-D model becomes justified, once collar and down-hole surveys are received (request R04, test V09).
* Province search uses the 18-province Natural Earth division; Angola's 2024 reform (21 provinces) is not reflected (request R12).
