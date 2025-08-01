import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import addBefore from '../src/addBefore'

describe('addBefore', () => {
  let container: HTMLElement
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let newElement: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'

    element1 = document.createElement('div')
    element1.id = 'element1'
    element1.textContent = 'Element 1'

    element2 = document.createElement('div')
    element2.id = 'element2'
    element2.textContent = 'Element 2'

    element3 = document.createElement('div')
    element3.id = 'element3'
    element3.textContent = 'Element 3'

    newElement = document.createElement('span')
    newElement.id = 'newElement'
    newElement.textContent = 'New Element'

    container.appendChild(element1)
    container.appendChild(element2)
    container.appendChild(element3)

    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('should insert new element before target element', () => {
    addBefore(element2, newElement)

    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(newElement)
    expect(container.children[2]).toBe(element2)
    expect(container.children[3]).toBe(element3)
  })

  it('should insert before first element', () => {
    addBefore(element1, newElement)

    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(newElement)
    expect(container.children[1]).toBe(element1)
    expect(container.children[2]).toBe(element2)
    expect(container.children[3]).toBe(element3)
  })

  it('should insert before last element', () => {
    addBefore(element3, newElement)

    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(element2)
    expect(container.children[2]).toBe(newElement)
    expect(container.children[3]).toBe(element3)
  })

  it('should insert text node', () => {
    const textNode = document.createTextNode('Text Node')
    addBefore(element2, textNode)

    expect(container.childNodes.length).toBe(4)
    expect(container.childNodes[0]).toBe(element1)
    expect(container.childNodes[1]).toBe(textNode)
    expect(container.childNodes[2]).toBe(element2)
    expect(container.childNodes[3]).toBe(element3)
  })

  it('should move existing element', () => {
    const existingElement = element3 // move element3 before element1
    addBefore(element1, existingElement)

    expect(container.children.length).toBe(3) // total count unchanged
    expect(container.children[0]).toBe(existingElement) // element3 is now at the front
    expect(container.children[1]).toBe(element1)
    expect(container.children[2]).toBe(element2)
  })

  it('should handle null element', () => {
    expect(() => addBefore(null as any, newElement)).not.toThrow()
    // new element should not be inserted anywhere
    expect(newElement.parentNode).toBeNull()
  })

  it('should handle element without parent node', () => {
    const orphanElement = document.createElement('div')
    expect(() => addBefore(orphanElement, newElement)).not.toThrow()
    expect(newElement.parentNode).toBeNull()
  })

  it('should return the inserted element', () => {
    const result = addBefore(element2, newElement)
    expect(result).toBe(newElement)
  })

  it('should handle single child element case', () => {
    const singleContainer = document.createElement('div')
    const singleChild = document.createElement('span')
    singleContainer.appendChild(singleChild)

    addBefore(singleChild, newElement)

    expect(singleContainer.children.length).toBe(2)
    expect(singleContainer.children[0]).toBe(newElement)
    expect(singleContainer.children[1]).toBe(singleChild)
  })

  it('should insert multiple elements consecutively', () => {
    const newElement2 = document.createElement('span')
    newElement2.textContent = 'New Element 2'

    addBefore(element2, newElement)
    addBefore(element2, newElement2)

    expect(container.children.length).toBe(5)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(newElement)
    expect(container.children[2]).toBe(newElement2)
    expect(container.children[3]).toBe(element2)
    expect(container.children[4]).toBe(element3)
  })

  it('should insert document fragment', () => {
    const fragment = document.createDocumentFragment()
    const fragmentChild1 = document.createElement('span')
    const fragmentChild2 = document.createElement('em')
    fragmentChild1.textContent = 'Fragment Child 1'
    fragmentChild2.textContent = 'Fragment Child 2'
    fragment.appendChild(fragmentChild1)
    fragment.appendChild(fragmentChild2)

    addBefore(element2, fragment)

    expect(container.children.length).toBe(5)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(fragmentChild1)
    expect(container.children[2]).toBe(fragmentChild2)
    expect(container.children[3]).toBe(element2)
    expect(container.children[4]).toBe(element3)
  })
})
