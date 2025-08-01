## `toElement(innerHTML, children)`

Create a DOM element from an HTML string with optional child elements.

### Usage

```ts
import { toElement } from 'zedom'

// Create simple element
const div = toElement('<div>Hello World</div>')

// Create element with attributes
const button = toElement('<button class="btn" id="submit">Submit</button>')

// Create element with children
const child1 = document.createElement('span')
const child2 = document.createElement('em')
const container = toElement('<div class="container"></div>', [child1, child2])

// Create complex nested structure
const card = toElement(`
  <div class="card">
    <h2>Title</h2>
    <p>Content</p>
  </div>
`)
```

### Arguments

1. `innerHTML` *(string)*: The HTML string to create the element from
2. `children` *(ArrayLike<Element>)*: Optional array-like collection of child elements to append

### Returns

*(Element)*: Returns the created DOM element