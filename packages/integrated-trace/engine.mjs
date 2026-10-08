import {analyzeShipment} from '../shipment-trace/engine.mjs';
import {analyze} from '../clause-dependency/engine.mjs';

// Research links only: do not conflate relevance with applicability, causation or entitlement.
const RULES = Object.freeze({
  origin_documentation:[['3.5','Manufacturing and testing records'],['3.9','Supply-chain security'],['7.1','Compliance with laws'],['7.6','Contractual recordkeeping'],['9.1 (body)','Potential indemnity'],['9.2 (body)','Potential damages limits'],['11.15','Choice of law'],['11.16','Dispute resolution']],
  tariff_change:[['2.2','Order precedence'],['2.8','Delivery and risk'],['9.1 (body)','Potential indemnity'],['9.2 (body)','Potential damages limits'],['11.15','Choice of law'],['11.16','Dispute resolution']],
  missing_supplier_records:[['3.5','Manufacturing records'],['7.6','Recordkeeping'],['7.3','Quality agreement dependency'],['9.1 (body)','Potential indemnity'],['11.16','Dispute resolution']]
});
export function analyzeIntegrated(tx, clauseMap, issue='origin_documentation') {
  if (!RULES[issue]) throw new Error('Unknown issue type');
  if (tx?.synthetic !== true) throw new Error('Prototype requires an explicitly synthetic transaction');
  if (tx?.contract?.research_id !== clauseMap?.id) throw new Error('Contract identifier mismatch');
  if (!Array.isArray(clauseMap.records)) throw new Error('Clause records required');
  const shipment=analyzeShipment(tx);
  const refs=RULES[issue].map(([section,reason])=>{
    const found=clauseMap.records.find(r=>r.section_as_printed===section);
    return {section,reason,found:!!found,category:found?.category??null,source_url:found?.source_url??null,source_status:found?.status??'not_mapped',research_finding:found?.finding??null,caveat:found?.caveat??'Requires independent source review',applicability:'unverified'};
  });
  const nodes=[{id:'TX',title:'Synthetic shipment / contractual link',status:'partial',references:[{target:'AGREEMENT',relation:'contract_referenced_not_verified'}]},
    {id:'AGREEMENT',title:clauseMap.title,status:'partial',references:refs.map((r,i)=>({target:'CLAUSE-'+i,relation:'issue_relevance_not_applicability',sourceSection:r.section}))}];
  refs.forEach((r,i)=>nodes.push({id:'CLAUSE-'+i,title:r.section+' — '+r.reason,status:r.found?(r.source_status==='observed'?'reviewed_sections':'partial'):'missing',url:r.source_url,references:[]}));
  const graphTrace=analyze({nodes,entryPoints:['TX']});
  const blockers=[...shipment.flags.map(f=>({code:f.code,detail:f.message})),...shipment.missing.map(m=>({code:'DOCUMENT_'+m.key.toUpperCase(),detail:m.label+' '+m.status})),...refs.filter(r=>!r.found).map(r=>({code:'CLAUSE_NOT_MAPPED',detail:r.section})),{code:'CLAUSE_APPLICABILITY_UNVERIFIED',detail:'Operative terms, amendments, notice compliance, remedies and actual events require review'}];
  return {schema_version:'0.7.0',scenario_id:tx.id,issue,synthetic:true,mode:'research_only',shipment,clause_links:refs,dependency_trace:graphTrace,blockers,public_law:{status:'undetermined',process:'CBP process requires entry-specific evidence; contract cannot displace statutory responsibilities'},private_law:{status:'undetermined',process:'Potential supplier claims require independently established breach, causation, damages, notice and forum'},conclusions:{ior_liability:'not_determined',supplier_recovery:'not_determined',governing_forum:'not_determined'},warning:'This is a source-linked research trace, not a legal opinion or a validation of shipment-specific facts.'};
}
