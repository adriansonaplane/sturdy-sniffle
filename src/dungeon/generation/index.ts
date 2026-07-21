export * from './types.js';
export * from './delaunay.js';
export * from './configuration.js';
export * from './roomComposition.js';
export * from './packing.js';
export * from './proximityGraph.js';
export * from './constrainedMst.js';
export * from './topology.js';
export * from './semanticReconciliation.js';
export * from './optimization.js';
export * from './validation.js';
export * from './metrics.js';

import type { DungeonConfig, EnvironmentProfile } from '../contracts/index.js';
import type { DungeonGenerationConfig, GenerationObserver, GeneratorCoreResult } from '../spatialEmbedding.js';
import { resolveGenerationConfig } from './configuration.js';
import { composePhysicalRooms } from './roomComposition.js';
import { packPhysicalRooms } from './packing.js';
import { buildProximityGraph } from './proximityGraph.js';
import { buildConstrainedMst } from './constrainedMst.js';
import { refineTopology } from './topology.js';
import { reconcileSemantics } from './semanticReconciliation.js';
import { optimizeGeneration } from './optimization.js';
import { validateGenerationCore } from './validation.js';
import { buildGenerationMetrics } from './metrics.js';

export interface GenerateCatacombsCoreInput{readonly config:DungeonConfig|DungeonGenerationConfig;readonly environment?:EnvironmentProfile;readonly generation?:Partial<DungeonGenerationConfig>;readonly requireReturnPortal?:boolean;readonly observer?:GenerationObserver}
function isCoreConfig(c:DungeonConfig|DungeonGenerationConfig):c is DungeonGenerationConfig{return 'targetRoomCount'in c&&'mapBounds'in c;}
function fail(f:{stage:string;code:string;message:string;attemptIndex:number;affectedIds:readonly string[];retryPermitted:boolean}):GeneratorCoreResult{return {ok:false,failure:f};}
function emit(observer:GenerationObserver|undefined,stage:string,summary:Readonly<Record<string,unknown>>){observer?.onStage?.({stage,attemptIndex:0,summary});}
export function generateCatacombsCore(input:GenerateCatacombsCoreInput):GeneratorCoreResult{const config=isCoreConfig(input.config)?{...input.config,...input.generation}:resolveGenerationConfig(input.config,input.generation); const requireReturnPortal=input.requireReturnPortal??true; const comp=composePhysicalRooms(config,requireReturnPortal); if(!comp.ok)return fail(comp.failure); emit(input.observer,'composition',comp.metrics); const packing=packPhysicalRooms(config,comp.candidates); if(!packing.ok)return fail(packing.failure); emit(input.observer,'packing',packing.metrics); const prox=buildProximityGraph(config,packing.layout); if(!prox.ok)return fail(prox.failure); emit(input.observer,'candidateGraph',prox.metrics); const mst=buildConstrainedMst(config,prox.graph); if(!mst.ok)return fail(mst.failure); emit(input.observer,'mst',mst.metrics); const topo=refineTopology(config,packing.layout,prox.graph,mst.edges,requireReturnPortal); if(!topo.ok)return fail(topo.failure); emit(input.observer,'topology',topo.metrics); const sem=reconcileSemantics(config,comp.candidates,packing.layout,topo.topology,requireReturnPortal); if(!sem.ok)return fail(sem.failure); emit(input.observer,'semantics',sem.metrics); const opt=optimizeGeneration(config,packing.layout,sem.layout,topo.topology); if(!opt.ok)return fail(opt.failure); emit(input.observer,'optimization',opt.metrics); const validation=validateGenerationCore(config,comp.candidates,opt.packedLayout,prox.graph,mst.edges,topo.topology,opt.semanticLayout); emit(input.observer,'validation',validation.metrics); const metrics=buildGenerationMetrics(config,comp.candidates,opt.packedLayout,prox.graph,mst.edges,topo.topology,opt.semanticLayout,{composition:comp.metrics,packing:packing.metrics,candidateGraph:{...prox.metrics,...mst.metrics},topology:topo.metrics,semantics:sem.metrics,optimization:opt.metrics,validation:validation.metrics}); if(!validation.valid)return {ok:false,failure:{stage:'validation',code:'CORE_VALIDATION_FAILED',message:validation.issues.map(i=>i.code).join(','),attemptIndex:0,affectedIds:validation.issues.flatMap(i=>i.affectedIds),retryPermitted:false}}; return {ok:true,composition:{candidates:comp.candidates},packedLayout:opt.packedLayout,candidateGraph:prox.graph,topology:topo.topology,semanticLayout:opt.semanticLayout,metrics};}

export function projectCoreToD2RoutingInputs(core:Extract<GeneratorCoreResult,{ok:true}>){
  const occupiedCells=core.packedLayout.rooms.flatMap(r=>{const out:{x:number;y:number;level:number;roomId:string}[]=[]; for(let y=0;y<r.footprint.height;y++)for(let x=0;x<r.footprint.width;x++)if(r.footprint.mask[y*r.footprint.width+x]===1)out.push({x:r.footprint.origin.x+x,y:r.footprint.origin.y+y,level:0,roomId:r.candidateId}); return out;});
  const paddingCells=core.packedLayout.rooms.flatMap(r=>{const out:{x:number;y:number;level:number;ownerId:string;type:string}[]=[]; for(let y=r.footprint.bounds.minimumY-r.padding;y<=r.footprint.bounds.maximumY+r.padding;y++)for(let x=r.footprint.bounds.minimumX-r.padding;x<=r.footprint.bounds.maximumX+r.padding;x++)if(x<r.footprint.bounds.minimumX||x>r.footprint.bounds.maximumX||y<r.footprint.bounds.minimumY||y>r.footprint.bounds.maximumY)out.push({x,y,level:0,ownerId:r.candidateId,type:r.padding>3?'landmark':'ordinary'}); return out;});
  const semanticByPacked=new Map(core.semanticLayout.rooms.map(r=>[r.packedRoomId,r]));
  const nodes=core.topology.nodeIds.map((id,i)=>{const s=semanticByPacked.get(id)!; return {id,category:s.function==='boss'?'landmark':s.function==='antechamber'?'transition':'room',scale:s.archetypeId.includes('boss-sepulcher')||s.archetypeId.includes('mausoleum')?'landmark':'medium',function:s.function,archetypeId:s.archetypeId,depthLayer:Math.max(0,core.topology.criticalPathNodeIds.indexOf(id)),degree:core.topology.edges.filter(e=>e.a===id||e.b===id).length,criticalPathEligible:core.topology.criticalPathNodeIds.includes(id),branchEligible:!core.topology.criticalPathNodeIds.includes(id),tags:[id===core.topology.entranceNodeId?'semantic:start':'',id===core.topology.bossNodeId?'semantic:finish':''].filter(Boolean)};});
  const edges=core.topology.edges.map((e,i)=>({id:`graph.${e.id}`,fromNodeId:e.a,toNodeId:e.b,category:e.fallback?'passage':'passage',initialState:'open',generationDirection:'forward',traversal:'bidirectional',criticality:core.topology.criticalPathNodeIds.includes(e.a)&&core.topology.criticalPathNodeIds.includes(e.b)?'critical':'optional'}));
  return {graph:{id:'graph.catacombs.core',nodes,edges,branches:core.topology.branches.map(b=>({id:b.id,kind:b.kind,divergenceNodeId:b.nodeIds[0]!,reconvergenceNodeId:b.nodeIds.at(-1),nodeIds:b.nodeIds,purpose:b.kind==='dead_end'?'pacing':'critical_progression'})),criticalPathNodeIds:core.topology.criticalPathNodeIds},assignedSemanticRooms:core.semanticLayout.rooms,embeddedPhysicalRooms:core.packedLayout.rooms,occupancy:{encoding:'coordinate-list',occupiedCells,roomCellCounts:Object.fromEntries(core.packedLayout.rooms.map(r=>[r.candidateId,r.footprint.occupiedCellCount]))},padding:{regions:core.packedLayout.rooms.map(r=>({id:`padding.${r.candidateId}`,roomId:r.candidateId,type:r.padding>3?'landmark':'ordinary',cells:paddingCells.filter(c=>c.ownerId===r.candidateId).map(c=>({x:c.x,y:c.y,level:c.level})),conflictRule:'protected'})),paddedCells:paddingCells},connectionApproachCandidates:core.topology.edges.map(e=>({edgeId:e.id,from:e.a,to:e.b,estimatedOrthogonalRouteDistance:e.estimatedOrthogonalRouteDistance})),bounds:core.packedLayout.bounds};
}
