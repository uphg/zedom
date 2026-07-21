# Events

## EventManager

The `EventManager` class provides a complete event handling system.

```ts
import { EventManager } from 'zedom-creator'

const em = new EventManager()
```

### on

Add an event listener. Returns an unsubscribe function.

```ts
const off = em.on(element, 'click', (event) => {
  console.log('clicked')
})

off() // remove listener
```

**Parameters:**
- `el: EventElement` - Target element
- `eventName: string` - Event type
- `handler: EventHandler` - Callback function
- `options?: EventOptions` - AddEventListener options

### once

Add a one-time event listener.

```ts
em.once(element, 'click', (event) => {
  console.log('fires only once')
})
```

### off

Remove an event listener.

```ts
em.off(element, 'click', handler)
em.off(element, 'click') // Remove all 'click' handlers
```

### delegate

Event delegation. Listens for events on matching child elements.

```ts
em.delegate(container, 'click', '.item', (event) => {
  console.log('item clicked')
})
```

### emit

Dispatch a custom event.

```ts
em.emit(element, 'custom-event', { message: 'hello' })
```

### clear

Remove all listeners from an element.

```ts
em.clear(element)
```
