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
}

export type ArenaMode = 'classic' | 'eight';

export interface RoundResult {
  teamId: number;
  guessedWords: string[];
  skippedWords: string[];
  score: number;
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
  RoundResult: { result: RoundResult };
  GameOver: { teams: Team[] };
};
