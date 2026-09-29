import type { CustomTask, TaskFrequency } from '../data/tasks';

export interface Word {
  id: string;
  text: string;
  category: CategoryId;
}

export type CategoryId =
  | 'general'
  | 'animale'
  | 'mancare'
  | 'sporturi'
  | 'profesii'
  | 'natura'
  | 'tehnologie'
  | 'filme'
  | 'muzica'
  | 'istorie'
  | 'geografie'
  | 'scoala'
  | 'casa'
  | 'emotii'
  | 'haine';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
}

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  roundDuration: number;
  winningScore: number;
  numberOfTeams: number;
  selectedCategories: CategoryId[];
  difficulty: Difficulty | 'all';
  skipPenalty: boolean;
  // 'eight': each round deals cards of 8 words; the team taps every word guessed
  arenaMode?: ArenaMode;
  // Classic mode: when time runs out, the word on screen can still be guessed
  lastWordTime?: LastWordTime;
  // Any team may guess the last word; players pick which one did
  sharedLastWord?: boolean;
  soundEnabled?: boolean;
  // Task rounds: how often a round comes with a challenge for the explainer
  taskFrequency?: TaskFrequency;
  disabledTasks?: string[];
  customTasks?: CustomTask[];
}

// 'off', a number of extra seconds, or 'unlimited'
export type LastWordTime = 'off' | 'unlimited' | number;

export type ArenaMode = 'classic' | 'eight';

export interface RoundResult {
  teamId: number;
  guessedWords: string[];
  skippedWords: string[];
  // Points for the team that played the round
  score: number;
  // The word on screen when time ran out; teamId is who guessed it, null if nobody
  lastWord?: { word: string; teamId: number | null };
}

// Quest Mode (Storyteller)
export type GameMode = 'arena' | 'quest';

export interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface QuestTurn {
  storytellerId: number;
  word: string;
  category: CategoryId;
  guessedById: number | null;
  hintsUsed: number;
  skipped: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  TeamSetup: undefined;
  Game: undefined;
  RoundResult: undefined;
  Tasks: undefined;
  GameOver: { teams: Team[] };
};
