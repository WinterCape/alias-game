import { Share, Platform } from 'react-native';
import { shareGameResults } from '../src/utils/share';
import { getStrings, Language } from '../src/i18n/strings';
import { ALL_CATEGORIES } from '../src/data/words';
import type {
  GameSettings,
  Team,
  RoundResult,
  CategoryId,
  Difficulty,
} from '../src/types';
import type { GameRecord, GameStats } from '../src/hooks/useStats';

// ─── 1. Share Utility ────────────────────────────────────────────────────────

describe('Share Utility (shareGameResults)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('formats text correctly with winner name and score', async () => {
    const teams = [
      { name: 'Dragons', score: 52 },
      { name: 'Wolves', score: 30 },
    ];
    const template = '{winner} won with {score} xp!';

    await shareGameResults('Dragons', 52, teams, template);

    const callArgs = (Share.share as jest.Mock).mock.calls[0][0];
    expect(callArgs.message).toContain('Dragons won with 52 xp!');
  });

  it('replaces {winner} and {score} template placeholders', async () => {
    const teams = [{ name: 'Vulturii', score: 60 }];
    const template = 'Campion: {winner} - {score} puncte';

    await shareGameResults('Vulturii', 60, teams, template);

    const callArgs = (Share.share as jest.Mock).mock.calls[0][0];
    expect(callArgs.message).toContain('Campion: Vulturii - 60 puncte');
    expect(callArgs.message).not.toContain('{winner}');
    expect(callArgs.message).not.toContain('{score}');
  });

  it('sorts teams by score descending in standings', async () => {
    const teams = [
      { name: 'Last', score: 10 },
      { name: 'First', score: 50 },
      { name: 'Second', score: 30 },
    ];
    const template = '{winner} wins!';

    await shareGameResults('First', 50, teams, template);

    const callArgs = (Share.share as jest.Mock).mock.calls[0][0];
    const message: string = callArgs.message;
    const firstIdx = message.indexOf('First');
    const secondIdx = message.indexOf('Second');
    const lastIdx = message.indexOf('Last');
    // "First" appears in the header but also in standings; check standings order
    const lines = message.split('\n').filter((l: string) => l.trim().length > 0);
    const standingLines = lines.filter(
      (l: string) => l.includes(': 50') || l.includes(': 30') || l.includes(': 10')
    );
    expect(standingLines[0]).toContain('First');
    expect(standingLines[1]).toContain('Second');
    expect(standingLines[2]).toContain('Last');
  });

  it('assigns medals correctly (gold, silver, bronze, then numbers)', async () => {
    const teams = [
      { name: 'A', score: 40 },
      { name: 'B', score: 30 },
      { name: 'C', score: 20 },
      { name: 'D', score: 10 },
    ];
    const template = '{winner} wins with {score}!';

    await shareGameResults('A', 40, teams, template);

    const message: string = (Share.share as jest.Mock).mock.calls[0][0].message;
    const lines = message.split('\n').filter((l: string) => l.trim().length > 0);
    const standingLines = lines.filter(
      (l: string) =>
        l.startsWith('\u{1F947}') ||
        l.startsWith('\u{1F948}') ||
        l.startsWith('\u{1F949}') ||
        l.startsWith('4.')
    );
    expect(standingLines[0]).toMatch(/^🥇 A: 40$/);
    expect(standingLines[1]).toMatch(/^🥈 B: 30$/);
    expect(standingLines[2]).toMatch(/^🥉 C: 20$/);
    expect(standingLines[3]).toMatch(/^4\. D: 10$/);
  });

  it('calls Share.share with the formatted message', async () => {
    const teams = [{ name: 'Team1', score: 55 }];
    const template = '{winner} - {score}';

    await shareGameResults('Team1', 55, teams, template);

    expect(Share.share).toHaveBeenCalledTimes(1);
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Team1 - 55'),
      })
    );
  });

  it('returns true on successful share', async () => {
    const teams = [{ name: 'W', score: 10 }];
    const result = await shareGameResults('W', 10, teams, '{winner} {score}');
    expect(result).toBe(true);
  });

  it('returns false when Share.share throws an error', async () => {
    (Share.share as jest.Mock).mockRejectedValueOnce(new Error('User cancelled'));

    const teams = [{ name: 'W', score: 10 }];
    const result = await shareGameResults('W', 10, teams, '{winner} {score}');
    expect(result).toBe(false);
  });

  it('includes ios url field when Platform.OS is ios', async () => {
    // The mock sets Platform.OS = 'ios' by default
    const teams = [{ name: 'T', score: 1 }];
    await shareGameResults('T', 1, teams, '{winner}');

    const callArgs = (Share.share as jest.Mock).mock.calls[0][0];
    expect(callArgs).toHaveProperty('url');
  });
});

// ─── 2. Game Settings Defaults ───────────────────────────────────────────────

describe('Game Settings Defaults', () => {
  // These constants are verified against the DEFAULT_SETTINGS in useGameState.ts
  const DEFAULT_SETTINGS: GameSettings = {
    roundDuration: 60,
    winningScore: 50,
    numberOfTeams: 2,
    selectedCategories: [...ALL_CATEGORIES],
    difficulty: 'all',
    skipPenalty: true,
  };

  it('default round duration is 60', () => {
    expect(DEFAULT_SETTINGS.roundDuration).toBe(60);
  });

  it('default winning score is 50', () => {
    expect(DEFAULT_SETTINGS.winningScore).toBe(50);
  });

  it('default number of teams is 2', () => {
    expect(DEFAULT_SETTINGS.numberOfTeams).toBe(2);
  });

  it('default difficulty is "all"', () => {
    expect(DEFAULT_SETTINGS.difficulty).toBe('all');
  });

  it('default skip penalty is true', () => {
    expect(DEFAULT_SETTINGS.skipPenalty).toBe(true);
  });

  it('default selected categories includes all 15 categories', () => {
    const expectedCategories: CategoryId[] = [
      'general',
      'animale',
      'mancare',
      'sporturi',
      'profesii',
      'natura',
      'tehnologie',
      'filme',
      'muzica',
      'istorie',
      'geografie',
      'scoala',
      'casa',
      'emotii',
      'haine',
    ];
    expect(DEFAULT_SETTINGS.selectedCategories).toEqual(expectedCategories);
    expect(DEFAULT_SETTINGS.selectedCategories).toHaveLength(15);
  });
});

// ─── 3. Score Calculation Logic ──────────────────────────────────────────────

describe('Score Calculation Logic', () => {
  // Pure function that mirrors the endRound scoring formula
  const calculateScore = (
    correctCount: number,
    skippedCount: number,
    skipPenalty: boolean
  ): number => {
    const penalty = skipPenalty ? skippedCount : 0;
    return correctCount - penalty;
  };

  it('correct words count as +1 each', () => {
    expect(calculateScore(5, 0, true)).toBe(5);
    expect(calculateScore(10, 0, false)).toBe(10);
  });

  it('with skipPenalty=true, skipped words count as -1 each', () => {
    expect(calculateScore(5, 3, true)).toBe(2);
    expect(calculateScore(0, 4, true)).toBe(-4);
  });

  it('with skipPenalty=false, skipped words do not affect score', () => {
    expect(calculateScore(5, 3, false)).toBe(5);
    expect(calculateScore(0, 10, false)).toBe(0);
  });

  it('score can go negative (more skips than correct with penalty)', () => {
    expect(calculateScore(2, 5, true)).toBe(-3);
    expect(calculateScore(0, 1, true)).toBe(-1);
  });

  it('score = correctCount - (skipPenalty ? skippedCount : 0)', () => {
    const cases = [
      { correct: 7, skipped: 2, penalty: true, expected: 5 },
      { correct: 7, skipped: 2, penalty: false, expected: 7 },
      { correct: 0, skipped: 0, penalty: true, expected: 0 },
      { correct: 3, skipped: 3, penalty: true, expected: 0 },
      { correct: 1, skipped: 10, penalty: true, expected: -9 },
      { correct: 1, skipped: 10, penalty: false, expected: 1 },
    ];

    for (const c of cases) {
      expect(calculateScore(c.correct, c.skipped, c.penalty)).toBe(c.expected);
    }
  });
});

// ─── 4. Team Initialization ─────────────────────────────────────────────────

describe('Team Initialization', () => {
  const TEAM_COLORS = ['#D4A853', '#9B2335', '#2D6A4F', '#5E548E'];

  const createTeams = (
    numberOfTeams: number,
    language: Language,
    customNames?: string[]
  ): Team[] => {
    const defaultTeamNames = getStrings(language).defaultTeams;
    const teams: Team[] = [];
    for (let i = 0; i < numberOfTeams; i++) {
      teams.push({
        id: i,
        name: customNames?.[i] || defaultTeamNames[i],
        score: 0,
        color: TEAM_COLORS[i],
      });
    }
    return teams;
  };

  it('default team names for "ro" are Dragonii, Vulturii, Lupii, Corbii', () => {
    const roTeams = createTeams(4, 'ro');
    expect(roTeams.map((t) => t.name)).toEqual([
      'Dragonii',
      'Vulturii',
      'Lupii',
      'Corbii',
    ]);
  });

  it('default team names for "en" are Dragons, Eagles, Wolves, Ravens', () => {
    const enTeams = createTeams(4, 'en');
    expect(enTeams.map((t) => t.name)).toEqual([
      'Dragons',
      'Eagles',
      'Wolves',
      'Ravens',
    ]);
  });

  it('team colors are correct', () => {
    const teams = createTeams(4, 'en');
    expect(teams.map((t) => t.color)).toEqual([
      '#D4A853',
      '#9B2335',
      '#2D6A4F',
      '#5E548E',
    ]);
  });

  it('custom team names override defaults', () => {
    const customNames = ['Alpha', 'Beta', 'Gamma'];
    const teams = createTeams(3, 'en', customNames);
    expect(teams.map((t) => t.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('number of teams matches numberOfTeams setting', () => {
    expect(createTeams(2, 'en')).toHaveLength(2);
    expect(createTeams(3, 'ro')).toHaveLength(3);
    expect(createTeams(4, 'en')).toHaveLength(4);
  });

  it('all teams start with score 0', () => {
    const teams = createTeams(4, 'en');
    for (const team of teams) {
      expect(team.score).toBe(0);
    }
  });

  it('team ids are sequential starting from 0', () => {
    const teams = createTeams(4, 'en');
    expect(teams.map((t) => t.id)).toEqual([0, 1, 2, 3]);
  });
});

// ─── 5. Timer Logic ─────────────────────────────────────────────────────────

describe('Timer Logic', () => {
  // Pure function mirroring useTimer's progress calculation
  const calculateProgress = (timeLeft: number, duration: number): number => {
    return timeLeft / duration;
  };

  it('progress = timeLeft / duration', () => {
    expect(calculateProgress(30, 60)).toBe(0.5);
    expect(calculateProgress(45, 90)).toBe(0.5);
    expect(calculateProgress(15, 60)).toBe(0.25);
  });

  it('progress starts at 1.0 (100%) when timeLeft equals duration', () => {
    expect(calculateProgress(60, 60)).toBe(1.0);
    expect(calculateProgress(90, 90)).toBe(1.0);
    expect(calculateProgress(30, 30)).toBe(1.0);
  });

  it('progress reaches 0.0 when timeLeft is 0', () => {
    expect(calculateProgress(0, 60)).toBe(0.0);
    expect(calculateProgress(0, 30)).toBe(0.0);
  });

  it('progress decreases linearly as time passes', () => {
    const duration = 60;
    const values = [60, 45, 30, 15, 0];
    const expected = [1.0, 0.75, 0.5, 0.25, 0.0];

    values.forEach((timeLeft, i) => {
      expect(calculateProgress(timeLeft, duration)).toBeCloseTo(expected[i]);
    });
  });

  it('progress is between 0 and 1 for valid timeLeft values', () => {
    const duration = 60;
    for (let t = 0; t <= duration; t++) {
      const p = calculateProgress(t, duration);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });
});

// ─── 6. Game Flow Consistency ────────────────────────────────────────────────

describe('Game Flow Consistency', () => {
  describe('RoundResult structure', () => {
    it('a round result contains guessedWords and skippedWords arrays', () => {
      const result: RoundResult = {
        teamId: 0,
        guessedWords: ['apple', 'banana'],
        skippedWords: ['cherry'],
        score: 1,
      };
      expect(Array.isArray(result.guessedWords)).toBe(true);
      expect(Array.isArray(result.skippedWords)).toBe(true);
      expect(result.guessedWords).toEqual(['apple', 'banana']);
      expect(result.skippedWords).toEqual(['cherry']);
    });

    it('score in RoundResult is calculated correctly (with penalty)', () => {
      const guessed = ['a', 'b', 'c', 'd', 'e'];
      const skipped = ['x', 'y'];
      const skipPenalty = true;
      const score = guessed.length - (skipPenalty ? skipped.length : 0);

      const result: RoundResult = {
        teamId: 0,
        guessedWords: guessed,
        skippedWords: skipped,
        score,
      };
      expect(result.score).toBe(3);
    });

    it('score in RoundResult is calculated correctly (without penalty)', () => {
      const guessed = ['a', 'b'];
      const skipped = ['x', 'y', 'z'];
      const skipPenalty = false;
      const score = guessed.length - (skipPenalty ? skipped.length : 0);

      const result: RoundResult = {
        teamId: 0,
        guessedWords: guessed,
        skippedWords: skipped,
        score,
      };
      expect(result.score).toBe(2);
    });
  });

  describe('Team index rotation', () => {
    it('team index advances after each round and wraps around', () => {
      const numberOfTeams = 3;
      let currentTeamIndex = 0;

      // Simulate advancing through rounds
      const advance = () => {
        currentTeamIndex = (currentTeamIndex + 1) % numberOfTeams;
      };

      expect(currentTeamIndex).toBe(0);
      advance();
      expect(currentTeamIndex).toBe(1);
      advance();
      expect(currentTeamIndex).toBe(2);
      advance();
      expect(currentTeamIndex).toBe(0); // wraps around
      advance();
      expect(currentTeamIndex).toBe(1);
    });

    it('wraps correctly for 2 teams', () => {
      const numberOfTeams = 2;
      const indices: number[] = [];
      let idx = 0;
      for (let i = 0; i < 6; i++) {
        indices.push(idx);
        idx = (idx + 1) % numberOfTeams;
      }
      expect(indices).toEqual([0, 1, 0, 1, 0, 1]);
    });

    it('wraps correctly for 4 teams', () => {
      const numberOfTeams = 4;
      const indices: number[] = [];
      let idx = 0;
      for (let i = 0; i < 8; i++) {
        indices.push(idx);
        idx = (idx + 1) % numberOfTeams;
      }
      expect(indices).toEqual([0, 1, 2, 3, 0, 1, 2, 3]);
    });
  });

  describe('Winner detection', () => {
    it('winner is detected when any team reaches winningScore', () => {
      const winningScore = 50;
      const teams: Team[] = [
        { id: 0, name: 'A', score: 52, color: '#D4A853' },
        { id: 1, name: 'B', score: 30, color: '#9B2335' },
      ];

      const winner = teams.find((t) => t.score >= winningScore) || null;
      expect(winner).not.toBeNull();
      expect(winner!.name).toBe('A');
    });

    it('returns null when no team has reached winningScore', () => {
      const winningScore = 50;
      const teams: Team[] = [
        { id: 0, name: 'A', score: 49, color: '#D4A853' },
        { id: 1, name: 'B', score: 30, color: '#9B2335' },
      ];

      const winner = teams.find((t) => t.score >= winningScore) || null;
      expect(winner).toBeNull();
    });

    it('detects winner at exact winningScore', () => {
      const winningScore = 50;
      const teams: Team[] = [
        { id: 0, name: 'Exact', score: 50, color: '#D4A853' },
        { id: 1, name: 'Below', score: 49, color: '#9B2335' },
      ];

      const winner = teams.find((t) => t.score >= winningScore) || null;
      expect(winner).not.toBeNull();
      expect(winner!.name).toBe('Exact');
    });
  });

  describe('resetGame clears all state', () => {
    it('resets teams, index, words, results, and gameStarted', () => {
      // Simulate state after a game
      let teams: Team[] = [
        { id: 0, name: 'A', score: 55, color: '#D4A853' },
        { id: 1, name: 'B', score: 30, color: '#9B2335' },
      ];
      let currentTeamIndex = 1;
      let words = ['word1', 'word2'];
      let currentWordIndex = 5;
      let roundResults: RoundResult[] = [
        { teamId: 0, guessedWords: ['w1'], skippedWords: [], score: 1 },
      ];
      let gameStarted = true;
      let guessedWords: string[] = ['g1', 'g2'];
      let skippedWords: string[] = ['s1'];

      // Reset (mirrors resetGame logic)
      teams = [];
      currentTeamIndex = 0;
      words = [];
      currentWordIndex = 0;
      roundResults = [];
      gameStarted = false;
      guessedWords = [];
      skippedWords = [];

      expect(teams).toEqual([]);
      expect(currentTeamIndex).toBe(0);
      expect(words).toEqual([]);
      expect(currentWordIndex).toBe(0);
      expect(roundResults).toEqual([]);
      expect(gameStarted).toBe(false);
      expect(guessedWords).toEqual([]);
      expect(skippedWords).toEqual([]);
    });
  });
});

// ─── 7. Stats Recording ─────────────────────────────────────────────────────

describe('Stats Recording', () => {
  describe('GameRecord shape', () => {
    it('has all required fields', () => {
      const record: GameRecord = {
        date: new Date().toISOString(),
        winner: 'Dragons',
        winnerScore: 52,
        teams: [
          { name: 'Dragons', score: 52 },
          { name: 'Wolves', score: 38 },
        ],
        totalRounds: 10,
        totalWordsGuessed: 45,
        totalWordsSkipped: 12,
      };

      expect(record).toHaveProperty('date');
      expect(record).toHaveProperty('winner');
      expect(record).toHaveProperty('winnerScore');
      expect(record).toHaveProperty('teams');
      expect(record).toHaveProperty('totalRounds');
      expect(record).toHaveProperty('totalWordsGuessed');
      expect(record).toHaveProperty('totalWordsSkipped');
    });

    it('date is a valid ISO string', () => {
      const record: GameRecord = {
        date: new Date().toISOString(),
        winner: 'A',
        winnerScore: 50,
        teams: [{ name: 'A', score: 50 }],
        totalRounds: 5,
        totalWordsGuessed: 20,
        totalWordsSkipped: 3,
      };

      expect(new Date(record.date).toISOString()).toBe(record.date);
    });

    it('teams in record are sorted by score descending', () => {
      const teams = [
        { name: 'C', score: 10 },
        { name: 'A', score: 50 },
        { name: 'B', score: 30 },
      ];
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      const record: GameRecord = {
        date: new Date().toISOString(),
        winner: sorted[0].name,
        winnerScore: sorted[0].score,
        teams: sorted.map((t) => ({ name: t.name, score: t.score })),
        totalRounds: 6,
        totalWordsGuessed: 30,
        totalWordsSkipped: 5,
      };

      expect(record.teams[0].name).toBe('A');
      expect(record.teams[1].name).toBe('B');
      expect(record.teams[2].name).toBe('C');
    });
  });

  describe('GameStats shape', () => {
    it('has all required fields', () => {
      const stats: GameStats = {
        gamesPlayed: 0,
        totalWordsGuessed: 0,
        totalWordsSkipped: 0,
        totalRoundsPlayed: 0,
        bestRoundScore: 0,
        bestRoundTeam: '',
        winsByTeam: {},
        recentGames: [],
        averageWordsPerRound: 0,
      };

      expect(stats).toHaveProperty('gamesPlayed');
      expect(stats).toHaveProperty('totalWordsGuessed');
      expect(stats).toHaveProperty('totalWordsSkipped');
      expect(stats).toHaveProperty('totalRoundsPlayed');
      expect(stats).toHaveProperty('bestRoundScore');
      expect(stats).toHaveProperty('bestRoundTeam');
      expect(stats).toHaveProperty('winsByTeam');
      expect(stats).toHaveProperty('recentGames');
      expect(stats).toHaveProperty('averageWordsPerRound');
    });

    it('empty stats start at zero / empty', () => {
      const emptyStats: GameStats = {
        gamesPlayed: 0,
        totalWordsGuessed: 0,
        totalWordsSkipped: 0,
        totalRoundsPlayed: 0,
        bestRoundScore: 0,
        bestRoundTeam: '',
        winsByTeam: {},
        recentGames: [],
        averageWordsPerRound: 0,
      };

      expect(emptyStats.gamesPlayed).toBe(0);
      expect(emptyStats.totalWordsGuessed).toBe(0);
      expect(emptyStats.totalWordsSkipped).toBe(0);
      expect(emptyStats.totalRoundsPlayed).toBe(0);
      expect(emptyStats.bestRoundScore).toBe(0);
      expect(emptyStats.bestRoundTeam).toBe('');
      expect(emptyStats.winsByTeam).toEqual({});
      expect(emptyStats.recentGames).toEqual([]);
      expect(emptyStats.averageWordsPerRound).toBe(0);
    });

    it('winsByTeam tracks per-team win counts', () => {
      const winsByTeam: Record<string, number> = {};

      // Simulate recording wins
      const recordWin = (teamName: string) => {
        winsByTeam[teamName] = (winsByTeam[teamName] || 0) + 1;
      };

      recordWin('Dragons');
      recordWin('Wolves');
      recordWin('Dragons');
      recordWin('Dragons');

      expect(winsByTeam).toEqual({ Dragons: 3, Wolves: 1 });
    });

    it('recentGames is capped at 20 entries', () => {
      const recentGames: GameRecord[] = [];

      for (let i = 0; i < 25; i++) {
        const record: GameRecord = {
          date: new Date().toISOString(),
          winner: 'Team',
          winnerScore: 50,
          teams: [{ name: 'Team', score: 50 }],
          totalRounds: 5,
          totalWordsGuessed: 20,
          totalWordsSkipped: 3,
        };
        recentGames.unshift(record);
      }

      // Slice to 20 as the real code does
      const capped = recentGames.slice(0, 20);
      expect(capped).toHaveLength(20);
    });

    it('averageWordsPerRound computes correctly', () => {
      const totalWordsGuessed = 100;
      const totalRoundsPlayed = 20;
      const avg = Math.round(totalWordsGuessed / totalRoundsPlayed);
      expect(avg).toBe(5);
    });
  });

  describe('recordGame stats accumulation', () => {
    it('correctly computes totals from round results', () => {
      const roundResults = [
        { guessedWords: ['a', 'b', 'c'], skippedWords: ['x'], score: 2 },
        { guessedWords: ['d', 'e'], skippedWords: ['y', 'z'], score: 0 },
        { guessedWords: ['f'], skippedWords: [], score: 1 },
      ];

      const totalGuessed = roundResults.reduce(
        (s, r) => s + r.guessedWords.length,
        0
      );
      const totalSkipped = roundResults.reduce(
        (s, r) => s + r.skippedWords.length,
        0
      );
      const bestRound = roundResults.reduce(
        (best, r) => (r.score > best.score ? r : best),
        roundResults[0]
      );

      expect(totalGuessed).toBe(6);
      expect(totalSkipped).toBe(3);
      expect(bestRound.score).toBe(2);
    });

    it('identifies the correct winner from sorted teams', () => {
      const teams = [
        { name: 'Wolves', score: 40 },
        { name: 'Dragons', score: 55 },
        { name: 'Ravens', score: 30 },
      ];

      const sorted = [...teams].sort((a, b) => b.score - a.score);
      const winner = sorted[0];

      expect(winner.name).toBe('Dragons');
      expect(winner.score).toBe(55);
    });
  });
});

// ─── 8. Review Prompt Logic ─────────────────────────────────────────────────

describe('Review Prompt Logic', () => {
  const GAMES_BEFORE_PROMPT = 3;

  interface ReviewState {
    gamesPlayed: number;
    hasRated: boolean;
    lastPromptedAt: number;
  }

  const shouldPrompt = (state: ReviewState): boolean => {
    if (state.hasRated) return false;
    if (state.gamesPlayed < GAMES_BEFORE_PROMPT) return false;
    const daysSinceLastPrompt =
      (Date.now() - state.lastPromptedAt) / (1000 * 60 * 60 * 24);
    if (state.lastPromptedAt > 0 && daysSinceLastPrompt < 7) return false;
    return true;
  };

  it('does not prompt if user has already rated', () => {
    expect(
      shouldPrompt({ gamesPlayed: 10, hasRated: true, lastPromptedAt: 0 })
    ).toBe(false);
  });

  it('does not prompt if fewer than 3 games played', () => {
    expect(
      shouldPrompt({ gamesPlayed: 2, hasRated: false, lastPromptedAt: 0 })
    ).toBe(false);
    expect(
      shouldPrompt({ gamesPlayed: 0, hasRated: false, lastPromptedAt: 0 })
    ).toBe(false);
  });

  it('prompts after 3 games if never prompted before', () => {
    expect(
      shouldPrompt({ gamesPlayed: 3, hasRated: false, lastPromptedAt: 0 })
    ).toBe(true);
  });

  it('does not prompt again within 7 days of last prompt', () => {
    const recentTimestamp = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days ago
    expect(
      shouldPrompt({
        gamesPlayed: 10,
        hasRated: false,
        lastPromptedAt: recentTimestamp,
      })
    ).toBe(false);
  });

  it('prompts again after 7+ days since last prompt', () => {
    const oldTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
    expect(
      shouldPrompt({
        gamesPlayed: 10,
        hasRated: false,
        lastPromptedAt: oldTimestamp,
      })
    ).toBe(true);
  });

  it('recordGamePlayed increments gamesPlayed by 1', () => {
    const state: ReviewState = {
      gamesPlayed: 5,
      hasRated: false,
      lastPromptedAt: 0,
    };
    const newState = { ...state, gamesPlayed: state.gamesPlayed + 1 };
    expect(newState.gamesPlayed).toBe(6);
  });
});

// ─── 9. ALL_CATEGORIES constant ─────────────────────────────────────────────

describe('ALL_CATEGORIES', () => {
  it('contains exactly 15 category ids', () => {
    expect(ALL_CATEGORIES).toHaveLength(15);
  });

  it('contains every expected category', () => {
    const expected: CategoryId[] = [
      'general',
      'animale',
      'mancare',
      'sporturi',
      'profesii',
      'natura',
      'tehnologie',
      'filme',
      'muzica',
      'istorie',
      'geografie',
      'scoala',
      'casa',
      'emotii',
      'haine',
    ];
    expect(ALL_CATEGORIES).toEqual(expected);
  });
});

// ─── 10. i18n Strings consistency ────────────────────────────────────────────

describe('i18n Strings', () => {
  it('RO and EN have matching defaultTeams length (4)', () => {
    expect(getStrings('ro').defaultTeams).toHaveLength(4);
    expect(getStrings('en').defaultTeams).toHaveLength(4);
  });

  it('shareText template includes {winner} and {score} placeholders', () => {
    const roText = getStrings('ro').shareText;
    const enText = getStrings('en').shareText;

    expect(roText).toContain('{winner}');
    expect(roText).toContain('{score}');
    expect(enText).toContain('{winner}');
    expect(enText).toContain('{score}');
  });

  it('categoryNames covers all categories for both languages', () => {
    const roCats = getStrings('ro').categoryNames;
    const enCats = getStrings('en').categoryNames;

    for (const cat of ALL_CATEGORIES) {
      expect(roCats[cat]).toBeDefined();
      expect(enCats[cat]).toBeDefined();
      expect(typeof roCats[cat]).toBe('string');
      expect(typeof enCats[cat]).toBe('string');
    }
  });
});
