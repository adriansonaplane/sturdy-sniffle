import { readFileSync } from 'node:fs';
const corpus = JSON.parse(readFileSync(new URL('./t1.seed-corpus.json', import.meta.url),'utf8')) as {seed:string;reason:string;difficulty:string;players:number;expectedInvariants:string[]}[];
import { generateCatacombs } from '../../../src/dungeon/generationPipeline.js';
import { config } from '../fixtures/config.js';

describe('T1 versioned regression seed corpus',()=>{
  for(const entry of corpus){
    test(`${entry.seed}: ${entry.reason}`,()=>{
      const r=generateCatacombs({config:config(entry.seed,{difficulty:entry.difficulty as any, authorizedPlayerCount:entry.players})});
      expect(r.ok).toBe(true); if(!r.ok)return;
      expect(r.routedLayout.metrics.successfullyRoutedEdges).toBe(r.routedLayout.metrics.graphEdgesRequiringRoutes);
      expect(r.routedLayout.metrics.finalConnectedComponents).toBe(1);
      expect(r.gameplay.snapshot.playerStarts.length).toBeGreaterThanOrEqual(entry.players);
      for(const invariant of entry.expectedInvariants) expect(invariant).toBeTruthy();
    });
  }
});
