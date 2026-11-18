import { openDatabaseSync } from 'expo-sqlite';

import type { ThemePreference } from '../../app/providers/PreferencesProvider';

const DB_NAME = 'user_preferences.db';

let cachedDb: ReturnType<typeof openDatabaseSync> | null = null;

function getPreferencesDb() {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const db = openDatabaseSync(DB_NAME);
    db.execSync(
      'CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY, value TEXT);'
    );
    cachedDb = db;
    return db;
  } catch {
    return null;
  }
}

/**
 * Loads the user's saved theme preference synchronously from SQLite.
 * Returns 'system', 'light', or 'dark'. Safely falls back to 'system'
 * if no preference is saved, or if storage is unreadable/corrupted.
 */
export function loadStoredThemePreference(): ThemePreference {
  try {
    const db = getPreferencesDb();
    if (!db) {
      return 'system';
    }
    const row = db.getFirstSync<{ value: string }>(
      'SELECT value FROM preferences WHERE key = ?;',
      ['theme_preference']
    );
    if (
      row &&
      (row.value === 'light' || row.value === 'dark' || row.value === 'system')
    ) {
      return row.value;
    }
  } catch {
    // Graceful fallback to system
  }
  return 'system';
}

/**
 * Persists the user's chosen theme preference ('system' | 'light' | 'dark').
 */
export function saveStoredThemePreference(preference: ThemePreference): void {
  try {
    const db = getPreferencesDb();
    if (!db) {
      return;
    }
    db.runSync(
      'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);',
      ['theme_preference', preference]
    );
  } catch {
    // Non-blocking error handling
  }
}

/**
 * Clears the stored theme preference back to default.
 */
export function clearStoredThemePreference(): void {
  try {
    const db = getPreferencesDb();
    if (!db) {
      return;
    }
    db.runSync('DELETE FROM preferences WHERE key = ?;', ['theme_preference']);
  } catch {
    // Non-blocking error handling
  }
}
