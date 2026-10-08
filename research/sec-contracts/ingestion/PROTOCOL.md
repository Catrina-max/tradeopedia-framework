# SEC ingestion and review protocol — v0.9

1. Acquire an SEC exhibit using a browser or the opt-in CLI. Record SEC Archives URL and SEC-compliant contact User-Agent. Do not bypass SEC access controls.
2. Preserve the exact downloaded bytes and SHA-256. Hashes indicate content identity, not legal authenticity.
3. Record accession and exhibit details from the source filing separately; they are not automatically verified in v0.9.
4. Extract section candidates using the v0.8 heuristic engine. Candidate labels are not legal findings.
5. Verify against the original exhibit, record precise provision references, short quotations, reviewer, and timestamp.
6. Do not promote a record if a referenced schedule or agreement has not been examined. Mark `needs_followup`.
7. Do not store client data or credentials in public GitHub. SEC exhibits may include redactions and confidential omissions.

## CLI

```bash
node packages/sec-ingestion/cli.mjs local path/to/exhibit.html CN-001 research/sec-contracts/ingested
SEC_USER_AGENT='TradeopediaResearch research@example.org' node packages/sec-ingestion/cli.mjs sec 'https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm' CN-001 research/sec-contracts/ingested
node --test tests/*.test.mjs
```

Set your actual contact email; the placeholder is not valid identifying contact information. The SEC command is explicitly invoked, not run on site visitors. Avoid bursts; follow SEC published access and fair-use policies. No direct HTTP ingestion is performed on Vercel.

## Limitations

The v0.8 HTML-to-text parser is regex-based and can misclassify table of contents and clause boundaries. The v0.9 review queue is browser-local with export, without login or backend audit trail. Review identity is entered by users and is not independently authenticated. Production use requires parser hardening, SEC accession identity reconciliation, document integrity review, authorization controls and immutable review logs.
