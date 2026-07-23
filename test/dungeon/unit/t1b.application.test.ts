/** @jest-environment jsdom */
import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'node:util';
(globalThis as any).TextEncoder=TextEncoder; (globalThis as any).TextDecoder=TextDecoder;

const calls:any[]=[];
class MockRenderer{stats={objects:2,geometries:2,materials:3,drawCalls:1,triangles:6,generationToken:1,assetErrors:[]}; async mount(c:HTMLElement){calls.push(['mount',c.id]); c.append(document.createElement('canvas'));} async render(input:any,opts:any){calls.push(['render',input.rendererContractVersion,opts.quality]); this.stats.generationToken++;} updatePresentation(o:any){calls.push(['presentation',o]);} setOverlayState(s:any){calls.push(['overlay',s]);} resize(w:number,h:number,pr:number){calls.push(['resize',w,h,pr]);} disposeDungeon(){calls.push(['disposeDungeon']);} dispose(){calls.push(['dispose']);} selectGameplayPlacement(id?:string){calls.push(['selectGameplay',id]);} getSelectedGameplayPlacement(){return {id:'mock-placement',category:'Player start',kind:'PLAYER_START'};} getStats(){return this.stats;}}
await jest.unstable_mockModule('../../../src/dungeon/rendering/index.js',()=>({ThreeDungeonRenderer:MockRenderer,DEFAULT_RENDERER_OPTIONS:{quality:'medium',animateBuild:false,animationSpeed:1,wallFading:true,reducedMotion:false,postProcessing:false}}));
const { CatacombsWorkbenchApp } = await import('../../../src/dungeon/workbench/application.js');
const { WORKBENCH_SCHEMA_FIELDS, D3_GENERATION_FIELDS, OVERLAY_DEFINITIONS } = await import('../../../src/dungeon/workbench/productionPipeline.js');

beforeEach(()=>{calls.length=0; jest.useFakeTimers(); (globalThis as any).ResizeObserver=class{cb:any; constructor(cb:any){this.cb=cb;} observe(el:any){this.cb([{contentRect:{width:640,height:360}}]);} disconnect(){}}; Object.defineProperty(window,'devicePixelRatio',{value:2,configurable:true});});
afterEach(()=>{jest.useRealTimers(); jest.restoreAllMocks();});
async function mounted(){const root=document.createElement('div'); document.body.replaceChildren(root); const app=new CatacombsWorkbenchApp(); await app.mount(root); return {app,root};}
const control=(root:HTMLElement,path:string)=>root.querySelector(`[data-path="${path}"]`) as HTMLInputElement|HTMLSelectElement;

describe('T1B browser-facing workbench application lifecycle',()=>{
  test('bootstraps controls overlays generation renderer stats inspectors and disposal',async()=>{
    const {app,root}=await mounted();
    expect(root.querySelector('#status')?.textContent).toBe('READY'); expect(calls.map(c=>c[0])).toEqual(expect.arrayContaining(['mount','resize','render']));
    for(const f of [...WORKBENCH_SCHEMA_FIELDS,...D3_GENERATION_FIELDS] as any[]) expect(control(root,f.path)).toBeTruthy();
    expect(root.querySelectorAll('#overlays input[type="checkbox"]').length).toBeGreaterThan(OVERLAY_DEFINITIONS.length);
    (root.querySelector('#tab-Configuration') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('rootSeed');
    (document.getElementById('tab-Renderer statistics') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('drawCalls');
    (document.getElementById('tab-Diagnostic projection') as HTMLButtonElement).click(); (root.querySelector('#filter') as HTMLInputElement).value='checksum'; root.querySelector('#filter')!.dispatchEvent(new Event('input',{bubbles:true})); expect(root.querySelector('#inspector')?.textContent).toContain('checksum');
    app.dispose(); app.dispose(); expect(root.childElementCount).toBe(0); expect(calls.some(c=>c[0]==='dispose')).toBe(true);
  });
  test('canonical controls regenerate and invalid values fail without renderer commit',async()=>{
    const {root}=await mounted(); const renders=calls.filter(c=>c[0]==='render').length;
    const seed=control(root,'rootSeed') as HTMLInputElement; seed.value='98765'; seed.dispatchEvent(new Event('change',{bubbles:true})); jest.advanceTimersByTime(181); await Promise.resolve(); await Promise.resolve(); expect(calls.filter(c=>c[0]==='render').length).toBeGreaterThan(renders);
    const room=control(root,'generation.targetRoomCount') as HTMLInputElement; room.value='999'; room.dispatchEvent(new Event('change',{bubbles:true})); jest.advanceTimersByTime(181); await Promise.resolve(); expect(root.querySelector('#status')?.textContent).toBe('FAILED'); expect(root.querySelector('#error')?.textContent).toContain('Room count must be 12-60');
    room.value='12'; room.dispatchEvent(new Event('change',{bubbles:true})); jest.advanceTimersByTime(181); await Promise.resolve(); await Promise.resolve(); expect(root.querySelector('#status')?.textContent).toBe('READY');
  });
  test('presentation controls and overlays do not regenerate or alter checksum',async()=>{
    const {root}=await mounted(); const before=root.querySelector('#stats')?.textContent; const renderCount=calls.filter(c=>c[0]==='render').length;
    const q=control(root,'renderer.quality') as HTMLSelectElement; q.value='high'; q.dispatchEvent(new Event('change',{bubbles:true}));
    const fade=control(root,'renderer.wallFading') as HTMLInputElement; fade.checked=false; fade.dispatchEvent(new Event('change',{bubbles:true}));
    const overlay=root.querySelector('#overlays input') as HTMLInputElement; overlay.checked=false; overlay.dispatchEvent(new Event('change',{bubbles:true}));
    expect(calls.filter(c=>c[0]==='render').length).toBe(renderCount); expect(calls.map(c=>c[0])).toEqual(expect.arrayContaining(['presentation','overlay'])); expect(root.querySelector('#stats')?.textContent).toContain('presentation only'); expect(before).toContain('checksum:');
  });
  test('export sanitizes filename and import rejects unsafe or oversized payloads',async()=>{
    const {root}=await mounted(); const urls:string[]=[]; (globalThis.URL.createObjectURL as any)=jest.fn(()=>{urls.push('blob:1'); return 'blob:1';}); (globalThis.URL.revokeObjectURL as any)=jest.fn(); const click=jest.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
    (root.querySelector('#export') as HTMLButtonElement).click(); expect(click).toHaveBeenCalled(); expect(URL.createObjectURL).toHaveBeenCalled();
    const made:HTMLInputElement[]=[]; const orig=document.createElement.bind(document); jest.spyOn(document,'createElement').mockImplementation(((tag:string)=>{const n=orig(tag); if(tag==='input') made.push(n as HTMLInputElement); return n;}) as any); (root.querySelector('#import') as HTMLButtonElement).click(); const input=made.at(-1)!; Object.defineProperty(input,'files',{value:[{size:1_000_001,text:async()=>'{ }'}]}); input.dispatchEvent(new Event('change')); await Promise.resolve(); expect(root.querySelector('#error')?.textContent).toContain('exceeds 1 MB');
  });
});

describe('T1B workbench bootstrap boundary',()=>{
  test('reports successful and failed browser bootstrap without leaking stacks',async()=>{
    const main=await import('../../../src/dungeon/workbench/main.js');
    const root=document.createElement('div');
    await expect(main.bootstrapWorkbench(root,{mount:async(r:HTMLElement)=>{r.textContent='ok';}} as any)).resolves.toMatchObject({ok:true});
    await expect(main.bootstrapWorkbench(root,{mount:async()=>{throw new Error('no webgl');}} as any)).resolves.toMatchObject({ok:false});
    expect(root.textContent).toBe('Workbench failed to start: no webgl');
  });
});

describe('T1B additional workbench behavior branches',()=>{
  test('random, replay, compare, enum controls, no-current inspector, and import validation branches are deterministic',async()=>{
    const {app,root}=await mounted(); const rand=jest.spyOn(Math,'random').mockReturnValue(.123456); const renders= calls.filter(c=>c[0]==='render').length;
    (root.querySelector('#random') as HTMLButtonElement).click(); await Promise.resolve(); expect((control(root,'rootSeed') as HTMLInputElement).value).toBe('123456000'); expect(calls.filter(c=>c[0]==='render').length).toBeGreaterThan(renders); rand.mockRestore();
    (root.querySelector('#replay') as HTMLButtonElement).click(); await Promise.resolve(); expect(root.querySelector('#stats')?.textContent).toContain('presentation only');
    (root.querySelector('#compare') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('comparison');
    const game=control(root,'gameType') as HTMLSelectElement; game.value='speed_run'; game.dispatchEvent(new Event('change',{bubbles:true})); jest.advanceTimersByTime(181); await Promise.resolve(); await Promise.resolve(); expect(root.querySelector('#status')?.textContent).toBe('READY');
    const env=control(root,'environmentId') as HTMLSelectElement; env.value=''; env.dispatchEvent(new Event('change',{bubbles:true})); jest.advanceTimersByTime(181); await Promise.resolve(); expect(root.querySelector('#error')?.textContent).toContain('Only Catacombs');
    (app as any).current=undefined; (document.getElementById('tab-Assets') as HTMLButtonElement).click(); expect(root.querySelector('#inspector')?.textContent).toContain('No dungeon');
    expect(root.querySelector('#error')?.textContent).toContain('Only Catacombs');
  });
});

describe('T1B workbench validation and safe helpers',()=>{
  test('validation, state transitions, and support-safe failures cover alternate branches',async()=>{
    const {app,root}=await mounted();
    expect((app as any).validate({environmentId:'catacombs',rootSeed:'1'},{targetRoomCount:12})).toEqual([]);
    expect((app as any).validate({environmentId:'catacombs',rootSeed:'not-a-number'},{targetRoomCount:12})).toContain('Seed must be a canonical unsigned integer.');
    expect((app as any).validate({environmentId:'garden_maze',rootSeed:''},{targetRoomCount:99})).toEqual(expect.arrayContaining(['Only Catacombs is active.','Seed is required.','Room count must be 12-60.']));
    (app as any).setState('LOADING'); expect(root.querySelector('#status')?.textContent).toBe('LOADING');
    (app as any).fail('support-safe error'); expect(root.querySelector('#error')?.textContent).toBe('support-safe error');
    (app as any).current=undefined; await (app as any).replay(); expect(root.querySelector('#error')?.textContent).toBe('support-safe error');
    expect((app as any).fingerprint({a:1})).toMatch(/^fnv1a-/);
  });
});
