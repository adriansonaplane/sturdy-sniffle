import { generateCatacombs } from '../../../src/dungeon/generationPipeline.js';
import { config } from '../fixtures/config.js';

describe('T1 PR property seed suite',()=>{
  test('deterministic seed tier satisfies production invariants with replay hint',()=>{
    const runs=Number(process.env.T1_PROPERTY_SEEDS??100);
    const shard=Number(process.env.T1_PROPERTY_SHARD??0), shards=Number(process.env.T1_PROPERTY_SHARDS??1);
    let executed=0;
    for(let i=0;i<runs;i++){
      if(i%shards!==shard) continue; executed++;
      const seed=`t1-pr-${i}`;
      const r=generateCatacombs({config:config(seed)});
      if(!r.ok) throw new Error(`seed=${seed} stage=${r.failure.stage} code=${r.failure.code} replay=T1_PROPERTY_SEEDS=${i+1} npm run test:property:pr`);
      expect(r.routedLayout.metrics.successfullyRoutedEdges).toBe(r.routedLayout.metrics.graphEdgesRequiringRoutes);
      expect(r.routedLayout.metrics.finalConnectedComponents).toBe(1);
      expect(r.routedLayout.metrics.missingGraphRoutes).toBe(0);
      expect(r.routedLayout.metrics.duplicateRoutes).toBe(0);
      expect(r.gameplay.validation.valid).toBe(true);
    }
    expect(executed).toBeGreaterThanOrEqual(Math.floor(runs/shards));
  },120000);
});
