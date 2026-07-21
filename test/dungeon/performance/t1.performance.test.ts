import { performance } from 'node:perf_hooks';
import { generateCatacombsCore } from '../../../src/dungeon/generation/index.js';
import { generateCatacombs as complete } from '../../../src/dungeon/generationPipeline.js';
import { config } from '../fixtures/config.js';
import { sampleStats } from '../helpers/invariants.js';

describe('T1 performance smoke budgets',()=>{
  test('core and complete generation stay within nonflaky smoke budgets',()=>{
    const core:number[]=[], full:number[]=[];
    for(let i=0;i<3;i++) generateCatacombsCore({config:config(`warm-${i}`)});
    for(let i=0;i<10;i++){let t=performance.now(); const c=generateCatacombsCore({config:config(`perf-c-${i}`)}); core.push(performance.now()-t); expect(c.ok).toBe(true); t=performance.now(); const f=complete({config:config(`perf-f-${i}`)}); full.push(performance.now()-t); expect(f.ok).toBe(true);}
    const cs=sampleStats(core), fs=sampleStats(full);
    expect(cs.p95).toBeLessThan(1500); expect(fs.p95).toBeLessThan(3000);
    console.info('T1 perf smoke', {core:cs,complete:fs});
  },30000);
});
