# Sources, assumptions and limits

This is an educational rendering experiment. Smooth reveals interpolate between selected dated anchors; they are not measured settlement boundaries, density surfaces or maps of everything people knew.

| Layer | Input | Interpretation |
| --- | --- | --- |
| Site markers | Curated records in `data/migration.js` | Selected anchors; dates and classifications require source review |
| Ember presence and routes | Authored strands, radii and retreat dates | An illustrative narrative between anchors |
| Basemap and environment | Natural Earth geography and schematic shelf/ice shapes | Context, not surveyed Ice Age coastlines |

BP means calendar years before present, using 1950 for calendar readouts. The near-zero endpoint is labelled “Today” for readability; it is the end of this model, not a live demographic layer.

## Chronological interpretation

Site ages, genetic inference and population continuity answer different questions. An early site date alone does not establish continuous occupation or ancestry in later populations. Fading early excursions and later restoring presence are model choices, particularly for early Sahul arrival and the relationship between archaeological and genetic chronologies.

`firm`, `debated` and `contested` are curated editorial labels, not computed confidence scores. Dark land does not demonstrate absence. Sparse evidence is especially difficult to interpret in submerged, tropical and forested environments.

Every authored date — site ages, strand windows, retreat and return, island settlement, land-bridge windows and the sea-level table — is listed with its file and field in [where the dates live](TIMELINE.md).

## Source entry points

These references form a starting bibliography, not an exhaustive or freshly audited literature review:

- [Clarkson et al., Madjedbebe](https://www.nature.com/articles/nature22968)
- [Sümer et al., Neanderthal admixture](https://www.nature.com/articles/s41586-024-08420-x)
- [Slimak et al., Grotte Mandrin](https://www.science.org/doi/10.1126/sciadv.abj9496)
- [Mylopotamitaki et al., Ranis](https://www.nature.com/articles/s41559-023-02303-6)
- [USGS discussion of White Sands dating](https://www.usgs.gov/news/national-news-release/study-confirms-age-oldest-fossil-human-footprints-north-america)
- [Wilkins et al., Ga-Mohana Hill](https://www.nature.com/articles/s41586-021-03419-0)
- [Barker et al., Niah Cave](https://www.sciencedirect.com/science/article/abs/pii/S0047248406001801)
- [Halligan et al., Page-Ladson](https://doi.org/10.1126/sciadv.1600375)

Consult original publications and subsequent work before treating a record as a research claim. Structured citations, date ranges and review dates for every record are a priority improvement.

## Geography and provenance

Land polygons and relief derive from Natural Earth. The inherited relief is already desaturated and cropped to 84°N–56°S; its original download version and transformation script are not recorded. The modular source preserves its JPEG bytes unchanged. No asset version is invented to fill that gap.

Shelves, containment fences and ice outlines are authored approximations, unsuitable for exact area, distance or coastline measurements. Water colour is independent of presence; no ocean-exploration dataset is included.

## Validation scope

Tests check software behavior, not whether an arrival date, retreat, seed radius or interpolation is historically correct. Visual checks establish that the interface renders and responds, not scientific consensus.
