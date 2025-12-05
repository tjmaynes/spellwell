import { useState, useEffect } from 'react'
import type { Word } from '../types'
import { getRandomWordsExcluding } from '../data/words'
import HistoryPanel from './HistoryPanel'

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
          className="px-6 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white font-semibold transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
          onClick={onBack}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold flex-1 text-center">Definition Match</h2>
        <div className="w-24"></div>
      </div>

      <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-10 mb-8 text-center">
        <h3 className="text-2xl font-semibold mb-6 text-gray-300">
          What word matches this definition?
        </h3>
        <p className="text-xl leading-relaxed">{word.definition}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 my-8">
        {options.map((option) => {
          const isSelected = selectedWord === option.word
          const isCorrect = option.word === word.word

          let className =
            'p-6 bg-white/5 border-2 border-white/20 rounded-xl text-white text-xl font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 hover:border-primary capitalize'

          if (revealed) {
            if (isCorrect) {
              className =
                'p-6 bg-green-400 border-2 border-green-400 rounded-xl text-[#1a1a1a] text-xl font-semibold capitalize animate-in zoom-in duration-500'
            } else if (isSelected && !isCorrect) {
              className =
                'p-6 bg-red-400 border-2 border-red-400 rounded-xl text-[#1a1a1a] text-xl font-semibold capitalize animate-in shake duration-500'
            } else {
              className =
                'p-6 bg-white/5 border-2 border-white/20 rounded-xl text-white text-xl font-semibold cursor-not-allowed opacity-50 capitalize'
            }
          }

          return (
            <button
              key={option.word}
              className={className}
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
          className={`border-2 rounded-2xl p-8 my-8 text-center animate-in slide-in-from-bottom-5 duration-500 ${
            selectedWord === word.word
              ? 'bg-green-400/10 border-green-400'
              : 'bg-red-400/10 border-red-400'
          }`}
        >
          {selectedWord === word.word ? (
            <>
              <h3 className="text-4xl font-bold mb-2 text-green-400">Correct! 🎉</h3>
              <p className="text-xl text-gray-300">Great job!</p>
            </>
          ) : (
            <>
              <h3 className="text-4xl font-bold mb-2 text-red-400">Not quite!</h3>
              <p className="text-xl text-gray-300">
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
