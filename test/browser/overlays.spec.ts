import { test, expect } from '@playwright/test';
const overlays=['primary trunk','room footprints','corridor centerlines','player starts','authored asset usage','manifest verification'];
test.describe('workbench overlays',()=>{
  for (const label of overlays) test(`toggle real overlay control: ${label}`,async({page})=>{
    await page.goto('/dungeon-generator-workbench.html'); await page.waitForLoadState('networkidle');
    const stats=await page.locator('#stats').innerText();
    const box=page.getByLabel(new RegExp(label,'i')); await expect(box).toBeVisible();
    await box.setChecked(false); await box.setChecked(true);
    expect(await page.locator('#stats').innerText()).toBe(stats);
  });
  test('planned unsupported environments are disabled rather than exposed as active overlays',async({page})=>{
    await page.goto('/dungeon-generator-workbench.html');
    await expect(page.locator('select[aria-label="Environment"] option:disabled')).toHaveCount(3);
  });
});
