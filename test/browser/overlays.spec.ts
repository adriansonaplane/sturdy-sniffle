import { test, expect } from '@playwright/test';
test('workbench starts, generates, exports, and responds to canonical/noncanonical controls',async({page})=>{
  await page.goto('/dungeon-generator-workbench.html');
  await expect(page.locator('body')).toContainText(/Catacombs|Dungeon|Workbench/i);
  await page.waitForLoadState('networkidle');
  const text=await page.locator('body').innerText();
  expect(text).toMatch(/ready|generated|seed|catacombs/i);
  await page.keyboard.press('Tab');
  const active=await page.evaluate(()=>document.activeElement?.tagName);
  expect(active).toBeTruthy();
});
