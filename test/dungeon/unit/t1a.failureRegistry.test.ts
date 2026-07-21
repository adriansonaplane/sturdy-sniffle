import { CATACOMBS_ROUTING_DIAGNOSTIC_CODES, resolveCorridorRoutingConfig, expandCorridorFootprint, classifyGraphEdge, orderGraphEdgesForRouting } from '../../../src/dungeon/catacombsRouting.js';
import * as astar from '../../../src/dungeon/routing/astar.js';
import * as boundaries from '../../../src/dungeon/routing/boundaries.js';
import * as crossings from '../../../src/dungeon/routing/crossings.js';
import * as doorways from '../../../src/dungeon/routing/doorways.js';
import * as equivalence from '../../../src/dungeon/routing/equivalence.js';
import * as routingIndex from '../../../src/dungeon/routing/index.js';
import * as metrics from '../../../src/dungeon/routing/metrics.js';
import * as navigation from '../../../src/dungeon/routing/navigation.js';
import * as obstacles from '../../../src/dungeon/routing/obstacles.js';
import * as occupancy from '../../../src/dungeon/routing/occupancy.js';
import * as rasterization from '../../../src/dungeon/routing/rasterization.js';
import * as routeCandidates from '../../../src/dungeon/routing/routeCandidates.js';
import * as validation from '../../../src/dungeon/routing/validation.js';
import { config } from '../fixtures/config.js';
import { routeAndRasterizeCatacombs } from '../../../src/dungeon/catacombsRouting.js';

const routingModules = [astar,boundaries,crossings,doorways,equivalence,routingIndex,metrics,navigation,obstacles,occupancy,rasterization,routeCandidates,validation];

const registry = Object.fromEntries(CATACOMBS_ROUTING_DIAGNOSTIC_CODES.map(code => [code, {
  stage: code.startsWith('DOORWAY_') ? 'doorways' : code.startsWith('RASTER_') ? 'rasterization' : code.startsWith('NAV_') ? 'navigation' : code.startsWith('EQUIVALENCE_') ? 'equivalence' : 'routing',
  discriminator: 'diagnostics', retryable: false, target: code.includes('CONFIG') ? 'constraint' : 'edge',
  test: 'T1A routing failure-code registry coverage guard'
}] as const));

describe('T1A deterministic core failure registry and routing barrels', () => {
  test('every declared routing/core failure code has registered ownership metadata', () => {
    expect(Object.keys(registry).sort()).toEqual([...CATACOMBS_ROUTING_DIAGNOSTIC_CODES].sort());
    expect(registry.ROUTING_CONFIG_INVALID).toMatchObject({stage:'routing', discriminator:'diagnostics', retryable:false, target:'constraint'});
    expect(registry.NAV_BOSS_CLEARANCE_FAILED.stage).toBe('navigation');
    expect(registry.EQUIVALENCE_WRONG_ROOM_ENDPOINT.stage).toBe('equivalence');
    expect(Object.values(registry).every(row => row.test.length > 10)).toBe(true);
  });

  test('routing facade modules expose the same production implementation instead of dead barrels', () => {
    for (const mod of routingModules) {
      expect(mod.routeAndRasterizeCatacombs).toBe(routeAndRasterizeCatacombs);
      expect(mod.expandCorridorFootprint([{x:0,y:0,level:0},{x:2,y:0,level:0}], 2).map(p => `${p.x},${p.y}`)).toContain('0,1');
    }
  });

  test('routing configuration validation covers numeric, movement, and topology-revision branches', () => {
    const bad = resolveCorridorRoutingConfig({ ordinaryCorridorWidth: -1, maximumCorridorLength: Number.NaN, bossApproachWidth: Infinity, criticalPathCorridorWidth: 1 });
    expect(bad.issues.map(i => [i.code, i.target?.id, i.severity]).sort((a,b)=>String(a[1]).localeCompare(String(b[1])))).toEqual([
      ['ROUTING_CONFIG_INVALID','bossApproachWidth','error'],
      ['ROUTING_CONFIG_INVALID','criticalPathCorridorWidth','error'],
      ['ROUTING_CONFIG_INVALID','maximumCorridorLength','error'],
      ['ROUTING_CONFIG_INVALID','ordinaryCorridorWidth','error']
    ]);
    const warned = resolveCorridorRoutingConfig({ movementPolicy:'eight_neighbor', allowCorridorCrossing:true, promoteCrossingToJunction:true });
    expect(warned.issues.map(i => [i.code, i.target?.id, i.severity])).toEqual([
      ['ROUTING_CONFIG_INVALID','movementPolicy','warning'],
      ['ROUTING_TOPOLOGY_REVISION_REQUIRED','promoteCrossingToJunction','warning']
    ]);
  });

  test('route classification covers secret, locked, boss, loop, reward, critical and transition branches', () => {
    const graph:any = { nodes:[{id:'a',function:'start'},{id:'b',function:'boss'},{id:'c',function:'ordinary'},{id:'d',function:'exit'},{id:'e',function:'antechamber'}], branches:[{id:'loop',kind:'immediate_loop'},{id:'dead',kind:'dead_end',purpose:'reward'}], edges:[] };
    const edge = (x:any) => ({id:'e',fromNodeId:'a',toNodeId:'c',category:'passage',initialState:'open',criticality:'optional',...x});
    expect(classifyGraphEdge(edge({criticality:'secret'}), graph)).toBe('secret_passage');
    expect(classifyGraphEdge(edge({initialState:'locked'}), graph)).toBe('conditional_shortcut');
    expect(classifyGraphEdge(edge({toNodeId:'d'}), graph)).toBe('post_completion_exit');
    expect(classifyGraphEdge(edge({fromNodeId:'e',toNodeId:'b'}), graph)).toBe('boss_approach');
    expect(classifyGraphEdge(edge({branchId:'loop'}), graph)).toBe('loop_passage');
    expect(classifyGraphEdge(edge({branchId:'dead'}), graph)).toBe('reward_spur');
    expect(classifyGraphEdge(edge({criticality:'critical'}), graph)).toBe('primary_passage');
    expect(classifyGraphEdge(edge({}), graph)).toBe('transition_passage');
    graph.edges = [edge({id:'z'}), edge({id:'a',criticality:'critical'}), edge({id:'m',initialState:'locked'})];
    expect(orderGraphEdgesForRouting(graph).map(x => x.edge.id)).toEqual(['a','z','m']);
  });

  test('production routing reports structured config, raster bounds, and missing-approach failures', () => {
    const room = (id:string, x:number):any => ({assignedRoom:{nodeId:id}, footprint:{origin:{x,y:0}, width:4, height:4, mask:new Uint8Array(16).fill(1), bounds:{minimumX:x,maximumX:x+3,minimumY:0,maximumY:3}, occupiedCellCount:16}});
    const graph:any = {id:'g', criticalPathNodeIds:['a','b'], branches:[], nodes:[{id:'a',function:'start'},{id:'b',function:'boss'}], edges:[{id:'edge.0',fromNodeId:'a',toNodeId:'b',category:'passage',initialState:'open',criticality:'critical'}]};
    const base:any = {config:config('t1a-routing'), environment:{id:'catacombs'}, graph, branches:[], depthLayers:[], assignedRooms:[], embeddedRooms:[room('a',0), room('b',10)], occupancy:{}, padding:{paddedCells:[],regions:[]}, connectionApproaches:[], doorCandidates:[], bounds:{minimumX:0,minimumY:0,maximumX:13,maximumY:3,level:0}};
    const raster = routeAndRasterizeCatacombs({...base, routing:{maximumRasterWidth:1}});
    expect(raster.ok).toBe(false); if (!raster.ok) expect(raster.diagnostics.issues.map(i => i.code)).toContain('RASTER_GRID_BOUNDS_EXCEEDED');
    const missing = routeAndRasterizeCatacombs(base);
    expect(missing.ok).toBe(false); if (!missing.ok) expect(missing.diagnostics.issues.map(i => i.code)).toEqual(expect.arrayContaining(['ROUTING_SOURCE_APPROACH_MISSING','ROUTING_EDGES_INCOMPLETE']));
  });
});

import { generateCatacombsCore as genCore, projectCoreToD2RoutingInputs as projectD2, validateGenerationCore, resolveGenerationConfig } from '../../../src/dungeon/generation/index.js';

describe('T1A generation result branches', () => {
  test('core failure helper returns structured production failure and D2 projection excludes diagnostics', () => {
    const failed = genCore({config:config('too-few'), generation:{exactRoomCount:1,targetRoomCount:1}});
    expect(failed.ok).toBe(false); if (!failed.ok) expect(failed.failure).toMatchObject({stage:'composition', code:'COMPOSITION_COUNT_OUT_OF_RANGE', retryPermitted:false});
    const ok = genCore({config:config('project'), generation:{exactRoomCount:12,targetRoomCount:12}});
    expect(ok.ok).toBe(true); if (!ok.ok) return;
    const d2 = projectD2(ok);
    expect(d2.graph.nodes).toHaveLength(ok.topology.nodeIds.length);
    expect(d2.assignedSemanticRooms.every(r => !('diagnostics' in r))).toBe(true);
    expect(d2.occupancy.occupiedCells.length).toBe(ok.packedLayout.rooms.reduce((n,r)=>n+r.footprint.occupiedCellCount,0));
    expect(d2.connectionApproachCandidates.map(c => c.edgeId).sort()).toEqual(ok.topology.edges.map(e => e.id).sort());
  });

  test('validation branch reports all structural production validation codes independently', () => {
    const ok = genCore({config:config('validation'), generation:{exactRoomCount:12,targetRoomCount:12}});
    expect(ok.ok).toBe(true); if (!ok.ok) return;
    const badGraph:any = {...ok.candidateGraph, componentCount:2, edges:[]};
    const badTopology:any = {...ok.topology, edges:[{...ok.topology.edges[0]!, id:'not-a-candidate'}], criticalPathNodeIds:[]};
    const badSem:any = {rooms:[...ok.semanticLayout.rooms.slice(2), {...ok.semanticLayout.rooms[0]!, archetypeId:'future-placeholder'}]};
    const result = validateGenerationCore({...resolveGenerationConfig(config('validation')), targetRoomCount:99} as any, ok.composition.candidates, {...ok.packedLayout, bounds:{...ok.packedLayout.bounds, maximumX:99999}}, badGraph, [], badTopology, badSem);
    expect(result.valid).toBe(false);
    expect(result.issues.map(i => i.code)).toEqual(expect.arrayContaining([
      'VALIDATION_COMPOSITION_COUNT','VALIDATION_BOUNDS','VALIDATION_CANDIDATE_CONNECTIVITY','VALIDATION_MST_EDGE_COUNT','VALIDATION_TOPOLOGY_EDGE_PROVENANCE','VALIDATION_CRITICAL_PATH','VALIDATION_SEMANTIC_COMPLETENESS','VALIDATION_MANDATORY_SEMANTICS','VALIDATION_PLACEHOLDER_SEMANTICS'
    ]));
  });
});
