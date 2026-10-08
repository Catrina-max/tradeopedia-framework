# Owlet–Aoni real-source review — v1.0

Primary exhibit: https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm

## Source status
- Original SEC exhibit was inspected through publicly available rendered web text.
- Source bytes were **not** acquired in the build environment because direct network retrieval failed.
- Raw source SHA-256 and machine extraction from the full exhibit are **not** available.
- JSON entries are source-linked research summaries, not machine extractions and not promoted human-verification decisions.

## Reproducibility plan
1. Download the SEC exhibit using the authorized local opt-in CLI or save from the browser; retain unmodified bytes.
2. Run `node packages/sec-ingestion/cli.mjs --help` for supported arguments and ingest the saved file.
3. Inspect candidates using `/review-lab.html`, confirm precise sections, quotations and original context.
4. Export review decisions; preserve reviewer, date, raw SHA-256, and original SEC URL.
5. Reconcile original source, table of contents and operative text; never silently correct numbering.
6. Link verified clauses to shipment evidence only after confirming that the agreement governed the particular transaction.

## Open issues
- Printed §11.16(b) references §11.14(a), although direct negotiations appear in §11.16(a).
- Table of contents and operative body appear inconsistent for §§9.2–9.3.
- The agreement alone cannot identify any particular shipment's Importer of Record.
- New York choice of law alone does not establish an express CISG exclusion.
- The existence and content of referenced exhibits and quality documents require separate review.
