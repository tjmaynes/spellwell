import type { GameMode, Difficulty } from '~/types'
import { resetGame } from '~/stores/gameStore'

export default function HomePage() {

  const handleModeSelect = (mode: GameMode, difficulty: Difficulty) => {
    resetGame()
    window.location.href = `/game/${mode}/${difficulty}`
  }

  const handleViewStats = () => {
    window.location.href = '/stats'
  }

  const modes = [
    {
      id: 'spelling' as GameMode,
      title: 'Word Spelling',
      description: 'Guess the hidden word letter by letter',
      icon: '🔤',
    },
    {
      id: 'definition' as GameMode,
      title: 'Definition Match',
      description: 'Match words with their correct definitions',
      icon: '📚',
    },
    {
      id: 'fillblank' as GameMode,
      title: 'Fill in the Blank',
      description: 'Complete sentences with the right word',
      icon: '✏️',
    },
    {
      id: 'anagram' as GameMode,
      title: 'Anagram Solver',
      description: 'Unscramble letters to form words',
      icon: '🔀',
    },
  ]

  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ]

  const getDifficultyStyles = (id: Difficulty) => {
    switch (id) {
      case 'easy':
        return { borderColor: 'var(--success-color)', color: 'var(--success-color)' }
      case 'medium':
        return { borderColor: 'var(--warning-color)', color: 'var(--warning-color)' }
      case 'hard':
        return { borderColor: 'var(--error-color)', color: 'var(--error-color)' }
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-[3.5rem] font-extrabold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
        SpellWell
      </h1>
      <p className="text-xl mb-12" style={{ color: 'var(--text-secondary)' }}>
        Choose your game mode and difficulty
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className="border-2 rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(102,126,234,0.2)]"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="text-6xl mb-4">{mode.icon}</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {mode.title}
            </h3>
            <p
              className="text-[0.95rem] mb-6 min-h-[2.5rem]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mode.description}
            </p>
            <div className="flex gap-2 justify-center">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  className="flex-1 px-4 py-2.5 border-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    ...getDifficultyStyles(diff.id),
                  }}
                  onMouseEnter={(e) => {
                    const styles = getDifficultyStyles(diff.id)
                    e.currentTarget.style.backgroundColor = styles.borderColor
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    const styles = getDifficultyStyles(diff.id)
                    e.currentTarget.style.backgroundColor = 'var(--card-bg)'
                    e.currentTarget.style.color = styles.color
                  }}
                  onClick={() => handleModeSelect(mode.id, diff.id)}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-8 px-8 py-4 border-2 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5"
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
        onClick={handleViewStats}
      >
        View Statistics
      </button>
    </div>
  )
}
