import { writeFileSync, mkdirSync } from 'node:fs';
import { generateCatacombs } from '../../../src/dungeon/generationPipeline.js';
import { configForSeed, makeReplayRecord, checksumResult } from '../t1c/replay.js';
import { assertStructuredFailure, assertSuccessInvariants } from '../t1c/invariantChecks.js';
import { selectShardSeeds, T1_LEVELS, type T1PropertyLevel } from '../t1c/seedModel.js';
const level=(process.env.T1_PROPERTY_LEVEL as T1PropertyLevel)||'pr';
const shard=Number(process.env.T1_PROPERTY_SHARD??0), shards=Number(process.env.T1_PROPERTY_SHARDS??T1_LEVELS[level].shards);
const cases=selectShardSeeds(level, shard, shards);
const artifactDir=process.env.T1_ARTIFACT_DIR??'artifacts/t1/property';
describe(`T1C ${level} property seed suite shard ${shard}/${shards}`,()=>{
 test('deterministic seed tier satisfies production invariants with replay records',async()=>{
  mkdirSync(artifactDir,{recursive:true}); const results=[] as unknown[];
  for(const c of cases){ const expectedFailure=c.caseIndex%6===5; const cfg=expectedFailure?configForSeed(c.seed,{authorizedPlayerCount:99 as never}):configForSeed(c.seed, c.caseIndex%5===1?{difficulty:'hard'}:c.caseIndex%5===2?{difficulty:'expert',authorizedPlayerCount:6}:c.caseIndex%5===3?{difficulty:'nightmare',authorizedPlayerCount:8}:{}); try{ if(expectedFailure){ const code=await assertStructuredFailure(c.seed); results.push({...c,status:'passed',expectedResult:'failure',failureCode:code}); continue; } const inv=await assertSuccessInvariants(c.seed,cfg); results.push({...c,status:'passed',expectedResult:'success',checksum:inv.checksum,invariants:inv.invariants}); }catch(e){ const r=generateCatacombs(expectedFailure?{config:cfg,generation:{exactRoomCount:1,minimumRoomCount:12,maximumRoomCount:26}}:{config:cfg}); const record=makeReplayRecord({...c,canonicalConfiguration:cfg,...(expectedFailure?{generationOverrides:{exactRoomCount:1,minimumRoomCount:12,maximumRoomCount:26}}:{}),expectedResult:expectedFailure?'failure':'success',...(expectedFailure?{expectedFailureCode:'CORE_GENERATION_FAILED'}:{}),expectedInvariant:expectedFailure?'structured-failure':'success-invariants',actualResult:r.ok?'success':r.failure.code,...(r.ok?{canonicalChecksum:checksumResult(r)}:{})}); const path=`${artifactDir}/replay-${level}-${shard}-${c.caseIndex}.json`; writeFileSync(path,JSON.stringify(record,null,2)); throw new Error(`T1 property failure replayRecord=${path} record=${JSON.stringify(record)} cause=${e instanceof Error?e.message:String(e)}`); }}
  const shardResult={suiteId:T1_LEVELS[level].suiteId,level,seedSetVersion:cases[0]?.seedSetVersion,shardIndex:shard,shardCount:shards,expectedCaseCount:cases.length,completed:true,results}; writeFileSync(`${artifactDir}/shard-${level}-${shard}-of-${shards}.json`,JSON.stringify(shardResult,null,2)); expect(results).toHaveLength(cases.length);
 },T1_LEVELS[level].timeoutMs);
});
