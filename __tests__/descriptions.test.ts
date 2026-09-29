import { ALL_CATEGORIES, getWordsByCategories, getPremiumWords, PREMIUM_WORD_PACKS } from '../src/data/words';
import { getWordDescription } from '../src/data/descriptions';
import { Language } from '../src/i18n/strings';
import { PackId } from '../src/store/packs';

const LANGUAGES: Language[] = ['ro', 'en', 'es', 'fr', 'ru'];

const allWords = (lang: Language): string[] => {
  const words = new Set(getWordsByCategories(ALL_CATEGORIES, 'all', lang));
  for (const packId of Object.keys(PREMIUM_WORD_PACKS) as PackId[]) {
    getPremiumWords(packId, 'all', lang).forEach((w) => words.add(w));
  }
  return [...words];
};

// Lowercase and strip accents so "Mărțișor" and "Martisor" compare equal
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ё/g, 'е')
    .replace(/й/g, 'и');

const tokens = (s: string) => fold(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

describe.each(LANGUAGES)('Word descriptions (%s)', (lang) => {
  const words = allWords(lang);

  test('every word has a description', () => {
    const missing = words.filter((w) => !getWordDescription(w, lang)?.trim());
    expect(missing).toEqual([]);
  });

  test('no description contains its own word', () => {
    const leaks = words.filter((word) => {
      const description = getWordDescription(word, lang) ?? '';
      const target = fold(word);
      return tokens(description).some((t) => t === target);
    });
    expect(leaks).toEqual([]);
  });

  test('descriptions are short clues', () => {
    const outOfRange = words.filter((w) => {
      const n = (getWordDescription(w, lang) ?? '').split(/\s+/).length;
      return n < 3 || n > 16;
    });
    expect(outOfRange).toEqual([]);
  });
});

test('unknown words have no description', () => {
  expect(getWordDescription('definitely-not-a-word', 'ro')).toBeNull();
  expect(getWordDescription('', 'en')).toBeNull();
});
