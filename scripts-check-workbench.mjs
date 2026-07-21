import { readFileSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const before = readFileSync('dungeon-generator-workbench.html', 'utf8');
const run = spawnSync(process.execPath, ['scripts-build-workbench.mjs'], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);
const after = readFileSync('dungeon-generator-workbench.html', 'utf8');
if (before !== after) {
  console.error('dungeon-generator-workbench.html was stale; rerun npm run build:workbench and commit the regenerated file.');
  process.exit(1);
}
const html = after;
const checks = [
  ['production generateCatacombs entry reference', /generateCatacombs/],
  ['DungeonRenderInput contract reference', /DungeonRenderInput|catacombs\.render_input\.d2\.v1/],
  ['Three.js WebGLRenderer bundled', /WebGLRenderer/],
  ['Catacombs active and planned environments disabled', /Catacombs[^<]+Active|garden_maze|Garden Maze/],
  ['no fixed 12-room synthesis', text => !/function\s+synthesize|Array\.from\(\{\s*length\s*:\s*12\s*\}|Rooms\s+12/.test(text)],
  ['no Canvas 2D main renderer', text => !/strokeRect|fillRect|CanvasRenderingContext2D/.test(text)],
  ['no private keys', text => !/PRIVATE KEY|privateKey\s*[:=]|signingKey\s*[:=]/.test(text)],
  ['no eval/new Function', text => !/\beval\s*\(|new Function\s*\(/.test(text)]
];
for (const [label, matcher] of checks) {
  const ok = typeof matcher === 'function' ? matcher(html) : matcher.test(html);
  if (!ok) { console.error(`workbench check failed: ${label}`); process.exit(1); }
}
console.log('workbench distributable is current and passes D3 static checks.');
