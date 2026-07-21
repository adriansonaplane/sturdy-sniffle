import { test, expect } from '@playwright/test';

const canonical = ['rootSeed','gameType','difficulty','authorizedPlayerCount','generation.targetRoomCount','generation.areaBudget','generation.targetPackingDensity','generation.minimumRoomPadding','generation.sizeProfile','routing.corridorWidth'];
const presentation = ['renderer.quality','renderer.animateBuild','renderer.animationSpeed','renderer.wallFading','renderer.reducedMotion','renderer.postProcessing'];

test.describe('registry-backed workbench controls',()=>{
  for (const path of canonical) test(`canonical control regenerates: ${path}`, async({page})=>{
    await page.goto('/dungeon-generator-workbench.html'); await page.waitForLoadState('networkidle');
    const before=await page.locator('#stats').innerText();
    const control=page.locator(`[data-path="${path}"]`); await expect(control).toBeVisible();
    const tag=await control.evaluate(e=>e.tagName.toLowerCase());
    if(tag==='select') await control.selectOption({index:1}); else {
      const type=await control.getAttribute('type');
      if(type==='number') await control.fill(path.includes('targetPackingDensity')?'0.45':path.includes('areaBudget')?'16000':path.includes('Player')?'2':'20'); else await control.fill(`seed-${path}`);
    }
    await control.dispatchEvent('change'); await expect(page.locator('#status')).toContainText(/READY|ANIMATING/, {timeout: 15000});
    await expect(page.locator('#stats')).toContainText('generation committed');
    expect(await page.locator('#stats').innerText()).not.toBe(before);
  });
  for (const path of presentation) test(`presentation control does not regenerate: ${path}`, async({page})=>{
    await page.goto('/dungeon-generator-workbench.html'); await page.waitForLoadState('networkidle');
    const before=await page.locator('#stats').innerText(); const control=page.locator(`[data-path="${path}"]`); await expect(control).toBeVisible();
    const tag=await control.evaluate(e=>e.tagName.toLowerCase());
    if(tag==='select') await control.selectOption({index:0}); else if(await control.getAttribute('type')==='checkbox') await control.setChecked(!(await control.isChecked())); else await control.fill('1.5');
    await control.dispatchEvent('change'); await expect(page.locator('#stats')).toContainText('presentation only');
    expect(await page.locator('#stats').innerText()).not.toBe(before);
  });
  test('random seed and reset-equivalent generate button paths are reachable',async({page})=>{
    await page.goto('/dungeon-generator-workbench.html'); await page.waitForLoadState('networkidle');
    await page.locator('#random').click(); await expect(page.locator('#status')).toContainText(/READY|ANIMATING/, {timeout:15000});
    await page.locator('#generate').click(); await expect(page.locator('#stats')).toContainText('generation committed');
  });
});
