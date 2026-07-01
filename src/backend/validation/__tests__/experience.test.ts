import { describe, it, expect } from 'vitest';
import { experienceSchema } from '../experience';

describe('experienceSchema', () => {
  const validExp = {
    name: 'Himalayan Trek',
    description: 'A challenging multi-day trek through the Himalayan wilderness with stunning mountain views.',
    featuredImage: '/images/cat-adventure.jpg',
    icon: 'Mountain',
    travelStyles: ['Adventure', 'Wildlife'],
    estimatedBudget: 1500,
    durationRange: '5-7 days',
    difficultyLevel: 'Challenging',
    tags: ['Trekking', 'Mountains'],
  };

  it('accepts a valid experience', () => {
    const result = experienceSchema.safeParse(validExp);
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 3 characters', () => {
    const result = experienceSchema.safeParse({ ...validExp, name: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    const result = experienceSchema.safeParse({ ...validExp, name: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects description longer than 1000 characters', () => {
    const result = experienceSchema.safeParse({ ...validExp, description: 'A'.repeat(1001) });
    expect(result.success).toBe(false);
  });

  it('accepts null description', () => {
    const result = experienceSchema.safeParse({ ...validExp, description: null });
    expect(result.success).toBe(true);
  });

  it('accepts valid status values', () => {
    for (const status of ['DRAFT', 'REVIEW', 'PUBLISHED']) {
      const result = experienceSchema.safeParse({ ...validExp, status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status values', () => {
    const result = experienceSchema.safeParse({ ...validExp, status: 'ARCHIVED' });
    expect(result.success).toBe(false);
  });

  it('rejects estimatedBudget below 0', () => {
    const result = experienceSchema.safeParse({ ...validExp, estimatedBudget: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects featuredImage that is not a path or URL', () => {
    const result = experienceSchema.safeParse({ ...validExp, featuredImage: 'not-a-path' });
    expect(result.success).toBe(false);
  });
});
