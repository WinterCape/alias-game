import {
  getGameNumber,
  getRoundNumber,
  getStartingTeamIndex,
  parseSavedGame,
  SavedArenaGame,
} from '../src/hooks/arenaSession';

const team = (id: number, score: number) => ({ id, name: `Team ${id}`, score, color: '#fff' });

const savedGame = (overrides: Partial<SavedArenaGame> = {}): SavedArenaGame => ({
  version: 1,
  teams: [team(0, 12), team(1, 8)],
  currentTeamIndex: 1,
  roundResults: [],
  sessionWins: {},
  settings: {
    roundDuration: 60,
    winningScore: 50,
    numberOfTeams: 2,
    selectedCategories: ['general'],
    difficulty: 'all',
    skipPenalty: true,
  },
  savedAt: 0,
  ...overrides,
});

describe('Round and game numbers', () => {
  test('a round is every team having one turn', () => {
    expect(getRoundNumber(0, 2)).toBe(1);
    expect(getRoundNumber(1, 2)).toBe(1);
    expect(getRoundNumber(2, 2)).toBe(2);
    expect(getRoundNumber(5, 3)).toBe(2);
    expect(getRoundNumber(6, 3)).toBe(3);
  });

  test('round number is safe with no teams', () => {
    expect(getRoundNumber(4, 0)).toBe(1);
  });

  test('game number counts games already won plus the current one', () => {
    expect(getGameNumber({})).toBe(1);
    expect(getGameNumber({ 0: 1 })).toBe(2);
    expect(getGameNumber({ 0: 2, 1: 1 })).toBe(4);
  });

  test('each rematch starts with the next team', () => {
    expect(getStartingTeamIndex(0, 3)).toBe(0);
    expect(getStartingTeamIndex(1, 3)).toBe(1);
    expect(getStartingTeamIndex(3, 3)).toBe(0);
    expect(getStartingTeamIndex(2, 0)).toBe(0);
  });
});

describe('Saved game parsing', () => {
  test('a valid saved game is restored', () => {
    const game = savedGame();
    expect(parseSavedGame(JSON.stringify(game))).toEqual(game);
  });

  test('missing session wins default to none', () => {
    const { sessionWins, ...rest } = savedGame();
    expect(parseSavedGame(JSON.stringify(rest))?.sessionWins).toEqual({});
  });

  test('empty, corrupt or unknown data is ignored', () => {
    expect(parseSavedGame(null)).toBeNull();
    expect(parseSavedGame('')).toBeNull();
    expect(parseSavedGame('{not json')).toBeNull();
    expect(parseSavedGame(JSON.stringify({ ...savedGame(), version: 2 }))).toBeNull();
    expect(parseSavedGame(JSON.stringify({ ...savedGame(), teams: [team(0, 0)] }))).toBeNull();
    expect(parseSavedGame(JSON.stringify({ ...savedGame(), currentTeamIndex: 5 }))).toBeNull();
  });

  test('a finished game is never resumed', () => {
    expect(parseSavedGame(JSON.stringify(savedGame({ teams: [team(0, 50), team(1, 8)] })))).toBeNull();
  });
});
