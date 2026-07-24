import { createHash } from 'node:crypto';
export type AssetRandomSubstream='geometry'|'materials'|'morphology'|'rig'|'animation'|'physics'|'lod'|'presentation';
export const ASSET_RANDOM_DERIVATION_VERSION='asset-forge-rng-v1';
export function normalizeSeed(seed:string):string{return createHash('sha256').update(String(seed).normalize('NFC')).digest('hex');}
function hash64(s:string):bigint{return BigInt('0x'+createHash('sha256').update(s).digest('hex').slice(0,16));}
class Rng{#s:bigint;constructor(seed:string){this.#s=hash64(seed)||1n;}next(){this.#s^=this.#s<<13n;this.#s^=this.#s>>7n;this.#s^=this.#s<<17n;return Number(this.#s&((1n<<53n)-1n))/Number(1n<<53n);}int(max:number){return Math.floor(this.next()*max);}}
export class DeterministicRandomContext{readonly rootSeed:string;#streams=new Map<string,Rng>();constructor(seed:string,readonly identity:string){this.rootSeed=normalizeSeed(seed);}stream(name:AssetRandomSubstream){const key=`${ASSET_RANDOM_DERIVATION_VERSION}:${this.rootSeed}:${this.identity}:${name}`;let r=this.#streams.get(key);if(!r){r=new Rng(key);this.#streams.set(key,r);}return r;}next(name:AssetRandomSubstream){return this.stream(name).next();}evidence(){return{version:ASSET_RANDOM_DERIVATION_VERSION,rootSeed:this.rootSeed,substreams:['geometry','materials','morphology','rig','animation','physics','lod','presentation'] as const};}}
