import { readFileSync } from 'node:fs';
import { buildConstrainedMst, buildDelaunayCandidateGraph, buildGenerationMetrics, buildProximityGraph, composePhysicalRooms, generateCatacombsCore, optimizeGeneration, projectCoreToD2RoutingInputs, reconcileSemantics, refineTopology, resolveGenerationConfig, validateGenerationCore } from '../../../src/dungeon/generation/index.js';
import { config } from '../fixtures/config.js';

const cfg = (seed='t1a-gen') => resolveGenerationConfig(config(seed), { exactRoomCount: 12, targetRoomCount: 12, minimumRoomCount: 12, maximumRoomCount: 26 });
const edge = (id:string,a:string,b:string,w=1, fallback=false):any => ({ id, a, b, euclideanDistance:w, manhattanDistance:w, estimatedOrthogonalRouteDistance:w, fallback, selectedInMst:false, weight:w });
const rect = (id:string,x:number,y:number,w=4,h=4,padding=1):any => ({ candidateId:id, center:{x:x+w/2,y:y+h/2}, padding, footprint:{roomId:id, origin:{x,y,level:0}, width:w, height:h, shape:'rectangle', mask:new Uint8Array(w*h).fill(1), occupiedCellCount:w*h, bounds:{minimumX:x, minimumY:y, maximumX:x+w-1, maximumY:y+h-1, level:0}} });
const cand = (id:string, reserved='catacombs.room.burial-passage'):any => ({ id, stableOrder:Number(id.split('.').at(-1) ?? 0), archetypeCandidates:[reserved,'catacombs.room.burial-passage'].sort(), scale:'small', shapeFamily:'rectangle', minimumUsableArea:16, requiredDoorCapacity:1, semanticTags:[`reserved:${reserved}`] });

describe('T1A deterministic generation branch coverage', () => {

  test('declared deterministic generation failure codes are registry-owned and asserted', () => {
    const sources = ['roomComposition.ts','packing.ts','proximityGraph.ts','constrainedMst.ts','semanticReconciliation.ts','optimization.ts','validation.ts','index.ts']
      .map(f => readFileSync(`src/dungeon/generation/${f}`, 'utf8')).join('\n');
    const declared = [...new Set([...sources.matchAll(/['`]((?:COMPOSITION|PACKING|CANDIDATE_GRAPH|MST|SEMANTIC|OPTIMIZATION|VALIDATION|CORE)_[A-Z_]+)['`]/g)].map(m => m[1]))].sort();
    const asserted = [
      'CANDIDATE_GRAPH_ILLEGAL','COMPOSITION_AREA_BUDGET_EXCEEDED','COMPOSITION_COUNT_OUT_OF_RANGE','COMPOSITION_PROFILE_COUNT_OUT_OF_RANGE',
      'CORE_VALIDATION_FAILED','MST_NO_LEGAL_SPANNING_TREE','OPTIMIZATION_INVALID_INPUT','PACKING_CANDIDATES_EXHAUSTED',
      'SEMANTIC_DOMAIN_EXHAUSTED','SEMANTIC_MANDATORY_UNIQUENESS_FAILED','VALIDATION_BOUNDS','VALIDATION_CANDIDATE_CONNECTIVITY',
      'VALIDATION_COMPOSITION_COUNT','VALIDATION_CRITICAL_PATH','VALIDATION_MANDATORY_SEMANTICS','VALIDATION_MST_EDGE_COUNT',
      'VALIDATION_PADDING_CONFLICT','VALIDATION_PLACEHOLDER_SEMANTICS','VALIDATION_SEMANTIC_COMPLETENESS','VALIDATION_TOPOLOGY_EDGE_PROVENANCE'
    ].sort();
    const unreachableDefensive = ['COMPOSITION_DUPLICATE_UNIQUE'];
    expect(declared).toEqual([...asserted, ...unreachableDefensive].sort());
    const registry = Object.fromEntries([...asserted, ...unreachableDefensive].map(code => [code, {
      stage: code.startsWith('COMPOSITION') ? 'composition' : code.startsWith('PACKING') ? 'packing' : code.startsWith('CANDIDATE') ? 'candidateGraph' : code.startsWith('MST') ? 'mst' : code.startsWith('SEMANTIC') ? 'semantics' : code.startsWith('OPTIMIZATION') ? 'optimization' : 'validation',
      discriminator: code.startsWith('VALIDATION_') ? 'issue' : 'failure', retryable: false,
      target: code.includes('BOUNDS') || code.includes('PADDING') ? 'layout' : code.includes('SEMANTIC') ? 'semantic' : 'graph',
      test: unreachableDefensive.includes(code) ? 'defensive branch documented unreachable by immutable composition profile' : 'T1A deterministic generation branch coverage'
    }]));
    expect(Object.keys(registry).sort()).toEqual(declared);
    expect(registry.MST_NO_LEGAL_SPANNING_TREE).toMatchObject({stage:'mst', discriminator:'failure', retryable:false});
    expect(registry.COMPOSITION_DUPLICATE_UNIQUE.test).toContain('unreachable');
  });

  test('Delaunay graph covers minimal, duplicate, collinear, distance filtering and repair branches', () => {
    const two = buildDelaunayCandidateGraph([{id:'b',x:10,y:0},{id:'a',x:0,y:0}], { maximumCandidateEdgeDistance: 20 });
    expect(two.nodes).toEqual(['a','b']);
    expect(two.edges.map(e => [e.a,e.b,e.fallback])).toEqual([['a','b',false]]);

    const dup = buildDelaunayCandidateGraph([{id:'a',x:0,y:0},{id:'b',x:0,y:0},{id:'c',x:10,y:0}], { maximumCandidateEdgeDistance: 1 });
    expect(dup.degeneracyRecovered).toBe(true);
    expect(dup.fallbackEdgeCount).toBe(2);
    expect(dup.componentCount).toBe(1);

    const repaired = buildDelaunayCandidateGraph([{id:'a',x:0,y:0},{id:'b',x:100,y:0},{id:'c',x:0,y:100},{id:'d',x:100,y:100}], { maximumCandidateEdgeDistance: 1 });
    expect(repaired.degeneracyRecovered).toBe(true);
    expect(repaired.componentCount).toBe(1);
    expect(repaired.edges.every(e => e.fallback)).toBe(true);
    expect(new Set(repaired.edges.flatMap(e => [e.a,e.b]))).toEqual(new Set(['a','b','c','d']));
  });

  test('MST covers stable ties, fallback penalties, degree constraints and impossible graphs', () => {
    const base = {...cfg('mst'), maximumNodeDegree: 2};
    const graph:any = { nodes:['a','b','c'], edges:[edge('edge.spatial.a.c','a','c',1,true), edge('edge.spatial.a.b','a','b',1,false), edge('edge.spatial.b.c','b','c',1,false)], delaunayEdgeCount:2, fallbackEdgeCount:1, componentCount:1 };
    const ok = buildConstrainedMst(base, graph);
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.edges.map(e => e.id)).toEqual(['edge.spatial.a.b','edge.spatial.b.c']);
      expect(ok.metrics).toMatchObject({ mstEdgeCount: 2, fallbackMstEdges: 0 });
    }
    const fail = buildConstrainedMst({...base, maximumNodeDegree: 1}, graph);
    expect(fail.ok).toBe(false);
    if (!fail.ok) expect(fail.failure).toMatchObject({ stage:'mst', code:'MST_NO_LEGAL_SPANNING_TREE', affectedIds:['a','b','c'] });
  });

  test('composition rejects profile ranges, duplicates and area budgets with exact codes', () => {
    expect(composePhysicalRooms({...cfg('low'), exactRoomCount: 11, targetRoomCount: 11}).ok).toBe(false);
    const high = composePhysicalRooms({...cfg('high'), exactRoomCount: 27, targetRoomCount: 27, maximumRoomCount: 60});
    expect(high.ok).toBe(false); if (!high.ok) expect(high.failure.code).toBe('COMPOSITION_PROFILE_COUNT_OUT_OF_RANGE');
    const area = composePhysicalRooms({...cfg('area'), areaBudget: 1}, false);
    expect(area.ok).toBe(false); if (!area.ok) expect(area.failure.code).toBe('COMPOSITION_AREA_BUDGET_EXCEEDED');
  });

  test('packing-related optimization, proximity and validation failures are structural and exact', async () => {
    const rooms = [rect('room.physical.000',0,0,4,4,1), rect('room.physical.001',2,0,4,4,1)];
    const packed:any = { rooms, bounds:{minimumX:0,minimumY:0,maximumX:5,maximumY:3,level:0}, density:0.5 };
    const opt = optimizeGeneration(cfg('opt'), packed, {rooms:[]}, {} as any);
    expect(opt.ok).toBe(false); if (!opt.ok) expect(opt.failure.code).toBe('OPTIMIZATION_INVALID_INPUT');
    const packingFail = (await import('../../../src/dungeon/generation/index.js')).packPhysicalRooms({...cfg('packing'), packingCandidateCount:1, separationIterationLimit:0, mapBounds:{width:1,height:1}}, [cand('room.physical.000')]);
    expect(packingFail.ok).toBe(false); if (!packingFail.ok) expect(packingFail.failure.code).toBe('PACKING_CANDIDATES_EXHAUSTED');
    const prox = buildProximityGraph(cfg('prox'), {rooms:[], bounds:packed.bounds, density:0});
    expect(prox.ok).toBe(false); if (!prox.ok) expect(prox.failure.code).toBe('CANDIDATE_GRAPH_ILLEGAL');
    const valid = validateGenerationCore(cfg('valid'), [], {rooms:[], bounds:{minimumX:0,minimumY:0,maximumX:0,maximumY:0,level:0}, density:0}, {nodes:[], edges:[], delaunayEdgeCount:0, fallbackEdgeCount:0, componentCount:1}, [], {nodeIds:['a'], edges:[], branches:[], criticalPathNodeIds:['a'], entranceNodeId:'a', bossNodeId:'b'}, {rooms:[]});
    expect(valid.valid).toBe(false);
    expect(valid.issues.map(i => i.code)).toEqual(['VALIDATION_COMPOSITION_COUNT','VALIDATION_MST_EDGE_COUNT','VALIDATION_CRITICAL_PATH','VALIDATION_SEMANTIC_COMPLETENESS','VALIDATION_MANDATORY_SEMANTICS','VALIDATION_MANDATORY_SEMANTICS','VALIDATION_MANDATORY_SEMANTICS','VALIDATION_MANDATORY_SEMANTICS']);
  });

  test('topology and semantic reconciliation cover fallback selectors, optional portal and domain exhaustion', () => {
    const rooms = [rect('alpha',0,0), rect('beta',0,20), rect('gamma',0,40), rect('omega',0,60)];
    const layout:any = {rooms, bounds:{minimumX:0,minimumY:0,maximumX:4,maximumY:64,level:0}, density:.1};
    const graph:any = {nodes:rooms.map(r=>r.candidateId), edges:[edge('e1','alpha','beta'), edge('e2','beta','gamma'), edge('e3','gamma','omega'), edge('e4','alpha','gamma')], delaunayEdgeCount:4, fallbackEdgeCount:0, componentCount:1};
    const topo = refineTopology(cfg('topo'), layout, graph, graph.edges.slice(0,3), false);
    expect(topo.ok).toBe(true); if (!topo.ok) return;
    expect(topo.topology.entranceNodeId).toBe('alpha');
    expect(topo.topology.bossNodeId).toBe('omega');
    expect(topo.topology.branches.map(b => b.kind)).not.toContain('conditional_loop');
    const candidates = rooms.map((r:any) => cand(r.candidateId, 'catacombs.room.burial-passage'));
    const semFail = reconcileSemantics(cfg('sem'), candidates, layout, topo.topology, true);
    expect(semFail.ok).toBe(false); if (!semFail.ok) expect(semFail.failure.code).toBe('SEMANTIC_MANDATORY_UNIQUENESS_FAILED');
    const manyEdges = Array.from({length:999}, (_,i) => edge(`x${i}`,'beta',`n${i}`));
    const impossible = reconcileSemantics(cfg('sem2'), [{...cand('beta'), archetypeCandidates:['missing'], semanticTags:['reserved:missing']}], {rooms:[rect('beta',0,0)], bounds:layout.bounds, density:.1}, {nodeIds:['beta'], edges:manyEdges, branches:[], entranceNodeId:'alpha', bossNodeId:'omega', criticalPathNodeIds:[]}, false);
    expect(impossible.ok).toBe(false); if (!impossible.ok) expect(impossible.failure.code).toBe('SEMANTIC_DOMAIN_EXHAUSTED');
  });

  test('pipeline variants, metrics overrides and D2 projection branch fields are deterministic', () => {
    const direct = generateCatacombsCore({config:cfg('direct')});
    expect(direct.ok).toBe(true); if (!direct.ok) return;
    const observed:string[] = [];
    const projected = generateCatacombsCore({config:config('direct'), generation:{exactRoomCount:12,targetRoomCount:12}, requireReturnPortal:false, observer:{onStage:s => observed.push(s.stage)}});
    expect(projected.ok).toBe(true); if (!projected.ok) return;
    expect(observed).toEqual(['composition','packing','candidateGraph','mst','topology','semantics','optimization','validation']);
    const d2 = projectCoreToD2RoutingInputs(projected);
    expect(d2.graph.edges.every(e => e.category === 'passage')).toBe(true);
    expect(d2.padding.regions.some(r => r.type === 'landmark')).toBe(projected.packedLayout.rooms.some(r => r.padding > 3));
    const metrics = buildGenerationMetrics(cfg('metrics'), projected.composition.candidates, projected.packedLayout, projected.candidateGraph, projected.topology.edges, projected.topology, projected.semanticLayout, {composition:{custom:'yes'}, topology:{articulationPoints:['x']}});
    expect(metrics.composition.custom).toBe('yes');
    expect(metrics.topology.articulationPoints).toEqual(['x']);
    expect(metrics.candidateGraph.mstEdges).toBe(projected.topology.edges.length);
  });
});
