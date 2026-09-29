import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, Team, RoundResult, CategoryId } from '../types';
import { getShuffledWords, ALL_CATEGORIES } from '../data/words';
import { Language } from '../i18n/strings';
import { PackId } from '../store/packs';
import {
  applyRoundScores,
  scoreRound,
  getStartingTeamIndex,
  getGameNumber,
  parseSavedGame,
  SavedArenaGame,
} from './arenaSession';

const SETTINGS_KEY = '@alias_game_settings';
const SAVED_GAME_KEY = '@alias_saved_arena_game';

const DEFAULT_SETTINGS: GameSettings = {
  roundDuration: 60,
  winningScore: 50,
  numberOfTeams: 2,
  selectedCategories: [...ALL_CATEGORIES],
  difficulty: 'all',
  skipPenalty: true,
  arenaMode: 'classic',
  lastWordTime: 'off',
  sharedLastWord: false,
  soundEnabled: true,
};

import { getStrings } from '../i18n/strings';

const TEAM_COLORS = ['#D4A853', '#9B2335', '#2D6A4F', '#5E548E'];

export const useGameState = (language: Language = 'ro', unlockedPacks: PackId[] = []) => {
  const defaultTeamNames = getStrings(language).defaultTeams;
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  // Kept in refs so marking a word and reading the next one in the same
  // handler always see the same, up-to-date position
  const wordsRef = useRef<string[]>([]);
  const wordIndexRef = useRef(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  // Games won per team id in this session of rematches
  const [sessionWins, setSessionWins] = useState<Record<number, number>>({});
  const [savedGame, setSavedGame] = useState<SavedArenaGame | null>(null);

  const guessedWordsRef = useRef<string[]>([]);
  const skippedWordsRef = useRef<string[]>([]);

  // Load saved settings and any unfinished game on mount
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    });
    AsyncStorage.getItem(SAVED_GAME_KEY)
      .then((raw) => setSavedGame(parseSavedGame(raw)))
      .catch(() => {});
  }, []);

  // Save the game after every change between rounds; a finished game is removed.
  // A round in progress is not saved, so after a restart that team replays its turn.
  useEffect(() => {
    if (!gameStarted || teams.length === 0) return;
    const finished = teams.some((t) => t.score >= settings.winningScore);
    if (finished) {
      setSavedGame(null);
      AsyncStorage.removeItem(SAVED_GAME_KEY).catch(() => {});
      return;
    }
    const data: SavedArenaGame = {
      version: 1,
      teams,
      currentTeamIndex,
      roundResults,
      sessionWins,
      settings,
      savedAt: Date.now(),
    };
    setSavedGame(data);
    AsyncStorage.setItem(SAVED_GAME_KEY, JSON.stringify(data)).catch(() => {});
  }, [gameStarted, teams, currentTeamIndex, roundResults, sessionWins, settings]);

  const clearSavedGame = useCallback(() => {
    setSavedGame(null);
    AsyncStorage.removeItem(SAVED_GAME_KEY).catch(() => {});
  }, []);

  const initializeTeams = useCallback((teamNames?: string[]) => {
    const newTeams: Team[] = [];
    for (let i = 0; i < settings.numberOfTeams; i++) {
      newTeams.push({
        id: i,
        name: teamNames?.[i] || defaultTeamNames[i],
        score: 0,
        color: TEAM_COLORS[i],
      });
    }
    setTeams(newTeams);
    setCurrentTeamIndex(0);
    // Start each game with an empty history, even if the last one was abandoned
    setRoundResults([]);
    setSessionWins({});
    setGameStarted(true);
  }, [settings.numberOfTeams]);

  const resumeGame = useCallback((game: SavedArenaGame) => {
    // Use the settings the game was started with, without changing the saved preferences
    setSettings(game.settings);
    setTeams(game.teams);
    setCurrentTeamIndex(game.currentTeamIndex);
    setRoundResults(game.roundResults);
    setSessionWins(game.sessionWins);
    wordsRef.current = [];
    wordIndexRef.current = 0;
    setGameStarted(true);
  }, []);

  const recordWin = useCallback((teamId: number) => {
    setSessionWins((prev) => ({ ...prev, [teamId]: (prev[teamId] ?? 0) + 1 }));
  }, []);

  // Same teams and settings, scores back to zero; a different team starts each game
  const rematch = useCallback(() => {
    setTeams((prev) => prev.map((team) => ({ ...team, score: 0 })));
    setCurrentTeamIndex(getStartingTeamIndex(getGameNumber(sessionWins) - 1, teams.length));
    setRoundResults([]);
    wordsRef.current = [];
    wordIndexRef.current = 0;
    setGameStarted(true);
  }, [sessionWins, teams.length]);

  const reshuffleWords = useCallback(() => {
    wordsRef.current = getShuffledWords(settings.selectedCategories, settings.difficulty, language, unlockedPacks);
    wordIndexRef.current = 0;
  }, [settings.selectedCategories, settings.difficulty, language, unlockedPacks]);

  const startNewRound = useCallback(() => {
    reshuffleWords();
    guessedWordsRef.current = [];
    skippedWordsRef.current = [];
  }, [reshuffleWords]);

  const getCurrentWord = useCallback((): string => {
    // Reshuffle if we run out
    if (wordIndexRef.current >= wordsRef.current.length) {
      reshuffleWords();
    }
    return wordsRef.current[wordIndexRef.current];
  }, [reshuffleWords]);

  const markCorrect = useCallback(() => {
    const word = wordsRef.current[wordIndexRef.current];
    if (word) {
      guessedWordsRef.current.push(word);
    }
    wordIndexRef.current += 1;
  }, []);

  // 8 words mode: take the next `count` words for a card
  const dealWords = useCallback((count: number): string[] => {
    const card: string[] = [];
    while (card.length < count) {
      card.push(getCurrentWord());
      wordIndexRef.current += 1;
    }
    return card;
  }, [getCurrentWord]);

  // 8 words mode: a word can be tapped as guessed and tapped again to undo
  const setWordGuessed = useCallback((word: string, guessed: boolean) => {
    const list = guessedWordsRef.current;
    const index = list.indexOf(word);
    if (guessed && index === -1) list.push(word);
    if (!guessed && index !== -1) list.splice(index, 1);
  }, []);

  const markSkipped = useCallback(() => {
    const word = wordsRef.current[wordIndexRef.current];
    if (word) {
      skippedWordsRef.current.push(word);
    }
    wordIndexRef.current += 1;
  }, []);

  // Returns the teams with this round's score applied, since the state
  // update is not visible to the caller until the next render
  const endRound = useCallback((
    lastWord?: RoundResult['lastWord']
  ): { result: RoundResult; updatedTeams: Team[] } => {
    const round = {
      teamId: currentTeamIndex,
      guessedWords: [...guessedWordsRef.current],
      skippedWords: [...skippedWordsRef.current],
      ...(lastWord ? { lastWord } : {}),
    };
    const points = scoreRound(round, settings.skipPenalty);
    const result: RoundResult = { ...round, score: points[currentTeamIndex] ?? 0 };

    const updatedTeams = applyRoundScores(teams, points);
    setTeams(updatedTeams);

    setRoundResults((prev) => [...prev, result]);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);

    return { result, updatedTeams };
  }, [currentTeamIndex, settings.skipPenalty, teams]);

  // Round review: replace the last round (e.g. a word marked by mistake) and
  // move the teams' scores from the old version to the corrected one
  const reviseLastRound = useCallback((
    revised: Pick<RoundResult, 'guessedWords' | 'skippedWords' | 'lastWord'>
  ): Team[] => {
    const previous = roundResults[roundResults.length - 1];
    if (!previous) return teams;
    const next = { ...previous, ...revised };
    const newPoints = scoreRound(next, settings.skipPenalty);
    const result: RoundResult = { ...next, score: newPoints[next.teamId] ?? 0 };
    const updatedTeams = applyRoundScores(
      applyRoundScores(teams, scoreRound(previous, settings.skipPenalty), -1),
      newPoints
    );
    setTeams(updatedTeams);
    setRoundResults((prev) => [...prev.slice(0, -1), result]);
    return updatedTeams;
  }, [roundResults, teams, settings.skipPenalty]);

  const checkWinner = useCallback((teamsToCheck: Team[] = teams): Team | null => {
    const winner = teamsToCheck.find((t) => t.score >= settings.winningScore);
    return winner || null;
  }, [teams, settings.winningScore]);

  const resetGame = useCallback(() => {
    setTeams([]);
    setCurrentTeamIndex(0);
    wordsRef.current = [];
    wordIndexRef.current = 0;
    setRoundResults([]);
    setSessionWins({});
    setGameStarted(false);
    guessedWordsRef.current = [];
    skippedWordsRef.current = [];
  }, []);

  // Leaving a game on purpose: forget it, including the saved copy
  const abandonGame = useCallback(() => {
    resetGame();
    clearSavedGame();
  }, [resetGame, clearSavedGame]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const updateTeamName = useCallback((teamId: number, name: string) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, name } : team))
    );
  }, []);

  return {
    settings,
    updateSettings,
    teams,
    currentTeamIndex,
    currentTeam: teams[currentTeamIndex],
    initializeTeams,
    updateTeamName,
    startNewRound,
    getCurrentWord,
    markCorrect,
    markSkipped,
    dealWords,
    setWordGuessed,
    endRound,
    reviseLastRound,
    checkWinner,
    resetGame,
    abandonGame,
    gameStarted,
    roundResults,
    sessionWins,
    recordWin,
    rematch,
    savedGame,
    resumeGame,
    clearSavedGame,
    guessedWords: guessedWordsRef,
    skippedWords: skippedWordsRef,
  };
};
