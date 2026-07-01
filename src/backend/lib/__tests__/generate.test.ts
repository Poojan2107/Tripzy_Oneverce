import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('generateDestinationDescription', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns fallback message when API key is not configured', async () => {
    vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', '');
    vi.stubEnv('GEMINI_API_KEY', '');

    const { generateDestinationDescription } = await import('../generate');
    const result = await generateDestinationDescription('Varanasi', 'Varanasi', 'India', 'culture, food');

    expect(result).toBe('AI generation unavailable (API key not configured).');
  });

  it('returns fallback message when GEMINI_API_KEY is also empty', async () => {
    vi.stubEnv('GOOGLE_GENERATIVE_AI_API_KEY', '');
    vi.stubEnv('GEMINI_API_KEY', '');

    const { generateExperienceDescription } = await import('../generate');
    const result = await generateExperienceDescription('Himalayan Trek', 'adventure');

    expect(result).toBe('AI generation unavailable (API key not configured).');
  });
});
