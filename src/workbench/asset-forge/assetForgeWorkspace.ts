import type { WorkbenchWorkspace, WorkspaceMountContext, WorkspaceActivationContext } from '../shared/workspaceContracts.js';
import { renderAssetForgeNavigation } from './assetForgeNavigation.js';
import { AssetWorkbenchController, buildAuthoringSchema, createAssetGeneratorCatalog, buildHierarchy, buildInspectorSections, computeBudgetSummary, catacombsCompatibilityViews, assetWorkbenchPresetRegistry, parseAndAdmitRecipeJson, exportWorkbench, BrowserAssetPreviewController, resolveExactGenerator, createRegisteredAssetGeneratorRegistry } from './workbench.js';

export class AssetForgeWorkspace implements WorkbenchWorkspace {
  readonly id = 'asset-forge' as const;
  readonly routes = ['asset-forge','asset-forge/catalog','asset-forge/recipe','asset-forge/preview','asset-forge/diagnostics','asset-forge/revisions','asset-forge/catacombs'];
  #root?: HTMLElement;
  #mounted = false;
  #controller = new AssetWorkbenchController();
  #preview?: BrowserAssetPreviewController;

  mount(context: WorkspaceMountContext) { if (this.#mounted) return; this.#mounted = true; this.#root = context.root; this.render(context); }
  activate(context: WorkspaceActivationContext) { this.render(context as WorkspaceMountContext); }
  unmount() { this.#mounted = false; this.#preview?.dispose(); this.#root?.replaceChildren(); }
  dispose() { this.unmount(); }

  private el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; }
  private render(context: WorkspaceMountContext) {
    const root = this.#root ?? context.root;
    const state = this.#controller.state;
    const recipe = state.project.recipeDraft;
    const registry = createRegisteredAssetGeneratorRegistry();
    const exact = resolveExactGenerator(registry, recipe.generator.id, recipe.generator.version);
    const main = this.el('main', undefined, 'asset-forge-workbench');
    main.setAttribute('aria-labelledby','afw-title');

    const title = this.el('h2','Asset Forge Workbench'); title.id='afw-title';
    const bar = this.el('section', undefined, 'asset-forge-commandbar'); bar.setAttribute('aria-label','Asset Forge command bar');
    const status = this.el('p', `Status ${state.status}; readiness ${state.readiness}; generator ${recipe.generator.id}@${recipe.generator.version}; seed ${recipe.seed}`, 'asset-forge-status'); status.setAttribute('role','status');
    const generate = this.el('button','Generate'); generate.type='button'; generate.accessKey='g'; generate.addEventListener('click', async()=>{ await this.#controller.generate(); this.render(context); });
    const cancel = this.el('button','Cancel'); cancel.type='button'; cancel.addEventListener('click',()=>this.#controller.generation.cancel());
    const save = this.el('button','Save draft'); save.type='button'; save.addEventListener('click',()=>{ try{ localStorage.setItem(`af.workbench.project.${state.project.projectId}.v1`, JSON.stringify(state.project)); status.textContent='Draft saved locally.'; }catch{ status.textContent='Storage unavailable or quota exceeded; draft preserved in memory.'; } });
    const copy = this.el('button','Copy recipe JSON'); copy.type='button'; copy.addEventListener('click',()=>void navigator.clipboard?.writeText(exportWorkbench(this.#controller.state.project,{kind:'canonical-recipe'})));
    bar.append(generate,cancel,save,copy,status);

    const grid = this.el('section', undefined, 'asset-forge-grid');
    const catalog = this.panel('Generator catalog', this.catalogPanel());
    const recipePanel = this.panel('Recipe editor', this.recipePanel(context));
    const previewHost = this.el('div', undefined, 'asset-preview-viewport'); previewHost.tabIndex=0; previewHost.setAttribute('role','img'); previewHost.setAttribute('aria-label','Three.js adapter-owned preview viewport with textual inspectors below.');
    if (state.result) { this.#preview?.dispose(); this.#preview = new BrowserAssetPreviewController(previewHost); this.#preview.replace(state.result); }
    else previewHost.append(this.el('p', exact.ok ? 'Generate to preview adapter-owned Three.js objects.' : `Blocking resolution error: ${exact.diagnostic.summary}`));
    const previewPanel = this.panel('Preview', previewHost);
    const hierarchy = this.panel('Hierarchy', this.listPanel(buildHierarchy(state.result).map(n=>`${n.kind}: ${n.label}`), 'Asset hierarchy tree'));
    const inspector = this.panel('Inspector', this.tablePanel(buildInspectorSections(state.project,state.result).flatMap(s=>s.rows.map(r=>[`${s.title} / ${r.label}`, r.value])), 'Inspector rows'));
    const budget = computeBudgetSummary(state.result);
    const diagnostics = this.panel('Diagnostics and validation', this.listPanel([...state.diagnostics.map(d=>`${d.severity} ${d.code}: ${d.summary}`), ...(state.result?.diagnostics??[]).map(d=>`${d.severity??'INFO'} ${d.code}: ${d.summary}`)].slice(0,200), 'Diagnostics'));
    const budgetPanel = this.panel('Budgets', this.tablePanel(Object.keys(budget.utilization).slice(0,18).map(k=>[k, `${(budget.current as any)[k]??0} / ${(budget.limit as any)[k]} (${Math.round((budget.utilization as any)[k]*100)}%)`]), 'Budget summary'));
    const revPanel = this.panel('Revisions', this.listPanel(state.revisions.map(r=>`r${r.revision} ${r.canonicalDigest.slice(0,16)}`), 'Revision history'));
    const catPanel = this.panel('Catacombs compatibility', this.listPanel(catacombsCompatibilityViews().slice(0,40).map(v=>`${v.assetId} ${v.registryFamily} ${v.generatorBinding} ${v.status}`), 'Catacombs asset compatibility'));
    const presets = this.panel('Presets', this.listPanel(assetWorkbenchPresetRegistry.list().map(p=>`${p.presetId} → ${p.generator.id}@${p.generator.version}`), 'Workbench presets'));
    grid.append(catalog, recipePanel, previewPanel, hierarchy, inspector, diagnostics, budgetPanel, revPanel, catPanel, presets);
    main.append(title, renderAssetForgeNavigation(context.route.path), bar, grid);
    root.replaceChildren(main);
  }
  private panel(titleText:string, body:HTMLElement) { const s=this.el('section', undefined, 'workspace-card asset-forge-panel'); const h=this.el('h3',titleText); s.append(h,body); return s; }
  private listPanel(items:readonly string[], label:string) { const ul=this.el('ul'); ul.setAttribute('aria-label',label); if(!items.length) ul.append(this.el('li','No entries.')); for(const item of items){ const li=this.el('li',item); ul.append(li); } return ul; }
  private tablePanel(rows:readonly (readonly [string,string])[], label:string) { const table=this.el('table'); table.setAttribute('aria-label',label); const body=document.createElement('tbody'); for(const [k,v] of rows){ const tr=document.createElement('tr'); const th=this.el('th',k); const td=this.el('td',v); tr.append(th,td); body.append(tr); } table.append(body); return table; }
  private catalogPanel() { const wrap=this.el('div'); const search=this.el('input') as HTMLInputElement; search.type='search'; search.placeholder='Search generators'; search.setAttribute('aria-label','Search generators'); const list=this.el('ul'); const render=(q='')=>{ list.replaceChildren(); for(const g of createAssetGeneratorCatalog().filter(g=>`${g.id} ${g.supportedFamilies.join(' ')}`.includes(q)).slice(0,50)){ const li=this.el('li',`${g.id}@${g.version} — ${g.supportedFamilies.slice(0,6).join(', ')} — ${g.availability}`); list.append(li); } if(!list.childElementCount) list.append(this.el('li','No generators match the active filters.'));}; search.addEventListener('input',()=>render(search.value)); render(); wrap.append(search,list); return wrap; }
  private recipePanel(context:WorkspaceMountContext) { const wrap=this.el('div'); const schema=buildAuthoringSchema(this.#controller.state.project.recipeDraft); for(const group of schema.groups){ const fs=this.el('fieldset'); const legend=this.el('legend',group.label); fs.append(legend); for(const field of group.fields){ const label=this.el('label',`${field.label} (${field.path})`); let input:HTMLInputElement|HTMLSelectElement; if(field.kind==='enum'){ const s=this.el('select') as HTMLSelectElement; for(const v of field.values??[]){ const o=this.el('option',v) as HTMLOptionElement; o.value=v; o.selected=v===field.value; s.append(o);} input=s; } else { const i=this.el('input') as HTMLInputElement; i.value=String(field.value); i.type=field.kind==='number'?'number':'text'; if(field.min!==undefined)i.min=String(field.min); if(field.max!==undefined)i.max=String(field.max); if(field.step!==undefined)i.step=String(field.step); input=i; } input.setAttribute('aria-description',field.description); const apply=this.el('button','Apply'); apply.type='button'; apply.addEventListener('click',()=>{ const value=field.kind==='number'?Number((input as HTMLInputElement).value):input.value; this.#controller.dispatch({type:'SET_FIELD',path:field.path,value:value as any}); this.render(context); }); label.append(input,apply); fs.append(label); } wrap.append(fs); }
    const json = this.el('textarea') as HTMLTextAreaElement; json.value=JSON.stringify(this.#controller.state.project.recipeDraft,null,2); json.rows=10; json.setAttribute('aria-label','Advanced admitted JSON recipe editor'); const applyJson=this.el('button','Apply admitted JSON'); applyJson.type='button'; applyJson.addEventListener('click',()=>{ const admitted=parseAndAdmitRecipeJson(json.value,this.#controller.state.project.recipeDraft); if(admitted.ok){ this.#controller = new AssetWorkbenchController({...this.#controller.state.project,recipeDraft:admitted.recipe,generationRequest:{recipe:admitted.recipe,targetSchemaVersion:admitted.recipe.schemaVersion},recipeRevision:this.#controller.state.project.recipeRevision+1}); } this.render(context); }); wrap.append(json,applyJson); return wrap; }
}
