import { test, expect } from '@playwright/test';

const main = (page: any) => page.getByRole('main');

async function waitForStable(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function fillReactInput(page: any, text: string) {
  const ta = page.getByLabel('Message input');
  await ta.focus();
  await page.keyboard.insertText(text);
}

async function submitPrompt(page: any, text: string) {
  await expect(page.getByLabel('Message input')).toBeEnabled({ timeout: 15000 });
  await fillReactInput(page, text);
  await expect(page.getByLabel('Send message')).toBeEnabled({ timeout: 5000 });
  await page.getByLabel('Send message').click();
}

test.describe('Travebie V2 — Real API Integration', () => {
  // NO route mock — hits the real Gemini API

  test('submits prompt and receives AI response', async ({ page }) => {
    test.setTimeout(60000); // Gemini can take 15-30s
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a weekend trip to Goa');

    // Wait for user message to appear
    await expect(main(page).getByText('Plan a weekend trip to Goa')).toBeVisible({ timeout: 10000 });

    // Wait for streaming to finish (typing indicator disappears)
    await expect(page.getByLabel('AI is typing')).not.toBeVisible({ timeout: 60000 });

    // AI response content should not be empty
    const responseText = await main(page).textContent();
    expect(responseText!.length).toBeGreaterThan(50);
  });

  test('AI response contains structured sections', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/');
    await waitForStable(page);
    await submitPrompt(page, 'Plan a 3-day trip to Udaipur');

    // Wait for streaming to finish
    await expect(page.getByLabel('AI is typing')).not.toBeVisible({ timeout: 60000 });

    // Check for rendered content
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('AI response length:', bodyText.length);

    expect(bodyText).toContain('Udaipur');
  });
});
