import { expect, test } from '@playwright/test';

test('DTD-D2 environmental overlay smoke: props, filters, selection, regeneration stability', async ({ page }) => {
  await page.goto('/dungeon-generator-workbench.html');
  await expect(page.getByText('CATACOMBS WORKBENCH')).toBeVisible();
  await expect(page.getByLabel(/Enable gameplay placement overlay/i)).toBeChecked();
  await expect(page.getByLabel(/Enable environmental prop overlay/i)).toBeChecked();
  await expect(page.locator('#stats')).toContainText('environmental:');
  await expect(page.locator('#gameplay-legend')).toContainText(/coffin|sarcophagus|pillar|rubble/i);
  await page.getByLabel(/Show Stone or wooden coffin environmental props/i).setChecked(false);
  await page.getByRole('button', { name: 'Environmental props' }).click();
  await expect(page.locator('#inspector')).toContainText('summary');
  const firstIds = await page.locator('#inspector').textContent();
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(page.locator('#status')).toContainText('READY');
  await page.getByRole('button', { name: 'Environmental props' }).click();
  await expect(page.locator('#inspector')).toContainText('placements');
  expect(await page.locator('#inspector').textContent()).toContain('environment.room');
  await page.getByRole('button', { name: 'Random seed' }).click();
  await expect(page.locator('#status')).toContainText('READY');
  await expect(page.getByLabel(/Enable gameplay placement overlay/i)).toBeChecked();
  await expect(page.getByLabel(/Enable environmental prop overlay/i)).toBeChecked();
  expect(firstIds).toContain('total');
});
