import { useState, useCallback, useRef } from 'react';
import { Player, CategoryId, Difficulty, QuestTurn } from '../types';
import { getShuffledWords, ALL_CATEGORIES } from '../data/words';
import { Language } from '../i18n/strings';
import { PackId } from '../store/packs';

const PLAYER_COLORS = ['#D4A853', '#9B2335', '#2D6A4F', '#5E548E', '#E91E63', '#FF9800', '#00BCD4', '#4CAF50'];

export interface QuestSettings {
  winningScore: number;
  selectedCategories: CategoryId[];
  difficulty: Difficulty | 'all';
}

const DEFAULT_QUEST_SETTINGS: QuestSettings = {
  winningScore: 10,
  selectedCategories: [...ALL_CATEGORIES],
  difficulty: 'all',
};

export const useQuestGame = (language: Language = 'ro', unlockedPacks: PackId[] = []) => {
  const [settings, setSettings] = useState<QuestSettings>(DEFAULT_QUEST_SETTINGS);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStorytellerIndex, setCurrentStorytellerIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [turnHistory, setTurnHistory] = useState<QuestTurn[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('general');

  const wordCategoryMap = useRef<Map<string, CategoryId>>(new Map());

  const initializePlayers = useCallback((names: string[]) => {
    const newPlayers: Player[] = names.map((name, i) => ({
      id: i,
      name,
      score: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    }));
    setPlayers(newPlayers);
    setCurrentStorytellerIndex(0);
    setGameStarted(true);

    const shuffled = getShuffledWords(settings.selectedCategories, settings.difficulty, language, unlockedPacks);
    setWords(shuffled);
    setCurrentWordIndex(0);
  }, [settings, language, unlockedPacks]);

  const getCurrentWord = useCallback((): string => {
    if (currentWordIndex < words.length) {
      return words[currentWordIndex];
    }
    const shuffled = getShuffledWords(settings.selectedCategories, settings.difficulty, language, unlockedPacks);
    setWords(shuffled);
    setCurrentWordIndex(0);
    return shuffled[0];
  }, [currentWordIndex, words, settings, language, unlockedPacks]);

  const startNewTurn = useCallback(() => {
    setHintsRevealed(0);
  }, []);

  const revealHint = useCallback(() => {
    setHintsRevealed((prev) => Math.min(prev + 1, 5));
  }, []);

  const markCorrectGuess = useCallback((guesserId: number) => {
    const word = words[currentWordIndex];
    setPlayers((prev) =>
      prev.map((p) => (p.id === guesserId ? { ...p, score: p.score + 1 } : p))
    );

    setTurnHistory((prev) => [
      ...prev,
      {
        storytellerId: currentStorytellerIndex,
        word: word || '',
        category: currentCategory,
        guessedById: guesserId,
        hintsUsed: hintsRevealed,
        skipped: false,
      },
    ]);

    setCurrentWordIndex((prev) => prev + 1);
    setCurrentStorytellerIndex((prev) => (prev + 1) % players.length);
    setHintsRevealed(0);
  }, [currentWordIndex, words, currentStorytellerIndex, currentCategory, hintsRevealed, players.length]);

  const skipWord = useCallback(() => {
    const word = words[currentWordIndex];
    // Storyteller gets -1 for failed description
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === players[currentStorytellerIndex]?.id
          ? { ...p, score: p.score - 1 }
          : p
      )
    );

    setTurnHistory((prev) => [
      ...prev,
      {
        storytellerId: currentStorytellerIndex,
        word: word || '',
        category: currentCategory,
        guessedById: null,
        hintsUsed: hintsRevealed,
        skipped: true,
      },
    ]);

    setCurrentWordIndex((prev) => prev + 1);
    setCurrentStorytellerIndex((prev) => (prev + 1) % players.length);
    setHintsRevealed(0);
  }, [currentWordIndex, words, currentStorytellerIndex, currentCategory, hintsRevealed, players]);

  const checkWinner = useCallback((): Player | null => {
    return players.find((p) => p.score >= settings.winningScore) || null;
  }, [players, settings.winningScore]);

  const resetGame = useCallback(() => {
    setPlayers([]);
    setCurrentStorytellerIndex(0);
    setWords([]);
    setCurrentWordIndex(0);
    setHintsRevealed(0);
    setTurnHistory([]);
    setGameStarted(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<QuestSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings,
    players,
    currentStoryteller: players[currentStorytellerIndex],
    currentStorytellerIndex,
    initializePlayers,
    getCurrentWord,
    startNewTurn,
    revealHint,
    hintsRevealed,
    markCorrectGuess,
    skipWord,
    checkWinner,
    resetGame,
    gameStarted,
    turnHistory,
    currentCategory,
    setCurrentCategory,
  };
};
