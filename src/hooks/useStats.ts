import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@alias_game_stats';

export interface GameRecord {
  date: string;
  winner: string;
  winnerScore: number;
  teams: { name: string; score: number }[];
  totalRounds: number;
  totalWordsGuessed: number;
  totalWordsSkipped: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalWordsGuessed: number;
  totalWordsSkipped: number;
  totalRoundsPlayed: number;
  bestRoundScore: number;
  bestRoundTeam: string;
  winsByTeam: Record<string, number>;
  recentGames: GameRecord[];
  averageWordsPerRound: number;
}

const EMPTY_STATS: GameStats = {
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

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(EMPTY_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STATS_KEY).then((saved) => {
      if (saved) {
        try {
          setStats(JSON.parse(saved));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const saveStats = useCallback(async (newStats: GameStats) => {
    setStats(newStats);
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats)).catch(() => {});
  }, []);

  const recordGame = useCallback(
    async (
      teams: { name: string; score: number }[],
      roundResults: { guessedWords: string[]; skippedWords: string[]; score: number }[]
    ) => {
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      const winner = sorted[0];

      const totalGuessed = roundResults.reduce((s, r) => s + r.guessedWords.length, 0);
      const totalSkipped = roundResults.reduce((s, r) => s + r.skippedWords.length, 0);
      const bestRound = roundResults.reduce(
        (best, r) => (r.score > best.score ? r : best),
        roundResults[0]
      );

      const record: GameRecord = {
        date: new Date().toISOString(),
        winner: winner.name,
        winnerScore: winner.score,
        teams: sorted.map((t) => ({ name: t.name, score: t.score })),
        totalRounds: roundResults.length,
        totalWordsGuessed: totalGuessed,
        totalWordsSkipped: totalSkipped,
      };

      const newStats: GameStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        totalWordsGuessed: stats.totalWordsGuessed + totalGuessed,
        totalWordsSkipped: stats.totalWordsSkipped + totalSkipped,
        totalRoundsPlayed: stats.totalRoundsPlayed + roundResults.length,
        bestRoundScore:
          bestRound && bestRound.score > stats.bestRoundScore
            ? bestRound.score
            : stats.bestRoundScore,
        bestRoundTeam:
          bestRound && bestRound.score > stats.bestRoundScore
            ? winner.name
            : stats.bestRoundTeam,
        winsByTeam: {
          ...stats.winsByTeam,
          [winner.name]: (stats.winsByTeam[winner.name] || 0) + 1,
        },
        recentGames: [record, ...stats.recentGames].slice(0, 20),
        averageWordsPerRound:
          roundResults.length > 0
            ? Math.round(
                (stats.totalWordsGuessed + totalGuessed) /
                  (stats.totalRoundsPlayed + roundResults.length)
              )
            : stats.averageWordsPerRound,
      };

      await saveStats(newStats);
    },
    [stats, saveStats]
  );

  const resetStats = useCallback(async () => {
    await saveStats(EMPTY_STATS);
  }, [saveStats]);

  return { stats, loaded, recordGame, resetStats };
};
