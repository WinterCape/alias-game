import { getTaskPool, pickTask, TASKS, TaskFrequency } from '../src/data/tasks';
import { Language } from '../src/i18n/strings';

const LANGUAGES: Language[] = ['ro', 'en', 'es', 'fr', 'ru'];

// Deterministic "random" numbers for the picking tests
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('Task data', () => {
  test('every task has a unique id', () => {
    const ids = TASKS.map((task) => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every task is written in all five languages', () => {
    for (const task of TASKS) {
      for (const lang of LANGUAGES) {
        expect(task.text[lang]?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('every group has tasks', () => {
    for (const group of ['emotions', 'roles', 'moves', 'special']) {
      expect(TASKS.some((task) => task.group === group)).toBe(true);
    }
  });
});

describe('Task pool', () => {
  test('uses the current language', () => {
    const pool = getTaskPool('fr');
    expect(pool.length).toBe(TASKS.length);
    expect(pool[0].text).toBe(TASKS[0].text.fr);
  });

  test('leaves out switched-off tasks and adds custom ones', () => {
    const pool = getTaskPool('ro', [TASKS[0].id, 'custom-2'], [
      { id: 'custom-1', text: '  Explică în șoaptă de pirat  ' },
      { id: 'custom-2', text: 'Oprită' },
      { id: 'custom-3', text: '   ' },
    ]);
    expect(pool.find((task) => task.id === TASKS[0].id)).toBeUndefined();
    expect(pool.filter((task) => task.group === 'custom')).toEqual([
      { id: 'custom-1', group: 'custom', text: 'Explică în șoaptă de pirat' },
    ]);
  });
});

describe('Picking a task', () => {
  const pool = getTaskPool('en').slice(0, 3);

  test('off, or an empty pool, never gives a task', () => {
    expect(pickTask(pool, 'off', null, sequence(0))).toBeNull();
    expect(pickTask([], 'always', null, sequence(0))).toBeNull();
  });

  test('always gives a task', () => {
    expect(pickTask(pool, 'always', null, sequence(0.99))).not.toBeNull();
  });

  test('rare and often follow their chance', () => {
    const cases: [TaskFrequency, number, boolean][] = [
      ['rare', 0.2, true],
      ['rare', 0.3, false],
      ['often', 0.45, true],
      ['often', 0.55, false],
    ];
    for (const [frequency, roll, expected] of cases) {
      expect(pickTask(pool, frequency, null, sequence(roll, 0)) !== null).toBe(expected);
    }
  });

  test('does not repeat the previous task when there is another', () => {
    for (let roll = 0; roll < 1; roll += 0.1) {
      expect(pickTask(pool, 'always', pool[0].id, sequence(roll))?.id).not.toBe(pool[0].id);
    }
  });

  test('a single task can repeat', () => {
    expect(pickTask(pool.slice(0, 1), 'always', pool[0].id, sequence(0))?.id).toBe(pool[0].id);
  });
});
