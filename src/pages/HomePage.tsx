import { useNavigate } from 'react-router-dom';
import type { GameMode, Difficulty } from '../types';
import { useGame } from '../context/GameContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { resetGame } = useGame();

  const handleModeSelect = (mode: GameMode, difficulty: Difficulty) => {
    resetGame();
    navigate(`/game/${mode}/${difficulty}`);
  };

  const handleViewStats = () => {
    navigate('/stats');
  };

  const modes = [
    {
      id: 'spelling' as GameMode,
      title: 'Word Spelling',
      description: 'Guess the hidden word letter by letter',
      icon: '🔤'
    },
    {
      id: 'definition' as GameMode,
      title: 'Definition Match',
      description: 'Match words with their correct definitions',
      icon: '📚'
    },
    {
      id: 'fillblank' as GameMode,
      title: 'Fill in the Blank',
      description: 'Complete sentences with the right word',
      icon: '✏️'
    },
    {
      id: 'anagram' as GameMode,
      title: 'Anagram Solver',
      description: 'Unscramble letters to form words',
      icon: '🔀'
    }
  ];

  const difficulties: { id: Difficulty; label: string; color: string }[] = [
    { id: 'easy', label: 'Easy', color: '#4ade80' },
    { id: 'medium', label: 'Medium', color: '#facc15' },
    { id: 'hard', label: 'Hard', color: '#f87171' }
  ];

  return (
    <div className="mode-selection">
      <h1 className="title">SpellWell</h1>
      <p className="subtitle">Choose your game mode and difficulty</p>

      <div className="modes-grid">
        {modes.map((mode) => (
          <div key={mode.id} className="mode-card">
            <div className="mode-icon">{mode.icon}</div>
            <h3 className="mode-title">{mode.title}</h3>
            <p className="mode-description">{mode.description}</p>
            <div className="difficulty-buttons">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  className="difficulty-btn"
                  style={{ '--diff-color': diff.color } as React.CSSProperties}
                  onClick={() => handleModeSelect(mode.id, diff.id)}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="stats-button" onClick={handleViewStats}>
        View Statistics
      </button>
    </div>
  );
}
