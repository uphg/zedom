# Environment

## isServer

Check if running in a server (non-browser) environment.

```ts
import { isServer } from 'zedom-creator'

if (isServer) {
  // Server-side code
}
```

Returns `true` when `window` is undefined (e.g., Node.js).

## isClient

Check if running in a browser environment.

```ts
import { isClient } from 'zedom-creator'

if (isClient) {
  // Client-side code
}
```

Returns `true` when `window` is defined. Equal to `!isServer`.

## Type Guards

```ts
import { isNode, isElement, isHTMLElement, isSVGElement } from 'zedom-creator'

isNode(someValue)         // value instanceof Node
isElement(someValue)      // value instanceof Element
isHTMLElement(someValue)  // value instanceof HTMLElement
isSVGElement(someValue)   // value instanceof SVGElement
```
