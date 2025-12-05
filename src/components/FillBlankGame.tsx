import { useState, useEffect } from 'react'
import type { Word } from '../types'
import { getRandomWordsExcluding } from '../data/words'
import HistoryPanel from './HistoryPanel'

interface FillBlankGameProps {
  word: Word
  difficulty: 'easy' | 'medium' | 'hard'
  onComplete: (correct: boolean, score: number) => void
  onBack: () => void
  correctHistory: Word[]
}

export default function FillBlankGame({
  word,
  difficulty,
  onComplete,
  onBack,
  correctHistory,
}: FillBlankGameProps) {
  const [options, setOptions] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(difficulty === 'easy')

  useEffect(() => {
    const wordsToExclude = [...correctHistory, word]
    const otherWords = getRandomWordsExcluding(difficulty, 3, wordsToExclude).map((w) => w.word)
    const allOptions = [word.word, ...otherWords].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setSelectedWord(null)
    setRevealed(false)
    setShowHint(difficulty === 'easy')
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

  const renderSentence = () => {
    if (!word.exampleSentence) {
      return <p className="text-xl leading-loose">No example sentence available.</p>
    }

    const parts = word.exampleSentence.split('_')

    let blankClasses =
      'inline-block min-w-[8rem] px-4 py-2 mx-2 bg-white/10 border-2 border-white/30 rounded-lg font-bold capitalize'

    if (revealed) {
      if (selectedWord === word.word) {
        blankClasses =
          'inline-block min-w-[8rem] px-4 py-2 mx-2 bg-green-400 border-2 border-green-400 rounded-lg font-bold capitalize text-[#1a1a1a]'
      } else {
        blankClasses =
          'inline-block min-w-[8rem] px-4 py-2 mx-2 bg-red-400 border-2 border-red-400 rounded-lg font-bold capitalize text-[#1a1a1a]'
      }
    }

    return (
      <p className="text-xl leading-loose">
        {parts[0]}
        <span className={blankClasses}>{selectedWord || '______'}</span>
        {parts[1]}
      </p>
    )
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
        <h2 className="text-3xl font-bold flex-1 text-center">Fill in the Blank</h2>
        <div className="w-24"></div>
      </div>

      <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-10 mb-8 text-center">
        <h3 className="text-2xl font-semibold mb-6 text-gray-300">Complete the sentence:</h3>
        <div className="my-6">{renderSentence()}</div>
      </div>

      {difficulty === 'easy' ? (
        <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 mb-8 text-center text-lg leading-relaxed">
          <strong>Hint:</strong> {word.definition}
        </div>
      ) : (
        <div className="text-center mb-8">
          {!showHint ? (
            <button
              className="px-8 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl text-white font-semibold transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5 hover:border-primary"
              onClick={() => setShowHint(true)}
            >
              💡 Show Hint
            </button>
          ) : (
            <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
              <strong>Hint:</strong> {word.definition}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 my-8">
        {options.map((option) => {
          const isSelected = selectedWord === option
          const isCorrect = option === word.word

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
              key={option}
              className={className}
              onClick={() => handleSelect(option)}
              disabled={revealed}
            >
              {option}
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
              <h3 className="text-4xl font-bold mb-2 text-green-400">Perfect! 🎉</h3>
              <p className="text-xl text-gray-300">You completed the sentence correctly!</p>
            </>
          ) : (
            <>
              <h3 className="text-4xl font-bold mb-2 text-red-400">Not quite!</h3>
              <p className="text-xl text-gray-300">
                The correct word was: <strong>{word.word}</strong>
              </p>
            </>
          )}
        </div>
      )}

      <HistoryPanel correctHistory={correctHistory} />
    </div>
  )
}
