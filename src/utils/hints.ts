import { CategoryId } from '../types';
import { Language } from '../i18n/strings';

interface Hint {
  type: string;
  value: string;
}

const HINT_LABELS: Record<Language, { category: string; length: string; firstLetter: string; lastLetter: string; startsWith: string }> = {
  ro: { category: 'Categorie', length: 'Lungime', firstLetter: 'Prima literă', lastLetter: 'Ultima literă', startsWith: 'Începe cu' },
  en: { category: 'Category', length: 'Length', firstLetter: 'First letter', lastLetter: 'Last letter', startsWith: 'Starts with' },
  es: { category: 'Categoría', length: 'Longitud', firstLetter: 'Primera letra', lastLetter: 'Última letra', startsWith: 'Empieza con' },
  fr: { category: 'Catégorie', length: 'Longueur', firstLetter: 'Première lettre', lastLetter: 'Dernière lettre', startsWith: 'Commence par' },
  ru: { category: 'Категория', length: 'Длина', firstLetter: 'Первая буква', lastLetter: 'Последняя буква', startsWith: 'Начинается с' },
};

/** "7 letters" with the plural form each language needs. */
export const formatLetterCount = (count: number, language: Language): string => {
  switch (language) {
    case 'ro':
      // Romanian: 1 literă, 2-19 litere, 20+ de litere
      if (count === 1) return '1 literă';
      return count % 100 >= 20 || count % 100 === 0 ? `${count} de litere` : `${count} litere`;
    case 'ru': {
      // Russian: 1, 21, 31 буква; 2-4, 22-24 буквы; otherwise букв
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} буква`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} буквы`;
      return `${count} букв`;
    }
    case 'es':
      return count === 1 ? '1 letra' : `${count} letras`;
    case 'fr':
      return count === 1 ? '1 lettre' : `${count} lettres`;
    default:
      return count === 1 ? '1 letter' : `${count} letters`;
  }
};

export const generateHints = (
  word: string,
  categoryName: string,
  language: Language
): Hint[] => {
  const labels = HINT_LABELS[language];
  const cleanWord = word.trim();

  return [
    { type: labels.category, value: categoryName },
    { type: labels.length, value: formatLetterCount(cleanWord.length, language) },
    { type: labels.firstLetter, value: cleanWord[0].toUpperCase() },
    { type: labels.lastLetter, value: cleanWord[cleanWord.length - 1].toUpperCase() },
    { type: labels.startsWith, value: cleanWord.slice(0, Math.min(3, cleanWord.length)).toUpperCase() },
  ];
};

/** "3 hints left" with the plural form each language needs. */
export const formatHintsLeft = (count: number, language: Language): string => {
  switch (language) {
    case 'ro':
      if (count === 1) return '1 indiciu rămas';
      return count % 100 >= 20 || (count > 0 && count % 100 === 0) ? `${count} de indicii rămase` : `${count} indicii rămase`;
    case 'ru': {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return `${count} подсказка осталась`;
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} подсказки осталось`;
      return `${count} подсказок осталось`;
    }
    case 'es':
      return count === 1 ? '1 pista restante' : `${count} pistas restantes`;
    case 'fr':
      return count === 1 ? '1 indice restant' : `${count} indices restants`;
    default:
      return count === 1 ? '1 hint left' : `${count} hints left`;
  }
};
