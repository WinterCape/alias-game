import {
  applyRoundScores,
  scoreRound,
  toggleRoundWord,
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

describe('Round scoring', () => {
  const round = { teamId: 0, guessedWords: ['a', 'b', 'c'], skippedWords: ['d'] };

  test('guessed words minus skips when the penalty is on', () => {
    expect(scoreRound(round, true)).toEqual({ 0: 2 });
    expect(scoreRound(round, false)).toEqual({ 0: 3 });
  });

  test('the last word adds a point to whoever guessed it, never a penalty', () => {
    expect(scoreRound({ ...round, lastWord: { word: 'e', teamId: 0 } }, true)).toEqual({ 0: 3 });
    expect(scoreRound({ ...round, lastWord: { word: 'e', teamId: 1 } }, true)).toEqual({ 0: 2, 1: 1 });
    expect(scoreRound({ ...round, lastWord: { word: 'e', teamId: null } }, true)).toEqual({ 0: 2 });
  });

  test('applying and removing points is symmetric', () => {
    const teams = [team(0, 10), team(1, 5)];
    const points = { 0: 2, 1: 1 };
    const added = applyRoundScores(teams, points);
    expect(added.map((t) => t.score)).toEqual([12, 6]);
    expect(applyRoundScores(added, points, -1).map((t) => t.score)).toEqual([10, 5]);
  });

  test('a reviewed word moves between guessed and skipped', () => {
    const fixed = toggleRoundWord(round, 'd');
    expect(fixed.guessedWords).toEqual(['a', 'b', 'c', 'd']);
    expect(fixed.skippedWords).toEqual([]);
    const back = toggleRoundWord(fixed, 'a');
    expect(back.guessedWords).toEqual(['b', 'c', 'd']);
    expect(back.skippedWords).toEqual(['a']);
    expect(toggleRoundWord(round, 'unknown')).toBe(round);
  });

  test('correcting a round moves the score by the difference', () => {
    const teams = [team(0, 10), team(1, 5)];
    const before = { ...round, lastWord: { word: 'e', teamId: null } };
    const after = { ...toggleRoundWord(before, 'd'), lastWord: { word: 'e', teamId: 1 } };
    const revised = applyRoundScores(
      applyRoundScores(teams, scoreRound(before, true), -1),
      scoreRound(after, true)
    );
    // Team 0: 10 - 2 + 4; team 1: 5 + 1
    expect(revised.map((t) => t.score)).toEqual([12, 6]);
  });
});
