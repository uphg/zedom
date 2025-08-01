## `append(parent, ...nodes)`

Append one or more child nodes to a parent element.

### Usage

```ts
import { append } from 'zedom'

const parent = document.getElementById('container')
const child1 = document.createElement('div')
const child2 = document.createElement('span')

// Append single child
append(parent, child1)

// Append multiple children
append(parent, child1, child2)

// Append from array
append(parent, [child1, child2])

// Mix single elements and arrays
append(parent, child1, [child2])
```

### Arguments

1. `parent` *(Element)*: The parent element to append children to
2. `...nodes` *(Array<Node | Element | Array<Node | Element> | null | undefined>)*: One or more nodes to append

### Returns

*(Element)*: Returns the parent element