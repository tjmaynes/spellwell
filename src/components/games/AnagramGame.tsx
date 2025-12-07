import { useState, useEffect } from 'react'
import type { Word, Difficulty } from '~/types'

interface AnagramGameProps {
  word: Word
  difficulty: Difficulty
  onComplete: (correct: boolean, score: number) => void
  onBack: () => void
}

export default function AnagramGame({ word, difficulty, onComplete, onBack }: AnagramGameProps) {
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(difficulty === 'easy')

  useEffect(() => {
    scrambleWord()
    setUserAnswer([])
    setRevealed(false)
    setShowHint(difficulty === 'easy')
  }, [word, difficulty])

  const scrambleWord = () => {
    const letters = word.word.toLowerCase().split('')
    const shuffled = [...letters].sort(() => Math.random() - 0.5)
    setScrambledLetters(shuffled)
  }

  const handleLetterClick = (index: number) => {
    if (revealed) return

    const letter = scrambledLetters[index]
    setUserAnswer([...userAnswer, letter])
    setScrambledLetters(scrambledLetters.filter((_, i) => i !== index))
  }

  const handleAnswerClick = (index: number) => {
    if (revealed) return

    const letter = userAnswer[index]
    setScrambledLetters([...scrambledLetters, letter])
    setUserAnswer(userAnswer.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (revealed || userAnswer.length !== word.word.length) return

    setRevealed(true)
    const guessedWord = userAnswer.join('')
    const correct = guessedWord === word.word.toLowerCase()
    const score = correct ? 15 : 0

    setTimeout(() => {
      onComplete(correct, score)
    }, 1500)
  }

  const handleShuffle = () => {
    if (revealed) return
    const shuffled = [...scrambledLetters].sort(() => Math.random() - 0.5)
    setScrambledLetters(shuffled)
  }

  const handleClear = () => {
    if (revealed) return
    setScrambledLetters([...scrambledLetters, ...userAnswer])
    setUserAnswer([])
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          className="px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5"
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
        <h2 className="text-3xl font-bold flex-1 text-center" style={{ color: 'var(--text-primary)' }}>
          Anagram Solver
        </h2>
        <div className="w-24"></div>
      </div>

      {difficulty === 'easy' ? (
        <div
          className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 mb-8 text-center text-lg leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          <strong>Definition:</strong> {word.definition}
        </div>
      ) : (
        <div className="text-center mb-8">
          {!showHint ? (
            <button
              className="px-8 py-3.5 border-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
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
              onClick={() => setShowHint(true)}
            >
              💡 Show Hint
            </button>
          ) : (
            <div
              className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500"
              style={{ color: 'var(--text-primary)' }}
            >
              <strong>Definition:</strong> {word.definition}
            </div>
          )}
        </div>
      )}

      <div
        className="border-2 rounded-2xl p-8 my-8"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="mb-8">
          <h3
            className="text-xl font-semibold mb-4 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your Answer:
          </h3>
          <div className="flex flex-wrap gap-3 justify-center min-h-[5rem] items-center">
            {userAnswer.length === 0 ? (
              <div className="italic p-4" style={{ color: 'var(--text-tertiary)' }}>
                Tap letters below to build your word
              </div>
            ) : (
              userAnswer.map((letter, index) => (
                <button
                  key={index}
                  className="w-16 h-16 flex items-center justify-center text-3xl font-bold border-2 border-primary rounded-xl bg-primary/20 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    e.currentTarget.style.borderColor = 'var(--card-border)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                  }}
                  onClick={() => handleAnswerClick(index)}
                >
                  {letter.toUpperCase()}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3
            className="text-xl font-semibold mb-4 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            Available Letters:
          </h3>
          <div className="flex flex-wrap gap-3 justify-center min-h-[5rem] items-center">
            {scrambledLetters.map((letter, index) => (
              <button
                key={index}
                className="w-16 h-16 flex items-center justify-center text-3xl font-bold border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                  e.currentTarget.style.borderColor = 'var(--primary-color)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)'
                  e.currentTarget.style.borderColor = 'var(--card-border)'
                }}
                onClick={() => handleLetterClick(index)}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            className="px-7 py-3.5 border-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              if (!revealed) {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!revealed) {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)'
              }
            }}
            onClick={handleShuffle}
            disabled={revealed}
          >
            🔀 Shuffle
          </button>
          <button
            className="px-7 py-3.5 border-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              if (!revealed) {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!revealed) {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)'
              }
            }}
            onClick={handleClear}
            disabled={revealed}
          >
            ✖️ Clear
          </button>
          <button
            className="px-7 py-3.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] border-2 border-primary rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            style={{ color: 'var(--text-primary)' }}
            onClick={handleSubmit}
            disabled={revealed || userAnswer.length !== word.word.length}
          >
            ✓ Submit
          </button>
        </div>
      </div>

      {revealed && (
        <div
          className="border-2 rounded-2xl p-8 my-8 text-center animate-in slide-in-from-bottom-5 duration-500"
          style={{
            backgroundColor:
              userAnswer.join('') === word.word.toLowerCase()
                ? 'var(--success-bg)'
                : 'var(--error-bg)',
            borderColor:
              userAnswer.join('') === word.word.toLowerCase()
                ? 'var(--success-color)'
                : 'var(--error-color)',
          }}
        >
          {userAnswer.join('') === word.word.toLowerCase() ? (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--success-color)' }}>
                Amazing! 🎉
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                You unscrambled the word correctly!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--error-color)' }}>
                Good try!
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                The correct word was: <strong>{word.word}</strong>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
