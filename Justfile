# Default recipe to display help information
default:
  @just --list

# Install dependencies
install:
  pnpm install

# Run development server
dev:
  pnpm dev

# Build the project for production
build:
  pnpm build

# Preview production build
preview:
  pnpm preview

# Run ESLint to check for code issues
lint:
  pnpm lint

# Run ESLint and automatically fix issues
lint-fix:
  pnpm lint:fix

# Format code with Prettier
format:
  pnpm format

# Check if code is formatted correctly
format-check:
  pnpm format:check

# Run both linting and formatting checks
check:
  @echo "Running format check..."
  pnpm format:check
  @echo "\nRunning lint check..."
  pnpm lint

# Fix all linting and formatting issues
fix:
  @echo "Formatting code..."
  pnpm format
  @echo "\nFixing lint issues..."
  pnpm lint:fix

# Clean build artifacts and dependencies
clean:
  rm -rf dist node_modules .vite

# Reinstall dependencies from scratch
reinstall: clean install

# Run type checking
typecheck:
  pnpm tsc --noEmit

# Full validation (typecheck, lint, format check)
validate:
  @echo "Running type check..."
  pnpm tsc --noEmit
  @echo "\nRunning format check..."
  pnpm format:check
  @echo "\nRunning lint check..."
  pnpm lint
  @echo "\n✅ All checks passed!"

# Build and preview the production build
build-preview: build preview
