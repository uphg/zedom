## `prepend(parent, ...nodes)`

Prepend one or more child nodes to the beginning of a parent element.

### Usage

```ts
import { prepend } from 'zedom'

const parent = document.getElementById('container')
const child1 = document.createElement('div')
const child2 = document.createElement('span')

// Prepend single child
prepend(parent, child1)

// Prepend multiple children
prepend(parent, child1, child2)

// Prepend from array
prepend(parent, [child1, child2])

// Mix single elements and arrays
prepend(parent, child1, [child2])
```

### Arguments

1. `parent` *(Node)*: The parent element to prepend children to
2. `...nodes` *(Array<Node | Array<Node> | null>)*: One or more nodes to prepend

### Returns

*(Node)*: Returns the parent element