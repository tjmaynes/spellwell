import type { Statistics } from '../types'
import { getStatistics, resetStatistics } from '../utils/statistics'
import { useState, useEffect } from 'react'

interface StatisticsViewProps {
  onBack: () => void
}

export default function StatisticsView({ onBack }: StatisticsViewProps) {
  const [stats, setStats] = useState<Statistics>(getStatistics())
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setStats(getStatistics())
  }, [])

  const handleReset = () => {
    resetStatistics()
    setStats(getStatistics())
    setShowConfirm(false)
  }

  const getTotalCorrect = () => {
    return (
      stats.correctByDifficulty.easy +
      stats.correctByDifficulty.medium +
      stats.correctByDifficulty.hard
    )
  }

  const getTotalIncorrect = () => {
    return (
      stats.incorrectByDifficulty.easy +
      stats.incorrectByDifficulty.medium +
      stats.incorrectByDifficulty.hard
    )
  }

  const getAccuracy = () => {
    const total = getTotalCorrect() + getTotalIncorrect()
    if (total === 0) return 0
    return Math.round((getTotalCorrect() / total) * 100)
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-400'
      case 'medium':
        return 'bg-yellow-400'
      case 'hard':
        return 'bg-red-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          className="px-4 py-2 border-2 rounded-lg transition-all duration-200"
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
          onClick={onBack}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Your Statistics
        </h2>
        <div className="w-24"></div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div
            className="border-2 rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl font-extrabold text-primary mb-2">
              {stats.totalGamesPlayed}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Games Played
            </div>
          </div>
          <div
            className="border-2 rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl font-extrabold text-primary mb-2">{stats.totalScore}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Total Score
            </div>
          </div>
          <div
            className="border-2 rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl font-extrabold text-primary mb-2">{stats.bestStreak}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Best Streak
            </div>
          </div>
          <div
            className="border-2 rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="text-5xl font-extrabold text-primary mb-2">{getAccuracy()}%</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Accuracy
            </div>
          </div>
        </div>

        <div
          className="border-2 rounded-2xl p-8 mb-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-secondary)' }}>
            Performance by Difficulty
          </h3>
          <div className="flex flex-col gap-4">
            {(['easy', 'medium', 'hard'] as const).map((diff) => {
              const correct = stats.correctByDifficulty[diff]
              const incorrect = stats.incorrectByDifficulty[diff]
              const total = correct + incorrect
              const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

              return (
                <div key={diff} className="grid grid-cols-[100px_1fr_150px] gap-4 items-center">
                  <div
                    className="font-semibold capitalize"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {diff}
                  </div>
                  <div
                    className="h-8 rounded-2xl overflow-hidden"
                    style={{ backgroundColor: 'var(--card-bg)' }}
                  >
                    <div
                      className={`h-full transition-all duration-500 ${getDifficultyColor(diff)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right" style={{ color: 'var(--text-secondary)' }}>
                    {correct}/{total} ({percentage}%)
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="border-2 rounded-2xl p-8 mb-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-secondary)' }}>
            Games by Mode
          </h3>
          <div className="flex flex-col gap-4">
            {Object.entries(stats.gamesByMode).map(([mode, count]) => (
              <div
                key={mode}
                className="flex justify-between items-center p-4 rounded-lg"
                style={{ backgroundColor: 'var(--hover-bg)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {mode === 'spelling' && '🔤 Word Spelling'}
                  {mode === 'definition' && '📚 Definition Match'}
                  {mode === 'fillblank' && '✏️ Fill in the Blank'}
                  {mode === 'anagram' && '🔀 Anagram Solver'}
                </div>
                <div className="text-2xl font-bold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {stats.incorrectWords.length > 0 && (
          <div
            className="border-2 rounded-2xl p-8 mb-8"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Words to Review
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              These words gave you trouble. Review them to improve!
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.incorrectWords.slice(0, 20).map((word, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-red-400/20 border border-red-400 rounded-lg font-semibold text-red-400"
                >
                  {word}
                </span>
              ))}
              {stats.incorrectWords.length > 20 && (
                <span
                  className="px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  +{stats.incorrectWords.length - 20} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          {!showConfirm ? (
            <button
              className="px-6 py-3 bg-red-400/20 border-2 border-red-400 rounded-lg text-red-400 font-semibold transition-all duration-200 hover:bg-red-400/30 hover:-translate-y-0.5"
              onClick={() => setShowConfirm(true)}
            >
              Reset All Statistics
            </button>
          ) : (
            <div
              className="p-6 border-2 rounded-2xl inline-block"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <p className="mb-4 text-red-400">Are you sure? This cannot be undone.</p>
              <button
                className="px-6 py-3 bg-red-400 border-2 border-red-400 rounded-lg text-[#1a1a1a] font-semibold mr-4 transition-all duration-200 hover:bg-red-600 hover:border-red-600"
                onClick={handleReset}
              >
                Yes, Reset
              </button>
              <button
                className="px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200"
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
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
