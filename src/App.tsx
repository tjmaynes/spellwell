import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { ThemeProvider } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import StatsPage from './pages/StatsPage'
import CompletionPage from './pages/CompletionPage'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <BrowserRouter>
          <div className="min-h-screen p-8 max-w-[1200px] mx-auto">
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:mode/:difficulty" element={<GamePage />} />
              <Route path="/game/:mode/:difficulty/complete" element={<CompletionPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  )
}

export default App
