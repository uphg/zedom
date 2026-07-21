# Getting Started

## Installation

```bash
pnpm add zedom-creator
```

```bash
npm install zedom-creator
```

## Basic Usage

### Event Management

```ts
import { EventManager } from 'zedom-creator'

const em = new EventManager()

// Add event listener
const off = em.on(document.body, 'click', (e) => {
  console.log('clicked', e.target)
})

// Remove listener
off()

// Event delegation
em.delegate(document.body, 'click', '.btn', (e) => {
  console.log('button clicked')
})

// One-time listener
em.once(document.body, 'load', () => {
  console.log('loaded once')
})

// Emit custom events
em.emit(document.body, 'my-event', { data: 42 })
```

### DOM Manipulation

```ts
import { toElement, setStyle, getStyle, getIndex } from 'zedom-creator'

// Create element from HTML
const el = toElement('<div class="box">Hello</div>')

// Set styles
setStyle(el, { color: 'red', fontSize: '16px' })
setStyle(el, 'background-color', 'blue')

// Get styles
console.log(getStyle(el, 'color')) // 'red'

// Get element index among siblings
console.log(getIndex(el)) // 0
```

### Environment Detection

```ts
import { isServer, isClient } from 'zedom-creator'

if (isServer) {
  console.log('Running in Node.js')
}
if (isClient) {
  console.log('Running in browser')
}
```
