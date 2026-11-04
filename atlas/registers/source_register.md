# Source register – Angola Critical-Minerals Investor Atlas

As of 2026-11-03. Generated from `atlas/tools/content.py`; do not edit by hand.

## Sources

| ID | Source | Author | Date | Kind | Note |
|---|---|---|---|---|---|
| S1 | Angola – Overview of actual development in the mining sector | P. N. Tanganha, National Director for Mineral Resources, MIREMPET | 2026-10 | Government presentation (22 slides, PDF) | Maps carry their own production dates (slide 4: 17/05/2024; slides 6, 8, 9: 20/04/2022). Project slides relay operator information without citing reports or certificates. |
| S2 | Angola Mineral Zones and Project Portfolio – integrated desk study | Not stated (desk review of a 26-file project folder) | 2026-11-03 | Desk study (29 pp, PDF) | Self-declared limitations: no site visit, no independent sampling, no legal due diligence. Its GeoPackage and Excel workbook were not supplied with this upload. |
| S2a | PLANAGEO geological sheets, occurrence layers, explanatory notes ch. 8, field stations 2016–2019, whole-rock annexes | IGEO / PLANAGEO (via S2) | 2016–2019 field; notes undated in S2 | Official geological mapping (secondary – seen only through S2) | 75 occurrence sites; 1,274 field stations; ~40 whole-rock analyses (max Cu ≈105 ppm). |
| S2b | PLANAGEO airborne survey block UTE-4 grids | IGEO / PLANAGEO (via S2) | not stated | Airborne geophysics (secondary – seen only through S2) | Used in S2 for Z10/Z11 thorium patterns. Same programme as the national dataset on S1 slide 5. |
| S2c | Chipindo drill, trench, chip, channel, soil and alluvial-pit data (ALS laboratory) | IMA (holder); LAFECH (neighbour) | not stated in S2 | Exploration database (secondary – seen only through S2) | 66 holes ≈8,370 m; 1,458 ALS drill samples; 883 alluvial pits / 1,977 samples. |
| S2d | USGS critical-minerals compilation (PP1802), World Minerals Exploration DB, Minerals Yearbook 2018 | USGS (via S2) | 2017–2018 vintages | International compilation (country scale) | Partly dated; capacities 'assumed active 2018'; at least one implausible value (U34 60 Mct/yr). |
| S2e | Angola project folder (26 files: titles, memos, laboratory certificates for Alto Zambeze grabs) | Various holders (via S2) | various; IMA portfolio Nov 2024 | Tenure and operator documents (secondary) | Two titles expired on their face (Lombige 2022 and one other). |
| S2f | Historical mineral-occurrence catalogues of Angola | Araújo et al. | 1998, 2001 | Historical catalogue (cited in PLANAGEO notes) | Root source for many PLANAGEO and IGEO occurrence points. |
| S3 | Natural Earth admin-1 (via npm @geo-insight/data 0.3.0) and countries 1:50m (npm world-atlas 2.0.2) | Natural Earth (public domain) | v5 vintage | Base cartography | 18-province division. Angola's 2024 reform (21 provinces) is NOT reflected – see request R12. |
| S4 | Pensana plc Longonjo project page; 'EPCM and updated Ore Reserve estimate' (Apr 2025) | Pensana plc (operator) | 2025-04 / accessed 2026-11-03 | Operator public disclosure (JORC) | Ore Reserve 21.54 Mt @ 3.04% TREO, 0.65% NdPr = 139,457 t NdPr contained; product mixed rare-earth carbonate (MREC). |
| S5 | Tyranna Resources (ASX:TYX) announcements – Namibe Lithium Project (Muvero prospect), Sinomine offtake | Tyranna Resources (operator) | 2023-05 → 2026-10 / accessed 2026-11-03 | Operator public disclosure (ASX) | Only headlines and excerpts were read; assay tables and JORC Table 1 not yet retrieved. |
| S6 | Minbos Resources (ASX:MNB) Cabinda Phosphate Project page; DFS announcement | Minbos Resources (operator) | accessed 2026-11-03 | Operator public disclosure (ASX) | Cácata deposit ≈45 km NE of Cabinda City. Operator names the plant differently from S1 ('Subantando'/'Subatando'). |
| S7 | Georeferenced slide overlays, digitised domains, survey extents, symbol extraction (atlas/tools/*.py) | Atlas build (2026-11-03) | 2026-11-03 | Derived – NOT independent of S1 | Every derived layer inherits S1's survey family; positional error stated per layer. |

## Survey / observation families (do not double-count)

| Family | Name | Members | Note |
|---|---|---|---|
| F-AIR | PLANAGEO national airborne magnetics & radiometrics | S1 slide 5 (TMI, DEM, K-Th-U); S1 slide 6 (nine geophysics domains – interpretation built on it); S1 slide 7 (metallogenic map – partly built on it); S2b UTE-4 grids → S2 zones Z10, Z11; S7 domain polygons & coverage | 1,000 m line spacing, ±120 m altitude (S1 slide 5). Flight & tie-line database, contractor, year and levelling not given. |
| F-OCC | IGEO / PLANAGEO mineral-occurrence catalogue | S1 slide 2 thumbnail; S1 slide 8 (>2,500 points); S1 slide 9 (>300 critical-mineral points – a subset of slide 8); S2a occurrence layers (75 Namibe sites); S2f Araújo et al. catalogues (root); S7 digitised symbols | A Namibe copper indício plotted on slides 8 and 9 and counted in S2 zones Z1–Z7 is ONE observation, not three. |
| F-MAP | PLANAGEO geological mapping & field stations | S2a sheets D-33/M, 333, 334 and 1,274 field stations; S1 slide 7 metallogenic map 1:1,000,000 | Field stations (2016–19) are primary observations; the metallogenic provinces are interpretation. |
| F-USGS | USGS compilations | S2d deposits, projects, facilities U1–U45 | Compiled largely from published literature that overlaps F-OCC history – treat as partly dependent. |
| F-IMA | IMA Chipindo exploration (ALS laboratory) | S2c drilling, trenches, rock chips, soils, alluvial pits | Holder's own data. |
| F-LAF | LAFECH channel sampling at Chipindo | S2c LAFECH chips/channels | Different sampler from IMA – genuinely independent surface corroboration. |
| F-OPR | Operator statements relayed on S1 project slides | S1 slides 13–18 (one family per operator) | Government slides repeat operator figures; they do not corroborate them. |
| F-PUB | Operator public-market disclosures | S4 Pensana; S5 Tyranna; S6 Minbos | Same operator as F-OPR but subject to listing-rule / JORC competent-person sign-off – stronger, still not independent. |

## Material claims

Evidence types: **Measured result** · **Reported occurrence** · **Operator claim** · **Geological interpretation** · **Survey coverage**.

| ID | Claim | Source (page) | Date | Scale | Location precision | Evidence | Family | Status / flag |
|---|---|---|---|---|---|---|---|---|
| C01 | PLANAGEO airborne survey flown at 1,000 m line spacing and ±120 m altitude | S1 p.5 | 2026-10 (survey date not given) | national | n/a | Survey coverage / parameters | F-AIR | Parameters only – no flight-line database, tie-line spacing, contractor, levelling or QC report |
| C02 | PLANAGEO 'Região Leste' (CN-1…CN-9) is not concluded; Norte and Sul regions (CITIC-1…5, UTE-1…8) are concluded | S1 p.4 | map dated 17/05/2024 | ~1:10,000,000 slide | ±2 km (georeferenced, RMS 0.75 km) | Survey coverage / parameters | F-AIR | Status is 2.5 years old relative to the keynote – confirm current completion with IGEO (R02) |
| C03 | Nine airborne-geophysics 'mega-blocks', each associated with a mineral group (Copper Belt, Cassinga Au–Fe, Cunene Complex base metals–Ni–PGE, Greenstone Au, Lucapa Graben diamonds, Archean Block, Proterozoic Orogeny Cu–Ni–Au, Cassinga Extension Fe–Au, Cabinda Au) | S1 p.6 | map dated 20/04/2022 | ~1:8,000,000 slide | ±15 km (hand-digitised) | Geological interpretation | F-AIR | Interpretation derived from the same airborne data – cannot corroborate F-AIR anomalies |
| C04 | Seven metallogenic provinces on the 1:1,000,000 metallogenic map (Cu; Cunene Complex polymetallic; Fe; Nb–Ta–REE; Au; Cr–Ni–PGE; diamonds) with indício / ocorrência / jazigo categories | S1 p.7 | not dated on slide | 1:1,000,000 (shown at slide scale) | not georeferenced in this atlas (grid illegible at slide resolution) | Geological interpretation | F-MAP | Request the vector map (R03) |
| C05 | More than 2,500 observed mineral-occurrence points nationally | S1 p.8 | map dated 20/04/2022 | ~1:9,000,000 slide | symbols ±5 km | Reported occurrence | F-OCC | Count not verifiable from a slide; request the register (R01) |
| C06 | More than 300 observed critical-mineral occurrence points | S1 p.9 | map dated 20/04/2022 | ~1:7,000,000 slide | symbols ±6 km | Reported occurrence | F-OCC | Atlas digitised 190 coloured symbols (grey Mo–Cu and graphite classes not extracted) – consistent in order of magnitude |
| C07 | IGEO geoscience laboratory accredited ISO/IEC 17025:2017 by CNAS (No. L15776); methods incl. ICP-MS, GFAAS, AES, IC, XRF, XRD, EPMA; labs in Luanda (18 methods), Huíla (10) and Saurimo (10, caustic fusion for microdiamonds) | S1 p.11 | 2026-10 | n/a | town level | Operator claim | F-OPR | Check accreditation scope and validity on the CNAS register (V07). Note: CNAS proficiency list includes Mn, Co, Bi, U in soil by ICP-MS but no Li, Nb, REE or fusion methods |
| C10 | Lulo (Lucapa Diamonds): prospecting, resource evaluation, kimberlite; production 2027; 671 jobs | S1 p.13 | 2026-10 | province | province (Lunda Norte) | Operator claim | F-OPR | Diamonds – outside critical-mineral scope |
| C11 | Chiri (Rio Tinto): prospecting, kimberlite; core drilling phases 1–3 on a regular grid and bulk-sampling trenches (phases 3–4); 'start production 2025' | S1 p.13 | 2026-10 | drill plan inset | province (Lunda Sul) | Operator claim | F-OPR | Start date 2025 is inconsistent with 'prospecting' phase |
| C12 | Kassinga (Tosyali): iron ore, US$150 M initial, ~1.7 Mt/yr concentrate, production 2025 | S1 p.14 | 2026-10 | province | province (Huíla) | Operator claim | F-OPR | No resource cited |
| C13 | Kassala-Kitungo (Capital Mining): iron ore, US$27 M initial, ~6 Mt/yr concentrate, production 2026 | S1 p.14 | 2026-10 | province | province (Cuanza Norte) | Operator claim | F-OPR | Capital intensity (US$4.5 per annual tonne) is an order of magnitude below industry norms – treat as unverified |
| C14 | Mavoio-Tetelo copper (Shining Star Icarus): ≥US$200 M, '4,000 t of copper concentrate per day', cathode ≥99.99%, US$683 M/yr gross revenue, production 2025; exploration 'initiated October 2025' | S1 p.15 | 2026-10 | province | province (Uíge) | Operator claim | F-OPR | Internal inconsistencies: deposit type given as 'iron-ore'; production (2025) before exploration start (Oct 2025); 4,000 t/day is almost certainly ore throughput, not concentrate |
| C15 | Core photographs labelled hematite–chalcocite (native copper) at Mavoio-Tetelo | S1 p.15 | 2026-10 | photo | none (no hole ID, depth or coordinates) | Reported occurrence | F-OPR | Visual only – no assay |
| C16 | Cácata phosphate (Minbos): mining & stockpiling, 50 kt/yr rising to 300 kt/yr, US$4.7 M, production Q3 2026 | S1 p.16 | 2026-10 | location inset | ≈5 km (Mina Cácata on inset; operator: 45 km NE of Cabinda City) | Operator claim | F-OPR | Operator has a DFS on ASX (S6) – request resource & DFS (R08) |
| C17 | Subatando phosphate fertilizer factory: US$40 M, '~187,000 million tons/year', 250 construction jobs | S1 p.16 | 2026-10 | location inset | ≈5 km | Operator claim | F-OPR | '187,000 million t/yr' is a unit error (likely 187,000 t/yr) |
| C18 | NioBonga integrated Nb–Fe–P2O5 project at Bonga carbonatite: pilot mining, 1.65 Mt/yr, production 2026; recovers phosphorus and 'aluminium powder' | S1 p.17 | 2026-10 | oblique image with concession outline | ≈3 km (Bonga hill) | Operator claim | F-OPR | Conflicts with S2, which treats Bonga as an untested 'target'. No Nb2O5 grade or resource stated anywhere |
| C19 | Longonjo (Ozango Minerals): exploration phase, US$90 M, production 2027, '~120 thousand tons per year of Nd and Pr oxides' plus Dy and Tb; US$250 M/yr revenue; mining licence 21 km² with carbonatite, open pit, plant, TSF, solar plant on Benguela railway | S1 p.17 | 2026-10 | site plan | ≈2 km (site plan) | Operator claim | F-OPR | CONTRADICTED by operator's own JORC disclosure (S4): whole Ore Reserve contains 139,457 t NdPr. 120 kt/yr is impossible; revenue figure also inconsistent with that tonnage |
| C20 | Namibe lithium (AngoLítio / Tyranna): pegmatite spodumene; prospecting title No. 023/05/03/T.P/ANG-MIREMPET 2023; grab assays NR065 4.24%, NR069 4.24%, NR056 0.08%, NR068 0.81%, NR060 1.13%, NR063 2.73% Li2O (May 2023) | S1 p.18 | assays May 2023 | ~1:150,000 inset (UTM 33S grid) | ±0.5 km (sample symbols on UTM grid) | Measured result | F-OPR | Values shown on an operator map, no certificates, lab, method or QC. Two samples report an identical 4.24% – check for transcription |
| C21 | Trench sample NR016 7.76% Li2O on a spodumene ('spd') zone | S1 p.18 | not stated | photo | none | Measured result | F-OPR | 7.76% Li2O is close to pure spodumene (~8.0%) – a selective mineral sample, not a grade |
| C22 | Diamond-drill core NDDH-004 box 9 logged with spodumene at ~29–31 m | S1 p.18 | not stated | photo | none | Reported occurrence | F-OPR | Visual logging only – assays not shown |
| C23 | Saurimo diamond cluster: 650,000 ct/yr installed; 'actual realized production 448 carats (69%)' | S1 p.19 | 2026-10 | town | town | Operator claim | F-OPR | 448 ct ≠ 69% of 650,000 ct (448,000 ct would be 69%) – unit error |
| C24 | Namibe dimension-stone cluster: ~US$104.9 M, completion 2026, ~32 km from Moçâmedes with road, rail and port connections | S1 p.20 | 2026-10 | schematic map | ≈5 km | Operator claim | F-OPR | Infrastructure, not a deposit claim |
| C30 | Chipindo: 66 holes (~8,370 m); of 1,458 ALS samples 104 ≥0.5 g/t and 50 ≥1 g/t Au; best 7.33 g/t (TC_012, 94–95 m), 7.22 g/t (CS009), 6.64 g/t (TC_019) | S2 p.27 | not stated | prospect (UTM 33S) | collar coordinates in database | Measured result | F-IMA | Strongest dataset in the portfolio; QA/QC (CRMs, blanks, duplicates) not reported |
| C31 | Chipindo trench TR-009: 37.5, 11.9, 10.7 and 5.8 g/t Au over its first 4 m (≈16 g/t over 4 m) | S2 p.27 | not stated | trench | database | Measured result | F-IMA | Surface; may include supergene enrichment / nugget effect |
| C32 | LAFECH channels reach 19.5 g/t (Tchambassuco) and 15.8 g/t (Chiriva) | S2 p.27 | not stated | channel | database | Measured result | F-LAF | Independent sampler – corroborates surface gold |
| C33 | Chipindo alluvial pits: 883 pits / 1,977 samples ≈94 g Au, up to 7.3 g/t, along Tchiquele–Cassanda corridor | S2 p.27 | not stated | pits | database | Measured result | F-IMA | Total recovered gold is small – alluvials indicate source, not a resource |
| C34 | Chipindo concession memo reports ≈20% monazite–xenotime in alluvial heavy-mineral concentrates | S2 p.5 | not stated | concentrates | unspecified | Operator claim | F-IMA | Not in the database; needs mineralogy (XRD/SEM) and fusion REE assays |
| C35 | Chipindo associated minerals: pyrite (297 intervals), chalcopyrite (276), arsenopyrite (16), sphalerite (7), visible gold (5); As to 6,950 ppm; Cu max 450 ppm | S2 p.27 | not stated | drill logs | database | Measured result | F-IMA | Base metals sub-economic |
| C36 | Cambuta oval magnetic intrusion with Cu–As anomalies → possible porphyry/skarn Cu–Au target | S2 p.5 | — | prospect | unspecified | Geological interpretation | F-IMA | Hypothesis only |
| C37 | Lombige: Mn layer averaging ≈49% Mn, 0.7 m thick; historic alluvial gold production 3.3 kg (1943–44); title expired on its face in 2022 | S2 p.1 | historic / 2022 | prospect | title coordinates (WGS84) | Measured result | F-OPR | Tenure blocker |
| C38 | Alto Zambeze (Mexico/Moxico): six grab samples 25–26% Cu, Ag, Au in two; laboratory certificates state the sample source was not verified | S2 p.1 | not stated | grab | title coordinates | Measured result | F-OPR | Measured value, unverified provenance |
| C39 | Namibe coast: 75 recorded mineral sites incl. 35 copper (3 ocorrências, 32 indícios), 21 marble quarries, 5 gypsum, 3 Mn; nine zones Z1–Z9 drawn 2.5 km around occurrences | S2 p.15 | 2016–2019 field | 1:250,000 | ±250 m (occurrence layer) – zones ±2.5 km by construction | Reported occurrence | F-OCC | Same catalogue family as S1 slides 8–9 |
| C40 | ~40 whole-rock analyses on sheet D-33/M are all background (highest Cu ≈105 ppm); Nb 3–88 ppm | S2 p.16 | 2016–2019 | sheet | station | Measured result | F-MAP | Negative evidence for bulk copper near the stations sampled |
| C41 | Bonga (USGS AOd013): Nb–Ta carbonatite deposit at 13.97E 14.27S; UTE-4 strong Th–U radiometric high over ≈39 km² | S2 p.26 | USGS vintage | country / 1:250k grid | ±1 km | Reported occurrence | F-USGS | Radiometric high belongs to F-AIR; USGS record partly literature-derived |
| C42 | East of Lubango (Z11): ≈201 km² high-Th / low-K radiometric response – alkaline rocks or laterite | S2 p.26 | — | UTE-4 grid | ±1 km | Geological interpretation | F-AIR | Untested |
| C43 | Xistextil alluvial gold 'feasibility study': ≈555 oz/yr cannot cover stated US$671k monthly operating cost | S2 p.1 | — | project | title coordinates | Operator claim | F-OPR | Fails own arithmetic |
| C44 | No project in the S2 portfolio has a JORC or NI 43-101 resource | S2 p.3 | 2026-11-03 | — | — | Geological interpretation | — | True for S2's ten projects; NOT true for Longonjo (S4 JORC Ore Reserve) or Cácata (S6 DFS) which S2 did not review |
| C45 | IMA-listed titles without technical data: copper 078/12/01/T.P (Huambo, 2,504.8 km², to 21 Dec 2027), copper 080/12/03/T.P (Benguela/Huíla, 831.2 km², to 21 Dec 2027), Telhabel lithium 025/05/05/T.P (Virei, 72.6 km², to 24 May 2028), silica-sand and granite titles | S2 p.9 | IMA portfolio Nov 2024 | municipality | municipality level only | Operator claim | F-OPR | Validity per copies; confirm on cadastre (R05) |
| C50 | Longonjo JORC Ore Reserve 21.54 Mt @ 3.04% TREO incl. 0.65% NdPr (139,457 t NdPr); product mixed rare-earth carbonate | S4 | 2025-04 (accessed 2026-11-03) | deposit | licence | Measured result | F-PUB | Competent-person-signed estimate; independent audit not seen |
| C51 | Tyranna reports the Namibe Lithium Project (Muvero prospect) with new pegmatite discoveries and a binding Sinomine offtake | S5 | 2023-05 → 2026 | project | project | Operator claim | F-PUB | Headlines only read – retrieve assay tables and any resource |
| C52 | Minbos Cácata phosphate deposit ~45 km NE of Cabinda City; DFS published; construction contract signed | S6 | accessed 2026-11-03 | project | ≈5 km | Operator claim | F-PUB | Retrieve resource statement and DFS |

## Figures used

| Figure | Source (page) | Evidence | Caption |
|---|---|---|---|
| `img/fig_s1_p02.jpg` | S1 p.2 | Reported occurrence | National occurrence/infrastructure thumbnail with legend (occurrences, airports, rivers, parks) – same family as slide 8 |
| `img/fig_s1_p04.jpg` | S1 p.4 | Survey coverage / parameters | PLANAGEO operator division: Região Norte e Sul (concluded) and Região Leste (pending); inset regional map; UTM 33S, WGS84, 17/05/2024 |
| `img/fig_s1_p05_mag.jpg` | S1 p.5 | Survey coverage / parameters | Airborne total magnetic intensity (national compilation) |
| `img/fig_s1_p05_dem.jpg` | S1 p.5 | Survey coverage / parameters | Digital elevation model from the airborne programme |
| `img/fig_s1_p05_rad.jpg` | S1 p.5 | Survey coverage / parameters | Radiometric ternary image K–Th–U; line spacing 1,000 m, altitude ±120 m |
| `img/fig_s1_p06.jpg` | S1 p.6 | Geological interpretation | Nine airborne-geophysics domains with legend (IGEO, 20/04/2022) |
| `img/fig_s1_p07.jpg` | S1 p.7 | Geological interpretation | Metallogenic map of Angola 1:1,000,000 – seven provinces |
| `img/fig_s1_p07_inset1.jpg` | S1 p.7 | Geological interpretation | Metallogenic map – location inset |
| `img/fig_s1_p07_inset2.jpg` | S1 p.7 | Geological interpretation | Metallogenic map – legend panel (mineral resources) |
| `img/fig_s1_p07_legend_morph.png` | S1 p.7 | Geological interpretation | Legend: morphology × category (indício / ocorrência / jazigo) |
| `img/fig_s1_p07_legend_elem.png` | S1 p.7 | Geological interpretation | Legend: element and resource abbreviations |
| `img/fig_s1_p08.jpg` | S1 p.8 | Reported occurrence | All mineral occurrences (>2,500 points) with legend |
| `img/fig_s1_p09.jpg` | S1 p.9 | Reported occurrence | Critical-mineral occurrences (>300 points) with legend |
| `img/fig_s1_p11_labs.png` | S1 p.11 | Operator claim | IGEO laboratories – Luanda, Huíla, Saurimo |
| `img/fig_s1_p13_chiri_drill.jpg` | S1 p.13 | Operator claim | Chiri core-drilling plan, phases 1–3 (Rio Tinto) |
| `img/fig_s1_p13_chiri_bulk.jpg` | S1 p.13 | Operator claim | Chiri bulk-sampling trench locations, phases 3–4 |
| `img/fig_s1_p15_core.jpg` | S1 p.15 | Reported occurrence | Mavoio-Tetelo core: hematite–chalcocite (native copper) |
| `img/fig_s1_p15_site.jpg` | S1 p.15 | Operator claim | Mavoio-Tetelo site construction |
| `img/fig_s1_p16_cacata.jpg` | S1 p.16 | Operator claim | Cácata mine – Subantando plant – Cabinda port location |
| `img/fig_s1_p17_bonga.jpg` | S1 p.17 | Operator claim | Bonga concession and Tchivira (NioBonga) |
| `img/fig_s1_p17_longonjo.jpg` | S1 p.17 | Operator claim | Longonjo site plan: 21 km² mining licence, carbonatite, open pit, plant, TSF, solar, Benguela railway |
| `img/fig_s1_p18_li_map.jpg` | S1 p.18 | Measured result | Namibe lithium title 023/05/03/T.P – grab assays (% Li2O), May 2023, UTM 33S |
| `img/fig_s1_p18_core.jpg` | S1 p.18 | Reported occurrence | Core NDDH-004 box 9 – spodumene (spd) at 29–31 m |
| `img/fig_s1_p18_trench.jpg` | S1 p.18 | Measured result | Trench NR016 – 7.76% Li2O on spodumene |
| `img/fig_s1_p18_outcrop.jpg` | S1 p.18 | Reported occurrence | Spodumene outcrop |
| `img/fig_s1_p20_namibe.jpg` | S1 p.20 | Operator claim | Namibe dimension-stone cluster – road, rail and port connections |
| `img/fig_s2_p26.jpg` | S2 p.26 | Survey coverage / parameters | S2: Bonga (Z10) and East of Lubango (Z11) on UTE-4 thorium |
| `img/fig_s2_p27.jpg` | S2 p.27 | Measured result | S2: Chipindo best gold value per site (drill, trench, chip, alluvial) |
| `img/fig_s2_p17.jpg` | S2 p.17 | Reported occurrence | S2: Z4 Calumbumbolo–Bacati–Calussula–Cacoma |
| `img/fig_s2_p18.jpg` | S2 p.18 | Reported occurrence | S2: Z1 Chapéu Armado–Pói–Lucumbo |
| `img/fig_s2_p22.jpg` | S2 p.22 | Reported occurrence | S2: Z9 coastal strip |
| `img/fig_s2_p23.jpg` | S2 p.23 | Reported occurrence | S2: Z5 Macahama–Damba do Sal–Chipate with P6 application |
