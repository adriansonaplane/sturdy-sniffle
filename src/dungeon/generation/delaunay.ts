import Delaunator from 'delaunator';
import type { GridBounds, SpatialCandidateEdge, SpatialCandidateGraph, SpatialConfig } from '../spatialEmbedding.js';

export interface DelaunayPoint { readonly id: string; readonly x: number; readonly y: number }
export interface DelaunayBuildResult extends SpatialCandidateGraph { readonly degeneracyRecovered: boolean }

function key(a:string,b:string){return a<b?`${a}\u0000${b}`:`${b}\u0000${a}`;}
function edgeId(a:string,b:string){const [x,y]=a<b?[a,b]:[b,a]; return `edge.spatial.${x}.${y}`;}
function collinear(points:readonly DelaunayPoint[]){if(points.length<3)return false; const a=points[0]!, b=points[1]!; for(let i=2;i<points.length;i++){const c=points[i]!; if(Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))>1e-9)return false;} return true;}

export function buildDelaunayCandidateGraph(pointsInput:readonly DelaunayPoint[], cfg:Pick<SpatialConfig,'maximumCandidateEdgeDistance'>):DelaunayBuildResult{
  const points=[...pointsInput].sort((a,b)=>a.id.localeCompare(b.id));
  const edges=new Map<string,SpatialCandidateEdge>();
  const add=(i:number,j:number,fallback:boolean)=>{if(i===j)return; const pa=points[i]!, pb=points[j]!; const [a,b]=pa.id<pb.id?[pa,pb]:[pb,pa]; const dx=a.x-b.x, dy=a.y-b.y, eu=Math.hypot(dx,dy), man=Math.abs(dx)+Math.abs(dy); if(!fallback&&eu>cfg.maximumCandidateEdgeDistance)return; const id=edgeId(a.id,b.id); edges.set(key(a.id,b.id),{id,a:a.id,b:b.id,euclideanDistance:+eu.toFixed(3),manhattanDistance:+man.toFixed(3),estimatedOrthogonalRouteDistance:+man.toFixed(3),fallback,selectedInMst:false,weight:+(eu+man*.25).toFixed(3)});};
  const unique=new Map<string,number>(); let duplicate=false; points.forEach((p,i)=>{const k=`${p.x},${p.y}`; if(unique.has(k)) duplicate=true; else unique.set(k,i);});
  let degeneracyRecovered=duplicate||collinear(points);
  if(points.length===2)add(0,1,false);
  else if(points.length>2&&!degeneracyRecovered){
    const coords=points.flatMap(p=>[p.x,p.y]);
    const tri=new Delaunator(coords);
    for(let t=0;t<tri.triangles.length;t+=3){const a=tri.triangles[t]!,b=tri.triangles[t+1]!,c=tri.triangles[t+2]!; add(a,b,false); add(b,c,false); add(c,a,false);}
    if(edges.size===0)degeneracyRecovered=true;
  }
  if(degeneracyRecovered){
    const uniq=[...unique.values()].sort((a,b)=>points[a]!.x-points[b]!.x||points[a]!.y-points[b]!.y||points[a]!.id.localeCompare(points[b]!.id));
    for(let i=1;i<uniq.length;i++)add(uniq[i-1]!,uniq[i]!,true);
  }
  const parent=new Map(points.map(p=>[p.id,p.id])); const find=(x:string):string=>{const p=parent.get(x)!; if(p===x)return x; const r=find(p); parent.set(x,r); return r;}; const union=(a:string,b:string)=>{const ra=find(a),rb=find(b); if(ra!==rb)parent.set(ra,rb);};
  for(const e of edges.values())union(e.a,e.b);
  while(points.length&&new Set(points.map(p=>find(p.id))).size>1){let best:{i:number;j:number;d:number}|undefined; for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(find(points[i]!.id)!==find(points[j]!.id)){const d=Math.hypot(points[i]!.x-points[j]!.x,points[i]!.y-points[j]!.y); if(!best||d<best.d||d===best.d&&key(points[i]!.id,points[j]!.id)<key(points[best.i]!.id,points[best.j]!.id))best={i,j,d};} if(!best)break; add(best.i,best.j,true); union(points[best.i]!.id,points[best.j]!.id); degeneracyRecovered=true;}
  const out=[...edges.values()].sort((a,b)=>a.weight-b.weight||a.id.localeCompare(b.id));
  return {nodes:points.map(p=>p.id),edges:out,delaunayEdgeCount:out.filter(e=>!e.fallback).length,fallbackEdgeCount:out.filter(e=>e.fallback).length,componentCount:new Set(points.map(p=>find(p.id))).size,degeneracyRecovered};
}
export type { GridBounds };
