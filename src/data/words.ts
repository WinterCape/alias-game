import { CategoryId, Difficulty } from '../types';
import { Language } from '../i18n/strings';
import { PackId } from '../store/packs';
import { WORDS_RO } from './words/ro';
import { WORDS_EN } from './words/en';
import { PACK_PARTY18 } from './packs/party18';
import { PACK_POPCULTURE } from './packs/popculture';
import { PACK_MYTHOLOGY } from './packs/mythology';
import { PACK_SCIENCE } from './packs/science';
import { PACK_BUSINESS } from './packs/business';
import { PACK_TRADITIONS } from './packs/traditions';

const ALL_CATEGORIES: CategoryId[] = [
  'general', 'animale', 'mancare', 'sporturi', 'profesii',
  'natura', 'tehnologie', 'filme', 'muzica', 'istorie',
  'geografie', 'scoala', 'casa', 'emotii', 'haine',
];

const WORD_PACKS: Record<Language, Record<CategoryId, string[]>> = {
  ro: WORDS_RO,
  en: WORDS_EN,
};

const PREMIUM_WORD_PACKS: Record<PackId, Record<Language, string[]>> = {
  party18: PACK_PARTY18,
  popculture: PACK_POPCULTURE,
  mythology: PACK_MYTHOLOGY,
  science: PACK_SCIENCE,
  business: PACK_BUSINESS,
  traditions: PACK_TRADITIONS,
};

export { ALL_CATEGORIES, PREMIUM_WORD_PACKS };

const getWordsByDifficulty = (
  categoryWords: string[],
  difficulty: Difficulty | 'all'
): string[] => {
  if (difficulty === 'all') return categoryWords;
  const third = Math.ceil(categoryWords.length / 3);
  switch (difficulty) {
    case 'easy':
      return categoryWords.slice(0, third);
    case 'medium':
      return categoryWords.slice(third, third * 2);
    case 'hard':
      return categoryWords.slice(third * 2);
  }
};

export const getWordsByCategories = (
  categories: CategoryId[],
  difficulty: Difficulty | 'all' = 'all',
  language: Language = 'ro'
): string[] => {
  const words = WORD_PACKS[language];
  const allWords: string[] = [];
  categories.forEach((cat) => {
    if (words[cat]) {
      allWords.push(...getWordsByDifficulty(words[cat], difficulty));
    }
  });
  return allWords;
};

export const getPremiumWords = (
  packId: PackId,
  difficulty: Difficulty | 'all' = 'all',
  language: Language = 'ro'
): string[] => {
  const pack = PREMIUM_WORD_PACKS[packId];
  if (!pack) return [];
  const words = pack[language] || [];
  return getWordsByDifficulty(words, difficulty);
};

export const getShuffledWords = (
  categories: CategoryId[],
  difficulty: Difficulty | 'all' = 'all',
  language: Language = 'ro',
  unlockedPacks: PackId[] = []
): string[] => {
  const words = getWordsByCategories(categories, difficulty, language);

  // Add words from unlocked premium packs
  unlockedPacks.forEach((packId) => {
    const premiumWords = getPremiumWords(packId, difficulty, language);
    words.push(...premiumWords);
  });

  // Fisher-Yates shuffle
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
};
