import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {basename,join,resolve} from 'node:path';
import {extractCandidates} from '../sec-extraction/engine.mjs';
export function validateSecUrl(value){
  const u=new URL(value);
  if(u.protocol!=='https:' || u.hostname!=='www.sec.gov' || !/^\/Archives\/edgar\/data\/\d+\/\d+\/[A-Za-z0-9_.-]+\.(?:htm|html|txt)$/i.test(u.pathname) || u.search || u.hash || u.username || u.password)throw new Error('Expected SEC Archives exhibit URL');
  return u.href;
}
export function buildEvidenceRecord(bytes,{documentId,sourceUrl=null,format='html',retrievedAt=null,acquisition='local_file'}={}){
  if(!/^[A-Za-z0-9_-]{2,80}$/.test(documentId||''))throw new Error('Valid documentId required');
  if(sourceUrl)sourceUrl=validateSecUrl(sourceUrl);
  const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
  if(!b.length || b.length>12_000_000)throw new Error('Source size must be 1 to 12 MB');
  const sha256=createHash('sha256').update(b).digest('hex');
  const extraction=extractCandidates(b.toString('utf8'),{documentId,sourceUrl,format});
  const evidence={schema_version:'0.9.0',document_id:documentId,source_url:sourceUrl,acquisition,acquired_at:retrievedAt,source_format:format,source_sha256:sha256,source_bytes:b.length,source_completeness:'not_verified',source_status:'acquired_unverified',extraction_status:'machine_candidate_unreviewed',candidate_count:extraction.candidate_count,candidates:extraction.candidates.map(c=>({...c,source_sha256:sha256})),unresolved:[...extraction.unresolved,'Source SHA-256 proves byte identity, not SEC authenticity or completeness']};
  return evidence;
}
export async function ingestLocal({input,output,documentId,sourceUrl=null,format='html'}){
 const bytes=await readFile(input);const rec=buildEvidenceRecord(bytes,{documentId,sourceUrl,format});await mkdir(output,{recursive:true});
 await writeFile(join(output,documentId+'.candidates.json'),JSON.stringify(rec,null,2)+'\n');
 await writeFile(join(output,documentId+'.source'+(format==='html'?'.html':'.txt')),bytes);
 return rec;
}
export async function fetchSecExhibit(url,{userAgent,fetchImpl=fetch}={}){
 const safe=validateSecUrl(url);
 if(!userAgent || !/\S+@\S+/.test(userAgent))throw new Error('SEC_USER_AGENT with contact email required');
 const res=await fetchImpl(safe,{headers:{'User-Agent':userAgent,'Accept':'text/html,text/plain'},redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!res.ok)throw new Error('SEC request failed HTTP '+res.status);
 const len=Number(res.headers.get('content-length')||0);if(len>12_000_000)throw new Error('File too large');
 const buf=Buffer.from(await res.arrayBuffer());if(buf.length>12_000_000)throw new Error('File too large');return buf;
}
