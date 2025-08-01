## `removeClass(el, ...classNames)`

Remove one or more CSS classes from an element.

### Usage

```ts
import { removeClass } from 'zedom'

const element = document.getElementById('target')

// Remove single class
removeClass(element, 'active')

// Remove multiple classes
removeClass(element, 'active', 'highlight', 'selected')

// Remove classes with space-separated string
removeClass(element, 'active highlight')
```

### Arguments

1. `el` *(Element)*: The target element
2. `...classNames` *(string[])*: One or more class names to remove

### Returns

*(void)*: This function does not return a value