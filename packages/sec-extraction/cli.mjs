#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {extractCandidates} from './engine.mjs';
const [input,output,documentId,sourceUrl] = process.argv.slice(2);
if(!input||!output){console.error('Usage: node packages/sec-extraction/cli.mjs INPUT.html OUTPUT.json DOCUMENT_ID [SOURCE_URL]');process.exit(2)}
try {const source=await readFile(input,'utf8');const data=extractCandidates(source,{documentId:documentId||'UNASSIGNED',sourceUrl:sourceUrl||null,format:/\.html?$/i.test(input)?'html':'text'});await writeFile(output,JSON.stringify(data,null,2)+'\n');console.log(`Wrote ${data.candidate_count} unreviewed candidates to ${output}`)}catch(e){console.error(e.message);process.exit(1)}
