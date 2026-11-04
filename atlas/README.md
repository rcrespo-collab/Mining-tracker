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
| `img/geo_*.png` | MIREMPET slide maps warped to EPSG:4326 (bounds in `data/overlays.json`) |
| `img/fig_*` | Every evidence-bearing map, inset, legend, project plan and assay figure from the MIREMPET keynote, plus cited Portfolio maps |
| `tools/` | Reproducible build scripts |

## Evidence vocabulary

* **Measured result** – a laboratory or instrument value (assay, intercept, grid).
* **Reported occurrence** – catalogued or observed presence, no grade or size.
* **Operator claim** – a holder's statement, including when a government slide relays it.
* **Geological interpretation** – domains, provinces, "probable" ratings, deposit hypotheses.
* **Survey coverage** – extent/parameters of a survey, not a result.

Items from the same **survey family** (e.g. the PLANAGEO airborne survey and the domains interpreted from it; MIREMPET slides 8 and 9 and the Portfolio's PLANAGEO occurrence layer) are never counted as corroborating each other. Families are listed in the source register.

Commodities carry a class: **E** element, **M** mineral species, **G** commodity group, **P** proposed product.

## Rebuild

```bash
pip install rasterio shapely pyproj pymupdf scipy pillow pyogrio   # GDAL 3.12 ships inside the rasterio wheel
SRC=/path/to/workdir
python3 -I atlas/tools/extract_mirempet.py 4-1_KeyNote_MIREMPET.pdf $SRC/mir
# base cartography (npm tarballs, data only – no code executed):
#   world-atlas 2.0.2 → $SRC/dl/wa/package/countries-50m.json
#   @geo-insight/data 0.3.0 → $SRC/dl/gi/package/dist/assets/adm1/024.json (Natural Earth admin-1, Angola)
python3 atlas/tools/build_spatial.py $SRC
python3 atlas/tools/build_content.py $SRC Angola_Mineral_Zones_and_Project_Portfolio.pdf
python3 atlas/tools/build_html.py
python3 atlas/tools/check_overlays.py /tmp/out   # visual QA: outlines drawn on each warped slide
```

Authored content (claims, candidates, requests, tests) lives in `tools/content.py`; the registers and `index.html` are generated from it.

## Spatial methods and their limits

* Slides 4, 6, 8 and 9 were georeferenced with least-squares affine fits to 20–36 frame-tick GCPs (RMS 0.35–0.75 km; pixel size 1.7–2.6 km). Slide-5 geophysics images have no legible ticks and were fitted by bounding box (±10 km). Slide 7 (metallogenic map) was not georeferenced.
* The PLANAGEO Região Leste extent was extracted by colour segmentation and GDAL polygonize; the nine geophysics domains were hand-digitised (±15 km); Domain 9 is taken as the Cabinda enclave.
* Critical-mineral symbols on slide 9 were extracted by legend-colour matching (190 symbols; grey Mo–Cu and graphite classes not extracted). These are screening positions only.
* QGIS was not available in the build environment. All checks ran in GDAL/rasterio, shapely and pyproj; the GeoJSON layers are ready for an independent QGIS re-check.
* No line data, drill collars or certificates were available, so no geophysical re-processing and no 3-D model was produced. Chipindo (66 holes) is the only area where a 3-D model becomes justified, once collar and down-hole surveys are received (request R04, test V09).
* Province search uses the 18-province Natural Earth division; Angola's 2024 reform (21 provinces) is not reflected (request R12).
