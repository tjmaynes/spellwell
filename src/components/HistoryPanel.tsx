import { useState } from 'react'
import type { Word } from '../types'

interface HistoryPanelProps {
  correctHistory: Word[]
}

export default function HistoryPanel({ correctHistory }: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (correctHistory.length === 0) {
    return null
  }

  return (
    <div className="mt-12 bg-white/5 border-2 border-white/10 rounded-2xl overflow-hidden">
      <button
        className="w-full px-6 py-5 bg-transparent border-none text-white text-lg font-semibold cursor-pointer flex items-center gap-3 transition-all duration-200 hover:bg-white/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          className="text-sm transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
        Correct Answers ({correctHistory.length})
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
          {correctHistory.map((word, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-xl mb-3 last:mb-0 transition-all duration-200 hover:bg-white/10"
            >
              <div className="text-xl font-bold text-primary mb-2 capitalize">{word.word}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{word.definition}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
