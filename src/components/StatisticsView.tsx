import type { Statistics } from '../types';
import { getStatistics, resetStatistics } from '../utils/statistics';
import { useState, useEffect } from 'react';

interface StatisticsViewProps {
  onBack: () => void;
}

export default function StatisticsView({ onBack }: StatisticsViewProps) {
  const [stats, setStats] = useState<Statistics>(getStatistics());
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setStats(getStatistics());
  }, []);

  const handleReset = () => {
    resetStatistics();
    setStats(getStatistics());
    setShowConfirm(false);
  };

  const getTotalCorrect = () => {
    return stats.correctByDifficulty.easy +
      stats.correctByDifficulty.medium +
      stats.correctByDifficulty.hard;
  };

  const getTotalIncorrect = () => {
    return stats.incorrectByDifficulty.easy +
      stats.incorrectByDifficulty.medium +
      stats.incorrectByDifficulty.hard;
  };

  const getAccuracy = () => {
    const total = getTotalCorrect() + getTotalIncorrect();
    if (total === 0) return 0;
    return Math.round((getTotalCorrect() / total) * 100);
  };

  return (
    <div className="statistics-view">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Your Statistics</h2>
      </div>

      <div className="stats-container">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{stats.totalGamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalScore}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.bestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getAccuracy()}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Performance by Difficulty</h3>
          <div className="difficulty-stats">
            {(['easy', 'medium', 'hard'] as const).map((diff) => {
              const correct = stats.correctByDifficulty[diff];
              const incorrect = stats.incorrectByDifficulty[diff];
              const total = correct + incorrect;
              const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

              return (
                <div key={diff} className="difficulty-row">
                  <div className="difficulty-label">{diff.charAt(0).toUpperCase() + diff.slice(1)}</div>
                  <div className="difficulty-bar">
                    <div
                      className={`difficulty-fill ${diff}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="difficulty-numbers">
                    {correct}/{total} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stats-section">
          <h3>Games by Mode</h3>
          <div className="mode-stats">
            {Object.entries(stats.gamesByMode).map(([mode, count]) => (
              <div key={mode} className="mode-row">
                <div className="mode-label">
                  {mode === 'spelling' && '🔤 Word Spelling'}
                  {mode === 'definition' && '📚 Definition Match'}
                  {mode === 'fillblank' && '✏️ Fill in the Blank'}
                  {mode === 'anagram' && '🔀 Anagram Solver'}
                </div>
                <div className="mode-count">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {stats.incorrectWords.length > 0 && (
          <div className="stats-section">
            <h3>Words to Review</h3>
            <p className="review-hint">These words gave you trouble. Review them to improve!</p>
            <div className="incorrect-words">
              {stats.incorrectWords.slice(0, 20).map((word, index) => (
                <span key={index} className="word-badge">{word}</span>
              ))}
              {stats.incorrectWords.length > 20 && (
                <span className="word-badge more">+{stats.incorrectWords.length - 20} more</span>
              )}
            </div>
          </div>
        )}

        <div className="stats-actions">
          {!showConfirm ? (
            <button className="reset-button" onClick={() => setShowConfirm(true)}>
              Reset All Statistics
            </button>
          ) : (
            <div className="confirm-reset">
              <p>Are you sure? This cannot be undone.</p>
              <button className="confirm-yes" onClick={handleReset}>Yes, Reset</button>
              <button className="confirm-no" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
