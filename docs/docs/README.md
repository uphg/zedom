# Zedom API Documentation

A lightweight DOM manipulation library with TypeScript support.

## DOM Manipulation

### Element Creation and Modification
- [`toElement(innerHTML, children)`](./toElement.md) - Create DOM element from HTML string
- [`append(parent, ...nodes)`](./append.md) - Append child nodes to parent element
- [`prepend(parent, ...nodes)`](./prepend.md) - Prepend child nodes to parent element
- [`addAfter(el, newNode)`](./addAfter.md) - Insert node after specified element
- [`addBefore(el, newNode)`](./addBefore.md) - Insert node before specified element
- [`removeChildren(el)`](./removeChildren.md) - Remove all child nodes from element

### CSS Class Management
- [`addClass(el, ...classNames)`](./addClass.md) - Add CSS classes to element
- [`removeClass(el, ...classNames)`](./removeClass.md) - Remove CSS classes from element
- [`hasClass(el, className)`](./hasClass.md) - Check if element has specific class

### Style Management
- [`getStyle(el, styleName)`](./getStyle.md) - Get inline style value
- [`setStyle(el, styles, value)`](./setStyle.md) - Set CSS styles on element

### Element Traversal
- [`getSiblings(el)`](./getSiblings.md) - Get all sibling elements
- [`getIndex(el)`](./getIndex.md) - Get element index among siblings
- [`getScrollParent(node)`](./getScrollParent.md) - Find nearest scrollable parent

## Event Handling
- [`on(el, eventName, selector, handler, options)`](./events.md) - Add event listener with delegation support
- [`off(el, eventName, handler, options)`](./events.md) - Remove event listener

## Utilities
- [`getScrollbarWidth()`](./getScrollbarWidth.md) - Get browser scrollbar width
- [`isServer` / `isClient`](./env.md) - Environment detection utilities

## Installation

```bash
npm install zedom
# or
pnpm add zedom
# or
yarn add zedom
```

## Basic Usage

```ts
import { addClass, removeClass, hasClass, on, toElement } from 'zedom'

// Create element
const button = toElement('<button class="btn">Click me</button>')

// Add classes
addClass(button, 'primary', 'large')

// Check class
if (hasClass(button, 'primary')) {
  console.log('Button has primary class')
}

// Add event listener
on(button, 'click', () => {
  removeClass(button, 'primary')
  addClass(button, 'secondary')
})
```