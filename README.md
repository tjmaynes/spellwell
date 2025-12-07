# 📚 SpellWell

> A modern, interactive vocabulary learning application that helps users improve their spelling and word knowledge through engaging games and challenges.

## ✨ Features

### 🎮 Multiple Game Modes

- **Word Spelling** 🔤 - Wordle-style game where you guess hidden words letter by letter
- **Definition Match** 📚 - Match words with their correct definitions
- **Fill in the Blank** ✏️ - Complete sentences with the right word
- **Anagram Solver** 🔀 - Unscramble letters to form words

### 🎯 Difficulty Levels

- **Easy** - Perfect for beginners, includes hints and definitions
- **Medium** - Moderate challenge with optional hints
- **Hard** - No hints, test your vocabulary mastery

### 🌓 Accessible Theme Support

- **Dark Mode** - Easy on the eyes with a beautiful purple gradient
- **Light Mode** - Clean, bright interface with WCAG AA compliant contrast
- **WCAG Accessible** - All colors meet 4.5:1 contrast ratio minimum
- **Color-blind Friendly** - Semantic color system that works for all users
- Toggle seamlessly between themes with persistent preferences

### 📊 Progress Tracking

- Track your score and streaks
- View detailed statistics by difficulty and game mode
- Review words you've mastered
- Identify words that need more practice

### 🎨 Modern UI/UX

- Smooth animations and transitions
- Responsive design for all devices
- Beautiful gradient effects and color schemes
- Intuitive navigation with Astro's routing
- Accessible design with semantic HTML and ARIA labels

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm/yarn
- **just** (optional, for task running)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tjmaynes/spellwell.git
   cd spellwell
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   just dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

## 🛠️ Tech Stack

### Core

- **Astro 5** - Modern web framework for content-driven sites
- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe development
- **Cloudflare Pages** - Edge deployment with SSR support

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming with WCAG-compliant colors
- **Custom Gradients** - Beautiful purple-themed design
- **Accessible Themes** - Light and dark modes with proper contrast ratios

### Code Quality

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific rules

### State Management

- **Nanostores** - Lightweight state management (< 1KB)
- **@nanostores/react** - React integration for stores
- **LocalStorage** - Persistent theme and statistics

## 📜 Available Scripts

### Using pnpm

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Using just

```bash
just              # List all available commands
just dev          # Start development server
just build        # Build for production
just preview      # Preview production build
just lint         # Run ESLint
just lint-fix     # Fix ESLint issues
just format       # Format code with Prettier
just format-check # Check code formatting
just check        # Run all checks (format + lint)
just fix          # Fix all issues (format + lint)
just typecheck    # Run TypeScript type checking
just validate     # Full validation (typecheck + format + lint)
just clean        # Remove build artifacts
just reinstall    # Clean reinstall dependencies
just deploy       # Deploy to Cloudflare Pages
```

## 🚀 Deployment

SpellWell can be deployed to Cloudflare Pages for free hosting with unlimited bandwidth.

Quick deployment:

```bash
# Login to Cloudflare
pnpm cf:login

# Build and deploy
pnpm deploy
```

## 🏗️ Architecture

### State Management with Nanostores

SpellWell uses [Nanostores](https://github.com/nanostores/nanostores) for state management, providing:

- **Lightweight** - Less than 1KB bundle size
- **Framework Agnostic** - Works with React, Vue, Svelte, and vanilla JS
- **Simple API** - Easy to understand atom-based state
- **Better Performance** - Only components using specific atoms re-render

**Game State** (`gameStore.ts`)

- Score tracking
- Streak management
- Correct answer history
- Current game mode

**Theme State** (`themeStore.ts`)

- Light/dark mode toggle
- Persistent theme preferences
- Automatic document attribute updates

### Accessibility First

All components use CSS variables for theming, ensuring:

- **WCAG AA Compliance** - 4.5:1 contrast ratio for normal text
- **WCAG AAA for Large Text** - 7:1 contrast ratio for headings
- **Dynamic Theming** - Colors adapt automatically to light/dark mode
- **Color-blind Friendly** - Semantic color system with proper contrast

### Server-Side Rendering

Built with Astro for optimal performance:

- **Static Site Generation** - Pre-rendered pages for fast loading
- **Islands Architecture** - Interactive React components only where needed
- **Edge Deployment** - Deployed to Cloudflare Pages for global performance
- **Zero JavaScript by Default** - Only hydrate interactive components

## 📁 Project Structure

```text
spellwell/
├── src/
│   ├── components/        # React components
│   │   ├── games/         # Game components
│   │   │   ├── AnagramGame.tsx
│   │   │   ├── DefinitionGame.tsx
│   │   │   ├── FillBlankGame.tsx
│   │   │   └── SpellingGame.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── GamePage.tsx
│   │   │   └── CompletionPage.tsx
│   │   ├── HistoryPanel.tsx
│   │   ├── ModeSelection.tsx
│   │   ├── StatisticsView.tsx
│   │   └── ThemeToggle.tsx
│   ├── stores/            # Nanostore state management
│   │   ├── gameStore.ts   # Game state (score, streak, history)
│   │   └── themeStore.ts  # Theme state (light/dark mode)
│   ├── data/              # Word lists and data
│   │   └── words.ts
│   ├── layouts/           # Astro layouts
│   │   └── MainLayout.astro
│   ├── pages/             # Astro pages (routes)
│   │   ├── index.astro    # Home page
│   │   ├── stats.astro    # Statistics page
│   │   └── game/
│   │       └── [mode]/
│   │           └── [difficulty]/
│   │               ├── index.astro
│   │               └── complete.astro
│   ├── styles/            # Global styles
│   │   └── global.css     # Theme variables and base styles
│   ├── utils/             # Utility functions
│   │   └── statistics.ts
│   └── types.ts           # TypeScript types
├── public/                # Static assets
│   └── favicon.svg
├── .prettierrc            # Prettier configuration
├── astro.config.mjs       # Astro configuration
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration
├── wrangler.toml          # Cloudflare Workers configuration
├── Justfile               # Task runner commands
└── package.json           # Dependencies and scripts
```

## 🎮 How to Play

1. **Choose a Game Mode** - Select from four different word games
2. **Pick a Difficulty** - Start with Easy and work your way up
3. **Play the Game** - Follow the instructions for each game type
4. **Track Your Progress** - View your statistics and improve over time

### Game Rules

#### Word Spelling 🔤

- Guess the hidden word in 6 tries
- Green = correct letter in correct position
- Yellow = correct letter in wrong position
- Gray = letter not in word

#### Definition Match 📚

- Read the definition
- Choose the correct word from 4 options
- Learn new vocabulary

#### Fill in the Blank ✏️

- Complete the sentence with the right word
- Context clues help you learn
- Hints available on Easy mode

#### Anagram Solver 🔀

- Unscramble the letters to form a word
- Tap letters to build your answer
- Shuffle for a new arrangement

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with Astro, React 19, and TypeScript
- State management with Nanostores
- Styled with Tailwind CSS 4 and accessible CSS variables
- Deployed on Cloudflare Pages
- Inspired by word games like Wordle and vocabulary learning apps

---

**Happy Learning!** 🎉
