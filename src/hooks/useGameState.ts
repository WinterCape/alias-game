import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, Team, RoundResult, CategoryId } from '../types';
import { getShuffledWords } from '../data/words';

const SETTINGS_KEY = '@alias_game_settings';

const DEFAULT_SETTINGS: GameSettings = {
  roundDuration: 60,
  winningScore: 50,
  numberOfTeams: 2,
  selectedCategories: ['general', 'animale', 'mancare', 'sporturi'],
  skipPenalty: true,
};

const DEFAULT_TEAM_NAMES = ['Echipa 1', 'Echipa 2', 'Echipa 3', 'Echipa 4'];
const TEAM_COLORS = ['#6C63FF', '#FF6584', '#43E97B', '#FFA502'];

export const useGameState = () => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
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
        name: teamNames?.[i] || DEFAULT_TEAM_NAMES[i],
        score: 0,
        color: TEAM_COLORS[i],
      });
    }
    setTeams(newTeams);
    setCurrentTeamIndex(0);
    setGameStarted(true);
  }, [settings.numberOfTeams]);

  const startNewRound = useCallback(() => {
    const shuffled = getShuffledWords(settings.selectedCategories);
    setWords(shuffled);
    setCurrentWordIndex(0);
    guessedWordsRef.current = [];
    skippedWordsRef.current = [];
  }, [settings.selectedCategories]);

  const getCurrentWord = useCallback((): string => {
    if (currentWordIndex < words.length) {
      return words[currentWordIndex];
    }
    // Reshuffle if we run out
    const shuffled = getShuffledWords(settings.selectedCategories);
    setWords(shuffled);
    setCurrentWordIndex(0);
    return shuffled[0];
  }, [currentWordIndex, words, settings.selectedCategories]);

  const markCorrect = useCallback(() => {
    const word = words[currentWordIndex];
    if (word) {
      guessedWordsRef.current.push(word);
    }
    setCurrentWordIndex((prev) => prev + 1);
  }, [currentWordIndex, words]);

  const markSkipped = useCallback(() => {
    const word = words[currentWordIndex];
    if (word) {
      skippedWordsRef.current.push(word);
    }
    setCurrentWordIndex((prev) => prev + 1);
  }, [currentWordIndex, words]);

  const endRound = useCallback((): RoundResult => {
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

    // Update team score
    setTeams((prev) =>
      prev.map((team) =>
        team.id === currentTeamIndex
          ? { ...team, score: team.score + score }
          : team
      )
    );

    setRoundResults((prev) => [...prev, result]);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);

    return result;
  }, [currentTeamIndex, settings.skipPenalty, teams.length]);

  const checkWinner = useCallback((): Team | null => {
    const winner = teams.find((t) => t.score >= settings.winningScore);
    return winner || null;
  }, [teams, settings.winningScore]);

  const resetGame = useCallback(() => {
    setTeams([]);
    setCurrentTeamIndex(0);
    setWords([]);
    setCurrentWordIndex(0);
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
