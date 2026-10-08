/** Candidate extraction only; never confers reviewed status. */
export const RULES = Object.freeze({
  delivery:/\b(?:FOB|FCA|CIF|DAP|DDP|shipping|delivery|title|Incoterms?)\b/i,
  customs:/\b(?:customs|tariff|dut(?:y|ies)|importer of record|country of origin|origin)\b/i,
  records:/\b(?:recordkeeping|record retention|records?|audit|inspection)\b/i,
  compliance:/\b(?:compliance|applicable laws|export controls|supply.chain security)\b/i,
  indemnity:/\b(?:indemnif\w*|liability|damages|warrant\w*)\b/i,
  dispute:/\b(?:arbitrat\w*|mediat\w*|dispute resolution|governing law|jurisdiction)\b/i,
  incorporation:/\b(?:incorporated by reference|exhibit|schedule|subject to the terms)\b/i
});
const clean=s=>s.replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim();
export function htmlToText(source){if(typeof source!=='string')throw new TypeError('source must be a string');return clean(source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<\/(?:p|div|h[1-6]|tr|li|br|table)>/gi,'\n').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|#160);/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"'));}
function sectionStart(line){return line.match(/^\s*(?:(?:SECTION|Section)\s+)?((?:\d{1,2}\.){1,3}\d{1,2}|\d{1,2}\.\d{1,2})\s*[.\-:]?\s+(.{3,})$/) }
export function extractCandidates(raw,{documentId='UNASSIGNED',sourceUrl=null,format='text'}={}){
 if(typeof raw!=='string'||!raw.trim())throw new Error('Nonempty source required');
 const txt=format==='html'?htmlToText(raw):raw;const lines=txt.split(/\r?\n/);const sections=[];let current=null;
 for(let i=0;i<lines.length;i++){
   const line=clean(lines[i]);if(!line)continue;
   const m=sectionStart(line);
   if(m){if(current)sections.push(current);current={section:m[1],heading:m[2],startLine:i+1,parts:[line]};}
   else if(current) current.parts.push(line);
 }
 if(current)sections.push(current);
 const occurrences=new Map(); const candidates=[];
 for(const section of sections){const body=section.parts.join(' ').slice(0,16000);const tags=Object.entries(RULES).filter(([,re])=>re.test(body)).map(([key])=>key);if(!tags.length)continue;
 const n=(occurrences.get(section.section)||0)+1;occurrences.set(section.section,n);
 const internalRefs=[...body.matchAll(/(?:Section|§)\s+(\d{1,2}\.\d{1,2}(?:\([a-z]\))?)/gi)].map(m=>m[1]);
 candidates.push({id:`${documentId}:${section.section}:${n}`,document_id:documentId,section_as_printed:section.section,heading_as_printed:section.heading,start_line:section.startLine,source_url:sourceUrl,labels:tags,excerpt:body.slice(0,600),references:[...new Set(internalRefs)],review_status:'machine_candidate_unreviewed',confidence:null,notes:'Verify against source exhibit and remove TOC duplicates; neither finding nor legal conclusion.'});}
 return {document_id:documentId,source_url:sourceUrl,source_format:format,review_status:'machine_candidate_unreviewed',candidate_count:candidates.length,candidates,unresolved:['Source completeness must be verified','Headings or table-of-contents entries may be misclassified','Human review required before publishing clause findings']};
}
