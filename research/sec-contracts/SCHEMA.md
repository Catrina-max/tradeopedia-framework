# SEC contract corpus — data specification

Status: **source-identified, not clause-reviewed**. The manifest points to original SEC exhibits; it is not a representation that a clause is present or missing.

## Contract record

- `id`: stable local identifier
- `parties`, `title`, `effective_date` (ISO date or null), `category`
- `source_url`: SEC exhibit permalink
- `source_type`, `review_status`, `clause_review`, `notes`, `parent_id`
- `extracted_clauses`: empty until grounded manual or assisted review

## Proposed clause record

```json
{
  "clause_id": "SEC-001:clause-001",
  "contract_id": "SEC-001",
  "category": "customs_importer_of_record",
  "section_ref": "section number exactly as printed",
  "quote": "short verbatim extract",
  "source_url": "https://www.sec.gov/Archives/...",
  "location_hint": "heading / text position",
  "extraction_method": "manual",
  "review_status": "pending-human-review",
  "assessment": "unassessed",
  "notes": ""
}
```

## Candidate labels (not findings)

- importer of record / customs entry
- tariffs and duties / price adjustment
- origin and supply-chain traceability
- records, audit rights and cooperation
- delivery / risk of loss / Incoterms
- representations and warranties
- indemnification and liability limits
- governing law and CISG
- forum and arbitration
- force majeure / regulatory change

## Review safeguards

1. Identify document version and related amendments before clause review.
2. Record original section and source URL for each extraction.
3. Distinguish *not reviewed*, *not found on review*, *present*, and *ambiguous*. Never treat missing machine extraction as evidence of absence.
4. Flag exhibit redactions and unavailable schedules.
5. Separate statutory IOR responsibility from contractual allocation of costs.
6. Do not equate a private arbitration clause with CBP protest or CIT jurisdiction.
7. Review source access and SEC fair-access requirements before implementing automatic collection.
