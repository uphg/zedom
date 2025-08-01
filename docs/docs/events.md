## `on(el, eventName, selector, handler, options)` / `off(el, eventName, handler, options)`

Event handling utilities with support for event delegation.

### Usage

```ts
import { on, off } from 'zedom'

const container = document.getElementById('container')
const button = document.getElementById('button')

// Simple event listener
const clickHandler = (event) => {
  console.log('Button clicked')
}
on(button, 'click', clickHandler)

// Event delegation
on(container, 'click', '.button', (event) => {
  console.log('Delegated button clicked')
})

// Remove event listener
off(button, 'click', clickHandler)

// With options
on(button, 'click', clickHandler, { once: true })
```

### Arguments

#### `on(el, eventName, selector, handler, options)`

1. `el` *(Element | null)*: The target element
2. `eventName` *(string)*: The event name (e.g., 'click', 'mouseover')
3. `selector` *(string | EventHandler)*: CSS selector for delegation or event handler function
4. `handler` *(EventHandler | EventListenerOptions)*: Event handler function or options
5. `options` *(boolean | EventListenerOptions)*: Event listener options

#### `off(el, eventName, handler, options)`

1. `el` *(Element | null)*: The target element
2. `eventName` *(string)*: The event name
3. `handler` *(EventHandler)*: The event handler function to remove
4. `options` *(boolean | EventListenerOptions)*: Event listener options

### Returns

*(Element | undefined)*: Returns the target element or undefined