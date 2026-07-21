import { canonicalStringify, generateCatacombs, routeAndRasterizeCatacombs, generateCatacombsGraph, assignCatacombsRooms, embedCatacombsRooms } from '../../src/dungeon/index.js';
import { dungeonConfig as cfg, environmentProfile } from './fixtures/fixtures.js';

function legacy(seed='24680') {
  const config={...cfg,rootSeed:seed};
  const g=generateCatacombsGraph({config,environment:environmentProfile}); expect(g.ok).toBe(true); if(!g.ok) throw new Error('graph');
  const a=assignCatacombsRooms({config,environment:environmentProfile,graph:g.graph,branches:g.branches,depthLayers:g.depthLayers,graphMetrics:g.metrics,requireReturnPortal:true}); expect(a.ok).toBe(true); if(!a.ok) throw new Error('rooms');
  const s=embedCatacombsRooms({config,environment:environmentProfile,graph:g.graph,branches:g.branches,depthLayers:g.depthLayers,assignedRooms:a.assignedRooms}); expect(s.ok).toBe(true); if(!s.ok) throw new Error('spatial');
  const r=routeAndRasterizeCatacombs({config,environment:environmentProfile,graph:g.graph,branches:g.branches,depthLayers:g.depthLayers,assignedRooms:a.assignedRooms,embeddedRooms:s.embeddedRooms,occupancy:s.occupancy,padding:s.padding,connectionApproaches:s.connectionApproaches,doorCandidates:s.doorCandidates,bounds:s.bounds}); expect(r.ok).toBe(true); if(!r.ok) throw new Error('routing');
  return {g,a,s,r};
}

test('D2 production pipeline returns routed layout, construction, gameplay, and diagnostic-free render input',()=>{
  const result=generateCatacombs({config:{...cfg,rootSeed:'24681'}});
  expect(result.ok).toBe(true); if(!result.ok) return;
  expect(result.routedLayout.corridors).toHaveLength(result.routedLayout.metrics.graphEdgesRequiringRoutes);
  expect(result.routedLayout.metrics.missingGraphRoutes).toBe(0);
  expect(result.routedLayout.metrics.extraPhysicalRoutes).toBe(0);
  expect(result.routedLayout.metrics.initialConnectedComponents).toBeGreaterThan(0);
  expect(result.routedLayout.metrics.finalConnectedComponents).toBeGreaterThan(0);
  expect(result.construction.records.every(r=>r.source.roomId||r.source.corridorId||r.source.doorwayId||r.source.tile)).toBe(true);
  expect(result.gameplay.validation.valid).toBe(true);
  const renderKeys=canonicalStringify(result.renderInput as never);
  expect(renderKeys).not.toContain('diagnostics');
  expect(renderKeys).not.toContain('camera');
  expect(renderKeys).not.toContain('signing');
  expect(renderKeys).not.toContain('authorizedLoot');
});

test('D2 routing preserves topology provenance, doorway-pair observations, deterministic output, and distinct completion rooms',()=>{
  const one=legacy('24682'), two=legacy('24682');
  expect(canonicalStringify({c:one.r.corridors,d:one.r.doorways,l:one.r.tileLayers} as never)).toBe(canonicalStringify({c:two.r.corridors,d:two.r.doorways,l:two.r.tileLayers} as never));
  const edgeIds=new Set(one.g.graph.edges.map(e=>e.id));
  expect(one.r.corridors.every(c=>edgeIds.has(c.graphEdgeId))).toBe(true);
  expect(new Set(one.r.corridors.map(c=>c.graphEdgeId)).size).toBe(edgeIds.size);
  expect(one.r.snapshots.some(s=>s.stage==='doorway-pair-evaluation')).toBe(true);
  expect(one.r.metrics.crossingCount).toBe(0);
  expect(one.r.metrics.sharedSegmentCount).toBe(0);
  expect(one.r.metrics.requiredRoomReachability).toBeGreaterThan(0);
  const boss=one.a.assignedRooms.find(r=>r.function==='boss')?.nodeId;
  const exit=one.a.assignedRooms.find(r=>r.function==='exit')?.nodeId;
  if(boss&&exit) expect(boss).not.toBe(exit);
});
