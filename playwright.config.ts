import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'test/browser',timeout:30000,use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:900},deviceScaleFactor:1},webServer:{command:'npm run build:workbench && npx http-server . -p 4173 -s',url:'http://127.0.0.1:4173/dungeon-generator-workbench.html',reuseExistingServer:false,timeout:30000}});
