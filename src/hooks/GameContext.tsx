import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useGameState } from './useGameState';
import { useI18n } from '../i18n/I18nContext';
import { useStore } from '../store/StoreContext';
import { useProgression } from '../progression/ProgressionContext';
import { LEVEL_REWARDS } from '../progression/rewards';
import { PackId } from '../store/packs';

type GameContextType = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useI18n();
  const { unlockedPacks } = useStore();
  const { level } = useProgression();

  const mergedPacks = useMemo(() => {
    const levelUnlockedPacks = LEVEL_REWARDS
      .filter((r) => r.packId && r.level <= level)
      .map((r) => r.packId as PackId);
    return [...new Set([...unlockedPacks, ...levelUnlockedPacks])];
  }, [unlockedPacks, level]);

  const gameState = useGameState(lang, mergedPacks);
  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
