# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Using pnpm (recommended)

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server at http://localhost:5173
pnpm build          # Build for production
pnpm preview        # Preview production build
pnpm lint           # Run ESLint
pnpm lint:fix       # Auto-fix linting issues
pnpm format         # Format code with Prettier
pnpm format:check   # Check code formatting
```

### Using just

```bash
just                # List all commands
just dev            # Start dev server
just fix            # Fix all formatting and linting
just check          # Run format + lint checks
just validate       # Full validation (typecheck + format + lint)
just typecheck      # TypeScript type checking only
just clean          # Remove build artifacts
just reinstall      # Clean reinstall dependencies
```

## Architecture Overview

### Application Structure

SpellWell is a vocabulary learning app with 4 game modes (Word Spelling, Definition Match, Fill in the Blank, Anagram Solver). It uses a two-tier state management pattern:

1. **GameContext** - Ephemeral session state (score, streak, correctHistory)
2. **ThemeContext** - Persistent theme preference (dark/light)

### State Management Pattern

**GameContext** (`src/context/GameContext.tsx`):

- Lives in-memory only, resets on navigation to HomePage
- Tracks: `score`, `streak`, `correctHistory`, `currentMode`
- When switching game modes, `correctHistory` is cleared to prevent word pool exhaustion

**Statistics** (`src/utils/statistics.ts`):

- Persisted to localStorage with key `spellwell-statistics`
- Separate from GameContext - survives app restarts
- Updated after every word attempt in GamePage's `handleGameComplete()`

**Critical Pattern**: GameContext is session-based, Statistics are permanent.

### Word Selection System

**Vocabulary** (`src/data/words.ts`):

- Static array of 24 words (8 per difficulty level)
- Word selection functions use exclusion pattern to avoid repeats:
  - `getRandomWordExcluding(difficulty, excludeWords)` - Main selection function
  - Returns `null` when no more words available → triggers completion page

**Word Progression Flow**:

1. GamePage calls `getRandomWordExcluding(difficulty, correctHistory)`
2. If word found → render game component
3. If null → navigate to `/game/:mode/:difficulty/complete`
4. Switching modes resets `correctHistory` to allow replay

### Game Component Pattern

All game components follow this structure:

```typescript
interface CommonGameProps {
  word: Word
  difficulty: Difficulty
  onComplete: (correct: boolean, score: number) => void
  onBack: () => void
  correctHistory?: Word[] // Used by most games for HistoryPanel
}
```

**Scoring by Mode**:

- SpellingGame: Variable (10-60 points) based on attempts - `(6 - attempts + 1) * 10`
- DefinitionGame: Fixed 10 points
- FillBlankGame: Fixed 10 points
- AnagramGame: Fixed 15 points (highest)

**Hint System**:

- Easy difficulty: Hints always visible
- Medium/Hard: "Show Hint" button reveals definition
- Implemented via local `showHint` state in each game component

### Data Flow

```text
GamePage (Orchestrator)
├── Fetches word via getRandomWordExcluding()
├── Renders game component based on :mode param
├── Receives onComplete(correct, score) callback
├── Updates GameContext (score, streak, correctHistory)
├── Updates localStorage statistics
└── Fetches next word OR navigates to completion
```

### Routing Structure

- `/` - HomePage (mode + difficulty selection)
- `/game/:mode/:difficulty` - GamePage (active game session)
- `/game/:mode/:difficulty/complete` - CompletionPage (success screen)
- `/stats` - StatsPage (statistics view)

**URL Parameters**:

- `mode`: 'spelling' | 'definition' | 'fillblank' | 'anagram'
- `difficulty`: 'easy' | 'medium' | 'hard'

GamePage validates params on mount and redirects to '/' if invalid.

### Theme System

Uses CSS variables with `data-theme` attribute on document root:

```css
:root[data-theme='dark'] { /* dark theme vars */ }
:root[data-theme='light'] { /* light theme vars */ }
```

**Primary Color**: `--color-primary: #667eea` (purple accent used throughout)

Components use inline styles with `var(--variable-name)` for theme-aware colors. ThemeContext manages state and localStorage persistence with key `spellwell-theme`.

### Type Definitions

All core types defined in `src/types.ts`:

- `Word`: `{ word, definition, difficulty, exampleSentence? }`
- `GameMode`: 'spelling' | 'definition' | 'fillblank' | 'anagram'
- `Difficulty`: 'easy' | 'medium' | 'hard'
- `Statistics`: Complete stats structure with difficulty/mode breakdowns

## Key Implementation Details

### Game-Specific Behaviors

**SpellingGame**:

- Wordle-style keyboard input (listens to keydown events)
- 6 attempts maximum
- Letter states: correct (green), present (yellow), absent (gray)
- Uses `getLetterState()` to determine color per letter position

**DefinitionGame**:

- Shows definition, user picks from 4 words
- Uses `getRandomWordsExcluding()` to generate 3 incorrect options
- Single attempt with immediate feedback

**FillBlankGame**:

- Requires `word.exampleSentence` with '\_' placeholder
- Splits sentence on '\_' and renders blank as interactive span
- Also uses `getRandomWordsExcluding()` for options

**AnagramGame**:

- Scrambles word letters on mount
- Click letters to move between "Available" and "Answer" areas
- Shuffle/Clear/Submit controls
- Does NOT show HistoryPanel (no `correctHistory` prop)

### Common Patterns to Follow

**Component Delays**: All games wait 1500ms after revealing answer before calling `onComplete()` - allows user to see result.

**Disabled States**: After answer revealed, all interactive elements disabled until next word loads.

**Navigation**: Always use `useNavigate()` hook from react-router-dom, never `<Link>` components for programmatic navigation.

**Context Updates**: GamePage is responsible for updating both GameContext and Statistics - individual game components never touch global state directly.

## Important Constraints

1. **Word Pool Limitation**: Only 8 words per difficulty level. When all words in a difficulty are exhausted, user is redirected to completion page.

2. **No API/Backend**: All data is static (`words.ts`) and client-side (localStorage). No fetch calls or external dependencies.

3. **Session vs Persistent State**:
   - GameContext: Cleared on home navigation
   - Statistics: Persisted forever unless explicitly reset

4. **Mode Switching**: Changing game mode resets `correctHistory` to prevent immediate completion (since word pools overlap across modes).

## Styling Approach

- **Primary**: Tailwind CSS utility classes
- **Theming**: CSS variables via inline styles (`style={{ color: 'var(--text-primary)' }}`)
- **No CSS Modules**: All styling via Tailwind or inline styles with CSS variables
- **Animations**: Tailwind's animate-in utilities for transitions

## Common Gotchas

1. **AnagramGame is Different**: Doesn't receive `correctHistory` prop and doesn't render HistoryPanel.

2. **GamePage Manages Mode Switching**: If `mode !== currentMode`, GamePage calls `setCurrentMode()` and `setCorrectHistory([])` to reset.

3. **Statistics Update Order**: Must happen BEFORE loading next word to ensure streak calculation is correct.

4. **Theme Toggle Icon Logic**: Shows sun (☀️) in dark mode and moon (🌙) in light mode - icon represents what you'll switch TO, not current state.

5. **Hint Visibility**: Easy mode sets `showHint={true}` on mount; medium/hard set `showHint={false}` and require button click.
