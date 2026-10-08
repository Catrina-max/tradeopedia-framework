/** Deterministic dependency traversal. No legal conclusions are inferred. */
export function analyze(graph, selectedIds = graph.entryPoints ?? []) {
  const nodes = new Map(graph.nodes.map(n => [n.id, n]));
  const visited = new Set(), active = new Set(), dependencies = [], alerts = [];
  const addAlert = (kind, id, message, path) => alerts.push({kind,id,message,path:[...path]});
  function visit(id, path=[]) {
    if(active.has(id)) { addAlert('cycle',id,'Circular dependency detected', [...path,id]); return; }
    if(visited.has(id)) return;
    const node = nodes.get(id);
    if(!node) {addAlert('missing_node',id,'Referenced node not included in research graph',[...path,id]);return;}
    active.add(id); visited.add(id);
    if(node.status === 'missing' || node.status === 'unavailable') addAlert('missing_evidence', id, `${node.title}: document or schedule is unavailable`,[...path,id]);
    if(node.status === 'unreviewed' || node.status === 'partial') addAlert('review_needed',id,`${node.title}: further document review required`,[...path,id]);
    for(const ref of node.references ?? []) {
      dependencies.push({from:id,to:ref.target,relation:ref.relation,sourceSection:ref.sourceSection ?? null,note:ref.note ?? null});
      visit(ref.target,[...path,id]);
    }
    active.delete(id);
  }
  for(const id of selectedIds) visit(id);
  const relevant = [...visited].map(id=>nodes.get(id)).filter(Boolean);
  const blocking = alerts.filter(a => ['cycle','missing_node','missing_evidence','review_needed'].includes(a.kind));
  return {entryPoints:selectedIds,visitedNodes:relevant,dependencies,alerts, assessment: blocking.length ? 'INCOMPLETE_EVIDENCE' : 'REFERENCES_TRACED',disclaimer:'Trace completeness is not a legal determination of governing law, venue, arbitrability, or liability.'};
}
