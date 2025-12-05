export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameMode = 'spelling' | 'definition' | 'fillblank' | 'anagram'

export interface Word {
  word: string
  definition: string
  difficulty: Difficulty
  exampleSentence?: string
}

export interface GameState {
  mode: GameMode | null
  difficulty: Difficulty | null
  currentWord: Word | null
  score: number
  streak: number
  totalAttempts: number
  correctAnswers: number
  incorrectAnswers: number
}

export interface Statistics {
  totalGamesPlayed: number
  totalScore: number
  bestStreak: number
  correctByDifficulty: Record<Difficulty, number>
  incorrectByDifficulty: Record<Difficulty, number>
  gamesByMode: Record<GameMode, number>
  incorrectWords: string[]
}

export interface LetterState {
  letter: string
  state: 'correct' | 'present' | 'absent' | 'empty'
}
