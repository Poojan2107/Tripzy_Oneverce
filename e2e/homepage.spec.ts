import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully and displays brand', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=travebie')).toBeVisible();
    await expect(page.locator('text=explore atlas')).toBeVisible();
  });

  test('navigation tabs switch views', async ({ page }) => {
    await page.goto('/');

    const atlasTab = page.getByRole('button', { name: /atlas/i });
    if (await atlasTab.isVisible()) {
      await atlasTab.click();
      await expect(page.locator('text=india\'s story atlas')).toBeVisible({ timeout: 5000 });
    }

    const companionTab = page.getByRole('button', { name: /companion/i });
    if (await companionTab.isVisible()) {
      await companionTab.click();
      await expect(page.locator('text=design your dream journey')).toBeVisible({ timeout: 5000 });
    }
  });

  test('search modal opens via Cmd+K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+k');
    await expect(page.locator('text=Search')).toBeVisible({ timeout: 3000 });
  });

  test('category chips are clickable', async ({ page }) => {
    await page.goto('/');
    const firstChip = page.locator('button:has-text("Spiritual")').first();
    if (await firstChip.isVisible()) {
      await firstChip.click();
    }
  });

  test('offline page renders', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('text=no signal')).toBeVisible();
  });
});
