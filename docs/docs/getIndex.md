## `getIndex(el)`

Get the index of an element among its siblings.

### Usage

```ts
import { getIndex } from 'zedom'

const element = document.getElementById('target')
const index = getIndex(element)

console.log(`Element is at index: ${index}`)
// => Element is at index: 2
```

### Arguments

1. `el` *(Element | null)*: The target element

### Returns

*(number)*: Returns the zero-based index of the element among its siblings, or -1 if the element has no parent or is not found