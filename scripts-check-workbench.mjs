import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const before = readFileSync('dungeon-generator-workbench.html', 'utf8');
const run = spawnSync(process.execPath, ['scripts-build-workbench.mjs'], { stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status ?? 1);
const after = readFileSync('dungeon-generator-workbench.html', 'utf8');
if (before !== after) {
  console.error('dungeon-generator-workbench.html was stale; rerun npm run build:workbench and commit the regenerated file.');
  process.exit(1);
}
console.log('workbench distributable is in sync with the reproducible build script.');
