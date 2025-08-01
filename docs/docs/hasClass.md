## `hasClass(el, className)`

Check if an element has a specific CSS class.

### Usage

```ts
import { hasClass } from 'zedom'

const element = document.getElementById('target')

if (hasClass(element, 'active')) {
  console.log('Element has active class')
}

// Check for multiple classes
const classes = ['active', 'highlight', 'selected']
const hasAnyClass = classes.some(cls => hasClass(element, cls))
```

### Arguments

1. `el` *(HTMLElement)*: The target element
2. `className` *(string)*: The CSS class name to check for

### Returns

*(boolean)*: Returns `true` if the element has the specified class, `false` otherwise