class HashShim{private chunks:string[]=[];update(v:unknown){this.chunks.push(typeof v==='string'?v:JSON.stringify(v));return this;}digest(enc:'hex'|'base64'='hex'){let h=2166136261; for(const chunk of this.chunks)for(let i=0;i<chunk.length;i++)h=Math.imul(h^chunk.charCodeAt(i),16777619); const hex=(h>>>0).toString(16).padStart(8,'0').repeat(8); return enc==='hex'?hex:btoa(hex);}}
export function createHash(_algorithm:string){return new HashShim();}
export const webcrypto = globalThis.crypto;
