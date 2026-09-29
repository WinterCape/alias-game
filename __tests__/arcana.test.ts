import { toRoman } from '../src/components/ArcanaCard';

jest.mock('@expo/vector-icons', () => ({ MaterialCommunityIcons: () => null }));

describe('Roman numerals on the card', () => {
  test('common numbers', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(14)).toBe('XIV');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(99)).toBe('XCIX');
  });

  test('zero or negative gives nothing', () => {
    expect(toRoman(0)).toBe('');
    expect(toRoman(-3)).toBe('');
  });
});
