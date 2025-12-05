import type { Statistics, Difficulty, GameMode } from '../types'

const STORAGE_KEY = 'spellwell-statistics'

const defaultStatistics: Statistics = {
  totalGamesPlayed: 0,
  totalScore: 0,
  bestStreak: 0,
  correctByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  incorrectByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  gamesByMode: {
    spelling: 0,
    definition: 0,
    fillblank: 0,
    anagram: 0,
  },
  incorrectWords: [],
}

export function getStatistics(): Statistics {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { ...defaultStatistics }
  }
  try {
    return JSON.parse(stored)
  } catch {
    return { ...defaultStatistics }
  }
}

export function saveStatistics(stats: Statistics): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function updateStatistics(
  correct: boolean,
  difficulty: Difficulty,
  mode: GameMode,
  streak: number,
  score: number,
  incorrectWord?: string
): void {
  const stats = getStatistics()

  stats.totalGamesPlayed += 1
  stats.totalScore += score
  stats.bestStreak = Math.max(stats.bestStreak, streak)
  stats.gamesByMode[mode] += 1

  if (correct) {
    stats.correctByDifficulty[difficulty] += 1
  } else {
    stats.incorrectByDifficulty[difficulty] += 1
    if (incorrectWord && !stats.incorrectWords.includes(incorrectWord)) {
      stats.incorrectWords.push(incorrectWord)
    }
  }

  saveStatistics(stats)
}

export function resetStatistics(): void {
  localStorage.removeItem(STORAGE_KEY)
}
