import { getFallbackStoreMode, getStoreMode, hasRealApiKey } from '../src/store/storeMode';

describe('Store mode', () => {
  test('placeholder and empty keys are not real keys', () => {
    expect(hasRealApiKey('YOUR_REVENUECAT_ANDROID_KEY')).toBe(false);
    expect(hasRealApiKey('YOUR_REVENUECAT_IOS_KEY')).toBe(false);
    expect(hasRealApiKey('')).toBe(false);
    expect(hasRealApiKey('goog_AbCdEf123')).toBe(true);
  });

  test('a real key uses live purchases in every build', () => {
    expect(getStoreMode('goog_AbCdEf123', false)).toBe('live');
    expect(getStoreMode('goog_AbCdEf123', true)).toBe('live');
  });

  test('without a real key, release builds never unlock packs for free', () => {
    expect(getStoreMode('YOUR_REVENUECAT_ANDROID_KEY', false)).toBe('unavailable');
    expect(getStoreMode('', false)).toBe('unavailable');
  });

  test('without a real key, development builds simulate purchases', () => {
    expect(getStoreMode('YOUR_REVENUECAT_ANDROID_KEY', true)).toBe('simulated');
  });

  test('falling back after a failed store start follows the build type', () => {
    expect(getFallbackStoreMode(false)).toBe('unavailable');
    expect(getFallbackStoreMode(true)).toBe('simulated');
  });
});
