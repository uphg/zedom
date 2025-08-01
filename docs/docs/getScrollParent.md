## `getScrollParent(node)`

Find the nearest scrollable parent element of a given node.

### Usage

```ts
import { getScrollParent } from 'zedom'

const element = document.getElementById('nested-element')
const scrollParent = getScrollParent(element)

if (scrollParent === document) {
  console.log('Scrollable parent is the document')
} else {
  console.log('Found scrollable parent:', scrollParent)
}
```

### Arguments

1. `node` *(Node)*: The node to find the scrollable parent for

### Returns

*(Element | HTMLElement | Document | null)*: Returns the nearest scrollable parent element, the document if no scrollable parent is found, or null if the node is null