import { ThreeDungeonRenderer, DEFAULT_RENDERER_OPTIONS } from '../../../src/dungeon/rendering/index.js';

const input:any={schemaVersion:'1.0.0',rendererContractVersion:'catacombs.render_input.d2.v1',environment:{environmentId:'catacombs',environmentVersion:'catacombs-1',displayName:'Catacombs'},geometry:{corridors:[],doorways:[],boundaries:[],tileLayers:{width:1,height:1,layers:[{id:'tileType',type:'uint8',length:1,base64:'AQ=='}]}},construction:{records:[],sockets:[],batches:[],assetResolutions:[]},gameplayPresentation:{placements:[{id:'start',kind:'PLAYER_START',sourceRoomId:'r',region:{id:'rs',roomId:'r',x:0,y:0,w:1,h:1},tags:[]},{id:'unknown',kind:'FUTURE_KIND',sourceRoomId:'r',region:{id:'ru',roomId:'r',x:1,y:0,w:1,h:1},tags:[]},{id:'bad',kind:'HAZARD',sourceRoomId:'r',region:{id:'bad',x:Infinity,y:0,w:1,h:1},tags:[]}],dependencies:[]},telegraphs:[]};

test('renderer creates gameplay markers, toggles visibility, selection, and disposes safely',async()=>{
  const renderer=new ThreeDungeonRenderer();
  await renderer.render(input,DEFAULT_RENDERER_OPTIONS);
  expect(renderer.getStats()).toMatchObject({gameplayPlacements:3,gameplayRenderablePlacements:2,gameplayAreas:2});
  renderer.setOverlayState({enabled:{},preset:'all',gameplay:{enabled:true,markers:true,areas:false,labels:false,ownership:true,validation:true,categories:{player_start:false,encounter:true,elite_encounter:true,boss:true,hazard:true,loot:true,objective:true,interaction:true,encounter_area:true,unknown:true}}});
  renderer.selectGameplayPlacement('start');
  expect(renderer.getSelectedGameplayPlacement()).toMatchObject({id:'start',category:'Player start'});
  await renderer.render({...input,gameplayPresentation:{placements:[],dependencies:[]}},DEFAULT_RENDERER_OPTIONS);
  expect(renderer.getSelectedGameplayPlacement()).toBeUndefined();
  renderer.disposeDungeon(); renderer.disposeDungeon(); renderer.dispose(); renderer.dispose();
});
