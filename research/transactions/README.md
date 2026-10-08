# Shipment research fixtures (v0.6)

The `DEMO-*` records are **entirely synthetic**; the Owlet SEC agreement is only a research category reference. No CBP transaction, supplier breach, shipment, purchase order, assessment or importer status is asserted about Owlet or Aoni.

## Data rules
- Use explicit `status` on documents and asserted facts: `present`, `missing`, `unverified`, or `not_applicable`.
- Do not equate contractual purchaser with actual importer of record.
- Do not calculate duties without verified product, classification, origin, time, entry value, and duty measures.
- No automatic determination of indemnity, protest viability, or arbitration forum.
- Later phases: source hash, provenance, custodial authority, confidence, human-review audit trail and a source-citation pointer for every extracted field.
