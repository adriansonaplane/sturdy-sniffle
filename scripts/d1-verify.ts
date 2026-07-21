import { generateCatacombsGraph, assignCatacombsRooms, embedCatacombsRooms, canonicalStringify, detectRoomOverlaps } from '../src/dungeon/index.js';
import { dungeonConfig, environmentProfile } from '../test/dungeon/fixtures/fixtures.js';
const cfg={...dungeonConfig,generatorVersion:'catacombs-gen-1'};
function make(seed:string){const g=generateCatacombsGraph({config:{...cfg,rootSeed:seed},environment:environmentProfile,graph:{sizeProfile:'small'}}); if(!g.ok)throw Error('graph'); const a=assignCatacombsRooms({config:{...cfg,rootSeed:seed},environment:environmentProfile,graph:g.graph,branches:g.branches,depthLayers:g.depthLayers,graphMetrics:g.metrics}); if(!a.ok)throw Error('rooms'); const s=embedCatacombsRooms({config:{...cfg,rootSeed:seed},environment:environmentProfile,graph:g.graph,branches:g.branches,depthLayers:g.depthLayers,assignedRooms:a.assignedRooms}); if(!s.ok)throw Error('spatial'); return {g,a,s};}
const one=make('101'), same=make('101'), other=make('202');
function assert(x:boolean,msg:string){if(!x)throw Error(msg)}
assert(one.s.embeddedRooms.length===one.g.graph.nodes.length,'requested count');
assert(canonicalStringify(one.s.embeddedRooms.map(r=>[r.assignedRoom.nodeId,r.footprint.origin,r.footprint.width,r.footprint.height]) as never)===canonicalStringify(same.s.embeddedRooms.map(r=>[r.assignedRoom.nodeId,r.footprint.origin,r.footprint.width,r.footprint.height]) as never),'same seed identical');
assert(canonicalStringify(one.g.graph.edges as never)!==canonicalStringify(other.g.graph.edges as never)||canonicalStringify(one.s.embeddedRooms.map(r=>r.footprint.origin) as never)!==canonicalStringify(other.s.embeddedRooms.map(r=>r.footprint.origin) as never),'different seeds vary');
assert(one.s.metrics.delaunayEdgeCount>0,'real Delaunay edges exist');
assert(one.s.metrics.mstEdgeCount===one.s.embeddedRooms.length-1,'mst count');
assert(one.s.metrics.fallbackEdgeCount>=0,'legal fallback count reported');
assert(detectRoomOverlaps(one.s.embeddedRooms).length===0,'no overlaps');
for(const fn of ['entrance','antechamber','boss']) assert(one.s.embeddedRooms.some(r=>r.assignedRoom.function===fn),'mandatory '+fn);
assert(one.s.diagnostics.issues.some(i=>String(i.message).includes('Delaunay/MST')),'old graph-first is not spatial authority');
console.log('D1 focused verification passed');
