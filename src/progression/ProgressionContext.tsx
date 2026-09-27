import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLevelForXP, getXPProgress, getRankForLevel, XP_SOURCES } from './ranks';

const PROGRESSION_KEY = '@alias_quest_progression';

interface ProgressionState {
  totalXP: number;
  gamesWon: number;
}

interface ProgressionContextType {
  totalXP: number;
  level: number;
  xpProgress: { current: number; needed: number; progress: number };
  previousLevel: number;
  didLevelUp: boolean;
  clearLevelUp: () => void;
  addXP: (amount: number) => void;
  recordArenaResult: (params: {
    wordsGuessed: number;
    won: boolean;
    flawlessRounds: number;
  }) => void;
  recordQuestResult: (params: {
    correctGuesses: number;
    storytellingSuccesses: number;
    won: boolean;
  }) => void;
  recordAchievementUnlocked: () => void;
}

const ProgressionContext = createContext<ProgressionContextType | null>(null);

export const ProgressionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProgressionState>({ totalXP: 0, gamesWon: 0 });
  const [previousLevel, setPreviousLevel] = useState(1);
  const [didLevelUp, setDidLevelUp] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    AsyncStorage.getItem(PROGRESSION_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState(parsed);
          setPreviousLevel(getLevelForXP(parsed.totalXP));
        } catch {}
      }
    });
  }, []);

  const save = useCallback(async (newState: ProgressionState) => {
    setState(newState);
    stateRef.current = newState;
    await AsyncStorage.setItem(PROGRESSION_KEY, JSON.stringify(newState)).catch(() => {});
  }, []);

  const addXP = useCallback((amount: number) => {
    const current = stateRef.current;
    const oldLevel = getLevelForXP(current.totalXP);
    const newXP = current.totalXP + amount;
    const newLevel = getLevelForXP(newXP);

    setPreviousLevel(oldLevel);
    if (newLevel > oldLevel) {
      setDidLevelUp(true);
    }

    save({ ...current, totalXP: newXP });
  }, [save]);

  const clearLevelUp = useCallback(() => setDidLevelUp(false), []);

  const recordArenaResult = useCallback((params: {
    wordsGuessed: number;
    won: boolean;
    flawlessRounds: number;
  }) => {
    let xp = params.wordsGuessed * XP_SOURCES.wordGuessed;
    if (params.won) xp += XP_SOURCES.gameWon;
    xp += params.flawlessRounds * XP_SOURCES.flawlessRound;
    addXP(xp);

    if (params.won) {
      save({ ...stateRef.current, gamesWon: stateRef.current.gamesWon + 1 });
    }
  }, [addXP, save]);

  const recordQuestResult = useCallback((params: {
    correctGuesses: number;
    storytellingSuccesses: number;
    won: boolean;
  }) => {
    let xp = params.correctGuesses * XP_SOURCES.questCorrectGuess;
    xp += params.storytellingSuccesses * XP_SOURCES.questSuccessfulStorytelling;
    if (params.won) xp += XP_SOURCES.gameWon;
    addXP(xp);

    if (params.won) {
      save({ ...stateRef.current, gamesWon: stateRef.current.gamesWon + 1 });
    }
  }, [addXP, save]);

  const recordAchievementUnlocked = useCallback(() => {
    addXP(XP_SOURCES.achievementUnlocked);
  }, [addXP]);

  const level = getLevelForXP(state.totalXP);
  const xpProgress = getXPProgress(state.totalXP);

  return (
    <ProgressionContext.Provider value={{
      totalXP: state.totalXP,
      level,
      xpProgress,
      previousLevel,
      didLevelUp,
      clearLevelUp,
      addXP,
      recordArenaResult,
      recordQuestResult,
      recordAchievementUnlocked,
    }}>
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = (): ProgressionContextType => {
  const context = useContext(ProgressionContext);
  if (!context) throw new Error('useProgression must be used within ProgressionProvider');
  return context;
};
