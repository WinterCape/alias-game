// How the shop behaves, decided once at startup:
// - live:        a real RevenueCat key is configured, purchases go through the store
// - simulated:   development builds without a key unlock packs locally, for testing
// - unavailable: release builds without a key; nothing is unlocked for free
export type StoreMode = 'live' | 'simulated' | 'unavailable';

export type PurchaseResult = 'success' | 'cancelled' | 'failed' | 'unavailable';

const PLACEHOLDER_KEY_PREFIX = 'YOUR_';

export const hasRealApiKey = (apiKey: string): boolean =>
  apiKey.length > 0 && !apiKey.startsWith(PLACEHOLDER_KEY_PREFIX);

/** Store mode to fall back to when live purchases can't be used. */
export const getFallbackStoreMode = (isDev: boolean): StoreMode =>
  isDev ? 'simulated' : 'unavailable';

export const getStoreMode = (apiKey: string, isDev: boolean): StoreMode =>
  hasRealApiKey(apiKey) ? 'live' : getFallbackStoreMode(isDev);
