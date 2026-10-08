// Deterministic research model. No legal conclusions and no inferred entry facts.
export function analyzeShipment(tx) {
  if (!tx || typeof tx !== 'object' || !tx.id) throw new Error('Transaction requires an id');
  const checks = [
    ['purchase_order','Purchase order',tx.documents?.purchase_order],
    ['commercial_invoice','Commercial invoice',tx.documents?.commercial_invoice],
    ['entry_summary','Entry summary (CBP Form 7501 or ACE equivalent)',tx.documents?.entry_summary],
    ['origin_support','Origin and manufacturing evidence',tx.documents?.origin_support],
    ['classification_support','HTS classification support',tx.documents?.classification_support],
    ['broker_communications','Broker instructions and communications',tx.documents?.broker_communications],
    ['contract','Governing agreement and operative order terms',tx.documents?.contract],
    ['cbp_notice','CBP notice or demand (if alleged)',tx.cbp?.action === 'notice' ? tx.documents?.cbp_notice : {status:'not_applicable'}]
  ];
  const missing = checks.filter(([, , value]) => value?.status !== 'present' && value?.status !== 'not_applicable').map(([key,label,value])=>({key,label,status:value?.status || 'missing',reason:'Evidence not supplied or verified'}));
  const flags=[];
  if(tx.entry?.importer_of_record?.status!=='verified') flags.push({code:'IOR_UNVERIFIED',message:'Importer of record not established by verified entry evidence'});
  if(tx.origin?.country?.status!=='verified') flags.push({code:'ORIGIN_UNVERIFIED',message:'Country of origin not established by reviewed production evidence'});
  if(tx.entry?.hts?.status!=='verified') flags.push({code:'HTS_UNVERIFIED',message:'HTS classification not independently verified'});
  if(tx.contract?.applicable_terms?.status!=='verified') flags.push({code:'TERMS_UNRESOLVED',message:'Applicable contract, amendments and order-of-precedence not yet verified'});
  if(tx.cbp?.action==='notice' && !tx.documents?.cbp_notice?.status?.includes('present')) flags.push({code:'CBP_NOTICE_MISSING',message:'Claimed CBP notice lacks supporting notice document'});
  return {transaction_id:tx.id,mode:'research_only',public_law:{status:'requires_entry_specific_review',note:'Contractual allocations do not transfer statutory IOR responsibilities'},private_law:{status:'requires_contract_and_fact_review',note:'Potential remedies depend on applicable clauses, limits, notice requirements, evidence, and forum'},checks:checks.map(([key,label,value])=>({key,label,status:value?.status||'missing'})),missing,flags,conclusion:{importer_liability:'not_determined',supplier_recovery:'not_determined',dispute_forum:'not_determined'},generated_from:'user_supplied_fixture_not_live_cbp_data'};
}
