import { test, expect } from '@playwright/test';

async function waitForStable(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function fillReactInput(page: any, text: string) {
  const ta = page.getByLabel('Message input');
  await ta.focus();
  await page.keyboard.insertText(text);
}

test.describe('Travebie V2 — Chat Welcome', () => {
  test('loads and shows welcome screen', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await expect(page.locator('text=where would you like to go next?')).toBeVisible({ timeout: 5000 });
  });

  test('shows prompt box and suggested prompts', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await expect(page.locator('textarea[aria-label="Message input"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("I want mountains and good coffee")')).toBeVisible();
    await expect(page.locator('button:has-text("Three days with my parents")')).toBeVisible();
    await expect(page.locator('button:has-text("Somewhere nobody talks about")')).toBeVisible();
  });

  test('typing in prompt enables send button', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await fillReactInput(page, 'Plan a trip to Goa');
    await expect(page.getByLabel('Send message')).toBeEnabled({ timeout: 5000 });
  });

  test('empty prompt keeps send button disabled', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await expect(page.getByLabel('Send message')).toBeDisabled();
  });

  test('sidebar opens and closes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStable(page);
    const hamburger = page.getByLabel('Open sidebar');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    // Wait for AnimatePresence spring animation to complete
    await expect(page.getByRole('button', { name: 'Close sidebar' })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'New Chat' })).toBeVisible();
    const closeBtn = page.getByRole('button', { name: 'Close sidebar' });
    await closeBtn.click();
    await expect(page.getByRole('button', { name: 'New Chat' })).not.toBeVisible();
  });

  test('offline page renders', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('text=no signal')).toBeVisible();
  });
});
