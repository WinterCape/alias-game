import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AchievementId, ACHIEVEMENTS } from './definitions';
import { Language } from '../i18n/strings';

const ACHIEVEMENTS_KEY = '@alias_quest_achievements';

interface AchievementState {
  unlocked: Record<AchievementId, string>;
  languagesPlayed: string[];
  questWins: number;
  storytellerTurns: number;
}

const EMPTY_STATE: AchievementState = {
  unlocked: {} as Record<AchievementId, string>,
  languagesPlayed: [],
  questWins: 0,
  storytellerTurns: 0,
};

interface AchievementContextType {
  state: AchievementState;
  isUnlocked: (id: AchievementId) => boolean;
  unlockedCount: number;
  totalCount: number;
  newlyUnlocked: AchievementId[];
  clearNewlyUnlocked: () => void;
  checkArenaAchievements: (stats: {
    gamesPlayed: number;
    totalWordsGuessed: number;
    roundGuessed: number;
    roundSkipped: number;
    gameSkipped: number;
    language: Language;
  }) => void;
  checkQuestAchievements: (params: {
    hintsUsed: number;
    playerCount: number;
    isStoryteller: boolean;
    won: boolean;
    language: Language;
  }) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AchievementState>(EMPTY_STATE);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementId[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    AsyncStorage.getItem(ACHIEVEMENTS_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({ ...EMPTY_STATE, ...parsed });
        } catch {}
      }
    });
  }, []);

  const save = useCallback(async (newState: AchievementState) => {
    setState(newState);
    stateRef.current = newState;
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(newState)).catch(() => {});
  }, []);

  const unlock = useCallback((id: AchievementId) => {
    const current = stateRef.current;
    if (current.unlocked[id]) return;
    const newUnlocked = { ...current.unlocked, [id]: new Date().toISOString() };
    const newState = { ...current, unlocked: newUnlocked };

    // Check completionist
    const unlockedIds = Object.keys(newUnlocked) as AchievementId[];
    const nonCompletionist = ACHIEVEMENTS.filter((a) => a.id !== 'completionist');
    if (nonCompletionist.every((a) => unlockedIds.includes(a.id)) && !newUnlocked.completionist) {
      newUnlocked.completionist = new Date().toISOString();
      setNewlyUnlocked((prev) => [...prev, id, 'completionist']);
    } else {
      setNewlyUnlocked((prev) => [...prev, id]);
    }

    save(newState);
  }, [save]);

  const isUnlocked = useCallback((id: AchievementId) => !!state.unlocked[id], [state.unlocked]);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const checkArenaAchievements = useCallback((stats: {
    gamesPlayed: number;
    totalWordsGuessed: number;
    roundGuessed: number;
    roundSkipped: number;
    gameSkipped: number;
    language: Language;
  }) => {
    const current = stateRef.current;

    if (stats.gamesPlayed >= 1) unlock('first_blood');
    if (stats.gamesPlayed >= 10) unlock('ten_games');
    if (stats.gamesPlayed >= 50) unlock('fifty_games');
    if (stats.totalWordsGuessed >= 100) unlock('hundred_words');
    if (stats.totalWordsGuessed >= 500) unlock('five_hundred_words');
    if (stats.totalWordsGuessed >= 1000) unlock('thousand_words');
    if (stats.roundSkipped === 0 && stats.roundGuessed > 0) unlock('flawless_round');
    if (stats.roundGuessed >= 10) unlock('speed_demon');
    if (stats.gameSkipped === 0 && stats.gamesPlayed >= 1) unlock('no_retreat');

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock('night_owl');

    // Track languages
    const langs = new Set(current.languagesPlayed);
    langs.add(stats.language);
    if (langs.size >= 3) unlock('polyglot');
    save({ ...stateRef.current, languagesPlayed: [...langs] });
  }, [unlock, save]);

  const checkQuestAchievements = useCallback((params: {
    hintsUsed: number;
    playerCount: number;
    isStoryteller: boolean;
    won: boolean;
    language: Language;
  }) => {
    const current = stateRef.current;

    if (params.hintsUsed === 0) unlock('hint_hater');
    if (params.playerCount >= 6) unlock('social_butterfly');

    let storytellerTurns = current.storytellerTurns;
    if (params.isStoryteller) {
      storytellerTurns += 1;
      if (storytellerTurns >= 20) unlock('storyteller');
    }

    let questWins = current.questWins;
    if (params.won) {
      questWins += 1;
      if (questWins >= 5) unlock('quest_master');
    }

    unlock('first_blood');

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock('night_owl');

    const langs = new Set(current.languagesPlayed);
    langs.add(params.language);
    if (langs.size >= 3) unlock('polyglot');

    save({ ...stateRef.current, languagesPlayed: [...langs], questWins, storytellerTurns });
  }, [unlock, save]);

  const unlockedCount = Object.keys(state.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <AchievementContext.Provider
      value={{ state, isUnlocked, unlockedCount, totalCount, newlyUnlocked, clearNewlyUnlocked, checkArenaAchievements, checkQuestAchievements }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
};
