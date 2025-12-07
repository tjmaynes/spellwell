import { atom } from 'nanostores'
import type { Word, GameMode } from '~/types'

export const $score = atom<number>(0)
export const $streak = atom<number>(0)
export const $correctHistory = atom<Word[]>([])
export const $currentMode = atom<GameMode | null>(null)

export const resetGame = () => {
  $score.set(0)
  $streak.set(0)
  $correctHistory.set([])
  $currentMode.set(null)
}

export const setScore = (score: number) => {
  $score.set(score)
}

export const setStreak = (streak: number) => {
  $streak.set(streak)
}

export const setCorrectHistory = (history: Word[]) => {
  $correctHistory.set(history)
}

export const setCurrentMode = (mode: GameMode | null) => {
  $currentMode.set(mode)
}
