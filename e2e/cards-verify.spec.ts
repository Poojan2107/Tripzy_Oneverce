import { test, expect } from '@playwright/test';

const main = (page: any) => page.getByRole('main');

test.describe('Card Rendering Verification', () => {
  test('all 18 card types render with simulated response', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Submit without route mock so simulated response kicks in
    const ta = page.getByLabel('Message input');
    await ta.focus();
    await page.keyboard.insertText('Plan a weekend trip to Goa');
    await expect(page.getByLabel('Send message')).toBeEnabled({ timeout: 5000 });
    await page.getByLabel('Send message').click();

    // Wait for streaming to finish
    await expect(page.getByLabel('AI is typing')).not.toBeVisible({ timeout: 30000 });

    // Check card section headings appear in the page
    const bodyText = await page.evaluate(() => document.body.innerText);

    // Card components use their own hardcoded headings (not the parsed section titles)
    const expectedSections = [
      'Journey Overview',
      'Local Experiences',
      'Itinerary',
      'Hotels & Accommodation',
      'Food & Dining',
      'Budget',
      'Transport',
      'Packing Essentials',
      'Weather & Best Time',
      'Pro Tips',
      'Hidden Gems',
      'Photography Spots',
      'Local Etiquette',
      'Things to Avoid',
      'Emergency Info',
      'Festivals & Events',
      'Nearby Destinations',
    ];

    const missing = expectedSections.filter(s => !bodyText.includes(s));
    console.log('Missing sections:', missing.length === 0 ? 'NONE' : missing);
    expect(missing).toEqual([]);

    // Verify Go-specific content is present
    expect(bodyText).toContain('Goa');
    expect(bodyText).toContain('BEACH');
    expect(bodyText).toContain('₹');
  });
});
