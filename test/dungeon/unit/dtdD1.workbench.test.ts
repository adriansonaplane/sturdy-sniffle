/** @jest-environment jsdom */
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'node:util';
(globalThis as any).TextEncoder=TextEncoder; (globalThis as any).TextDecoder=TextDecoder;
const calls:any[]=[];
class MockRenderer{stats={objects:2,geometries:2,materials:3,drawCalls:1,triangles:6,generationToken:1,assetErrors:[],gameplayPlacements:3,gameplayAreas:2}; async mount(c:HTMLElement){c.append(document.createElement('canvas'));} async render(){this.stats.generationToken++;} updatePresentation(o:any){calls.push(['presentation',o]);} setOverlayState(s:any){calls.push(['overlay',s]);} selectGameplayPlacement(){} getSelectedGameplayPlacement(){return {id:'room.x.player_start.0',category:'Player start',kind:'PLAYER_START',owner:{type:'room',id:'room.x'},validationState:'valid'};} resize(){} disposeDungeon(){} dispose(){} getStats(){return this.stats;}}
await jest.unstable_mockModule('../../../src/dungeon/rendering/index.js',()=>({ThreeDungeonRenderer:MockRenderer,DEFAULT_RENDERER_OPTIONS:{quality:'medium',animateBuild:false,animationSpeed:1,wallFading:true,reducedMotion:true,postProcessing:false}}));
const { CatacombsWorkbenchApp } = await import('../../../src/dungeon/workbench/application.js');

beforeEach(()=>{calls.length=0; (globalThis.URL.createObjectURL as any)=jest.fn(()=> 'blob:1'); (globalThis.URL.revokeObjectURL as any)=jest.fn(); jest.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{}); (globalThis as any).ResizeObserver=class{constructor(private cb:any){} observe(){this.cb([{contentRect:{width:800,height:500}}]);}};});

test('DTD-D1 workbench renders gameplay overlay filters legend and selected inspector safely',async()=>{
  const root=document.createElement('div'); document.body.replaceChildren(root); const app=new CatacombsWorkbenchApp(); await app.mount(root);
  expect(root.querySelector('#gameplay-legend')?.textContent).toMatch(/Player start|Boss|Encounter/);
  const hazard=root.querySelector('[data-gameplay-category="hazard"]') as HTMLInputElement; expect(hazard).toBeTruthy(); hazard.checked=false; hazard.dispatchEvent(new Event('change',{bubbles:true})); expect(calls.at(-1)?.[0]).toBe('overlay');
  (document.getElementById('tab-Gameplay legend') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('category');
  (document.getElementById('tab-Selected gameplay placement') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('room.x.player_start.0');
  (root.querySelector('#export') as HTMLButtonElement).click(); expect(root.textContent).not.toContain('selectedPlacementId');
  app.dispose();
});
