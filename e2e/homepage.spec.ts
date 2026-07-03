import { test, expect } from '@playwright/test';

async function waitForStable(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function fillReactInput(page: any, text: string) {
  await page.evaluate((val) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    )!.set!;
    nativeSetter.call(textarea, val);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }, text);
}

test.describe('Travebie V2 — Chat Welcome', () => {
  test('loads and shows welcome screen', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await expect(page.locator('text=what adventure are you planning?')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('main').getByText('travebie', { exact: true })).toBeVisible();
  });

  test('shows prompt box and suggested prompts', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await expect(page.getByPlaceholder('Describe your dream journey...')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Weekend Escape")')).toBeVisible();
    await expect(page.locator('button:has-text("Honeymoon")')).toBeVisible();
    await expect(page.locator('button:has-text("Solo Backpacking")')).toBeVisible();
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
