import { useState, useEffect } from 'react'
import type { Word } from '~/types'
import { getRandomWordsExcluding } from '~/data/words'
import HistoryPanel from '~/components/HistoryPanel'

interface DefinitionGameProps {
  word: Word
  difficulty: 'easy' | 'medium' | 'hard'
  onComplete: (correct: boolean, score: number) => void
  onBack: () => void
  correctHistory: Word[]
}

export default function DefinitionGame({
  word,
  difficulty,
  onComplete,
  onBack,
  correctHistory,
}: DefinitionGameProps) {
  const [options, setOptions] = useState<Word[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const wordsToExclude = [...correctHistory, word]
    const otherWords = getRandomWordsExcluding(difficulty, 3, wordsToExclude)
    const allOptions = [word, ...otherWords].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setSelectedWord(null)
    setRevealed(false)
  }, [word, difficulty, correctHistory])

  const handleSelect = (selectedWord: string) => {
    if (revealed) return

    setSelectedWord(selectedWord)
    setRevealed(true)

    const correct = selectedWord === word.word
    const score = correct ? 10 : 0

    setTimeout(() => {
      onComplete(correct, score)
    }, 1500)
  }

  if (options.length === 0) {
    return <div>Loading...</div>
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
          Definition Match
        </h2>
        <div className="w-24"></div>
      </div>

      <div
        className="border-2 rounded-2xl p-10 mb-8 text-center"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <h3 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-secondary)' }}>
          What word matches this definition?
        </h3>
        <p className="text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {word.definition}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 my-8">
        {options.map((option) => {
          const isSelected = selectedWord === option.word
          const isCorrect = option.word === word.word

          const getButtonStyle = () => {
            if (revealed) {
              if (isCorrect) {
                return {
                  backgroundColor: 'var(--success-color)',
                  borderColor: 'var(--success-color)',
                  color: '#1a1a1a',
                }
              } else if (isSelected && !isCorrect) {
                return {
                  backgroundColor: 'var(--error-color)',
                  borderColor: 'var(--error-color)',
                  color: '#1a1a1a',
                }
              } else {
                return {
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)',
                  opacity: 0.5,
                }
              }
            }
            return {
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)',
            }
          }

          return (
            <button
              key={option.word}
              className={`p-6 border-2 rounded-xl text-xl font-semibold transition-all duration-200 capitalize ${
                !revealed ? 'cursor-pointer hover:-translate-y-0.5 hover:border-primary' : ''
              } ${isCorrect && revealed ? 'animate-in zoom-in duration-500' : ''} ${isSelected && !isCorrect && revealed ? 'animate-in shake duration-500' : ''}`}
              style={getButtonStyle()}
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
              onClick={() => handleSelect(option.word)}
              disabled={revealed}
            >
              {option.word}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div
          className="border-2 rounded-2xl p-8 my-8 text-center animate-in slide-in-from-bottom-5 duration-500"
          style={{
            backgroundColor:
              selectedWord === word.word ? 'var(--success-bg)' : 'var(--error-bg)',
            borderColor: selectedWord === word.word ? 'var(--success-color)' : 'var(--error-color)',
          }}
        >
          {selectedWord === word.word ? (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--success-color)' }}>
                Correct! 🎉
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                Great job!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-4xl font-bold mb-2" style={{ color: 'var(--error-color)' }}>
                Not quite!
              </h3>
              <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
                The correct answer was: <strong>{word.word}</strong>
              </p>
            </>
          )}
        </div>
      )}

      <HistoryPanel correctHistory={correctHistory} />
    </div>
  )
}
