export type DeepReadonly<T>=T extends object?Readonly<T>:T;
export function deepFreeze<T>(value:T,seen=new WeakSet<object>()):Readonly<T>{ if(value&&typeof value==='object'){const obj=value as object;if(seen.has(obj))return value as Readonly<T>;seen.add(obj);for(const k of Reflect.ownKeys(obj)){deepFreeze((obj as Record<PropertyKey,unknown>)[k],seen);}Object.freeze(obj);}return value as Readonly<T>;}
export function clonePlain<T>(value:T):T{return structuredClone(value);}
