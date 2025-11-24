export interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation?: string; // AI generated explanation
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
  LOADING_AI = 'LOADING_AI'
}

export interface QuizStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeElapsed: number;
  streak: number;
  maxStreak: number;
}
