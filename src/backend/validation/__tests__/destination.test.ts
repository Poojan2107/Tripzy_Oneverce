import { describe, it, expect } from 'vitest';
import { destinationSchema } from '../destination';

describe('destinationSchema', () => {
  const validDest = {
    name: 'Varanasi',
    country: 'India',
    city: 'Varanasi',
    description: 'Ancient spiritual city on the banks of the Ganges, known for its ghats, temples, and sacred rituals.',
    price: 1500,
  };

  it('accepts a valid destination', () => {
    const result = destinationSchema.safeParse(validDest);
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 100 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, name: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, description: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects description longer than 2000 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, description: 'A'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('rejects latitude below -90', () => {
    const result = destinationSchema.safeParse({ ...validDest, latitude: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects latitude above 90', () => {
    const result = destinationSchema.safeParse({ ...validDest, latitude: 100 });
    expect(result.success).toBe(false);
  });

  it('rejects longitude below -180', () => {
    const result = destinationSchema.safeParse({ ...validDest, longitude: -200 });
    expect(result.success).toBe(false);
  });

  it('rejects longitude above 180', () => {
    const result = destinationSchema.safeParse({ ...validDest, longitude: 200 });
    expect(result.success).toBe(false);
  });

  it('rejects metaTitle longer than 70 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, metaTitle: 'A'.repeat(71) });
    expect(result.success).toBe(false);
  });

  it('rejects metaDescription longer than 160 characters', () => {
    const result = destinationSchema.safeParse({ ...validDest, metaDescription: 'A'.repeat(161) });
    expect(result.success).toBe(false);
  });

  it('accepts valid status values', () => {
    for (const status of ['DRAFT', 'REVIEW', 'PUBLISHED']) {
      const result = destinationSchema.safeParse({ ...validDest, status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status values', () => {
    const result = destinationSchema.safeParse({ ...validDest, status: 'ARCHIVED' });
    expect(result.success).toBe(false);
  });

  it('accepts min-max scores within range', () => {
    const result = destinationSchema.safeParse({
      ...validDest,
      adventureScore: 50,
      culturalScore: 75,
      luxuryScore: 100,
      familyScore: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rejects scores above 100', () => {
    const result = destinationSchema.safeParse({ ...validDest, adventureScore: 150 });
    expect(result.success).toBe(false);
  });

  it('rejects scores below 0', () => {
    const result = destinationSchema.safeParse({ ...validDest, culturalScore: -5 });
    expect(result.success).toBe(false);
  });
});
