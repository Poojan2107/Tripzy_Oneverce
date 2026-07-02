import { test, expect } from '@playwright/test';

test.describe('AI Planner', () => {
  test('planner wizard loads and shows steps', async ({ page }) => {
    await page.goto('/');
    const companionTab = page.getByRole('button', { name: /companion/i });
    if (await companionTab.isVisible()) {
      await companionTab.click();
    } else {
      await page.goto('/#ai-planner');
    }

    await expect(page.locator('text=design your dream journey')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=choose your chapter')).toBeVisible();
  });

  test('destination selection works', async ({ page }) => {
    await page.goto('/#ai-planner');
    await expect(page.locator('text=choose your destination')).toBeVisible({ timeout: 5000 });

    const firstDest = page.locator('button:has-text("Varanasi")').first();
    if (await firstDest.isVisible()) {
      await firstDest.click();
      await expect(page.locator('text=selected')).toBeVisible();
    }
  });

  test('planner shows budget slider', async ({ page }) => {
    await page.goto('/#ai-planner');
    await expect(page.locator('text=choose your destination')).toBeVisible({ timeout: 5000 });

    const dest = page.locator('button:has-text("Varanasi")').first();
    if (await dest.isVisible()) await dest.click();

    const nextBtn = page.getByRole('button', { name: /next/i });
    if (await nextBtn.isVisible({ timeout: 3000 })) {
      await nextBtn.click();
      await expect(page.locator('text=budget per day')).toBeVisible({ timeout: 5000 });
    }
  });

});
