import { useState, useEffect } from 'react'
import type { Word, Difficulty } from '~/types'
import HistoryPanel from '~/components/HistoryPanel'

interface SpellingGameProps {
  word: Word
  difficulty: Difficulty
  onComplete: (correct: boolean, score: number) => void
  onBack: () => void
  correctHistory: Word[]
}

export default function SpellingGame({
  word,
  difficulty,
  onComplete,
  onBack,
  correctHistory,
}: SpellingGameProps) {
  const maxAttempts = 6
  const wordLength = word.word.length

  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showHint, setShowHint] = useState(difficulty === 'easy')

  useEffect(() => {
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setShowHint(difficulty === 'easy')
  }, [word, difficulty])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      if (e.key === 'Enter') {
        if (currentGuess.length === wordLength) {
          submitGuess()
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess((prev) => prev + e.key.toLowerCase())
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGuess, gameOver, wordLength])

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) return

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    if (currentGuess === word.word.toLowerCase()) {
      setWon(true)
      setGameOver(true)
      const score = (maxAttempts - newGuesses.length + 1) * 10
      setTimeout(() => onComplete(true, score), 1500)
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true)
      setTimeout(() => onComplete(false, 0), 1500)
    }

    setCurrentGuess('')
  }

  const getLetterState = (letter: string, index: number): 'correct' | 'present' | 'absent' => {
    const targetWord = word.word.toLowerCase()

    if (targetWord[index] === letter) {
      return 'correct'
    }

    if (targetWord.includes(letter)) {
      return 'present'
    }

    return 'absent'
  }

  const renderGuessRow = (guess: string, rowIndex: number) => {
    const letters = guess.split('')

    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {letters.map((letter, i) => {
          const state = getLetterState(letter, i)

          return (
            <div
              key={i}
              className="w-16 h-16 flex items-center justify-center text-4xl font-bold border-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor:
                  state === 'correct'
                    ? 'var(--success-color)'
                    : state === 'present'
                      ? 'var(--warning-color)'
                      : '#64748b',
                borderColor:
                  state === 'correct'
                    ? 'var(--success-color)'
                    : state === 'present'
                      ? 'var(--warning-color)'
                      : '#64748b',
                color: state === 'absent' ? 'var(--text-tertiary)' : '#1a1a1a',
              }}
            >
              {letter.toUpperCase()}
            </div>
          )
        })}
      </div>
    )
  }

  const renderCurrentGuessRow = () => {
    const letters = currentGuess.split('')
    const emptySlots = wordLength - letters.length

    return (
      <div className="flex gap-2 justify-center">
        {letters.map((letter, i) => (
          <div
            key={i}
            className="w-16 h-16 flex items-center justify-center text-4xl font-bold border-2 border-primary rounded-lg bg-primary/10 animate-pulse"
            style={{ color: 'var(--text-primary)' }}
          >
            {letter.toUpperCase()}
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-16 h-16 flex items-center justify-center text-4xl font-bold border-2 rounded-lg"
            style={{
              borderColor: 'var(--input-border)',
              backgroundColor: 'var(--input-bg)',
            }}
          />
        ))}
      </div>
    )
  }

  const renderEmptyRow = (index: number) => {
    return (
      <div key={`empty-row-${index}`} className="flex gap-2 justify-center">
        {Array.from({ length: wordLength }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 flex items-center justify-center text-4xl font-bold border-2 rounded-lg"
            style={{
              borderColor: 'var(--card-border)',
              backgroundColor: 'var(--card-bg)',
            }}
          />
        ))}
      </div>
    )
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
          Word Spelling
        </h2>
        <div
          className="px-6 py-3 rounded-lg font-semibold"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
        >
          {guesses.length}/{maxAttempts}
        </div>
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
        className="flex flex-col gap-3 my-8 p-8 border-2 rounded-2xl"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        {guesses.map((guess, i) => renderGuessRow(guess, i))}
        {!gameOver && guesses.length < maxAttempts && renderCurrentGuessRow()}
        {Array.from({ length: Math.max(0, maxAttempts - guesses.length - (gameOver ? 0 : 1)) }).map(
          (_, i) => renderEmptyRow(i)
        )}
      </div>

      {gameOver && (
        <div
          className="border-2 rounded-2xl p-8 my-8 text-center animate-in slide-in-from-bottom-5 duration-500"
          style={{
            backgroundColor: won ? 'var(--success-bg)' : 'var(--error-bg)',
            borderColor: won ? 'var(--success-color)' : 'var(--error-color)',
          }}
        >
          {won ? (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--success-color)' }}>
                Excellent! 🎉
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                You got it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--error-color)' }}>
                Good try!
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                The word was: <strong>{word.word}</strong>
              </p>
            </>
          )}
        </div>
      )}

      {!gameOver && (
        <div className="text-center mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Type your guess and press Enter
        </div>
      )}

      <HistoryPanel correctHistory={correctHistory} />
    </div>
  )
}
