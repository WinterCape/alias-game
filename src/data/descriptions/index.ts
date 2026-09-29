import { Language } from '../../i18n/strings';

// A short description for every word, per language, read out as the first
// clue in Aventura. Each language's file is only loaded when it's needed.
type DescriptionMap = Record<string, string>;

const cache: Partial<Record<Language, DescriptionMap>> = {};

const load = (language: Language): DescriptionMap => {
  switch (language) {
    case 'ro':
      return require('./ro.json');
    case 'en':
      return require('./en.json');
    case 'es':
      return require('./es.json');
    case 'fr':
      return require('./fr.json');
    case 'ru':
      return require('./ru.json');
    default:
      return {};
  }
};

export const getWordDescription = (word: string, language: Language): string | null => {
  if (!word) return null;
  const map = cache[language] ?? (cache[language] = load(language));
  return map[word] ?? null;
};
