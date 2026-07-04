"use client";

import type { BudgetTier, TravelerType } from './intentDetector';

export interface SavedPreferences {
  budgetTier?: BudgetTier;
  travelerType?: TravelerType;
  destination?: string;
  duration?: number | null;
}

const STORAGE_KEY = 'travebie_preferences';

export function savePreferences(prefs: SavedPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadPreferences();
    const merged: SavedPreferences = { ...existing, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadPreferences(): SavedPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SavedPreferences;
  } catch {
    return {};
  }
}

export function clearPreferences(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
