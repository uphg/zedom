# Changelog

## [0.1.0-alpha.2] - 2026-07-21

### Added

- `getSiblings` function to get sibling elements
- EventManager `once`, `emit`, `clear` tests
- MIT license file
- Community governance files (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)

### Changed

- Replaced `unfunt` dependency with inlined utility functions
- Replaced placeholder URLs with real repository references
- Switched vitest environment from `node` to `jsdom`
- Improved README with API documentation and examples

### Fixed

- `toElement` nil check logic was inverted
- `EventManager.delegate` event traversal logic was incorrect
- `getStyle` type cast from `as unknown as number` to proper indexing
- EventManager methods now bind `this` for destructured usage
- Test files now use named imports consistently
- CI repository reference now uses real org/repo

### Infrastructure

- Added `typecheck` and `test:coverage` scripts
- Added Node version matrix (18, 20, 22) to CI
- Added `.editorconfig`
- Added release workflow for automated npm publishing
- Added Dependabot configuration
- Added Issue/PR templates
