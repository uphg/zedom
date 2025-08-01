import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import getIndex from '../src/getIndex'

describe('getIndex', () => {
  let container: HTMLElement
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let element4: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'

    element1 = document.createElement('div')
    element1.id = 'element1'
    element1.textContent = 'Element 1'

    element2 = document.createElement('span')
    element2.id = 'element2'
    element2.textContent = 'Element 2'

    element3 = document.createElement('p')
    element3.id = 'element3'
    element3.textContent = 'Element 3'

    element4 = document.createElement('em')
    element4.id = 'element4'
    element4.textContent = 'Element 4'

    container.appendChild(element1)
    container.appendChild(element2)
    container.appendChild(element3)
    container.appendChild(element4)

    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('should return index of first element', () => {
    const index = getIndex(element1)
    expect(index).toBe(0)
  })

  it('should return index of second element', () => {
    const index = getIndex(element2)
    expect(index).toBe(1)
  })

  it('should return index of third element', () => {
    const index = getIndex(element3)
    expect(index).toBe(2)
  })

  it('should return index of last element', () => {
    const index = getIndex(element4)
    expect(index).toBe(3)
  })

  it('should handle null element', () => {
    const index = getIndex(null)
    expect(index).toBe(-1)
  })

  it('should handle undefined element', () => {
    const index = getIndex(undefined as any)
    expect(index).toBe(-1)
  })

  it('should handle element without parent node', () => {
    const orphanElement = document.createElement('div')
    const index = getIndex(orphanElement)
    expect(index).toBe(-1)
  })

  it('should handle case where parent node has no child elements', () => {
    const emptyContainer = document.createElement('div')
    const index = getIndex(emptyContainer)
    expect(index).toBe(-1)
  })

  it('should handle single child element case', () => {
    const singleContainer = document.createElement('div')
    const singleChild = document.createElement('span')
    singleContainer.appendChild(singleChild)

    const index = getIndex(singleChild)
    expect(index).toBe(0)
  })

  it('should return correct index after dynamically adding elements', () => {
    const newElement = document.createElement('strong')

    // insert new element after element2
    container.insertBefore(newElement, element3)

    expect(getIndex(element1)).toBe(0)
    expect(getIndex(element2)).toBe(1)
    expect(getIndex(newElement)).toBe(2)
    expect(getIndex(element3)).toBe(3)
    expect(getIndex(element4)).toBe(4)
  })

  it('should return correct index after removing elements', () => {
    // remove second element
    container.removeChild(element2)

    expect(getIndex(element1)).toBe(0)
    expect(getIndex(element3)).toBe(1)
    expect(getIndex(element4)).toBe(2)

    // removed element should return -1
    expect(getIndex(element2)).toBe(-1)
  })

  it('should return correct index after reordering elements', () => {
    // move first element to last
    container.appendChild(element1)

    expect(getIndex(element2)).toBe(0)
    expect(getIndex(element3)).toBe(1)
    expect(getIndex(element4)).toBe(2)
    expect(getIndex(element1)).toBe(3)
  })

  it('should handle elements at different levels', () => {
    const nestedContainer = document.createElement('div')
    const nestedElement = document.createElement('span')
    nestedContainer.appendChild(nestedElement)
    container.appendChild(nestedContainer)

    // nested element's index in its parent container
    expect(getIndex(nestedElement)).toBe(0)

    // nested container's index in main container
    expect(getIndex(nestedContainer)).toBe(4)
  })

  it('should handle mixed text nodes and elements', () => {
    const mixedContainer = document.createElement('div')
    const childElement1 = document.createElement('span')
    const childElement2 = document.createElement('div')

    mixedContainer.appendChild(childElement1)
    mixedContainer.appendChild(document.createTextNode('Text Node'))
    mixedContainer.appendChild(childElement2)

    // only count element nodes, not text nodes
    expect(getIndex(childElement1)).toBe(0)
    expect(getIndex(childElement2)).toBe(1)
  })

  it('should maintain index consistency', () => {
    // multiple calls should return same result
    const index1 = getIndex(element2)
    const index2 = getIndex(element2)
    const index3 = getIndex(element2)

    expect(index1).toBe(index2)
    expect(index2).toBe(index3)
    expect(index1).toBe(1)
  })

  it('should correctly handle consecutive indices', () => {
    const indices = [element1, element2, element3, element4].map(getIndex)

    expect(indices).toEqual([0, 1, 2, 3])
    expect(indices).toHaveLength(4)

    // check if indices are consecutive
    for (let i = 0; i < indices.length; i++) {
      expect(indices[i]).toBe(i)
    }
  })
})
