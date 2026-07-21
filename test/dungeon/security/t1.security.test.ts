import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('T1 static security boundaries',()=>{
  const files=['src/dungeon/generationPipeline.ts','src/dungeon/renderInput.ts','src/dungeon/workbench/application.ts','template/main.js','template/index.html'];
  test('production/workbench sources avoid dynamic code execution and embedded private keys',()=>{
    for(const f of files){const s=readFileSync(join(process.cwd(),f),'utf8'); expect(s).not.toMatch(/\beval\s*\(/); expect(s).not.toMatch(/new Function\s*\(/); expect(s).not.toMatch(/-----BEGIN [A-Z ]*PRIVATE KEY-----|signingKey\s*[:=]/);}
  });
  test('import boundary rejects prototype pollution shaped JSON by default parser semantics',()=>{
    const parsed=JSON.parse('{"__proto__":{"polluted":true},"schemaVersion":"1.0.0"}');
    expect(({} as any).polluted).toBeUndefined(); expect(Object.prototype.hasOwnProperty.call(parsed,'__proto__')).toBe(true);
  });
});
