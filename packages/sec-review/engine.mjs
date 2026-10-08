/** Pure review validator: requires affirmative human evidence and produces distinct reviewed output. */
export function createReview(candidate,{decision,reviewer,reviewedAt,verifiedSection,sourceChecked,notes='',evidenceQuote=''}={}){
 if(!candidate || candidate.review_status!=='machine_candidate_unreviewed')throw new Error('Must review a machine candidate');
 if(!['verified','rejected','needs_followup'].includes(decision))throw new Error('Invalid review decision');
 if(!reviewer||!reviewer.trim()||!reviewedAt)throw new Error('Reviewer and review date required');
 if(decision==='verified'&&(!sourceChecked||!verifiedSection||!evidenceQuote.trim()))throw new Error('Verified requires source checked, section pinpoint and evidence quote');
 return {schema_version:'0.9.0',candidate_id:candidate.id,document_id:candidate.document_id,source_url:candidate.source_url,source_sha256:candidate.source_sha256||null,section_as_printed:candidate.section_as_printed,review_status:decision==='verified'?'human_verified_clause':decision==='rejected'?'human_rejected_candidate':'needs_followup',verified_section:verifiedSection||null,evidence_quote:evidenceQuote||null,reviewer:reviewer.trim(),reviewed_at:reviewedAt,source_checked:!!sourceChecked,notes,legal_conclusion:null};
}
