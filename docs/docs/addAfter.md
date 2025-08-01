## `addAfter(el, newNode)`

Insert a new node after the specified element.

### Usage

```ts
import { addAfter } from 'zedom'

const element = document.getElementById('target')
const newElement = document.createElement('div')
newElement.textContent = 'New content'

addAfter(element, newElement)
```

### Arguments

1. `el` *(Node)*: The reference element after which to insert the new node
2. `newNode` *(Node)*: The new node to insert

### Returns

*(Node | null | undefined)*: Returns the inserted node, or null/undefined if the operation fails