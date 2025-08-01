## `removeChildren(el)`

Remove all child nodes from an element.

### Usage

```ts
import { removeChildren } from 'zedom'

const container = document.getElementById('container')

// Remove all children
removeChildren(container)

console.log(container.children.length) // => 0
```

### Arguments

1. `el` *(Element)*: The target element to remove children from

### Returns

*(void)*: This function does not return a value