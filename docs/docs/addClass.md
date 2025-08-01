## `addClass(el, ...classNames)`

Add one or more CSS classes to an element.

### Usage

```ts
import { addClass } from 'zedom'

const element = document.getElementById('target')

// Add single class
addClass(element, 'active')

// Add multiple classes
addClass(element, 'active', 'highlight', 'selected')

// Add classes from array
addClass(element, ['class1', 'class2'])

// Mix strings and arrays
addClass(element, 'active', ['highlight', 'selected'])
```

### Arguments

1. `el` *(Element)*: The target element
2. `...classNames` *(string | string[])*: One or more class names to add

### Returns

*(void)*: This function does not return a value