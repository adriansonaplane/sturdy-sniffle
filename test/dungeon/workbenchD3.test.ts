import { readFileSync } from 'node:fs';
import { generateCatacombs } from '../../src/dungeon/generationPipeline.js';
import { DEFAULT_DUNGEON_CONFIG, D3_GENERATION_FIELDS, OVERLAY_DEFINITIONS, WORKBENCH_ENVIRONMENTS } from '../../src/dungeon/workbench/productionPipeline.js';
import { ThreeDungeonRenderer } from '../../src/dungeon/rendering/index.js';

describe('D3 production workbench integration', () => {
  test('production pipeline produces DungeonRenderInput consumed by renderer contract', () => {
    const result = generateCatacombs({ config: DEFAULT_DUNGEON_CONFIG, generation: { targetRoomCount: 12, exactRoomCount: 12, sizeProfile: 'small' } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.renderInput.rendererContractVersion).toBe('catacombs.render_input.d2.v1');
    expect(result.renderInput.geometry.corridors.length).toBeGreaterThan(0);
    expect(result.renderInput.geometry.boundaries.length).toBeGreaterThan(0);
    expect(result.renderInput.geometry.doorways.length).toBeGreaterThan(0);
    expect(result.renderInput.construction.records.length).toBeGreaterThan(0);
    expect(result.renderInput.gameplayPresentation.placements.length).toBeGreaterThan(0);
    expect(ThreeDungeonRenderer.prototype.render.length).toBe(2);
  });

  test('presentation controls and replay are noncanonical by contract', () => {
    expect(D3_GENERATION_FIELDS.filter(f => String(f.path).startsWith('renderer.')).every(f => f.canonical === false && f.regenerationRequired === false)).toBe(true);
    const first = generateCatacombs({ config: DEFAULT_DUNGEON_CONFIG, generation: { targetRoomCount: 12, exactRoomCount: 12 } });
    const second = generateCatacombs({ config: DEFAULT_DUNGEON_CONFIG, generation: { targetRoomCount: 12, exactRoomCount: 12 } });
    expect(first.ok && second.ok && JSON.stringify(first.renderInput) === JSON.stringify(second.renderInput)).toBe(true);
  });

  test('canonical controls regenerate and planned environments are disabled', () => {
    expect(D3_GENERATION_FIELDS.filter(f => !String(f.path).startsWith('renderer.')).every(f => f.canonical === true && f.regenerationRequired === true)).toBe(true);
    expect(WORKBENCH_ENVIRONMENTS.filter(e => e.id !== 'catacombs').every(e => e.disabled && e.status === 'planned')).toBe(true);
    const a = generateCatacombs({ config: { ...DEFAULT_DUNGEON_CONFIG, rootSeed: '101' }, generation: { targetRoomCount: 12, exactRoomCount: 12 } });
    const b = generateCatacombs({ config: { ...DEFAULT_DUNGEON_CONFIG, rootSeed: '102' }, generation: { targetRoomCount: 12, exactRoomCount: 12 } });
    expect(a.ok && b.ok && JSON.stringify(a.renderInput) !== JSON.stringify(b.renderInput)).toBe(true);
  });

  test('generated HTML is bundled, reproducible-checkable, and rejects old stubs', () => {
    const html = readFileSync('dungeon-generator-workbench.html', 'utf8');
    expect(html).toContain('WebGLRenderer');
    expect(html).toContain('generateCatacombs');
    expect(html).not.toMatch(/function\s+synthesize|Array\.from\(\{\s*length\s*:\s*12\s*\}/);
    expect(html).not.toMatch(/strokeRect|fillRect|PRIVATE KEY|privateKey\s*[:=]/);
  });

  test('every exposed overlay has production-record-adapter metadata', () => {
    expect(OVERLAY_DEFINITIONS.length).toBeGreaterThan(10);
    expect(OVERLAY_DEFINITIONS.every(o => o.implementation === 'production-record-adapter')).toBe(true);
  });
});
