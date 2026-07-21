import { CatacombsWorkbenchApp } from './application.js';

export async function bootstrapWorkbench(root: HTMLElement = document.body, app = new CatacombsWorkbenchApp()) {
  try { await app.mount(root); return { ok: true as const, app }; }
  catch (error) { root.textContent = `Workbench failed to start: ${error instanceof Error ? error.message : String(error)}`; return { ok: false as const, error }; }
}

void bootstrapWorkbench();
