import { test, expect } from '@playwright/test';

const main = (page: any) => page.getByRole('main');

/** Wait for Fast Refresh / HMR to settle so React event handlers are stable */
async function waitForStable(page: any) {
  // Wait for any pending HMR updates to complete
  await page.waitForLoadState('networkidle');
  // Give React time to flush any pending state updates
  await page.waitForTimeout(500);
}

async function fillReactInput(page: any, text: string) {
  await page.evaluate((val) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) throw new Error('textarea not found');
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    )!.set!;
    nativeSetter.call(textarea, val);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }, text);
}

async function typePrompt(page: any, text: string) {
  await fillReactInput(page, text);
  await expect(page.getByLabel('Send message')).toBeEnabled({ timeout: 5000 });
}

async function submitPrompt(page: any, text: string) {
  await typePrompt(page, text);
  await page.getByLabel('Send message').click();
}

test.describe('Travebie V2 — Chat Conversation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: 'Travebie AI is running in offline mode. Add a GEMINI_API_KEY to your .env file to enable live responses.',
      });
    });
  });

  test('submit prompt creates user message bubble', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a weekend trip to Goa');
    await expect(main(page).getByText('Plan a weekend trip to Goa')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=what adventure are you planning?')).not.toBeVisible();
  });

  test('suggested prompt fills and submits', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    const spiritualBtn = page.locator('button:has-text("Spiritual")');
    await spiritualBtn.click();
    await expect(main(page).getByText('Spiritual journey through Varanasi and Rishikesh')).toBeVisible({ timeout: 8000 });
  });

  test('prompt box stays visible after submission', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a trip to Kerala');
    await expect(page.getByPlaceholder('Describe your dream journey...')).toBeVisible({ timeout: 5000 });
  });

  test('sidebar shows conversation history after first message', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a trip to Goa');
    await page.getByLabel('Open sidebar').click();
    await expect(page.getByRole('complementary').getByText('Plan a trip to Goa')).toBeVisible({ timeout: 8000 });
  });

  test('multiple messages stack in conversation', async ({ page }) => {
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a trip to Goa');
    await expect(main(page).getByText('Plan a trip to Goa')).toBeVisible({ timeout: 8000 });
    await submitPrompt(page, 'What about hotels?');
    await expect(main(page).getByText('What about hotels?')).toBeVisible({ timeout: 8000 });
  });
});
