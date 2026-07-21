import { CatacombsWorkbenchApp } from './application.js';
const app = new CatacombsWorkbenchApp();
void app.mount(document.body).catch(error => { document.body.textContent = `Workbench failed to start: ${error instanceof Error ? error.message : String(error)}`; });
