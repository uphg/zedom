import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import append from '../src/append'

describe('append', () => {
  let parent: HTMLElement
  let child1: HTMLElement
  let child2: HTMLElement
  let child3: HTMLElement

  beforeEach(() => {
    parent = document.createElement('div')
    parent.id = 'parent'

    child1 = document.createElement('span')
    child1.id = 'child1'
    child1.textContent = 'Child 1'

    child2 = document.createElement('p')
    child2.id = 'child2'
    child2.textContent = 'Child 2'

    child3 = document.createElement('em')
    child3.id = 'child3'
    child3.textContent = 'Child 3'

    document.body.appendChild(parent)
  })

  afterEach(() => {
    if (parent.parentNode) {
      parent.parentNode.removeChild(parent)
    }
  })

  it('should add single child element', () => {
    append(parent, child1)

    expect(parent.children.length).toBe(1)
    expect(parent.firstElementChild).toBe(child1)
    expect(child1.parentNode).toBe(parent)
  })

  it('should add multiple child elements', () => {
    append(parent, child1, child2, child3)

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('should add child elements in array format', () => {
    append(parent, [child1, child2])

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('should add mixed single elements and arrays', () => {
    append(parent, child1, [child2, child3])

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('should maintain order of child elements', () => {
    append(parent, child3, child1, child2)

    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(child2)
  })

  it('should add to parent element with existing children', () => {
    parent.appendChild(child1)
    append(parent, child2)

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('should ignore null and undefined elements', () => {
    append(parent, child1, null, child2, undefined)

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('should return parent element', () => {
    const result = append(parent, child1)
    expect(result).toBe(parent)
  })

  it('should add text node', () => {
    const textNode = document.createTextNode('Hello World')

    append(parent, textNode)

    expect(parent.childNodes.length).toBe(1)
    expect(parent.firstChild).toBe(textNode)
    expect(parent.textContent).toBe('Hello World')
  })

  it('should add document fragment', () => {
    const fragment = document.createDocumentFragment()
    fragment.appendChild(child1)
    fragment.appendChild(child2)

    append(parent, fragment)

    // 文档片段被添加后，其子元素会移动到父元素中
    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(fragment.children.length).toBe(0)
  })

  it('should handle nested arrays', () => {
    append(parent, [child1, child2, child3])

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('should move elements already existing in DOM', () => {
    const anotherParent = document.createElement('div')
    document.body.appendChild(anotherParent)
    anotherParent.appendChild(child1)

    expect(child1.parentNode).toBe(anotherParent)

    append(parent, child1)

    expect(child1.parentNode).toBe(parent)
    expect(anotherParent.children.length).toBe(0)
    expect(parent.children.length).toBe(1)

    document.body.removeChild(anotherParent)
  })
})
