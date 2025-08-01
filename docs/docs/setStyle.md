## `setStyle(el, styles, value)`

Set CSS styles on an element. Supports both single property and multiple properties.

### Usage

```ts
import { setStyle } from 'zedom'

const element = document.getElementById('target')

// Set single style property
setStyle(element, 'color', 'red')
setStyle(element, 'font-size', '16px')

// Set multiple styles with object
setStyle(element, {
  color: 'blue',
  fontSize: '18px',
  backgroundColor: 'yellow'
})

// Supports kebab-case property names (automatically converted)
setStyle(element, 'background-color', 'green')
```

### Arguments

1. `el` *(HTMLElement)*: The target element
2. `styles` *(Record<string, string> | string)*: Either a styles object or a single property name
3. `value` *(string)*: The property value (only used when styles is a string)

### Returns

*(void)*: This function does not return a value