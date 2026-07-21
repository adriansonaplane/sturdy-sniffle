import { spawnSync } from 'node:child_process';
const cmds=['npm run typecheck','npm run build','npm run build:workbench','npm run check:workbench','npm run test:unit','npm run test:integration','npm run test:property:pr','npm run test:regression','npm run test:security','npm run test:performance','npm run test:coverage -- --coverageReporters=text-summary','npm audit --audit-level=high','git diff --check'];
for(const cmd of cmds){console.log(`T1 gate: ${cmd}`); const r=spawnSync(cmd,{shell:true,stdio:'inherit'}); if(r.status) process.exit(r.status);}
