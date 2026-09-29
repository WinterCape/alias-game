import { CATEGORIES } from '../data/categories';
import { getWordCategory, getWordPack } from '../data/words';
import { Language, Strings } from '../i18n/strings';
import { PREMIUM_PACKS } from '../store/packs';
import type { ArcanaRealm } from '../components/ArcanaCard';

/** The realm a word comes from: its category, or the premium pack it belongs to. */
export const getWordRealm = (word: string, language: Language, t: Strings): ArcanaRealm | null => {
  if (!word) return null;
  const categoryId = getWordCategory(word, language);
  if (categoryId) {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (category) {
      return { name: t.categoryNames[categoryId], icon: category.icon, color: category.color };
    }
  }
  const packId = getWordPack(word, language);
  const pack = packId ? PREMIUM_PACKS.find((p) => p.id === packId) : undefined;
  if (pack) return { name: pack.name[language], icon: pack.icon, color: pack.color };
  return null;
};
