import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { execFileSync } from 'node:child_process';

const md = execFileSync('git', ['ls-files', '-z', '*.md']).toString('utf8').split('\0').filter(Boolean);
const pkg = JSON.parse(readFileSync('package.json','utf8'));
const scripts = new Set(Object.keys(pkg.scripts ?? {}));
const failures = [];
const staleRuntime = /Node\.js\s+22|node-version:\s*22|node:22|22\.19\.0|npm\s+10\./i;
const absPath = /(?:^|[\s(`])\/(?:Users|home|workspace|tmp|var\/folders)\//;
const linkRe = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const scriptRe = /`npm run ([^`\s]+)(?:\s|`)/g;
function slug(h){return h.trim().toLowerCase().replace(/[`*_[\]().,:]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');}
for (const file of md) {
  const text = readFileSync(file,'utf8');
  if (staleRuntime.test(text) && !/historical/i.test(text)) failures.push(`${file}: stale runtime reference`);
  if (absPath.test(text) && !/historical/i.test(text.slice(0,500))) failures.push(`${file}: absolute developer-machine path`);
  for (const m of text.matchAll(scriptRe)) if (!scripts.has(m[1])) failures.push(`${file}: unknown package script ${m[1]}`);
  const headings = new Set([...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m=>slug(m[1])));
  for (const m of text.matchAll(linkRe)) {
    const raw = m[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const [pathPart, anchor] = raw.split('#');
    if (!pathPart) continue;
    const target = normalize(join(dirname(file), decodeURIComponent(pathPart)));
    if (!existsSync(target)) { failures.push(`${file}: missing link target ${raw}`); continue; }
    if (anchor && statSync(target).isFile() && target.endsWith('.md')) {
      const t = readFileSync(target,'utf8');
      const hs = new Set([...t.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m=>slug(m[1])));
      if (!hs.has(anchor.toLowerCase())) failures.push(`${file}: missing heading anchor ${raw}`);
    }
  }
}
if (!existsSync('dungeon-generator-workbench.html')) failures.push('missing generated workbench dungeon-generator-workbench.html');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Documentation check passed (${md.length} Markdown files).`);
