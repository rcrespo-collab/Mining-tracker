# Verification plan – checks completed vs required

As of 2026-11-03.

## Completed in this build (spatial QA log)

| Check | Method | Result |
|---|---|---|
| National outline includes Cabinda exclave | Count polygons in Natural Earth admin-1 union; test that Cabinda town (12.20E, 5.55S) falls inside | 3 polygon parts; Cabinda inside=True; area 1,244,411 km2 |
| Georeference MIREMPET slide 4 (PLANAGEO division map) | 36 GCPs from UTM 33S (EPSG:32733) frame ticks, least-squares affine (GDAL/rasterio) | RMS 0.75 km, max 1.34 km; pixel size 1.95 km. Positional uncertainty dominated by slide resolution (~2 km/px) and tick reading (+/-1 px). |
| Extract PLANAGEO 'Região Leste (por concluir)' extent | Colour threshold of legend green on slide 4, morphological closing, vectorised with GDAL polygonize (rasterio.features.shapes), clipped to Natural Earth outline | Leste (pending) = 450,112 km2 (36% of Angola); Norte+Sul (concluded) = 794,299 km2 |
| Georeference MIREMPET slide 6 (airborne geophysics domains) | 20 GCPs from WGS84 graticule ticks, affine | RMS 0.35 km, max 0.53 km |
| Digitise the nine airborne-geophysics domains | Vertices read on gridded enlargements of slide 6, transformed with the slide-6 affine, clipped to Angola | 9 polygons; together 941,273 km2 = 76% of Angola (domains are not a full partition – NW, coastal basins and SE Kalahari cover are unassigned) |
| Georeference MIREMPET slides 8 and 9 (occurrence maps) | 25 and 20 graticule GCPs, affine | slide 8 RMS 0.72 km (pixel 2.6 km); slide 9 RMS 0.50 km (pixel 1.7 km) |
| Digitise coloured critical-mineral symbols on slide 9 and test the '>300 points' statement | Per-class colour distance to legend swatch, opening, connected components (GDAL-rasterised land mask), centroid; merged clusters counted by area/110 px. Grey classes (Mo+Cu, graphite) not extracted – indistinguishable from roads/text. | 190 coloured symbols recovered (Ag:6, Al:5, AuAg:48, CuCoAuPbZn:108, NiCoCuCr:8, PbCuZn:9, V:1, Zn:5). Consistent in order of magnitude with '>300'; exact count needs the IGEO occurrence table. |
| Coverage of Total magnetic intensity (MIREMPET slide 5) | Non-background pixel mask, bounding-box fit to Angola extremes in UTM 33S, polygonised and differenced against Natural Earth outline | pixel 2.5 x 2.5 km (anisotropy 1.1%); 0 uncovered patch(es) >1,500 km2 totalling 0 km2 |
| Coverage of Digital elevation model (MIREMPET slide 5) | Non-background pixel mask, bounding-box fit to Angola extremes in UTM 33S, polygonised and differenced against Natural Earth outline | pixel 2.7 x 2.6 km (anisotropy 2.9%); 3 uncovered patch(es) >1,500 km2 totalling 38,233 km2 centred near 19.2E 8.4S, 23.5E 11.2S, 23.6E 12.9S |
| Coverage of Radiometric ternary K–Th–U (MIREMPET slide 5) | Non-background pixel mask, bounding-box fit to Angola extremes in UTM 33S, polygonised and differenced against Natural Earth outline | pixel 2.8 x 2.7 km (anisotropy 3.2%); 3 uncovered patch(es) >1,500 km2 totalling 30,889 km2 centred near 19.1E 8.3S, 21.2E 17.8S, 16.3E 17.4S |
| Survey-coverage gaps common to the DEM and radiometric products | Intersection of the no-data patches of the two independently masked slide-5 images (single-image edge artefacts discarded) | 1 consistent gap(s): 27,202 km2 centred 19.2E 8.3S. The magnetic image shows data there, so the magnetic grid may merge a different survey – confirm with flight-line database. |
| Spatial join of every candidate | Point-in-polygon against Natural Earth provinces, digitised domains, PLANAGEO regions, airborne gap; straight-line distance (Africa Albers) to approximate rail polylines and ports; digitised slide-9 symbols within 25 km | 19 candidates joined; access distances are proxies, not route lengths |
| Stated vs computed province for each candidate | Compare authored province text with point-in-polygon result | all consistent |
| Do the digitised Ni+Co+Cu+Cr occurrences fall in the 'Cunene Complex' domain (D3)? | Point-in-polygon, 0.05° tolerance | 6 of 7 digitised Ni-Co-Cu-Cr symbol clusters inside D3 – supports G01 as a two-family coincidence (F-OCC on F-AIR) |
| Occurrence support inside the 'Copper Belt' domain (D1) | Count digitised slide-9 symbols inside D1 | 8 symbol clusters, all within ~1.5° of the northern (Cazombo) edge or the Namibia border; none in the Kalahari-covered core – the core is interpretation only (G03 deferred) |
| How much of D1 lies in the unfinished PLANAGEO Leste region | Area intersection (Africa Albers) | 51% of Domain 1 |
| Spatial join of every candidate | Point-in-polygon against Natural Earth provinces, digitised domains, PLANAGEO regions, airborne gap; straight-line distance (Africa Albers) to approximate rail polylines and ports; digitised slide-9 symbols within 25 km | 19 candidates joined; access distances are proxies, not route lengths |
| Stated vs computed province for each candidate | Compare authored province text with point-in-polygon result | all consistent |
| Do the digitised Ni+Co+Cu+Cr occurrences fall in the 'Cunene Complex' domain (D3)? | Point-in-polygon, 0.05° tolerance | 6 of 7 digitised Ni-Co-Cu-Cr symbol clusters inside D3 – supports G01 as a two-family coincidence (F-OCC on F-AIR) |
| Occurrence support inside the 'Copper Belt' domain (D1) | Count digitised slide-9 symbols inside D1 | 8 symbol clusters, all within ~1.5° of the northern (Cazombo) edge or the Namibia border; none in the Kalahari-covered core – the core is interpretation only (G03 deferred) |
| How much of D1 lies in the unfinished PLANAGEO Leste region | Area intersection (Africa Albers) | 51% of Domain 1 |

## Conclusion-level tests

| # | Conclusion | Independent test | Who | Status | Result |
|---|---|---|---|---|---|
| V01 | Slide maps are positioned correctly on Angola (overlays usable for comparison) | Least-squares affine from frame ticks; RMS residual; visual overlay against Natural Earth outline | This build | **completed** | RMS 0.35–0.75 km on slides 4, 6, 8, 9 (pixel 1.7–2.6 km). Slide-5 images fitted by bounding box (±10 km). Slide 7 not georeferenced. |
| V02 | PLANAGEO Região Leste (pending) covers about a third of Angola | Colour segmentation of slide 4 + polygonize + clip; independent team: compare with IGEO block shapefile (R02) | This build → IGEO data | **completed** | ≈36% of Angola (450,000 km²) – withheld check: IGEO block polygons |
| V03 | Displayed DEM and radiometric products lack a ≈27,000 km² block near 19.2E 8.3S that the magnetic image covers | Intersect no-data masks of two images; withheld control: flight-line database extent | This build → independent geophysicist | **completed** | 1 consistent gap; must be confirmed on line data (could be a display/merge artefact) |
| V04 | '>300 critical-mineral points' is plausible | Digitised 190 coloured symbols; full test needs the register (R01) | This build → IGEO register | **completed** | 190 coloured + grey classes not extracted |
| V05 | Longonjo production claim on S1 is overstated | Compare S1 slide 17 with operator JORC Ore Reserve (S4) | This build (public sources) | **completed** | Reserve holds 139,457 t NdPr in total vs 120,000 t/yr claimed – impossible |
| V06 | Unit/arithmetic errors on S1 (Saurimo 448 ct = 69%; Subatando '187,000 million t'; Mavoio dates and deposit type; Kitungo capex) | Internal arithmetic | This build | **completed** | Four inconsistencies flagged on claims C13, C14, C17, C23 |
| V07 | IGEO laboratory is accredited for the methods investors need | Check CNAS register entry L15776 scope & expiry; require fusion ICP-MS for Nb/REE/Li | Independent QA consultant | **required** |  |
| V08 | Chipindo gold grades are real and reproducible | Umpire re-assay of 5% of pulps (stratified by grade) at a second ISO 17025 lab; insert blind CRMs; re-log core; check collars by DGPS | Independent QP / umpire lab | **required** |  |
| V09 | Chipindo mineralisation has continuity | Cross-sections and 3-D wireframes ONLY after V08 – 66 holes with surveyed collars justify a 3-D model; until surveys are received no 3-D model is built | Independent QP | **required** |  |
| V10 | Bonga carbonatite carries economic Nb (and REE) | Rock/soil sampling by lithium-borate fusion ICP-MS with CRMs (OREAS carbonatite standards), duplicates; mineralogy by XRD/SEM | Independent field team | **required** |  |
| V11 | Namibe lithium grades are reproducible | Resample 10 outcrops + quarter-core 3 intervals; Li by sodium-peroxide fusion ICP-OES; mineralogy by XRD | Independent field team | **required** |  |
| V12 | Alto Zambeze copper grabs come from the site | Chain-of-custody resampling with GPS photos at reported sites; stream sediments | Independent field team | **required** |  |
| V13 | Titles are valid and held by the stated parties | Certified cadastral extracts (R05) | Angolan counsel | **required** |  |
| V14 | Greenfield targets are not artefacts of interpretation | Withheld-control test: hide 20% of occurrence-register points, rebuild domain/prospectivity ranking from geophysics only, and check that withheld points fall in high-ranked cells more than chance (ROC / success-rate curve) | Independent data scientist with R01 + R02 | **required** |  |
| V15 | Metallurgy supports the proposed products (MREC, spodumene concentrate, Cu cathode, Nb product) | Bench-scale tests on representative composites | Accredited metallurgical lab | **required** |  |
| V16 | Digitised domain outlines match the source | Second operator re-digitises slide 6 blind; compare areas (tolerance ±10%) | Independent GIS analyst | **required** |  |
