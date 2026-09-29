import { CategoryId } from '../src/types';
import {
  ALL_CATEGORIES,
  getWordsByCategories,
  getPremiumWords,
  getShuffledWords,
  getWordCategory,
  getWordPack,
  PREMIUM_WORD_PACKS,
} from '../src/data/words';
import { WORDS_RO } from '../src/data/words/ro';
import { WORDS_EN } from '../src/data/words/en';
import { CATEGORIES, getCategoryById } from '../src/data/categories';
import { RO, EN, getStrings, Language } from '../src/i18n/strings';
import { PREMIUM_PACKS, PackId } from '../src/store/packs';

// ---------------------------------------------------------------------------
// 1. Word Data Integrity
// ---------------------------------------------------------------------------
describe('Word Data Integrity', () => {
  test('every CategoryId in ALL_CATEGORIES has words in WORDS_RO', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(WORDS_RO).toHaveProperty(cat);
      expect(Array.isArray(WORDS_RO[cat])).toBe(true);
    }
  });

  test('every CategoryId in ALL_CATEGORIES has words in WORDS_EN', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(WORDS_EN).toHaveProperty(cat);
      expect(Array.isArray(WORDS_EN[cat])).toBe(true);
    }
  });

  test('no category is empty - minimum 30 words per category (RO)', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(WORDS_RO[cat].length).toBeGreaterThanOrEqual(30);
    }
  });

  test('no category is empty - minimum 30 words per category (EN)', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(WORDS_EN[cat].length).toBeGreaterThanOrEqual(30);
    }
  });

  test('no duplicate words within the same category (RO)', () => {
    const issues: string[] = [];
    for (const cat of ALL_CATEGORIES) {
      const words = WORDS_RO[cat];
      const seen = new Set<string>();
      for (const word of words) {
        const lower = word.toLowerCase();
        if (seen.has(lower)) {
          issues.push(`"${cat}": duplicate "${word}"`);
        }
        seen.add(lower);
      }
    }
    expect(issues).toEqual([]);
  });

  test('no duplicate words within the same category (EN)', () => {
    const issues: string[] = [];
    for (const cat of ALL_CATEGORIES) {
      const words = WORDS_EN[cat];
      const seen = new Set<string>();
      for (const word of words) {
        const lower = word.toLowerCase();
        if (seen.has(lower)) {
          issues.push(`"${cat}": duplicate "${word}"`);
        }
        seen.add(lower);
      }
    }
    expect(issues).toEqual([]);
  });

  test('no empty strings in any word array (RO)', () => {
    for (const cat of ALL_CATEGORIES) {
      for (const word of WORDS_RO[cat]) {
        expect(word.trim()).not.toBe('');
      }
    }
  });

  test('no empty strings in any word array (EN)', () => {
    for (const cat of ALL_CATEGORIES) {
      for (const word of WORDS_EN[cat]) {
        expect(word.trim()).not.toBe('');
      }
    }
  });

  test('total RO word count is 1000+', () => {
    let total = 0;
    for (const cat of ALL_CATEGORIES) {
      total += WORDS_RO[cat].length;
    }
    expect(total).toBeGreaterThanOrEqual(1000);
  });

  test('total EN word count is 1000+', () => {
    let total = 0;
    for (const cat of ALL_CATEGORIES) {
      total += WORDS_EN[cat].length;
    }
    expect(total).toBeGreaterThanOrEqual(1000);
  });
});

// ---------------------------------------------------------------------------
// 2. Category Consistency
// ---------------------------------------------------------------------------
describe('Category Consistency', () => {
  test('CATEGORIES array has an entry for every CategoryId', () => {
    const categoryIds = CATEGORIES.map((c) => c.id);
    for (const cat of ALL_CATEGORIES) {
      expect(categoryIds).toContain(cat);
    }
  });

  test('every category has a non-empty name, icon, and color', () => {
    for (const cat of CATEGORIES) {
      expect(cat.name.trim()).not.toBe('');
      expect(cat.icon.trim()).not.toBe('');
      expect(cat.color.trim()).not.toBe('');
    }
  });

  test('getCategoryById returns the correct category for each id', () => {
    for (const cat of CATEGORIES) {
      const found = getCategoryById(cat.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(cat.id);
      expect(found!.name).toBe(cat.name);
      expect(found!.icon).toBe(cat.icon);
      expect(found!.color).toBe(cat.color);
    }
  });

  test('ALL_CATEGORIES matches CATEGORIES.map(c => c.id)', () => {
    const idsFromCategories = CATEGORIES.map((c) => c.id);
    expect(ALL_CATEGORIES).toEqual(idsFromCategories);
  });
});

// ---------------------------------------------------------------------------
// 3. i18n String Completeness
// ---------------------------------------------------------------------------
describe('i18n String Completeness', () => {
  test('RO and EN have exactly the same top-level keys', () => {
    const roKeys = Object.keys(RO).sort();
    const enKeys = Object.keys(EN).sort();
    expect(roKeys).toEqual(enKeys);
  });

  test('no empty strings in RO', () => {
    const checkEmpty = (obj: unknown, path: string): void => {
      if (typeof obj === 'string') {
        expect(`${path}: "${obj}"`).not.toMatch(/: ""\s*$/);
        expect(obj.trim()).not.toBe('');
      } else if (Array.isArray(obj)) {
        obj.forEach((item, i) => checkEmpty(item, `${path}[${i}]`));
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          checkEmpty(value, `${path}.${key}`);
        }
      }
    };
    checkEmpty(RO, 'RO');
  });

  test('no empty strings in EN', () => {
    const checkEmpty = (obj: unknown, path: string): void => {
      if (typeof obj === 'string') {
        expect(`${path}: "${obj}"`).not.toMatch(/: ""\s*$/);
        expect(obj.trim()).not.toBe('');
      } else if (Array.isArray(obj)) {
        obj.forEach((item, i) => checkEmpty(item, `${path}[${i}]`));
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          checkEmpty(value, `${path}.${key}`);
        }
      }
    };
    checkEmpty(EN, 'EN');
  });

  test('both languages have all 15 categoryNames (one per CategoryId)', () => {
    const roCatKeys = Object.keys(RO.categoryNames).sort();
    const enCatKeys = Object.keys(EN.categoryNames).sort();
    const expectedKeys = [...ALL_CATEGORIES].sort();

    expect(roCatKeys).toEqual(expectedKeys);
    expect(enCatKeys).toEqual(expectedKeys);
  });

  test('both languages have the same number of rules entries', () => {
    expect(RO.rules.length).toBe(EN.rules.length);
    expect(RO.rules.length).toBeGreaterThan(0);
  });

  test('both languages have defaultTeams of length 4', () => {
    expect(RO.defaultTeams).toHaveLength(4);
    expect(EN.defaultTeams).toHaveLength(4);
  });

  test('shareText contains {winner} and {score} placeholders in both languages', () => {
    expect(RO.shareText).toContain('{winner}');
    expect(RO.shareText).toContain('{score}');
    expect(EN.shareText).toContain('{winner}');
    expect(EN.shareText).toContain('{score}');
  });

  test('getStrings returns the correct strings for each language', () => {
    expect(getStrings('ro')).toBe(RO);
    expect(getStrings('en')).toBe(EN);
  });
});

// ---------------------------------------------------------------------------
// 4. Difficulty Filtering
// ---------------------------------------------------------------------------
describe('Difficulty Filtering', () => {
  const languages: Language[] = ['ro', 'en'];

  for (const lang of languages) {
    describe(`language: ${lang}`, () => {
      const allWords = getWordsByCategories(ALL_CATEGORIES, 'all', lang);
      const easyWords = getWordsByCategories(ALL_CATEGORIES, 'easy', lang);
      const mediumWords = getWordsByCategories(ALL_CATEGORIES, 'medium', lang);
      const hardWords = getWordsByCategories(ALL_CATEGORIES, 'hard', lang);

      test('"all" returns all words', () => {
        expect(allWords.length).toBeGreaterThan(0);
      });

      test('"easy" returns approximately 1/3 of total words', () => {
        const ratio = easyWords.length / allWords.length;
        expect(ratio).toBeGreaterThanOrEqual(0.2);
        expect(ratio).toBeLessThanOrEqual(0.45);
      });

      test('"medium" returns approximately 1/3 of total words', () => {
        const ratio = mediumWords.length / allWords.length;
        expect(ratio).toBeGreaterThanOrEqual(0.2);
        expect(ratio).toBeLessThanOrEqual(0.45);
      });

      test('"hard" returns approximately 1/3 of total words', () => {
        const ratio = hardWords.length / allWords.length;
        expect(ratio).toBeGreaterThanOrEqual(0.2);
        expect(ratio).toBeLessThanOrEqual(0.45);
      });

      test('easy + medium + hard = all (no words lost or duplicated)', () => {
        const combined = [...easyWords, ...mediumWords, ...hardWords];
        expect(combined.length).toBe(allWords.length);
        // Content must match (order may differ since slicing is per-category)
        expect([...combined].sort()).toEqual([...allWords].sort());
      });
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Premium Packs
// ---------------------------------------------------------------------------
describe('Premium Packs', () => {
  const activePacks: PackId[] = ['party18', 'popculture', 'mythology', 'science', 'business', 'traditions'];

  test('PREMIUM_PACKS has correct PackId for each entry', () => {
    const expectedIds: PackId[] = [
      'party18',
      'popculture',
      'mythology',
      'science',
      'business',
      'traditions',
    ];
    const packIds = PREMIUM_PACKS.map((p) => p.id);
    for (const id of expectedIds) {
      expect(packIds).toContain(id);
    }
  });

  test.each(activePacks)(
    'active pack "%s" has 100+ words per language',
    (packId) => {
      const pack = PREMIUM_WORD_PACKS[packId];
      expect(pack).toBeDefined();
      expect(pack.ro.length).toBeGreaterThanOrEqual(100);
      expect(pack.en.length).toBeGreaterThanOrEqual(100);
    }
  );

  test.each(activePacks)(
    'getPremiumWords returns words for active pack "%s"',
    (packId) => {
      const roWords = getPremiumWords(packId, 'all', 'ro');
      const enWords = getPremiumWords(packId, 'all', 'en');
      expect(roWords.length).toBeGreaterThan(0);
      expect(enWords.length).toBeGreaterThan(0);
    }
  );

  test('pack productIds are unique', () => {
    const productIds = PREMIUM_PACKS.map((p) => p.productId);
    const unique = new Set(productIds);
    expect(unique.size).toBe(productIds.length);
  });

  test('pack names exist in both languages', () => {
    for (const pack of PREMIUM_PACKS) {
      expect(pack.name.ro.trim()).not.toBe('');
      expect(pack.name.en.trim()).not.toBe('');
    }
  });

  test('pack descriptions exist in both languages', () => {
    for (const pack of PREMIUM_PACKS) {
      expect(pack.description.ro.trim()).not.toBe('');
      expect(pack.description.en.trim()).not.toBe('');
    }
  });

  test('pack wordCount matches actual word count for all packs', () => {
    for (const pack of PREMIUM_PACKS) {
      const data = PREMIUM_WORD_PACKS[pack.id];
      expect(data.ro.length).toBe(pack.wordCount.ro);
      expect(data.en.length).toBe(pack.wordCount.en);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Shuffling
// ---------------------------------------------------------------------------
describe('Shuffling', () => {
  test('getShuffledWords returns different order on multiple calls (probabilistic)', () => {
    const results = [
      getShuffledWords(ALL_CATEGORIES, 'all', 'ro'),
      getShuffledWords(ALL_CATEGORIES, 'all', 'ro'),
      getShuffledWords(ALL_CATEGORIES, 'all', 'ro'),
    ];

    // At least one pair should differ in order
    const allSame =
      JSON.stringify(results[0]) === JSON.stringify(results[1]) &&
      JSON.stringify(results[1]) === JSON.stringify(results[2]);
    expect(allSame).toBe(false);
  });

  test('getShuffledWords with unlockedPacks includes premium words', () => {
    const withoutPacks = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', []);
    const withPacks = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', [
      'party18',
    ]);
    expect(withPacks.length).toBeGreaterThan(withoutPacks.length);
  });

  test('getShuffledWords returns more words when multiple premium packs are unlocked', () => {
    const noPacks = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', []);
    const onePack = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', ['party18']);
    const twoPacks = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', [
      'party18',
      'popculture',
    ]);
    const threePacks = getShuffledWords(ALL_CATEGORIES, 'all', 'ro', [
      'party18',
      'popculture',
      'mythology',
    ]);

    expect(onePack.length).toBeGreaterThan(noPacks.length);
    expect(twoPacks.length).toBeGreaterThan(onePack.length);
    expect(threePacks.length).toBeGreaterThan(twoPacks.length);
  });
});

// ---------------------------------------------------------------------------
// 7. Cross-Language Consistency
// ---------------------------------------------------------------------------
describe('Cross-Language Consistency', () => {
  test('RO and EN word packs have the same category keys', () => {
    const roKeys = Object.keys(WORDS_RO).sort();
    const enKeys = Object.keys(WORDS_EN).sort();
    expect(roKeys).toEqual(enKeys);
  });

  test('category word counts are similar between languages (within 30% tolerance)', () => {
    for (const cat of ALL_CATEGORIES) {
      const roCount = WORDS_RO[cat].length;
      const enCount = WORDS_EN[cat].length;
      const avg = (roCount + enCount) / 2;
      const diff = Math.abs(roCount - enCount);
      const tolerance = avg * 0.3;

      expect(diff).toBeLessThanOrEqual(tolerance);
    }
  });
});

// ---------------------------------------------------------------------------
// Word -> category / pack lookup (Aventura category badge)
// ---------------------------------------------------------------------------
describe('Word Source Lookup', () => {
  const LANGUAGES: Language[] = ['ro', 'en', 'es', 'fr', 'ru'];

  test('every base-game word maps to a category that contains it', () => {
    for (const lang of LANGUAGES) {
      for (const cat of ALL_CATEGORIES) {
        for (const word of getWordsByCategories([cat], 'all', lang)) {
          const found = getWordCategory(word, lang);
          expect(found).not.toBeNull();
          expect(getWordsByCategories([found as CategoryId], 'all', lang)).toContain(word);
        }
      }
    }
  });

  test('every premium pack word maps to a category or to a pack that contains it', () => {
    for (const lang of LANGUAGES) {
      for (const packId of Object.keys(PREMIUM_WORD_PACKS) as PackId[]) {
        for (const word of getPremiumWords(packId, 'all', lang)) {
          if (getWordCategory(word, lang)) continue;
          const pack = getWordPack(word, lang);
          expect(pack).not.toBeNull();
          expect(getPremiumWords(pack as PackId, 'all', lang)).toContain(word);
        }
      }
    }
  });

  test('a known word maps to its category', () => {
    const roWord = WORDS_RO.animale[0];
    expect(getWordCategory(roWord, 'ro')).toBe('animale');
  });

  test('unknown words return null', () => {
    expect(getWordCategory('definitely-not-a-word', 'ro')).toBeNull();
    expect(getWordPack('definitely-not-a-word', 'ro')).toBeNull();
  });
});
