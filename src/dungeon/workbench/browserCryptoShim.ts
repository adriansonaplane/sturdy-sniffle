class DigestBytes extends Uint8Array{
  readUInt32LE(offset:number){return ((this[offset]??0)|((this[offset+1]??0)<<8)|((this[offset+2]??0)<<16)|((this[offset+3]??0)<<24))>>>0;}
}
class HashShim{
  private chunks:string[]=[];
  update(v:unknown){this.chunks.push(typeof v==='string'?v:ArrayBuffer.isView(v)?Array.from(new Uint8Array(v.buffer,v.byteOffset,v.byteLength)).map(x=>String.fromCharCode(x)).join(''):JSON.stringify(v));return this;}
  digest(enc?:'hex'|'base64'){
    let h=2166136261; for(const chunk of this.chunks)for(let i=0;i<chunk.length;i++)h=Math.imul(h^chunk.charCodeAt(i),16777619);
    const bytes=new DigestBytes(32); for(let i=0;i<32;i+=4){h=Math.imul(h^i,16777619)>>>0; bytes[i]=h&255; bytes[i+1]=(h>>>8)&255; bytes[i+2]=(h>>>16)&255; bytes[i+3]=(h>>>24)&255;}
    if(enc==='hex')return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
    if(enc==='base64')return btoa(String.fromCharCode(...bytes));
    return bytes;
  }
}
export function createHash(_algorithm:string){return new HashShim();}
export const webcrypto = globalThis.crypto;
