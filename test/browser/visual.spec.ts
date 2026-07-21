import { test, expect } from '@playwright/test';
test('stable workbench visual smoke without binary baseline',async({page})=>{
  await page.goto('/dungeon-generator-workbench.html');
  await page.waitForLoadState('networkidle');
  const png=await page.screenshot({animations:'disabled',scale:'css'});
  expect(png.subarray(1,4).toString('ascii')).toBe('PNG');
  expect(png.length).toBeGreaterThan(20_000);
});
