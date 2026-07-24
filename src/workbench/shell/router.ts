import type { ResolvedWorkbenchRoute, WorkspaceId } from '../shared/workspaceContracts.js';
export interface RouteEntry { readonly path:string; readonly workspaceId:WorkspaceId; readonly title:string; }
const SAFE_PARAM=/^[\w:.-]{1,80}$/u;
function cleanPath(input:string){ let hash=input.startsWith('#')?input.slice(1):input; const q=hash.indexOf('?'); if(q>=0)hash=hash.slice(0,q); try{hash=decodeURI(hash);}catch{} hash=`/${hash.replace(/^\/+/, '')}`.toLowerCase(); hash=hash.replace(/\/+/g,'/').replace(/\/$/,'')||'/dungeon-generator'; return hash; }
function parseQuery(input:string){ const out:Record<string,string>={}; const q=input.indexOf('?'); if(q<0)return out; const usp=new URLSearchParams(input.slice(q+1, q+401)); for(const [k,v] of usp){ if(SAFE_PARAM.test(k)&&SAFE_PARAM.test(v))out[k]=v; } return out; }
export class WorkbenchRouter { #routes: RouteEntry[]; constructor(routes:readonly RouteEntry[]){ this.#routes=[...routes].sort((a,b)=>a.path.localeCompare(b.path)); }
resolve(hash:string):ResolvedWorkbenchRoute{ const path=cleanPath(hash||'#/dungeon-generator'); const match=this.#routes.find(r=>r.path===path); const query=parseQuery(hash); if(match)return{path,canonicalHash:`#${path}`,workspaceId:match.workspaceId,title:match.title,params:{},query}; return{path:'/dungeon-generator',canonicalHash:'#/dungeon-generator',workspaceId:'dungeon-generator',title:'Dungeon Generator',params:{unknownRoute:path.slice(0,120)},query,unknown:true}; }
navigate(hash:string){ const r=this.resolve(hash); if(globalThis.location.hash!==r.canonicalHash) globalThis.location.hash=r.canonicalHash; }
}
