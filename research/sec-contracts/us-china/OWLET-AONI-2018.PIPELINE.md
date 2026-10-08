# Owlet–Aoni: source-byte acquisition and reproducible extraction

## Source
Official SEC exhibit: https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm

The research environment could read the filing on the SEC website but **could not acquire the underlying original HTML bytes**. No original source HTML or SHA-256 hash has been supplied in this release. Do not treat the webpage-rendered text as a byte-for-byte SEC source file.

## Run on your computer

1. Open the official SEC exhibit link in your browser.
2. Use **Save Page As** to save the HTML source locally as `owlet-original.html` (avoid converting it to PDF, taking screenshots or copying only the displayed text).
3. In the repository root, run:

```bash
node packages/sec-ingestion/owlet-pipeline.mjs ./owlet-original.html ./research/sec-contracts/ingested/owlet
node --test tests/*.test.mjs
```

This writes `OWLET-AONI-2018.candidates.json` and `OWLET-AONI-2018.coverage.json`. The former includes a SHA-256 hash **of the saved input file**, not a guarantee that it matches the original SEC bytes. The location-coverage metric compares extracted section numbers against preselected source-linked research records. It is **not** full-document recall, precision, or human verification.

If saved HTML contains browser-added resources or wrappers, its hash will differ from a raw HTTP response. To acquire raw bytes instead, run the existing `sec` ingestion CLI with a contact-bearing `SEC_USER_AGENT` and the official URL; never bypass rate limits or access controls.

## Review protocol

* Check candidate section numbers against the original SEC exhibit, especially repeated table-of-contents labels.
* Verify the printed text for §§2.8, 3.5, 3.6, 3.9, 9.2–9.3, 11.15–11.16.
* Record original quotes, offsets, and reviewer identity; do not promote candidates automatically.
* Preserve mismatched 9.2/9.3 and 11.14/11.16 references as unresolved questions.
* Do not commit local exhibit HTML to the public repository until source licensing, provenance and file suitability are reviewed. Never commit credentials or confidential customs data.
