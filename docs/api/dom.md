# DOM Utilities

## toElement

Create a DOM element from an HTML string.

```ts
import { toElement } from 'zedom-creator'

const el = toElement('<div class="box">Hello World</div>')
const btn = toElement('<button type="submit">Submit</button>', childElements)
```

## getStyle

Get an inline style value. Supports both camelCase and kebab-case.

```ts
import { getStyle } from 'zedom-creator'

element.style.color = 'red'
getStyle(element, 'color') // 'red'
getStyle(element, 'background-color') // 'green'
```

## setStyle

Set inline style(s) on an element. Accepts a style name and value, or an object of styles.

```ts
import { setStyle } from 'zedom-creator'

setStyle(element, 'color', 'red')
setStyle(element, {
  color: 'blue',
  fontSize: '16px',
  'background-color': 'white'
})
```

## getIndex

Get the index of an element among its siblings.

```ts
import { getIndex } from 'zedom-creator'

getIndex(element) // 0, 1, 2, ... or -1 if no parent
```

## getSiblings

Get all sibling elements (excluding the element itself).

```ts
import { getSiblings } from 'zedom-creator'

const siblings = getSiblings(element)
// Array of sibling elements
```

## getParentNode

Find an ancestor element matching a selector or element reference.

```ts
import { getParentNode } from 'zedom-creator'

const parent = getParentNode(element, '.container')
const ancestor = getParentNode(element, targetElement)
```

## getScrollParent

Find the nearest scrollable ancestor.

```ts
import { getScrollParent } from 'zedom-creator'

const scrollParent = getScrollParent(element)
```

## getScrollbarWidth

Get the browser scrollbar width (cached after first call).

```ts
import { getScrollbarWidth } from 'zedom-creator'

const width = getScrollbarWidth()
console.log(width) // e.g. 17 (px)
```

## $all

`querySelectorAll` wrapper that returns an array.

```ts
import { $all } from 'zedom-creator'

const elements = $all('.item', container)
elements.forEach(el => { /* ... */ })
```
