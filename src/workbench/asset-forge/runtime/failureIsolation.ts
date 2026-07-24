import{diagnostic,type AssetForgeDiagnostic}from'../core/diagnostics.js';
export function safeDiagnostic(summary:string,affectedId?:string):AssetForgeDiagnostic{return diagnostic('AF_SCHEMA_VIOLATION',summary.replace(/(?:[A-Za-z]:)?\/[\w./-]+/g,'[path]').slice(0,120),'serialization',affectedId);}
export function isolateFailure(e:unknown,stage:string):AssetForgeDiagnostic{const m=e instanceof Error?e.message:String(e);return safeDiagnostic(`${stage}: ${m}`);}
