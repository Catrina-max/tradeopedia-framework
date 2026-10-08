import test from 'node:test';import assert from 'node:assert/strict';import {extractCandidates,htmlToText} from '../packages/sec-extraction/engine.mjs';
const sample=`2.8 Shipping and Delivery\nFOB Shenzhen.\n3.5 Record Retention\nKeep records for audit.\n11.16 Dispute Resolution\nArbitration under ICDR rules.`;
test('classifies candidate headings',()=>{let r=extractCandidates(sample,{documentId:'TEST'});assert.equal(r.candidate_count,3);assert(r.candidates[0].labels.includes('delivery'))});
test('never promotes machine candidates to findings',()=>{let r=extractCandidates(sample);assert(r.candidates.every(x=>x.review_status==='machine_candidate_unreviewed'))});
test('captures printed section and source trace',()=>{let r=extractCandidates(sample,{documentId:'ABC',sourceUrl:'https://www.sec.gov/example'});assert.equal(r.candidates[2].section_as_printed,'11.16');assert.equal(r.candidates[2].source_url,'https://www.sec.gov/example')});
test('rejects blank source',()=>assert.throws(()=>extractCandidates('  ')));
test('strips scripts from HTML',()=>assert(!htmlToText('<script>evil()</script><p>2.8 Shipping and Delivery</p>').includes('evil')));
test('allows duplicates with distinct ids',()=>{const r=extractCandidates('2.8 Shipping and Delivery\nFOB\n2.8 Shipping and Delivery\nFOB');assert.equal(r.candidate_count,2);assert.notEqual(r.candidates[0].id,r.candidates[1].id)});
