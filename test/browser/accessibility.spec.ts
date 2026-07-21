import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('workbench has no serious or critical axe violations',async({page})=>{await page.goto('/dungeon-generator-workbench.html'); await page.waitForLoadState('networkidle'); const results=await new AxeBuilder({page: page as any}).analyze(); expect(results.violations.filter(v=>['serious','critical'].includes(v.impact??''))).toEqual([]);});
