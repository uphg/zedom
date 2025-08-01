# Contributing to Zedom

English | [中文](./CONTRIBUTING.zh-CN.md)

Thank you for your interest in contributing to Zedom! This guide will help you get started with contributing to this lightweight DOM manipulation library.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

- Node.js (latest LTS version recommended)
- pnpm (package manager)
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/zedom.git
   cd zedom
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up git hooks:
   ```bash
   pnpm prepare
   ```

### Available Scripts

- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm build` - Build the library
- `pnpm lint` - Lint and fix code
- `pnpm lint:check` - Check linting without fixing
- `pnpm docs:dev` - Start documentation development server
- `pnpm docs:build` - Build documentation
- `pnpm release` - Create a release (maintainers only)

## Project Structure

```
zedom/
├── src/                 # Source code
│   ├── *.ts            # DOM utility functions
│   └── internal/       # Internal shared utilities
├── test/               # Test files (mirrors src structure)
├── docs/               # Documentation
│   └── docs/           # API documentation
├── dist/               # Build output (generated)
└── scripts/            # Build and release scripts
```

## Code Guidelines

### General Rules

- **Language**: All code and comments must be in English
- **Line Endings**: Use Linux-style line endings (LF)
- **No Semicolons**: Don't add semicolons unless syntactically required
- **TypeScript First**: All source code should be written in TypeScript
- **Minimal Dependencies**: Keep the library lightweight with minimal dependencies

### Code Style

- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Don't extract single-line code (≤100 characters) into functions unless reused ≥2 times
- Don't reformat existing code unless explicitly needed

### Adding New DOM Utilities

1. **File naming**: Use camelCase for file names (e.g., `myDomFunction.ts`)

2. **Function structure**:
   ```typescript
   /**
    * Brief description of what the function does
    * 
    * @param param1 Description of parameter
    * @param param2 Description of parameter
    * @returns Description of return value
    * 
    * @example
    * ```typescript
    * myDomFunction(element, 'value')
    * // => result
    * ```
    */
   function myDomFunction(param1: Element, param2?: string): ReturnType {
     // Implementation
   }

   export default myDomFunction
   ```

3. **Export from index**: Add your function to the main `src/index.ts` file

4. **Browser compatibility**: Ensure compatibility with modern browsers, provide fallbacks for older browsers when necessary

## Testing

### Writing Tests

- All new utilities must have comprehensive tests
- Test files should be named: `test/functionName.spec.ts`
- Use Vitest for testing framework with jsdom environment
- Follow the existing test patterns

### Test Structure

```typescript
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import myDomFunction from '../src/myDomFunction'

describe('myDomFunction', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })

  it('should handle basic case', () => {
    expect(myDomFunction(element, 'value')).toBe('expected')
  })

  it('should handle null element', () => {
    expect(() => myDomFunction(null, 'value')).not.toThrow()
  })

  it('should handle edge cases', () => {
    expect(myDomFunction(element, '')).toBe('')
  })
})
```

### Running Tests

```bash
# Run all tests
pnpm test:run

# Run tests in watch mode
pnpm test

# Run tests for specific file
pnpm test myDomFunction.spec.ts
```

## Documentation

### API Documentation

- Each utility function should have JSDoc comments with:
  - Clear description
  - Parameter descriptions with types
  - Return value description
  - Usage examples
  - Notes about browser compatibility or special behavior

### Markdown Documentation

- API docs are located in `docs/docs/`
- Each function should have its own markdown file
- Include practical examples and use cases
- Update the main README.md when adding new utilities

### Documentation Format

```markdown
## `functionName(param1, param2)`

Brief description of the function.

### Usage

```ts
import { functionName } from 'zedom'

const element = document.getElementById('target')
functionName(element, 'value')
```

### Arguments

1. `param1` *(Type)*: Description of parameter
2. `param2` *(Type)*: Description of parameter

### Returns

*(ReturnType)*: Description of return value
```

## Submitting Changes

### Before Submitting

1. **Run the full test suite**: `pnpm test:run`
2. **Check linting**: `pnpm lint:check`
3. **Build the project**: `pnpm build`
4. **Update documentation** if needed

### Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test changes
- `refactor:` for code refactoring
- `perf:` for performance improvements
- `chore:` for maintenance tasks

Examples:
```
feat: add toggleClass utility for CSS class management
fix: handle null elements in addClass function
docs: add examples for event delegation
test: add edge cases for getScrollParent utility
```

### Pull Request Process

1. Create a feature branch from `master`:
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/my-new-utility
   ```

2. Make your changes following the guidelines above

3. Commit your changes with conventional commit messages

4. Push to your fork and create a pull request targeting the `master` branch

5. Fill out the pull request template with:
   - Clear description of changes
   - Testing information
   - Breaking changes (if any)
   - Related issues

### Pull Request Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits
- [ ] No breaking changes (unless discussed)
- [ ] Branch is up to date with `master`

## Release Process

Releases are handled by maintainers using automated scripts:

1. **Version bump**: Using semantic versioning
2. **Changelog generation**: Automatically generated from commit messages
3. **Build and publish**: Automated build and npm publication

### Versioning

- **Patch** (`0.1.0` → `0.1.1`): Bug fixes, documentation updates
- **Minor** (`0.1.0` → `0.2.0`): New features, non-breaking changes
- **Major** (`0.1.0` → `1.0.0`): Breaking changes

## Browser Support

Zedom aims to support:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

When adding new features, consider:
- Modern DOM APIs availability
- Fallbacks for older browsers when necessary
- Performance implications

## Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Maintainers will review all pull requests

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's technical standards

Thank you for contributing to Zedom! 🚀