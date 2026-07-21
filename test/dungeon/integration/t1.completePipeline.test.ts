import { generateCatacombs } from '../../../src/dungeon/generationPipeline.js';
import { config } from '../fixtures/config.js';
import { stableCore, floodFill } from '../helpers/invariants.js';

describe('T1 complete Catacombs pipeline',()=>{
  test('complete generation is deterministic and renderer-facing contract excludes diagnostics/authority',()=>{
    const a=generateCatacombs({config:config('complete')}); const b=generateCatacombs({config:config('complete')});
    expect(a.ok).toBe(true); expect(b.ok).toBe(true); expect(stableCore(a)).toBe(stableCore(b)); if(!a.ok)return;
    const text=JSON.stringify(a.renderInput);
    expect(text).not.toContain('GenerationDiagnostics'); expect(text).not.toContain('ResolvedDungeon'); expect(text).not.toContain('privateKey'); expect(text).not.toContain('rewardClaimState');
    expect(a.routedLayout.corridors.length).toBe(a.routedLayout.metrics.graphEdgesRequiringRoutes);
    expect(a.construction.records.length).toBeGreaterThan(0);
    expect(a.gameplay.snapshot.playerStarts).toHaveLength(8);
  });
  test('independent flood fill reaches every room/corridor traversal cell in final raster',()=>{
    const r=generateCatacombs({config:config('nav')}); expect(r.ok).toBe(true); if(!r.ok)return;
    const passable=new Set<string>();
    for(let y=0;y<r.routedLayout.navigation.height;y++) for(let x=0;x<r.routedLayout.navigation.width;x++){
      const idx=y*r.routedLayout.navigation.width+x; if(r.routedLayout.navigation.finalMask[idx]) passable.add(`${x},${y}`);
    }
    expect(passable.size).toBeGreaterThan(0);
    const seen=floodFill([...passable][0]!,passable);
    expect(seen.size).toBe(passable.size);
  });
});
