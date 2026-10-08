#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {ingestLocal,fetchSecExhibit,buildEvidenceRecord} from './engine.mjs';
const [mode,source,documentId,output='research/sec-contracts/ingested']=process.argv.slice(2);
if(!['local','sec'].includes(mode)||!source||!documentId){console.error('Usage: node packages/sec-ingestion/cli.mjs local <saved-file> <document-id> [output-dir]\n   or: node packages/sec-ingestion/cli.mjs sec <sec-exhibit-url> <document-id> [output-dir]');process.exit(2)}
try{
 let rec;
 if(mode==='local')rec=await ingestLocal({input:source,output,documentId,sourceUrl:null,format:/\.html?$/i.test(source)?'html':'text'});
 else {const bytes=await fetchSecExhibit(source,{userAgent:process.env.SEC_USER_AGENT});rec=buildEvidenceRecord(bytes,{documentId,sourceUrl:source,format:'html',retrievedAt:new Date().toISOString(),acquisition:'sec_http'});await mkdir(output,{recursive:true});await writeFile(join(output,documentId+'.source.html'),bytes);await writeFile(join(output,documentId+'.candidates.json'),JSON.stringify(rec,null,2)+'\n')}
 console.log(JSON.stringify({document_id:rec.document_id,source_sha256:rec.source_sha256,candidates:rec.candidate_count,status:rec.extraction_status},null,2));
}catch(e){console.error(e.message);process.exitCode=1}
