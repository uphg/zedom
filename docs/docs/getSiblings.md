## `getSiblings(el)`

Get all sibling elements of the specified element.

### Usage

```ts
import { getSiblings } from 'zedom'

const element = document.getElementById('target')
const siblings = getSiblings(element)

console.log(`Element has ${siblings.length} siblings`)
siblings.forEach((sibling, index) => {
  console.log(`Sibling ${index}:`, sibling)
})
```

### Arguments

1. `el` *(Element)*: The target element

### Returns

*(Element[])*: Returns an array of sibling elements. Returns an empty array if the element has no siblings or no parent