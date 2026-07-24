import { ApplicationShell } from './shell/applicationShell.js';
import { DungeonGeneratorWorkspace } from './dungeon-generator/dungeonGeneratorWorkspace.js';
import { AssetForgeWorkspace } from './asset-forge/assetForgeWorkspace.js';
import { SettingsWorkspace } from './settings/settingsWorkspace.js';
import { AboutWorkspace } from './about/aboutWorkspace.js';
export async function bootstrapWorkbench(root:HTMLElement=document.body){ const app=new ApplicationShell([new DungeonGeneratorWorkspace(),new AssetForgeWorkspace(),new SettingsWorkspace(),new AboutWorkspace()]); try{ await app.mount(root); return{ok:true as const,app}; }catch(error){ root.textContent=`Workbench failed to start: ${error instanceof Error?error.message:String(error)}`; return{ok:false as const,error}; } }
void bootstrapWorkbench();
