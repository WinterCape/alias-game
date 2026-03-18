import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from './useGameState';

type GameContextType = ReturnType<typeof useGameState>;

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();
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
