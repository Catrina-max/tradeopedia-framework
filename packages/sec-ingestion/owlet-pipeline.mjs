#!/usr/bin/env node
/** Run locally on an independently downloaded original SEC exhibit. No source bytes are bundled. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {buildEvidenceRecord} from './engine.mjs';
const URL='https://www.sec.gov/Archives/edgar/data/1816708/000114036121010908/nt10020073x5_ex10-11.htm';
export const EXPECTED_SECTIONS=['2.8','3.5','3.6','3.9','9.2','9.3','11.15','11.16'];
export function compareLocations(record, expected=EXPECTED_SECTIONS){
 const available=new Set(record.candidates.map(c=>c.section_as_printed));
 const matched=expected.filter(s=>available.has(s));
 const missed=expected.filter(s=>!available.has(s));
 return {expected_section_locations:expected.length,found_location_count:matched.length,found:matched,not_found:missed,extracted_candidate_count:record.candidate_count,metric_note:'Section-location recall against a small, manually selected reference list. Not clause precision, legal correctness, or full-document recall.'};
}
export async function run(input, output){
 const bytes=await readFile(input);
 const record=buildEvidenceRecord(bytes,{documentId:'OWLET-AONI-2018',sourceUrl:URL,format:/\.txt$/i.test(input)?'text':'html',acquisition:'user_saved_file'});
 const metrics=compareLocations(record);
 await mkdir(output,{recursive:true});
 await writeFile(join(output,'OWLET-AONI-2018.candidates.json'),JSON.stringify(record,null,2)+'\n');
 await writeFile(join(output,'OWLET-AONI-2018.coverage.json'),JSON.stringify({document_id:record.document_id,sha256:record.source_sha256,source_bytes:record.source_bytes,...metrics,source_completeness:'not independently verified',human_review_status:'not reviewed'},null,2)+'\n');
 return {hash:record.source_sha256,candidates:record.candidate_count,...metrics};
}
if(process.argv[1]?.endsWith('owlet-pipeline.mjs')){
 const [input,output='research/sec-contracts/ingested/owlet']=process.argv.slice(2);
 if(!input){console.error('Usage: node packages/sec-ingestion/owlet-pipeline.mjs <saved-original-sec-exhibit.html> [output-folder]');process.exitCode=2;}
 else run(input,output).then(x=>console.log(JSON.stringify(x,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
}
