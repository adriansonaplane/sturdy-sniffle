import { test, expect } from '@playwright/test';

const canonical = ['rootSeed','gameType','difficulty','authorizedPlayerCount','generation.targetRoomCount','generation.areaBudget','generation.targetPackingDensity','generation.minimumRoomPadding'];
const presentation = ['renderer.quality','renderer.animateBuild','renderer.animationSpeed','renderer.wallFading','renderer.reducedMotion','renderer.postProcessing'];

test.describe('registry-backed workbench controls',()=>{
  // Helper: ensure app is READY before taking a snapshot
  const waitForReady = async (page: any) => {
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#status')).toContainText('READY', { timeout: 20000 });
  };

  for (const path of canonical) test(`canonical control regenerates: ${path}`, async({page})=>{
    await page.goto('/dungeon-generator-workbench.html');
    await waitForReady(page);

    const before = await page.locator('#stats').innerText();
    const control = page.locator(`[data-path="${path}"]`);
    await expect(control).toBeVisible();

    const tag = await control.evaluate((e: HTMLElement) => e.tagName.toLowerCase());
    if (tag === 'select') {
      // pick a different selectedIndex
      const selectedIndex = await control.evaluate((el: HTMLSelectElement) => el.selectedIndex);
      const optionCount = await control.evaluate((el: HTMLSelectElement) => el.options.length);
      const newIndex = (selectedIndex + 1) % Math.max(1, optionCount);
      await control.selectOption({ index: newIndex });
    } else {
      const type = await control.getAttribute('type');
      if (type === 'number' || type === 'range') {
        const current = Number(await control.inputValue().catch(() => '0'));
        const newValue = Number.isFinite(current) ? String(current + 1) : (path.includes('targetPackingDensity') ? '0.45' : '20');
        await control.fill(newValue);
        await control.blur();
      } else if (type === 'checkbox') {
        await control.setChecked(!(await control.isChecked()));
      } else {
        // text-like inputs (seed etc.) — use a unique value
        await control.fill(`seed-${Date.now()}`);
        await control.blur();
      }
    }

    // Trigger input/change events to match user interaction
    await control.evaluate((e: HTMLElement) => {
      e.dispatchEvent(new Event('input', { bubbles: true }));
      e.dispatchEvent(new Event('change', { bubbles: true }));
      if ((e as HTMLElement).blur) (e as any).blur();
    });

    // Wait for a full generation: ANIMATING then READY, then the commit message
    await expect(page.locator('#status')).toContainText('ANIMATING', { timeout: 5000 });
    await expect(page.locator('#status')).toContainText('READY', { timeout: 20000 });
    await expect(page.locator('#stats')).toContainText('generation committed', { timeout: 5000 });

    const after = await page.locator('#stats').innerText();
    expect(after).not.toBe(before);
  });

  for (const path of presentation) test(`presentation control does not regenerate: ${path}`, async({page})=>{
    await page.goto('/dungeon-generator-workbench.html');
    await waitForReady(page);

    const before = await page.locator('#stats').innerText();
    const control = page.locator(`[data-path="${path}"]`);
    await expect(control).toBeVisible();

    const tag = await control.evaluate((e: HTMLElement) => e.tagName.toLowerCase());
    if (tag === 'select') {
      const selectedIndex = await control.evaluate((el: HTMLSelectElement) => el.selectedIndex);
      const optionCount = await control.evaluate((el: HTMLSelectElement) => el.options.length);
      const newIndex = (selectedIndex + 1) % Math.max(1, optionCount);
      await control.selectOption({ index: newIndex });
    } else {
      const type = await control.getAttribute('type');
      if (type === 'checkbox') {
        await control.setChecked(!(await control.isChecked()));
      } else if (type === 'number' || type === 'range') {
        const current = Number(await control.inputValue().catch(() => '0'));
        await control.fill(String((Number.isFinite(current) ? current + 1 : 1)));
        await control.blur();
      } else {
        await control.fill(`ui-${Date.now()}`);
        await control.blur();
      }
    }

    await control.evaluate((e: HTMLElement) => {
      e.dispatchEvent(new Event('input', { bubbles: true }));
      e.dispatchEvent(new Event('change', { bubbles: true }));
      if ((e as HTMLElement).blur) (e as any).blur();
    });

    // Presentation-only update should report 'presentation only' in stats
    await expect(page.locator('#stats')).toContainText('presentation only', { timeout: 10000 });
    const after = await page.locator('#stats').innerText();
    expect(after).not.toBe(before);
  });

  test('random seed and reset-equivalent generate button paths are reachable',async({page})=>{
    await page.goto('/dungeon-generator-workbench.html');
    await waitForReady(page);
    await page.locator('#random').click();
    await expect(page.locator('#status')).toContainText('ANIMATING', { timeout: 5000 });
    await expect(page.locator('#status')).toContainText('READY', { timeout: 20000 });
    await page.locator('#generate').click();
    await expect(page.locator('#stats')).toContainText('generation committed', { timeout: 5000 });
  });
});
