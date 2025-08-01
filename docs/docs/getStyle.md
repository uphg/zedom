## `getStyle(el, styleName)`

Get the inline style value of an element for a specific CSS property.

### Usage

```ts
import { getStyle } from 'zedom'

const element = document.getElementById('target')

// Get style with camelCase property name
const color = getStyle(element, 'color')
const backgroundColor = getStyle(element, 'backgroundColor')

// Get style with kebab-case property name (automatically converted)
const fontSize = getStyle(element, 'font-size')

console.log('Color:', color)
console.log('Background:', backgroundColor)
console.log('Font size:', fontSize)
```

### Arguments

1. `el` *(HTMLElement)*: The target element
2. `styleName` *(string)*: The CSS property name (supports both camelCase and kebab-case)

### Returns

*(string | null)*: Returns the style value as a string, or null if the element or style name is invalid