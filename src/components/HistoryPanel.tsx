import { useState } from 'react'
import type { Word } from '~/types'

interface HistoryPanelProps {
  correctHistory: Word[]
}

export default function HistoryPanel({ correctHistory }: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (correctHistory.length === 0) {
    return null
  }

  return (
    <div
      className="mt-12 border-2 rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      <button
        className="w-full px-6 py-5 bg-transparent border-none text-lg font-semibold cursor-pointer flex items-center gap-3 transition-all duration-200"
        style={{ color: 'var(--text-primary)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
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
              className="p-4 rounded-xl mb-3 last:mb-0 transition-all duration-200"
              style={{ backgroundColor: 'var(--card-bg)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)'
              }}
            >
              <div className="text-xl font-bold text-primary mb-2 capitalize">{word.word}</div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {word.definition}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
