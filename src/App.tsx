import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:mode/:difficulty" element={<GamePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
