## `getScrollbarWidth()`

Get the width of the browser's scrollbar. The result is cached and automatically updated on window resize.

### Usage

```ts
import { getScrollbarWidth } from 'zedom'

const scrollbarWidth = getScrollbarWidth()
console.log(`Scrollbar width: ${scrollbarWidth}px`)
// => Scrollbar width: 17px

// Use for layout calculations
const contentWidth = containerWidth - scrollbarWidth
```

### Arguments

None

### Returns

*(number)*: Returns the scrollbar width in pixels. Returns 0 if running on server or if scrollbars are not present