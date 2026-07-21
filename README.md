# zedom

A lightweight JavaScript DOM utility library.

## Features

- 🚀 **TypeScript** — Type-safe development
- ⚡ **Vitest** — Fast unit testing
- 📦 **Rollup** — Efficient bundling (ESM, CJS, UMD)
- 🎨 **ESLint + @stylistic** — Code linting and formatting
- 🔧 **Git Hooks** — Pre-commit linting with lint-staged

## Installation

```bash
pnpm add zedom-creator
```

```bash
npm install zedom-creator
```

## API

### Events

| Function | Description |
|----------|-------------|
| `EventManager` | Full-featured event management class |
| `.on(el, event, handler)` | Add event listener, returns unsubscribe function |
| `.once(el, event, handler)` | Add one-time event listener |
| `.off(el, event, handler?)` | Remove event listener |
| `.delegate(container, event, selector, handler)` | Event delegation |
| `.emit(el, event, detail?)` | Dispatch custom event |
| `.clear(el)` | Remove all listeners from an element |

```ts
import { EventManager } from 'zedom-creator'

const em = new EventManager()
const off = em.on(document.body, 'click', (e) => {
  console.log('body clicked', e)
})
// later...
off()
```

### DOM Manipulation

| Function | Description |
|----------|-------------|
| `toElement(innerHTML, children?)` | Create element from HTML string |
| `getStyle(el, styleName)` | Get inline style value (camelCase or kebab-case) |
| `setStyle(el, styles, value?)` | Set inline style(s) |
| `getIndex(el)` | Get element index among siblings |
| `getSiblings(el)` | Get sibling elements (excluding self) |
| `getParentNode(el, selector)` | Find matching ancestor element |
| `getScrollParent(node)` | Find nearest scrollable ancestor |
| `getScrollbarWidth()` | Get browser scrollbar width |
| `$all(selector, parent?)` | `querySelectorAll` wrapper returning array |

```ts
import { toElement, setStyle, getStyle, getSiblings } from 'zedom-creator'

const el = toElement('<div class="box">Hello</div>')
setStyle(el, { color: 'red', fontSize: '16px' })
console.log(getStyle(el, 'color')) // 'red'

const index = getIndex(el.parentNode?.children[0] as Element)
console.log(index) // 0
```

### Environment

| Function | Description |
|----------|-------------|
| `isServer` | `true` if running in Node.js (no `window`) |
| `isClient` | `true` if running in browser |

### Type Guards

| Function | Description |
|----------|-------------|
| `isNode(val)` | Check if value is a `Node` |
| `isElement(val)` | Check if value is an `Element` |
| `isHTMLElement(val)` | Check if value is an `HTMLElement` |
| `isSVGElement(val)` | Check if value is an `SVGElement` |

### Utilities

| Function | Description |
|----------|-------------|
| `withPure(data?)` | Create a clean object without prototype chain |

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
- **Automatic**: No manual intervention needed — code is formatted on commit

To skip hooks (not recommended):
```bash
git commit --no-verify -m "your message"
```

## License

[MIT](./LICENSE)
