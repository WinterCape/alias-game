import { CategoryId } from '../types';
import { Language } from '../i18n/strings';

interface Hint {
  type: string;
  value: string;
}

const HINT_LABELS: Record<Language, { category: string; letters: string; firstLetter: string; lastLetter: string; startsWith: string }> = {
  ro: { category: 'Categorie', letters: 'litere', firstLetter: 'Prima literă', lastLetter: 'Ultima literă', startsWith: 'Începe cu' },
  en: { category: 'Category', letters: 'letters', firstLetter: 'First letter', lastLetter: 'Last letter', startsWith: 'Starts with' },
  es: { category: 'Categoría', letters: 'letras', firstLetter: 'Primera letra', lastLetter: 'Última letra', startsWith: 'Empieza con' },
  fr: { category: 'Catégorie', letters: 'lettres', firstLetter: 'Première lettre', lastLetter: 'Dernière lettre', startsWith: 'Commence par' },
  ru: { category: 'Категория', letters: 'букв', firstLetter: 'Первая буква', lastLetter: 'Последняя буква', startsWith: 'Начинается с' },
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
    { type: labels.letters, value: `${cleanWord.length} ${labels.letters}` },
    { type: labels.firstLetter, value: cleanWord[0].toUpperCase() },
    { type: labels.lastLetter, value: cleanWord[cleanWord.length - 1].toUpperCase() },
    { type: labels.startsWith, value: cleanWord.slice(0, Math.min(3, cleanWord.length)).toUpperCase() },
  ];
};
