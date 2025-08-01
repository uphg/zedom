import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import prepend from '../src/prepend'

describe('prepend', () => {
  let parent: HTMLElement
  let child1: HTMLElement
  let child2: HTMLElement
  let child3: HTMLElement
  let existingChild: HTMLElement

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

    existingChild = document.createElement('strong')
    existingChild.id = 'existing'
    existingChild.textContent = 'Existing'

    document.body.appendChild(parent)
  })

  afterEach(() => {
    if (parent.parentNode) {
      parent.parentNode.removeChild(parent)
    }
  })

  it('should add single child element to empty container', () => {
    prepend(parent, child1)

    expect(parent.children.length).toBe(1)
    expect(parent.firstElementChild).toBe(child1)
    expect(child1.parentNode).toBe(parent)
  })

  it('should add new element before existing child elements', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1)

    expect(parent.children.length).toBe(2)
    expect(parent.firstElementChild).toBe(child1)
    expect(parent.children[1]).toBe(existingChild)
  })

  it('should add multiple child elements to beginning', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, child2, child3)

    expect(parent.children.length).toBe(4)
    // prepend inserts one by one to the beginning, so the last parameter appears at the front
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('should add child elements in array format', () => {
    parent.appendChild(existingChild)
    prepend(parent, [child1, child2])

    expect(parent.children.length).toBe(3)
    // elements in array are inserted in order, last inserted appears at the front
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })

  it('should add mixed single elements and arrays', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, [child2, child3])

    expect(parent.children.length).toBe(4)
    // first child1, then [child2, child3], last inserted appears at the front
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('should maintain order of added elements', () => {
    prepend(parent, child3, child1, child2)

    // 最后的参数在最前面
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(child3)
  })

  it('should ignore null and undefined elements', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, null, child2, undefined)

    expect(parent.children.length).toBe(3)
    // 最后有效的参数在最前面
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })

  it('should return parent element', () => {
    const result = prepend(parent, child1)
    expect(result).toBe(parent)
  })

  it('should add text node', () => {
    const textNode = document.createTextNode('Hello World')
    const existingTextNode = document.createTextNode('Existing Text')
    parent.appendChild(existingTextNode)

    prepend(parent, textNode)

    expect(parent.childNodes.length).toBe(2)
    expect(parent.firstChild).toBe(textNode)
    expect(parent.childNodes[1]).toBe(existingTextNode)
  })

  it('should add document fragment', () => {
    const fragment = document.createDocumentFragment()
    fragment.appendChild(child1)
    fragment.appendChild(child2)

    parent.appendChild(existingChild)
    prepend(parent, fragment)

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(existingChild)
    expect(fragment.children.length).toBe(0)
  })

  it('should handle arrays', () => {
    parent.appendChild(existingChild)
    prepend(parent, [child1, child2, child3])

    expect(parent.children.length).toBe(4)
    // 数组内的元素按顺序插入，最后插入的在最前面
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('should move elements already existing in DOM', () => {
    const anotherParent = document.createElement('div')
    document.body.appendChild(anotherParent)
    anotherParent.appendChild(child1)

    parent.appendChild(existingChild)

    expect(child1.parentNode).toBe(anotherParent)

    prepend(parent, child1)

    expect(child1.parentNode).toBe(parent)
    expect(anotherParent.children.length).toBe(0)
    expect(parent.children.length).toBe(2)
    expect(parent.firstElementChild).toBe(child1)
    expect(parent.children[1]).toBe(existingChild)

    document.body.removeChild(anotherParent)
  })

  it('should maintain correct order with multiple calls', () => {
    parent.appendChild(existingChild)

    prepend(parent, child1)
    expect(parent.firstElementChild).toBe(child1)

    prepend(parent, child2)
    expect(parent.firstElementChild).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })
})
