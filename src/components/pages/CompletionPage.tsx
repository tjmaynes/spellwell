import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import type { GameMode, Difficulty } from '~/types'
import { $score, $correctHistory, resetGame } from '~/stores/gameStore'

export default function CompletionPage() {
  const score = useStore($score)
  const correctHistory = useStore($correctHistory)
  const [mode, setMode] = useState<GameMode | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)

  useEffect(() => {
    // Extract route params from URL
    const pathname = window.location.pathname
    const parts = pathname.split('/')
    setMode(parts[2] as GameMode)
    setDifficulty(parts[3] as Difficulty)
  }, [])

  const handleBackToMenu = () => {
    resetGame()
    window.location.href = '/'
  }

  const handleTryAgain = () => {
    resetGame()
    if (mode && difficulty) {
      window.location.href = `/game/${mode}/${difficulty}`
    }
  }

  const getModeTitle = () => {
    switch (mode) {
      case 'spelling':
        return 'Word Spelling'
      case 'definition':
        return 'Definition Match'
      case 'fillblank':
        return 'Fill in the Blank'
      case 'anagram':
        return 'Anagram Solver'
      default:
        return 'Game'
    }
  }

  const getDifficultyLabel = () => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : ''
  }

  return (
    <div>
      <div className="max-w-[1000px] mx-auto">
        <div
          className="max-w-[600px] mx-auto mb-12 text-center p-12 border-2 border-primary/30 rounded-3xl"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            You've completed all <strong>{getDifficultyLabel()}</strong> words in{' '}
            <strong>{getModeTitle()}</strong>!
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div
              className="border-2 rounded-2xl p-6"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="text-5xl font-extrabold text-primary mb-2">
                {correctHistory.length}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Words Mastered
              </div>
            </div>
            <div
              className="border-2 rounded-2xl p-6"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="text-5xl font-extrabold text-primary mb-2">{score}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total Score
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(102,126,234,0.4)]"
              onClick={handleTryAgain}
            >
              🔄 Try Again
            </button>
            <button
              className="px-8 py-4 border-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)'
              }}
              onClick={handleBackToMenu}
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>

        {correctHistory.length > 0 && (
          <div
            className="border-2 rounded-3xl p-8"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <h3
              className="text-center text-3xl font-bold mb-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Words You Mastered
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {correctHistory.map((word, index) => (
                <div
                  key={index}
                  className="bg-primary/10 border border-primary/20 rounded-xl p-5 transition-all duration-200 hover:bg-primary/15 hover:border-primary/30 hover:-translate-y-0.5"
                >
                  <div className="text-xl font-bold text-primary mb-3 capitalize">{word.word}</div>
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {word.definition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
