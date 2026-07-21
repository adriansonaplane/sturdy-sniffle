import { generateCatacombsCore, resolveGenerationConfig, buildDelaunayCandidateGraph, buildConstrainedMst } from '../../../src/dungeon/generation/index.js';
import { config } from '../fixtures/config.js';
import { assertNoRoomOverlap, connected, hasCycle, stableCore, validateMst } from '../helpers/invariants.js';

describe('T1 production core verification',()=>{
  test('same seed/config is structurally deterministic and observer-neutral',()=>{
    const c=config('determinism');
    const a=generateCatacombsCore({config:c});
    const events:unknown[]=[];
    const b=generateCatacombsCore({config:{...c}, observer:{onStage:e=>events.push(e)}});
    expect(a.ok).toBe(true); expect(b.ok).toBe(true); expect(events.length).toBeGreaterThan(5);
    expect(stableCore(a)).toBe(stableCore(b));
  });
  test('property iteration order does not affect resolved generation configuration',()=>{
    const c=config('order');
    const reversed=Object.fromEntries(Object.entries(c).reverse()) as typeof c;
    expect(resolveGenerationConfig(c)).toEqual(resolveGenerationConfig(reversed));
    expect(stableCore(generateCatacombsCore({config:c}))).toBe(stableCore(generateCatacombsCore({config:reversed})));
  });
  test('core output satisfies independent geometry and graph invariants',()=>{
    const res=generateCatacombsCore({config:config('invariants'), generation:{exactRoomCount:18, targetRoomCount:18}});
    expect(res.ok).toBe(true); if(!res.ok)return;
    expect(res.packedLayout.rooms).toHaveLength(18);
    assertNoRoomOverlap(res.packedLayout.rooms);
    for(const r of res.packedLayout.rooms){
      expect(Number.isInteger(r.footprint.origin.x)).toBe(true); expect(Number.isInteger(r.footprint.origin.y)).toBe(true);
      expect(r.footprint.mask.length).toBe(r.footprint.width*r.footprint.height);
      expect(r.footprint.occupiedCellCount).toBe(Array.from(r.footprint.mask).filter(Boolean).length);
      expect(r.footprint.bounds.minimumX).toBe(r.footprint.origin.x);
      expect(r.footprint.bounds.maximumX).toBe(r.footprint.origin.x+r.footprint.width-1);
    }
    expect(connected(res.candidateGraph.nodes,res.candidateGraph.edges)).toBe(true);
    const mst=res.topology.edges.filter(e=>e.selectedInMst);
    expect(validateMst(res.topology.nodeIds,mst)).toBe(true);
    expect(hasCycle(res.topology.nodeIds,mst)).toBe(false);
    expect(new Set(res.semanticLayout.rooms.map(r=>r.packedRoomId)).size).toBe(res.topology.nodeIds.length);
  });
  test('cross-seed sample varies coordinates, topology and semantics',()=>{
    const sample=Array.from({length:24},(_,i)=>generateCatacombsCore({config:config(`diversity-${i}`),generation:{exactRoomCount:18,targetRoomCount:18}}));
    expect(sample.every(r=>r.ok)).toBe(true);
    const oks=sample.filter((r):r is Extract<typeof r,{ok:true}>=>r.ok);
    expect(new Set(oks.map(r=>r.packedLayout.rooms.map(x=>`${x.footprint.origin.x},${x.footprint.origin.y}`).join('|'))).size).toBeGreaterThan(12);
    expect(new Set(oks.map(r=>r.topology.edges.map(e=>e.id).sort().join('|'))).size).toBeGreaterThan(8);
    expect(new Set(oks.map(r=>r.semanticLayout.rooms.map(s=>s.archetypeId).join('|'))).size).toBeGreaterThan(1);
  });
  test('Delaunay candidate graph handles square, duplicate and collinear fixtures with provenance',()=>{
    const cfg={maximumCandidateEdgeDistance:999};
    const square=buildDelaunayCandidateGraph([{id:'a',x:0,y:0},{id:'b',x:10,y:0},{id:'c',x:0,y:10},{id:'d',x:10,y:10}],cfg);
    expect(square.edges.every(e=>e.a<e.b && e.a!==e.b)).toBe(true);
    expect(new Set(square.edges.map(e=>e.id)).size).toBe(square.edges.length);
    expect(connected(square.nodes,square.edges)).toBe(true);
    expect(square.delaunayEdgeCount).toBeGreaterThanOrEqual(4);
    const deg=buildDelaunayCandidateGraph([{id:'a',x:0,y:0},{id:'b',x:0,y:0},{id:'c',x:5,y:0},{id:'d',x:9,y:0}],cfg);
    expect(deg.degeneracyRecovered).toBe(true); expect(deg.fallbackEdgeCount).toBeGreaterThan(0); expect(connected(deg.nodes,deg.edges)).toBe(true);
  });
  test('constrained MST validates tree shape and failure for impossible degree',()=>{
    const graph=buildDelaunayCandidateGraph([{id:'a',x:0,y:0},{id:'b',x:10,y:0},{id:'c',x:0,y:10},{id:'d',x:10,y:10}],{maximumCandidateEdgeDistance:999});
    const base=resolveGenerationConfig(config('mst'));
    const ok=buildConstrainedMst({...base,maximumNodeDegree:3},graph);
    expect(ok.ok).toBe(true); if(ok.ok) expect(validateMst(graph.nodes,ok.edges)).toBe(true);
    const fail=buildConstrainedMst({...base,maximumNodeDegree:1},graph);
    expect(fail.ok).toBe(false); if(!fail.ok) expect(fail.failure.code).toBe('MST_NO_LEGAL_SPANNING_TREE');
  });
});
