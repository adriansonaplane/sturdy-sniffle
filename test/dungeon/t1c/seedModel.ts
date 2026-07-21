export const T1_SEED_SET_VERSION = 't1c-seeds-v1';
export const T1_GENERATOR_VERSION = 't1-test';
export const T1_SCHEMA_VERSION = '1.0.0';
export type T1PropertyLevel = 'pr'|'nightly'|'release';
export interface T1CaseSeed { readonly suiteId:string; readonly seedSetVersion:string; readonly seed:number; readonly shardIndex:number; readonly shardCount:number; readonly caseIndex:number; }
export const T1_LEVELS: Record<T1PropertyLevel,{suiteId:string;caseCount:number;timeoutMs:number;caseTimeoutMs:number;baseSeed:number;shards:number}> = {
  pr:{suiteId:'t1.property.pr',caseCount:6,timeoutMs:120000,caseTimeoutMs:5000,baseSeed:0x51c0ffee,shards:1},
  nightly:{suiteId:'t1.property.nightly',caseCount:24,timeoutMs:600000,caseTimeoutMs:7500,baseSeed:0x91a7c10d,shards:4},
  release:{suiteId:'t1.property.release',caseCount:40,timeoutMs:900000,caseTimeoutMs:10000,baseSeed:0x7e1ea5ed,shards:8}
};
export function normalizeT1Seed(seed:unknown):number{ if(typeof seed!=='number'||!Number.isInteger(seed)||seed<0||seed>0xffffffff) throw new Error(`noncanonical seed: ${String(seed)}`); return seed>>>0; }
function mix32(x:number){ x>>>=0; x^=x>>>16; x=Math.imul(x,0x7feb352d)>>>0; x^=x>>>15; x=Math.imul(x,0x846ca68b)>>>0; x^=x>>>16; return x>>>0; }
function suiteHash(s:string){ let h=2166136261; for(const ch of s){h^=ch.charCodeAt(0); h=Math.imul(h,16777619)>>>0;} return h>>>0; }
export function seedForCase(suiteId:string, seedSetVersion:string, caseIndex:number, baseSeed:number){ if(!Number.isInteger(caseIndex)||caseIndex<0) throw new Error('invalid case index'); return normalizeT1Seed(mix32((normalizeT1Seed(baseSeed)^suiteHash(suiteId)^suiteHash(seedSetVersion)^caseIndex)>>>0)); }
export function shardCaseIndices(totalCases:number, shardIndex:number, shardCount:number):number[]{ if(!Number.isInteger(totalCases)||totalCases<0) throw new Error('invalid total cases'); if(!Number.isInteger(shardCount)||shardCount<1) throw new Error('invalid shard count'); if(!Number.isInteger(shardIndex)||shardIndex<0||shardIndex>=shardCount) throw new Error('invalid shard index'); const out:number[]=[]; for(let i=0;i<totalCases;i++) if(i%shardCount===shardIndex) out.push(i); return out; }
export function selectShardSeeds(level:T1PropertyLevel, shardIndex=0, shardCount=T1_LEVELS[level].shards):T1CaseSeed[]{ const p=T1_LEVELS[level]; return shardCaseIndices(p.caseCount,shardIndex,shardCount).map(caseIndex=>({suiteId:p.suiteId,seedSetVersion:T1_SEED_SET_VERSION,seed:seedForCase(p.suiteId,T1_SEED_SET_VERSION,caseIndex,p.baseSeed),shardIndex,shardCount,caseIndex})); }
