import test from 'node:test';
import assert from 'node:assert/strict';
import {compareLocations,EXPECTED_SECTIONS} from '../packages/sec-ingestion/owlet-pipeline.mjs';
test('coverage identifies available and missing expected section locations',()=>{
 const report=compareLocations({candidate_count:2,candidates:[{section_as_printed:'2.8'},{section_as_printed:'3.5'}]});
 assert.deepEqual(report.found,['2.8','3.5']);
 assert.ok(report.not_found.includes('11.16'));
 assert.equal(report.expected_section_locations,EXPECTED_SECTIONS.length);
});
test('coverage does not label its numbers as extraction accuracy',()=>{
 const report=compareLocations({candidate_count:0,candidates:[]});
 assert.equal(report.found_location_count,0);
 assert.match(report.metric_note,/Not clause precision/);
});
