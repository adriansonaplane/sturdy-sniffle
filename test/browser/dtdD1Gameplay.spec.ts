import { test, expect } from '@playwright/test';

test('DTD-D1 gameplay overlay smoke: generate, toggle, inspect, regenerate safely', async ({ page }) => {
  await page.goto('/dungeon-generator-workbench.html');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#gameplay-legend')).toContainText(/Player start|Boss|Encounter/);
  await expect(page.getByLabel(/Enable gameplay placement overlay/i)).toBeChecked();
  await page.getByLabel(/Show Hazard \/ trap placements/i).setChecked(false);
  await page.getByLabel(/Show Hazard \/ trap placements/i).setChecked(true);
  await page.getByRole('button', { name: 'Gameplay', exact: true }).click();
  await expect(page.locator('#inspector')).toContainText('placements');
  await page.locator('canvas').click({ position: { x: 120, y: 120 }, force: true });
  await page.getByRole('button', { name: 'Selected gameplay placement' }).click();
  await expect(page.locator('#inspector')).toContainText(/No gameplay placement selected|category|Player start|Boss|Encounter/);
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(page.locator('#status')).toHaveText('READY', { timeout: 10000 });
  await expect(page.locator('#gameplay-legend')).toContainText(/Player start|Boss|Encounter/);
});
