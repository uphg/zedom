# zedom

A DOM librar.

## Features

- 🚀 **TypeScript** - Type-safe development
- ⚡ **Vitest** - Fast unit testing
- 📦 **Rollup** - Efficient bundling (ESM, CJS, UMD)
- 🎨 **ESLint + @stylistic** - Code linting and formatting
- 🔧 **Git Hooks** - Pre-commit linting with lint-staged
- 📚 **VitePress** - Documentation site

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests once
pnpm test:run

# Lint and fix code
pnpm lint

# Check code without fixing
pnpm lint:check

# Build library
pnpm build
```

## Git Hooks

This project uses `simple-git-hooks` and `lint-staged` to automatically lint and fix code before commits:

- **Pre-commit**: Runs ESLint with auto-fix on staged `.js` and `.ts` files
- **Automatic**: No manual intervention needed - code is formatted on commit

To skip hooks (not recommended):
```bash
git commit --no-verify -m "your message"
```