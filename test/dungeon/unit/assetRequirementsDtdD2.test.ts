import { readFileSync, readdirSync } from 'node:fs';

describe('DTD-D2 asset requirements registry',()=>{
  test('requirements are machine-readable and link prompt files without remote URLs',()=>{const text=readFileSync('orchestration/assets/requirements.yaml','utf8'); const ids=[...text.matchAll(/requirementId: (DTD-D3-CATACOMBS-[A-Z-]+)/g)].map(m=>m[1]); expect(new Set(ids).size).toBe(ids.length); expect(ids.length).toBeGreaterThanOrEqual(14); expect(text).toContain('originatingObjective: DTD-D2'); expect(text).toContain('intendedImplementationObjective: DTD-D3'); expect(text).toMatch(/createdAt: '\d{4}-\d{2}-\d{2}T/); expect(text).not.toMatch(/https?:\/\//); const prompts=readdirSync('orchestration/assets/prompts'); for(const id of ids)expect(prompts).toContain(`${id}.md`);});
});
