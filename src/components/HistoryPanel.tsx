import { useState } from 'react';
import type { Word } from '../types';

interface HistoryPanelProps {
  correctHistory: Word[];
}

export default function HistoryPanel({ correctHistory }: HistoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (correctHistory.length === 0) {
    return null;
  }

  return (
    <div className="history-panel">
      <button
        className="history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="history-icon">{isExpanded ? '▼' : '▶'}</span>
        Correct Answers ({correctHistory.length})
      </button>

      {isExpanded && (
        <div className="history-content">
          {correctHistory.map((word, index) => (
            <div key={index} className="history-item">
              <div className="history-word">{word.word}</div>
              <div className="history-definition">{word.definition}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
