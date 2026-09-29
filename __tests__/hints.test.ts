import { formatHintsLeft, formatLetterCount, generateHints } from '../src/utils/hints';

describe('Hint labels', () => {
  test('every hint label starts with a capital letter', () => {
    for (const lang of ['ro', 'en', 'es', 'fr', 'ru'] as const) {
      for (const hint of generateHints('Camelot', 'Mitologie', lang)) {
        expect(hint.type[0]).toBe(hint.type[0].toUpperCase());
      }
    }
  });

  test('the length hint shows the letter count', () => {
    const hints = generateHints('Camelot', 'Mitologie', 'ro');
    expect(hints[1]).toEqual({ type: 'Lungime', value: '7 litere' });
  });
});

describe('Letter count plurals', () => {
  test('Romanian', () => {
    expect(formatLetterCount(1, 'ro')).toBe('1 literă');
    expect(formatLetterCount(7, 'ro')).toBe('7 litere');
    expect(formatLetterCount(19, 'ro')).toBe('19 litere');
    expect(formatLetterCount(20, 'ro')).toBe('20 de litere');
  });

  test('Russian', () => {
    expect(formatLetterCount(1, 'ru')).toBe('1 буква');
    expect(formatLetterCount(3, 'ru')).toBe('3 буквы');
    expect(formatLetterCount(5, 'ru')).toBe('5 букв');
    expect(formatLetterCount(11, 'ru')).toBe('11 букв');
    expect(formatLetterCount(12, 'ru')).toBe('12 букв');
    expect(formatLetterCount(21, 'ru')).toBe('21 буква');
    expect(formatLetterCount(22, 'ru')).toBe('22 буквы');
  });

  test('English, Spanish and French', () => {
    expect(formatLetterCount(1, 'en')).toBe('1 letter');
    expect(formatLetterCount(6, 'en')).toBe('6 letters');
    expect(formatLetterCount(1, 'es')).toBe('1 letra');
    expect(formatLetterCount(6, 'es')).toBe('6 letras');
    expect(formatLetterCount(1, 'fr')).toBe('1 lettre');
    expect(formatLetterCount(6, 'fr')).toBe('6 lettres');
  });
});

describe('Hints left plurals', () => {
  test('one hint left is singular', () => {
    expect(formatHintsLeft(1, 'ro')).toBe('1 indiciu rămas');
    expect(formatHintsLeft(1, 'en')).toBe('1 hint left');
    expect(formatHintsLeft(1, 'es')).toBe('1 pista restante');
    expect(formatHintsLeft(1, 'fr')).toBe('1 indice restant');
    expect(formatHintsLeft(1, 'ru')).toBe('1 подсказка осталась');
  });

  test('Russian uses the right form for each count', () => {
    expect(formatHintsLeft(0, 'ru')).toBe('0 подсказок осталось');
    expect(formatHintsLeft(3, 'ru')).toBe('3 подсказки осталось');
    expect(formatHintsLeft(5, 'ru')).toBe('5 подсказок осталось');
  });

  test('other counts are plural', () => {
    expect(formatHintsLeft(3, 'ro')).toBe('3 indicii rămase');
    expect(formatHintsLeft(0, 'en')).toBe('0 hints left');
  });
});
