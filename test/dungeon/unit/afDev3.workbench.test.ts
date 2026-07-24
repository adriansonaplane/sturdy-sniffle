import { createAssetGeneratorCatalog, createDefaultAssetForgeWorkbenchProject, createRegisteredAssetGeneratorRegistry, resolveExactGenerator, buildAuthoringSchema, applyStructuredField, parseAndAdmitRecipeJson, normalizeWorkbenchSeed, AssetWorkbenchController, diffRevisions, catacombsCompatibilityViews, exportWorkbench } from '../../../src/workbench/asset-forge/workbench.js';

test('AF-DEV3 generator catalog is deterministic and exact versions fail closed', () => {
  const first = createAssetGeneratorCatalog().map(g => `${g.id}@${g.version}`);
  const second = createAssetGeneratorCatalog().map(g => `${g.id}@${g.version}`);
  expect(first).toEqual(second);
  expect(first).toContain('af.generator.catacombs@1.0.0');
  expect(resolveExactGenerator(createRegisteredAssetGeneratorRegistry(), 'af.generator.catacombs', '9.9.9').ok).toBe(false);
});

test('AF-DEV3 structured authoring validates numeric fields and JSON admission rejects unsafe input', () => {
  const project = createDefaultAssetForgeWorkbenchProject();
  const size = buildAuthoringSchema(project.recipeDraft).groups.flatMap(g => g.fields).find(f => f.path === '/parameters/size')!;
  expect(applyStructuredField(project.recipeDraft, size, 2).ok).toBe(true);
  expect(applyStructuredField(project.recipeDraft, size, Number.POSITIVE_INFINITY).ok).toBe(false);
  expect(applyStructuredField(project.recipeDraft, size, 99).ok).toBe(false);
  expect(parseAndAdmitRecipeJson('{"__proto__":{"polluted":true}}', project.recipeDraft).ok).toBe(false);
  expect(parseAndAdmitRecipeJson(JSON.stringify({ ...project.recipeDraft, references: [{ id:'x', kind:'TEXTURE', uri:'https://example.invalid/a.png' }] }), project.recipeDraft).ok).toBe(false);
  expect(normalizeWorkbenchSeed('  Hero Seed 01  ')).toBe('hero.seed.01');
});

test('AF-DEV3 generation readiness, digest determinism, exports, diffs, and Catacombs bindings work', async () => {
  const controller = new AssetWorkbenchController();
  await controller.generate();
  expect(controller.state.status).toBe('SUCCEEDED');
  expect(controller.state.readiness).toBe('CANDIDATE_READY');
  const digest = controller.state.result!.integrity.digest;
  const again = new AssetWorkbenchController(controller.state.project);
  await again.generate();
  expect(again.state.result!.integrity.digest).toBe(digest);
  controller.dispatch({ type:'SET_UI', ui:{ activePanel:'diagnostics' } });
  expect(controller.state.result!.integrity.digest).toBe(digest);
  const exported = exportWorkbench(controller.state.project, { kind:'canonical-recipe' });
  expect(exported).toContain('af.generator.catacombs');
  expect(exported).not.toContain('activePanel');
  const [a,b] = controller.state.revisions;
  if (a && b) expect(diffRevisions(a,b).changes.map(c => c.path)).toEqual([...diffRevisions(a,b).changes.map(c => c.path)].sort());
  expect(catacombsCompatibilityViews().some(v => v.generatorBinding === 'af.generator.catacombs@1.0.0')).toBe(true);
});
