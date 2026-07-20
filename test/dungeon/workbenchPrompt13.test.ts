import * as fs from 'node:fs';
import * as path from 'node:path';
import { DEFAULT_DUNGEON_CONFIG, WORKBENCH_ENVIRONMENTS, WORKBENCH_SCHEMA_FIELDS, OVERLAY_DEFINITIONS, generateProductionCatacombsDungeon, assetRegistryForWorkbench } from '../../src/dungeon/workbench/productionPipeline.js';
import { BUILD_ANIMATION_STAGES, buildSceneRecords } from '../../src/dungeon/workbench/sceneBuilder.js';
import { checksumResolvedDungeon } from '../../src/dungeon/index.js';

describe('Prompt 13 diagnostic workbench integration', () => {
  test('invokes production Catacombs modules and exposes renderer-independent resolved records', async () => {
    const dungeon = await generateProductionCatacombsDungeon({ ...DEFAULT_DUNGEON_CONFIG, rootSeed: '13', gameType: 'hunt', difficulty: 'normal' });
    expect(dungeon.config.environmentId).toBe('catacombs');
    expect(dungeon.roomGraph.nodes.length).toBeGreaterThan(10);
    expect(dungeon.rooms).toHaveLength(dungeon.roomGraph.nodes.length);
    expect(dungeon.constructionPlacements.length).toBeGreaterThan(0);
    expect(dungeon.gameplayPlacements.some(p => p.kind === 'boss')).toBe(true);
    expect(await checksumResolvedDungeon({ ...dungeon, uiState: { overlay: 'everything' }, cameraState: { x: 1 } })).toBe(dungeon.canonicalChecksum);
  });

  test('environment selector has Catacombs active and only planned future environments', () => {
    expect(WORKBENCH_ENVIRONMENTS.map(e => e.id)).toEqual(['catacombs', 'garden_maze', 'dark_tower', 'hells_canyon']);
    expect(WORKBENCH_ENVIRONMENTS.find(e => e.id === 'catacombs')?.disabled).toBe(false);
    expect(WORKBENCH_ENVIRONMENTS.filter(e => e.id !== 'catacombs').every(e => e.disabled && e.status === 'planned')).toBe(true);
    const html = fs.readFileSync(path.join(process.cwd(), 'dungeon-generator-workbench.html'), 'utf8');
    expect(html).not.toMatch(/ancient|molten|frost|grim|verdant/);
    expect(html).not.toMatch(/Generic Hell|>Hell</);
  });

  test('schema controls, overlays, animation, and scene mappings are generated from production records', async () => {
    expect(WORKBENCH_SCHEMA_FIELDS.some(f => f.path === 'rootSeed' && f.canonical)).toBe(true);
    expect(WORKBENCH_SCHEMA_FIELDS.some(f => f.path === 'renderer.quality' && !f.canonical)).toBe(true);
    expect(OVERLAY_DEFINITIONS.map(o => o.category)).toEqual(expect.arrayContaining(['Graph', 'Spatial', 'Gameplay', 'Assets', 'Authorization']));
    expect(BUILD_ANIMATION_STAGES).toEqual(['Rooms scatter','Rooms separate','Graph resolves','Floors flood outward','Walls rise','Structural elements appear','Props pop','Gameplay overlays appear']);
    const dungeon = await generateProductionCatacombsDungeon({ ...DEFAULT_DUNGEON_CONFIG, rootSeed: '14' });
    const scene = buildSceneRecords(dungeon, { quality: 'high', animateBuild: true, overlayIds: ['primary_trunk'], runtimeLod: 'lod0' });
    expect(scene.rendererBoundary).toBe('threejs-presentation-only');
    expect(scene.objects.some(o => o.sourceKind === 'construction' && o.sourceRecordId)).toBe(true);
    expect(scene.canonicalChecksum).toBe(dungeon.canonicalChecksum);
    expect(await checksumResolvedDungeon(dungeon)).toBe(dungeon.canonicalChecksum);
  });

  test('single-file distributable and static boundaries are enforced', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'dungeon-generator-workbench.html'), 'utf8');
    expect(html).toContain('prompt13-workbench-1.0.0');
    expect(html).toContain('Local generation is diagnostic and unauthorized');
    expect(html).toContain('No production signing keys or reward authority');
    expect(assetRegistryForWorkbench().assets.length).toBeGreaterThan(0);
    for (const file of ['src/dungeon/graph.ts','src/dungeon/roomAssignment.ts','src/dungeon/spatialEmbedding.ts','src/dungeon/catacombsRouting.ts','src/dungeon/construction.ts','src/dungeon/gameplay.ts']) {
      const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
      expect(source).not.toMatch(/from ['"]three|document\.|window\.|GLTFLoader|workbench\/sceneBuilder/);
    }
    expect(html).not.toMatch(/PRIVATE KEY|BEGIN RSA|BEGIN EC|rewardAuthority|authorizeCompletion/);
  });
});
