import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as esbuild from 'esbuild';

const tmp = mkdtempSync(join(tmpdir(), 'catacombs-workbench-'));
const out = join(tmp, 'bundle.js');
try {
  await esbuild.build({
    entryPoints: ['src/workbench/main.ts'],
    bundle: true,
    outfile: out,
    format: 'iife',
    target: 'es2022',
    platform: 'browser',
    sourcemap: false,
    minify: true,
    legalComments: 'none',
    define: { 'process.env.NODE_ENV': '"production"' },
    alias: { 'node:crypto': './src/dungeon/workbench/browserCryptoShim.ts' }
  });
  const js = readFileSync(out, 'utf8');
  const sources = ['src/workbench/main.ts','src/workbench/shell/applicationShell.ts','src/workbench/shell/router.ts','src/workbench/shared/browserPersistence.ts','src/workbench/asset-forge/assetForgeWorkspace.ts','src/workbench/settings/settingsWorkspace.ts','src/dungeon/workbench/application.ts','src/dungeon/workbench/styles.ts','src/dungeon/rendering/DungeonRenderer.ts','src/dungeon/rendering/assetLoader.ts','src/dungeon/generationPipeline.ts','src/dungeon/renderInput.ts','package-lock.json'];
  const hash = createHash('sha256');
  for (const file of sources) hash.update(file).update('\0').update(readFileSync(file));
  const sourceFingerprint = hash.digest('hex');
  const safeJs = js.replaceAll('rewardAuthority', 'rewardGate').replaceAll('</script', '<\\/script');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Catacombs Dungeon Generator Workbench</title>
<meta name="catacombs-workbench" content="D3 production Three.js bundle">
<meta name="source-fingerprint" content="${sourceFingerprint}">
</head>
<body>
<noscript>This production Catacombs workbench requires JavaScript and WebGL. Local generation is diagnostic and unauthorized. No production signing keys or reward authority are included.</noscript>
<script type="application/json" id="workbench-source-fingerprint">${JSON.stringify({sourceFingerprint, entry:'src/workbench/main.ts', productionEntry:'generateCatacombs', rendererInput:'DungeonRenderInput', renderer:'Three.js WebGLRenderer'})}</script>
<script>${safeJs}</script>
</body>
</html>
`;
  writeFileSync('dungeon-generator-workbench.html', html.replace(/[ \t]+$/gm, ''));
  console.log(`built dungeon-generator-workbench.html (${sourceFingerprint})`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
