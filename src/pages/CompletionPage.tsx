import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import type { GameMode, Difficulty } from '../types';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { mode, difficulty } = useParams<{ mode: GameMode; difficulty: Difficulty }>();
  const { score, correctHistory, resetGame } = useGame();

  const handleBackToMenu = () => {
    resetGame();
    navigate('/');
  };

  const handleTryAgain = () => {
    resetGame();
    if (mode && difficulty) {
      navigate(`/game/${mode}/${difficulty}`);
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'spelling':
        return 'Word Spelling';
      case 'definition':
        return 'Definition Match';
      case 'fillblank':
        return 'Fill in the Blank';
      case 'anagram':
        return 'Anagram Solver';
      default:
        return 'Game';
    }
  };

  const getDifficultyLabel = () => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : '';
  };

  return (
    <div className="game-view">
      <div className="completion-page">
        <div className="completion-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>
            You've completed all <strong>{getDifficultyLabel()}</strong> words in{' '}
            <strong>{getModeTitle()}</strong>!
          </p>
          <div className="completion-stats">
            <div className="completion-stat">
              <div className="stat-value">{correctHistory.length}</div>
              <div className="stat-label">Words Mastered</div>
            </div>
            <div className="completion-stat">
              <div className="stat-value">{score}</div>
              <div className="stat-label">Total Score</div>
            </div>
          </div>

          <div className="completion-actions">
            <button className="primary-button" onClick={handleTryAgain}>
              🔄 Try Again
            </button>
            <button className="secondary-button" onClick={handleBackToMenu}>
              🏠 Back to Menu
            </button>
          </div>
        </div>

        {correctHistory.length > 0 && (
          <div className="completion-words-review">
            <h3>Words You Mastered</h3>
            <div className="words-grid">
              {correctHistory.map((word, index) => (
                <div key={index} className="word-card">
                  <div className="word-card-title">{word.word}</div>
                  <div className="word-card-definition">{word.definition}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
