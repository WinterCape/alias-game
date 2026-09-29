import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, Team, RoundResult, CategoryId } from '../types';
import { getShuffledWords, ALL_CATEGORIES } from '../data/words';
import { Language } from '../i18n/strings';
import { PackId } from '../store/packs';

const SETTINGS_KEY = '@alias_game_settings';

const DEFAULT_SETTINGS: GameSettings = {
  roundDuration: 60,
  winningScore: 50,
  numberOfTeams: 2,
  selectedCategories: [...ALL_CATEGORIES],
  difficulty: 'all',
  skipPenalty: true,
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

  const guessedWordsRef = useRef<string[]>([]);
  const skippedWordsRef = useRef<string[]>([]);

  // Load saved settings on mount
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    });
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
    setGameStarted(true);
  }, [settings.numberOfTeams]);

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

  const markSkipped = useCallback(() => {
    const word = wordsRef.current[wordIndexRef.current];
    if (word) {
      skippedWordsRef.current.push(word);
    }
    wordIndexRef.current += 1;
  }, []);

  // Returns the teams with this round's score applied, since the state
  // update is not visible to the caller until the next render
  const endRound = useCallback((): { result: RoundResult; updatedTeams: Team[] } => {
    const correctCount = guessedWordsRef.current.length;
    const skippedCount = skippedWordsRef.current.length;
    const penalty = settings.skipPenalty ? skippedCount : 0;
    const score = correctCount - penalty;

    const result: RoundResult = {
      teamId: currentTeamIndex,
      guessedWords: [...guessedWordsRef.current],
      skippedWords: [...skippedWordsRef.current],
      score,
    };

    const updatedTeams = teams.map((team) =>
      team.id === currentTeamIndex ? { ...team, score: team.score + score } : team
    );
    setTeams(updatedTeams);

    setRoundResults((prev) => [...prev, result]);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);

    return { result, updatedTeams };
  }, [currentTeamIndex, settings.skipPenalty, teams]);

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
    setGameStarted(false);
    guessedWordsRef.current = [];
    skippedWordsRef.current = [];
  }, []);

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
    endRound,
    checkWinner,
    resetGame,
    gameStarted,
    roundResults,
    guessedWords: guessedWordsRef,
    skippedWords: skippedWordsRef,
  };
};
