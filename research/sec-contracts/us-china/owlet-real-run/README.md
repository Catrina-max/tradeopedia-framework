# First real saved-document extraction — Owlet / Shenzhen Aoni

This directory contains a **real run**, not a synthetic test. Input is a user-saved SEC HTML page, which may contain browser-injected markup. The reported SHA-256 applies to that saved file **only**, not the SEC origin server response.

## Baseline evaluation

- Rule-based extractor produced **54 candidates**.
- Matched **4/8** previously selected printed section identifiers; this is **50% section-location recall on that small list**. It is **not** precision, full-document recall or legal validity.
- Missed **2.8, 3.6, 3.9**, which are present in tables, and **9.3**, which is in the TOC but not the operative indemnity/limitation section sequence.
- The operative agreement calls supplier indemnification **§9.1**, and limitation of consequential damages **§9.2** despite different numbers in its TOC.
- The arbitration provision is **§11.16** but references **§11.14(a)** for negotiation instead of **§11.16(a)**.
- Exhibit C (Supplier Quality Agreement) is present in the uploaded HTML, contrary to any earlier assumption it was unavailable. The incorporated Exhibit D is not present in the saved file.

## Files

- `OWLET-AONI-2018.candidates.json`: v1.1 extraction output, unreviewed.
- `OWLET-AONI-2018.coverage.json`: v1.1 baseline metrics.
- `OWLET-AONI-2018.real-evaluation.json`: provenance, issue flags, additional research locations.

### Next engineering fixes

1. Parse HTML table cells before rule matching; preserve clause-number column and heading/body column as one record.
2. Exclude the TOC when identifying operative sections; keep TOC as separate independent evidence for mismatch detection.
3. Detect embedded Exhibit A/B/C sections and maintain scoped numbering for Exhibit C.
4. Distinguish cross-references from actual clause identifiers and verify reference targets.
5. Build adjudicated evaluation labels with a documented reviewer and version before publishing accuracy claims.

Source: https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm
