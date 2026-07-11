import { test, expect } from '@playwright/test';

const main = (page: any) => page.getByRole('main');

const SECTION_RESPONSE = `## Journey Overview
Goa hits different. The first morning — the salt air hits your window before the sun does. By the time you're eating beach-bread omelette at a shack with your feet in the sand, you'll wonder why you don't live here. BEACH is the heartbeat of this place — golden by noon, pink at sunset.

- **Destination highlights** — Pristine beaches, Portuguese-era architecture, night markets, spice plantations
- **Best for** — Solo travellers, couples, friend groups
- **Ideal duration** — 4-5 days
- **Vibe** — Relaxed, tropical, cultural

## Top Places to Visit
**Calangute Beach** — The Queen of Beaches. Best time: November to March. Time needed: ~2-3 hrs. Pro tip: Go early morning before the crowd.
**Fort Aguada** — 17th-century Portuguese fort with ocean views. Best time: Late afternoon for sunset. Time needed: ~1 hr. Pro tip: Combine with a visit to the nearby lighthouse.

## Daily Itinerary
**Day 1: North Goa Beaches**
**Morning**: Land at Goa International Airport. Take a prepaid taxi (₹600) to Candolim. Start with a morning swim at Candolim Beach.
**Afternoon**: Lunch at Fisherman's Wharf (prawn balchão recommended, ₹800). Explore Fort Aguada.
**Evening**: Watch the sunset from the fort walls. Dinner at Bomra's (Asian-fusion, ₹1,800 for two).

**Day 2: South Goa Exploration**
**Morning**: Drive to Palolem Beach (1 hr). Kayak through the backwaters spotting kingfishers.
**Afternoon**: Lunch at The Loft in Palolem (wood-fired pizzas, ₹1,200). Visit Butterfly Beach.
**Evening**: Dinner on the sand at Cafe Lazy under fairy lights (₹1,500 for two).

## Hotels & Accommodation
**Luxury**
Taj Fort Aguada Resort — Perched on a cliff with private beach access. ₹15,000–₹25,000/night. Best for: Honeymooners and luxury seekers.
**Mid-Range**
The Baroque — Boutique villa in Candolim with pool. ₹4,500–₹7,000/night. Best for: Couples and small groups.
**Budget**
Zostel Goa — Social hostel in Anjuna with dorms and private rooms. ₹800–₹1,500/night. Best for: Solo travellers and backpackers.

## Food & Dining
**Signature dishes**: Goan fish curry rice, prawn balchão, bebinca
**Street food**: Chorizo pao at the Mapusa market (₹50), fresh coconut water from any beach shack
**Unique experience**: Sunset dinner cruise on the Mandovi River (₹1,500 per person)

## Budget Breakdown
| Category | Estimated Cost |
| Transport | ₹3,000–₹5,000 |
| Accommodation (4 nights) | ₹6,000–₹20,000 |
| Food (per day) | ₹1,000–₹1,500 |
| Activities & entry fees | ₹1,500–₹3,000 |
| Miscellaneous | ₹1,000–₹2,000 |
| **Total** | **₹12,500–₹31,500 per person** |

## Transport & Getting Around
**Airport**: Goa International Airport (GOI) in Dabolim, 30 min from North Goa.
**Local transport**: Scooter rental (₹400–₹600/day), taxi (₹15–₹20/km), Uber available in Panjim.

## Packing Essentials
**Clothing**: Light cottons, swimwear, a light scarf for temple visits
**Footwear**: Flip-flops, walking sandals
**Gear**: Sunscreen (high SPF), sunglasses, hat, reusable water bottle
**Extras**: Insect repellent, basic first-aid kit, dry bag for beach days

## Weather & Best Time
**Best Months**: November to March — pleasant, sunny, perfect beach weather
**Current Season**: Warm and dry
**Temperature**: 25°C–32°C
**Crowd Level**: High during December–January

## Pro Tips
- Rent a scooter — it's the best way to explore Goa at your own pace
- Carry cash — many beach shacks don't accept cards
- Book accommodation in advance during December and January

## Hidden Gems
Butterfly Beach — accessible only by boat or a forest trail, often empty. Reach it from Palolem.
Fontainhas — Panjim's Latin Quarter with colourful Portuguese-era mansions and cobblestone streets.

## Photography Spots
Chapora Fort — sunset views of the coastline from the Dil Chahta Hai spot.
Our Lady of the Immaculate Conception Church — white baroque church stunning against blue skies.

## Etiquette & Local Customs
Do greet with "Namaste" — it's appreciated everywhere.
Don't wear beachwear inside temples and churches — cover shoulders and knees.

## Things to Avoid
Don't accept taxi rides without negotiating the fare first — always agree on a price.
Avoid beach shacks that aggressively push their menu — walk a bit further for authentic ones.

## Emergency Contacts
Police: 100
Ambulance: 108
Goa Medical College & Hospital: +91 832 249 3000

## Local Festivals
Carnival (February) — Goa's version of Mardi Gras with parades, music, and dancing.
Shigmo (March) — Spring festival with colourful processions and folk performances.

## Nearby Destinations
Dudhsagar Falls (1.5 hrs) — One of India's tallest waterfalls. BEACH trips often include this as a day excursion. ₹500 entry.
Hampi (5 hrs) — Ruins of the Vijayanagara Empire. Worth an overnight trip for history lovers.`;

test.describe('Card Rendering Verification', () => {
  test('all 18 card types render with simulated response', async ({ page, context }) => {
    test.setTimeout(30000);

    // Set up route mocking before navigation
    await context.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: SECTION_RESPONSE,
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const ta = page.getByLabel('Message input');
    await ta.focus();
    await page.keyboard.insertText('Plan a weekend trip to Goa');
    await expect(page.getByLabel('Send message')).toBeEnabled({ timeout: 5000 });
    await page.getByLabel('Send message').click();

    // Wait for streaming to finish (mock returns instantly, but typing indicator still appears briefly)
    await expect(page.getByLabel('AI is typing')).not.toBeVisible({ timeout: 15000 });

    // Wait for first section to appear (progressive reveal starts after 800ms)
    await expect(page.locator('text=Itinerary').first()).toBeVisible({ timeout: 10000 });

    // Wait for progressive section reveal to complete
    await expect(page.locator('text=Nearby').first()).toBeVisible({ timeout: 20000 });

    // Check card section headings appear in the page
    const bodyText = await page.evaluate(() => document.body.innerText);

    // Card components use their own hardcoded headings (not the parsed section titles)
    const expectedSections = [
      "Don't Miss",
      'Itinerary',
      'Hotels',
      'Food',
      'Budget',
      'Transport',
      'Packing',
      'Weather',
      'Tips',
      'Local Secrets',
      'Photo Moments',
      'Local Ways',
      'Avoid',
      'Keep Safe',
      'Festivals',
      'Nearby',
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
