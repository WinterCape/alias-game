import { GameSettings, RoundResult, Team } from '../types';

// An unfinished Arena game, saved between rounds so it can be resumed later
export interface SavedArenaGame {
  version: 1;
  teams: Team[];
  currentTeamIndex: number;
  roundResults: RoundResult[];
  sessionWins: Record<number, number>;
  settings: GameSettings;
  savedAt: number;
}

/** One round is every team having one turn. */
export const getRoundNumber = (roundsPlayed: number, teamCount: number): number =>
  teamCount > 0 ? Math.floor(roundsPlayed / teamCount) + 1 : 1;

/** Game number within the session: games already won plus the current one. */
export const getGameNumber = (sessionWins: Record<number, number>): number =>
  Object.values(sessionWins).reduce((sum, wins) => sum + wins, 0) + 1;

/** Rotate which team starts, so each rematch opens with a different team. */
export const getStartingTeamIndex = (gamesPlayed: number, teamCount: number): number =>
  teamCount > 0 ? gamesPlayed % teamCount : 0;

/** Validates stored data before resuming, so a corrupt save can't crash the app. */
export const parseSavedGame = (raw: string | null): SavedArenaGame | null => {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (
      data?.version !== 1 ||
      !Array.isArray(data.teams) ||
      data.teams.length < 2 ||
      !Array.isArray(data.roundResults) ||
      typeof data.currentTeamIndex !== 'number' ||
      data.currentTeamIndex < 0 ||
      data.currentTeamIndex >= data.teams.length ||
      typeof data.settings?.winningScore !== 'number'
    ) {
      return null;
    }
    // A finished game is never resumed
    if (data.teams.some((t: Team) => t.score >= data.settings.winningScore)) return null;
    return { ...data, sessionWins: data.sessionWins ?? {} };
  } catch {
    return null;
  }
};

/** Points each team gets from one round. The last word is never penalised. */
export const scoreRound = (
  round: Pick<RoundResult, 'teamId' | 'guessedWords' | 'skippedWords' | 'lastWord'>,
  skipPenalty: boolean
): Record<number, number> => {
  const points: Record<number, number> = {
    [round.teamId]: round.guessedWords.length - (skipPenalty ? round.skippedWords.length : 0),
  };
  const lastTeam = round.lastWord?.teamId;
  if (lastTeam !== null && lastTeam !== undefined) {
    points[lastTeam] = (points[lastTeam] ?? 0) + 1;
  }
  return points;
};

/** Adds (sign 1) or removes (sign -1) a round's points from the teams. */
export const applyRoundScores = (
  teams: Team[],
  points: Record<number, number>,
  sign: 1 | -1 = 1
): Team[] =>
  teams.map((team) =>
    points[team.id] ? { ...team, score: team.score + sign * points[team.id] } : team
  );

/** Moves a word between the guessed and skipped lists of a round. */
export const toggleRoundWord = <T extends Pick<RoundResult, 'guessedWords' | 'skippedWords'>>(
  round: T,
  word: string
): T => {
  if (round.guessedWords.includes(word)) {
    return {
      ...round,
      guessedWords: round.guessedWords.filter((w) => w !== word),
      skippedWords: [...round.skippedWords, word],
    };
  }
  if (round.skippedWords.includes(word)) {
    return {
      ...round,
      skippedWords: round.skippedWords.filter((w) => w !== word),
      guessedWords: [...round.guessedWords, word],
    };
  }
  return round;
};
