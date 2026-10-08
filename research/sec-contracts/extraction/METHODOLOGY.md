# SEC clause candidate extraction (v0.8)

Research prototype. The bundled fixture is **synthetic**, not a reproduction of the Owlet exhibit. To examine a real filing, save its HTML from the [SEC exhibit](https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm) locally and run the CLI. Do not commit full exhibit content without checking redistribution and repository policies.

- Source acquisition, source completeness and document identity are **external** to the extractor.
- `htmlToText` is a basic HTML cleaner, not a layout-aware EDGAR parser.
- Numbered headings are heuristics and can include tables of contents; candidates have no verified pinpoint citation.
- Category labels are keyword hits, not clause interpretations. False negatives and false positives are expected.
- All outputs remain `machine_candidate_unreviewed`. Human reviewers must verify against the original filing, amendments, exhibits, date, and parties.
- Preserve the original SEC URL and document metadata. Do not place sensitive nonpublic documents in a public repository.
- Neither the engine nor the UI calculates customs liability, arbitral jurisdiction, or recoverable damages.

Run tests: `node --test tests/*.test.mjs`

Run on saved SEC HTML: `node packages/sec-extraction/cli.mjs owlet.html candidates.json CN-001 https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm`
