import { jest } from '@jest/globals';
import { buildCatacombsGraphWorkbenchView, buildCatacombsRoutingWorkbenchView, canonicalExport, inspectContractTree, serializeDiagnostics, authorityLabel } from '../../../src/dungeon/workbench/adapter.js';
import { DEFAULT_DUNGEON_CONFIG, D3_GENERATION_FIELDS, OVERLAY_DEFINITIONS, WORKBENCH_SCHEMA_FIELDS, WORKBENCH_ENVIRONMENTS, assetRegistryForWorkbench, generateProductionCatacombsDungeon } from '../../../src/dungeon/workbench/productionPipeline.js';
import { buildSceneRecords, BUILD_ANIMATION_STAGES } from '../../../src/dungeon/workbench/sceneBuilder.js';
import { createDungeonRenderInput } from '../../../src/dungeon/renderInput.js';
import { SafeAssetLoader } from '../../../src/dungeon/rendering/assetLoader.js';
import { boundaryTransform, tileToWorld, FLOOR_GEOMETRY, WALL_GEOMETRY, DOOR_GEOMETRY, MARKER_GEOMETRY } from '../../../src/dungeon/rendering/geometry.js';
import { createMaterials } from '../../../src/dungeon/rendering/materials.js';
import { QUALITY_PROFILES } from '../../../src/dungeon/rendering/quality.js';
import { ThreeDungeonRenderer } from '../../../src/dungeon/rendering/DungeonRenderer.js';
import { DEFAULT_RENDERER_OPTIONS } from '../../../src/dungeon/rendering/index.js';

const b64=(a:number[])=>Buffer.from(Uint8Array.from(a)).toString('base64');
function renderInput(){return {schemaVersion:'1.0.0' as const,rendererContractVersion:'catacombs.render_input.d2.v1' as const,environment:{environmentId:'catacombs',environmentVersion:'catacombs-1',displayName:'Catacombs'},geometry:{corridors:[{id:'c1',graphEdgeId:'e1',category:'critical',width:2,bendCount:1,strategy:'astar',centerline:[{x:0,y:0,level:0},{x:1,y:0,level:0}],footprint:[{x:0,y:0,level:0},{x:1,y:0,level:0}],initialTraversable:true,finalTraversable:true}],doorways:[{id:'d1',graphEdgeId:'e1',cells:[{x:0,y:0,level:0}],kind:'normal'}],boundaries:[{tile:{x:0,y:0,level:0},side:'n',boundaryType:'wall'},{tile:{x:1,y:0,level:0},side:'e',boundaryType:'door'}],tileLayers:{width:2,height:2,layers:[{id:'tileType',type:'uint8',length:4,base64:b64([1,2,0,3])},{id:'roomOwner',type:'uint16',length:4,base64:b64([1,0,0,1])}]}},construction:{records:[{id:'prop1',requestedAssetFamily:'bad/url',transform:{position:{x:1,y:2},orientation:0},source:{roomId:'r1'}}],sockets:[],batches:[],assetResolutions:[{requested:{family:'bad/url'},state:'FALLBACK',resolvedAssetId:'fallback.asset'}]},gameplayPresentation:{placements:[{id:'p1',kind:'PLAYER_START',sourceRoomId:'r1',region:{id:'reg',x:1,y:1,w:1,h:1}}],dependencies:[]},telegraphs:[{id:'t1',placementId:'p1',regionId:'reg'}]};}

describe('T1B workbench registries and adapters',()=>{
  test('control and overlay registries expose complete behavioral metadata',()=>{
    const fields=[...WORKBENCH_SCHEMA_FIELDS,...D3_GENERATION_FIELDS] as any[];
    expect(fields.map(f=>f.path)).toEqual(expect.arrayContaining(['rootSeed','gameType','difficulty','authorizedPlayerCount','generation.targetRoomCount','generation.areaBudget','generation.targetPackingDensity','generation.minimumRoomPadding','generation.sizeProfile','routing.corridorWidth','renderer.quality','renderer.animateBuild','renderer.animationSpeed','renderer.wallFading','renderer.reducedMotion','renderer.postProcessing']));
    for(const f of fields){ expect(f.label).toBeTruthy(); expect(f.regenerationRequired).toBe(f.canonical); if(f.minimum!==undefined) expect(f.maximum).toBeGreaterThan(f.minimum); if(f.enum) expect(f.enum.length).toBeGreaterThan(0); }
    expect(WORKBENCH_ENVIRONMENTS.filter(e=>!e.disabled).map(e=>e.id)).toEqual(['catacombs']);
    expect(new Set(OVERLAY_DEFINITIONS.map(o=>o.id)).size).toBe(OVERLAY_DEFINITIONS.length);
    for(const o of OVERLAY_DEFINITIONS) expect(o).toEqual(expect.objectContaining({label:o.id.replaceAll('_',' '),implementation:'production-record-adapter'}));
    expect(assetRegistryForWorkbench().assets.length).toBeGreaterThan(0);
  });
  test('adapter serialization excludes executable mutation and reports graph/routing branches',()=>{
    expect(inspectContractTree(new Uint16Array([1,2,3]))).toEqual(expect.objectContaining({type:'Uint16Array',length:3}));
    expect(inspectContractTree([1,2])).toEqual({type:'array',length:2,items:[1,2]});
    expect(authorityLabel('config')).toBeTruthy();
    const diagnostics:any={issues:[{target:'node.a'}],attemptHistory:[{attempt:1}]};
    expect(serializeDiagnostics(diagnostics)).toContain('node.a');
    const graph:any={criticalPathNodeIds:['a','b'],branches:[{kind:'secondary_trunk',divergenceNodeId:'a',reconvergenceNodeId:'b'},{kind:'secret_loop',purpose:'secret_reward',divergenceNodeId:'b'}],nodes:[{id:'a',function:'start'},{id:'b',function:'boss'}],edges:[{id:'e',from:'a',to:'b'}]};
    const view=buildCatacombsGraphWorkbenchView({graph,depthLayers:[],criticalPaths:{initial:{nodeIds:['a'],edgeIds:[],cost:1},final:{nodeIds:['b'],edgeIds:[],cost:1}},metrics:{},loops:[{classification:'immediate_loop'}],diagnostics} as any);
    expect(view.secrets).toHaveLength(1); expect(view.validationTargets).toEqual(['node.a']);
    const routing=buildCatacombsRoutingWorkbenchView({ok:false,diagnostics} as any); expect(routing.ok).toBe(false);
    expect(canonicalExport({...DEFAULT_DUNGEON_CONFIG, z:new Uint8Array([1])} as any)).not.toMatch(/function|<script/);
  });
});

describe('T1B scene building, render input, and production pipeline',()=>{
  test('scene records preserve canonical ownership and presentation overlays',()=>{
    const dungeon:any={dungeonId:'d1',canonicalChecksum:'abc',rooms:[{id:'r1'}],boundaries:[{id:'b1',assetId:'wall'}],constructionPlacements:[{id:'c1',assetId:'fallback.asset'}],gameplayPlacements:[{id:'g1'}],assetUsage:[{assetId:'fallback.asset',status:'fallback'}],metrics:{drawCalls:3,triangles:12},drawCallGroups:[{instances:2}],materialGroups:[{textureMemoryBytes:4}]};
    const scene=buildSceneRecords(dungeon,{quality:'high',overlayIds:['candidate_graph','navigation'],runtimeLod:'high'} as any);
    expect(scene.rendererBoundary).toBe('threejs-presentation-only'); expect(scene.objects.map(o=>o.sourceKind)).toEqual(['room','boundary','construction','gameplay','overlay','overlay']); expect(scene.staleLoadToken).toContain(':high:high'); expect(BUILD_ANIMATION_STAGES.length).toBeGreaterThan(4);
  });
  test('createDungeonRenderInput includes only renderer-facing data',()=>{
    const ri=renderInput(); const out=createDungeonRenderInput({environment:{environmentId:'catacombs',environmentVersion:'catacombs-1',displayName:'Catacombs'} as any,routing:{ok:true,...ri.geometry} as any,construction:ri.construction as any,gameplay:{placements:ri.gameplayPresentation.placements,dependencies:[]} as any});
    expect(out).toEqual(expect.objectContaining({rendererContractVersion:'catacombs.render_input.d2.v1'})); expect(JSON.stringify(out)).not.toMatch(/authorization|privateKey|diagnostics/);
  });
  test('production pipeline succeeds for defaults and rejects planned environments',async()=>{
    await expect(generateProductionCatacombsDungeon({...DEFAULT_DUNGEON_CONFIG,rootSeed:'424242'})).resolves.toEqual(expect.objectContaining({schemaVersion:'1.0.0',canonicalChecksum:expect.any(String)}));
    await expect(generateProductionCatacombsDungeon({...DEFAULT_DUNGEON_CONFIG,environmentId:'garden_maze' as any})).rejects.toMatchObject({stage:'validation'});
  },30000);
});

describe('T1B rendering primitives, assets, and lifecycle',()=>{
  beforeAll(()=>{(globalThis as any).window={devicePixelRatio:2};(globalThis as any).requestAnimationFrame=(cb:FrameRequestCallback)=>setTimeout(()=>cb(16),0) as any;(globalThis as any).cancelAnimationFrame=(id:any)=>clearTimeout(id);});
  test('geometry/material/quality defaults are stable and disposable',()=>{
    expect(tileToWorld(2,3,1).toArray()).toEqual([2,1,3]); expect(boundaryTransform({x:1,y:2,level:0},'e').rotationY).toBeCloseTo(Math.PI/2); expect(boundaryTransform({x:1,y:2,level:0},'w').position.x).toBe(1);
    expect(FLOOR_GEOMETRY.type).toContain('Box'); expect(WALL_GEOMETRY.type).toContain('Box'); expect(DOOR_GEOMETRY.type).toContain('Box'); expect(MARKER_GEOMETRY.type).toContain('Cone');
    const mats=createMaterials(); expect(Object.keys(mats)).toEqual(expect.arrayContaining(['room','corridor','doorway','wall','secret','fallback','missing','gameplay','overlay'])); mats.wall.opacity=.5; Object.values(mats).forEach(m=>m.dispose());
    expect(QUALITY_PROFILES.low.pixelRatioCap).toBeLessThan(QUALITY_PROFILES.high.pixelRatioCap); expect(QUALITY_PROFILES.high.shadows).toBe(true);
  });
  test('asset loader rejects unsafe urls, aborts stale loads, and clears cache on disposal',async()=>{
    const loader=new SafeAssetLoader(); const t=loader.beginGeneration(); await expect(loader.load('a','http://evil/x.glb',t)).resolves.toMatchObject({ok:false,error:expect.stringContaining('rejected')}); const p=loader.load('a','./assets/model.glb',t); const t2=loader.beginGeneration(); await expect(p).resolves.toMatchObject({stale:true}); await expect(loader.load('a',undefined,t2)).resolves.toMatchObject({ok:false}); loader.dispose(); expect(loader.currentToken()).toBeGreaterThan(t2);
  });
  test('renderer renders, updates overlays/presentation, resizes, replaces scenes, and disposes without committing canonical state',async()=>{
    const renderer=new ThreeDungeonRenderer(); const input=renderInput() as any;
    await renderer.render(input,{...DEFAULT_RENDERER_OPTIONS,animateBuild:false,quality:'low'}); expect(renderer.getStats()).toEqual(expect.objectContaining({objects:expect.any(Number),materials:expect.any(Number),assetErrors:expect.arrayContaining([expect.stringContaining('prop1')])}));
    renderer.setOverlayState({preset:'custom',enabled:{doorways:false,corridor_centerlines:true}}); renderer.updatePresentation({quality:'high',wallFading:false,reducedMotion:true,animationSpeed:2,postProcessing:true}); renderer.resize(0,0,10);
    const before=renderer.getStats().generationToken; await renderer.render({...input,construction:{...input.construction,records:[]}}, {...DEFAULT_RENDERER_OPTIONS,animateBuild:true,reducedMotion:true}); expect(renderer.getStats().generationToken).toBeGreaterThan(before);
    renderer.disposeDungeon(); expect(renderer.getStats().objects).toBe(0); renderer.dispose(); renderer.dispose();
  });
});

test('T1B scene records cover absent optional ownership fields',()=>{
  const dungeon:any={dungeonId:'d2',canonicalChecksum:'def',rooms:[],boundaries:[{id:'b2'}],constructionPlacements:[{id:'c2',assetId:'authored.asset'}],gameplayPlacements:[],assetUsage:[],metrics:{drawCalls:0,triangles:0},drawCallGroups:[],materialGroups:[]};
  const scene=buildSceneRecords(dungeon,{quality:'low',overlayIds:[]} as any);
  expect(scene.objects).toEqual([{objectId:'scene.boundary.b2',sourceRecordId:'b2',sourceKind:'boundary',fallback:false,runtimeLoadState:'NOT_REQUESTED'},{objectId:'scene.construction.c2',sourceRecordId:'c2',sourceKind:'construction',assetId:'authored.asset',fallback:false,runtimeLoadState:'NOT_REQUESTED'}]);
});
