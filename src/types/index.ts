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

export interface GameSettings {
  roundDuration: number; // seconds
  winningScore: number;
  numberOfTeams: number;
  selectedCategories: CategoryId[];
  skipPenalty: boolean; // -1 point for skipping
}

export interface RoundResult {
  teamId: number;
  guessedWords: string[];
  skippedWords: string[];
  score: number;
}

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  TeamSetup: undefined;
  Game: undefined;
  RoundResult: { result: RoundResult };
  GameOver: { teams: Team[] };
};
