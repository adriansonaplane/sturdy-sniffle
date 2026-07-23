import { createHash } from 'node:crypto';
import { buildGameplayLegendEntries, buildGameplayPlacementViews, categoryForGameplayKind, DEFAULT_GAMEPLAY_OVERLAY_STATE } from '../../../src/dungeon/gameplayPresentation.js';
import { canonicalStringify, generateCatacombs } from '../../../src/dungeon/index.js';
import { DEFAULT_DUNGEON_CONFIG } from '../../../src/dungeon/workbench/productionPipeline.js';

const base = { id:'p', sourceRoomId:'r1', region:{id:'reg',roomId:'r1',x:4,y:5,w:2,h:3}, tags:[] } as any;

test('maps supported gameplay placement kinds with deterministic fallback',()=>{
  expect(categoryForGameplayKind('PLAYER_START')).toBe('player_start');
  expect(categoryForGameplayKind('ENCOUNTER')).toBe('encounter');
  expect(categoryForGameplayKind('MONSTER_SPAWN_GROUP',['elite'])).toBe('elite_encounter');
  expect(categoryForGameplayKind('BOSS')).toBe('boss');
  expect(categoryForGameplayKind('HAZARD')).toBe('hazard');
  expect(categoryForGameplayKind('REWARD_PRESENTATION')).toBe('loot');
  expect(categoryForGameplayKind('OBJECTIVE')).toBe('objective');
  expect(categoryForGameplayKind('EVENT')).toBe('interaction');
  expect(categoryForGameplayKind('FUTURE_KIND')).toBe('unknown');
});

test('builds stable presentation views and rejects invalid render positions safely',()=>{
  const views=buildGameplayPlacementViews([{...base,id:'b',kind:'BOSS',spawnTransform:{x:4,y:5,z:0,yaw:0}},{...base,id:'a',kind:'HAZARD',region:{id:'bad',x:Number.NaN,y:0,w:1,h:1}}]);
  expect(views.map(v=>v.id)).toEqual(['a','b']);
  expect(views[0]!.validationState).toBe('missing_position');
  expect(views[1]!.canonicalAreas[0]).toMatchObject({w:2,h:3});
  expect(views[1]!.owner).toEqual({type:'boss_arena',id:'r1'});
});

test('legend derives counts and visibility from centralized registry',()=>{
  const views=buildGameplayPlacementViews([{...base,kind:'PLAYER_START'},{...base,id:'h',kind:'HAZARD'}]);
  const legend=buildGameplayLegendEntries(views,{...DEFAULT_GAMEPLAY_OVERLAY_STATE,categories:{...DEFAULT_GAMEPLAY_OVERLAY_STATE.categories,hazard:false}});
  expect(legend.map(e=>[e.category,e.count,e.visible])).toEqual([['player_start',1,true],['hazard',1,false]]);
});

test('gameplay overlay state and selection do not affect canonical checksum',()=>{
  const cfg={...DEFAULT_DUNGEON_CONFIG,rootSeed:'12345',authorizedPlayerCount:4};
  const r=generateCatacombs({config:cfg,requireReturnPortal:true});
  expect(r.ok).toBe(true); if(!r.ok)return;
  const checksum=()=>createHash('sha256').update(canonicalStringify({renderInput:r.renderInput,construction:r.construction.canonicalProjection,gameplay:r.gameplay.canonicalProjection} as never)).digest('hex');
  const before=checksum();
  buildGameplayPlacementViews(r.renderInput.gameplayPresentation.placements,cfg);
  buildGameplayLegendEntries([], {...DEFAULT_GAMEPLAY_OVERLAY_STATE, enabled:false, markers:false, areas:false, selectedPlacementId:'x', hoveredPlacementId:'y'});
  expect(checksum()).toBe(before);
});
