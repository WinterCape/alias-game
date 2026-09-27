import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from './useGameState';
import { useI18n } from '../i18n/I18nContext';
import { useStore } from '../store/StoreContext';

type GameContextType = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useI18n();
  const { unlockedPacks } = useStore();
  const gameState = useGameState(lang, unlockedPacks);
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
