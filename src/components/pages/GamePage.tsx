import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import type { GameMode, Difficulty, Word } from '~/types'
import { getRandomWordExcluding } from '~/data/words'
import { updateStatistics } from '~/utils/statistics'
import {
  $score,
  $streak,
  $correctHistory,
  $currentMode,
  setScore,
  setStreak,
  setCorrectHistory,
  setCurrentMode,
} from '~/stores/gameStore'
import SpellingGame from '~/components/games/SpellingGame'
import DefinitionGame from '~/components/games/DefinitionGame'
import FillBlankGame from '~/components/games/FillBlankGame'
import AnagramGame from '~/components/games/AnagramGame'

export default function GamePage() {
  const [mode, setMode] = useState<GameMode | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const score = useStore($score)
  const streak = useStore($streak)
  const correctHistory = useStore($correctHistory)
  const currentMode = useStore($currentMode)

  const [currentWord, setCurrentWord] = useState<Word | null>(null)

  useEffect(() => {
    // Extract route params from URL
    const pathname = window.location.pathname
    const parts = pathname.split('/')
    const urlMode = parts[2] as GameMode
    const urlDifficulty = parts[3] as Difficulty

    setMode(urlMode)
    setDifficulty(urlDifficulty)

    if (!urlMode || !urlDifficulty) {
      window.location.href = '/'
      return
    }

    if (urlMode !== currentMode) {
      setCurrentMode(urlMode)
      setCorrectHistory([])
    }

    const word = getRandomWordExcluding(urlDifficulty, correctHistory)
    setCurrentWord(word)
  }, [currentMode, setCurrentMode, setCorrectHistory, correctHistory])

  const handleGameComplete = (correct: boolean, points: number) => {
    if (!currentWord || !difficulty || !mode) return

    const newScore = score + points
    const newStreak = correct ? streak + 1 : 0

    setScore(newScore)
    setStreak(newStreak)

    updateStatistics(
      correct,
      difficulty as Difficulty,
      mode as GameMode,
      newStreak,
      points,
      correct ? undefined : currentWord.word
    )

    if (correct) {
      setCorrectHistory([...correctHistory, currentWord])
    }

    setTimeout(() => {
      const wordsToExclude = correct ? [...correctHistory, currentWord] : correctHistory
      const nextWord = getRandomWordExcluding(difficulty as Difficulty, wordsToExclude)

      if (nextWord) {
        setCurrentWord(nextWord)
      } else {
        // Navigate to completion page
        window.location.href = `/game/${mode}/${difficulty}/complete`
      }
    }, 100)
  }

  const handleBackToMenu = () => {
    window.location.href = '/'
  }

  if (!currentWord) {
    return <div>Loading...</div>
  }

  const renderGame = () => {
    switch (mode) {
      case 'spelling':
        return (
          <SpellingGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        )
      case 'definition':
        return (
          <DefinitionGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        )
      case 'fillblank':
        return (
          <FillBlankGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
            correctHistory={correctHistory}
          />
        )
      case 'anagram':
        return (
          <AnagramGame
            word={currentWord}
            difficulty={difficulty as Difficulty}
            onComplete={handleGameComplete}
            onBack={handleBackToMenu}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex gap-8 justify-center mb-8 text-xl font-semibold">
        <div
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          Score: {score}
        </div>
        <div
          className="px-6 py-3 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          Streak: {streak} 🔥
        </div>
      </div>
      {renderGame()}
    </div>
  )
}
