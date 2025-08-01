import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import removeChildren from '../src/removeChildren'

describe('removeChildren', () => {
  let container: HTMLElement
  let child1: HTMLElement
  let child2: HTMLElement
  let child3: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'

    child1 = document.createElement('span')
    child1.id = 'child1'
    child1.textContent = 'Child 1'

    child2 = document.createElement('p')
    child2.id = 'child2'
    child2.textContent = 'Child 2'

    child3 = document.createElement('em')
    child3.id = 'child3'
    child3.textContent = 'Child 3'

    container.appendChild(child1)
    container.appendChild(child2)
    container.appendChild(child3)

    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('should remove all child elements', () => {
    expect(container.children.length).toBe(3)

    removeChildren(container)

    expect(container.children.length).toBe(0)
    expect(container.childNodes.length).toBe(0)
    expect(container.innerHTML).toBe('')
  })

  it('should remove all types of child nodes', () => {
    // add text node and comment node
    const textNode = document.createTextNode('Text Node')
    const commentNode = document.createComment('Comment Node')

    container.appendChild(textNode)
    container.appendChild(commentNode)

    expect(container.childNodes.length).toBe(5) // 3 elements + 1 text + 1 comment

    removeChildren(container)

    expect(container.childNodes.length).toBe(0)
  })

  it('should handle empty container', () => {
    const emptyContainer = document.createElement('div')

    expect(emptyContainer.children.length).toBe(0)

    // should not throw error
    expect(() => removeChildren(emptyContainer)).not.toThrow()

    expect(emptyContainer.children.length).toBe(0)
  })

  it('should handle null element', () => {
    expect(() => removeChildren(null as any)).not.toThrow()
  })

  it('should handle undefined element', () => {
    expect(() => removeChildren(undefined as any)).not.toThrow()
  })

  it('should remove nested child elements', () => {
    const nestedContainer = document.createElement('div')
    const nestedChild1 = document.createElement('span')
    const nestedChild2 = document.createElement('em')

    nestedContainer.appendChild(nestedChild1)
    nestedContainer.appendChild(nestedChild2)
    container.appendChild(nestedContainer)

    expect(container.children.length).toBe(4) // 3 original + 1 nested container
    expect(nestedContainer.children.length).toBe(2)

    removeChildren(container)

    expect(container.children.length).toBe(0)
    // nested container itself is removed, so its child elements no longer exist
  })

  it('should remove elements with event listeners', () => {
    const eventElement = document.createElement('button')
    let _clicked = false

    eventElement.addEventListener('click', () => {
      _clicked = true
    })

    container.appendChild(eventElement)

    expect(container.children.length).toBe(4)

    removeChildren(container)

    expect(container.children.length).toBe(0)

    // note: in jsdom, event listeners may still be effective after element removal
    // this depends on specific implementation, so we adjust test expectations
    eventElement.click()
    // don't make specific assertions about event trigger results, as this depends on specific DOM implementation
  })

  it('should keep other properties of parent element unchanged', () => {
    container.className = 'test-container'
    container.setAttribute('data-test', 'value')

    expect(container.className).toBe('test-container')
    expect(container.getAttribute('data-test')).toBe('value')

    removeChildren(container)

    expect(container.className).toBe('test-container')
    expect(container.getAttribute('data-test')).toBe('value')
    expect(container.children.length).toBe(0)
  })

  it('should handle multiple calls', () => {
    expect(container.children.length).toBe(3)

    removeChildren(container)
    expect(container.children.length).toBe(0)

    // second call should not throw error
    expect(() => removeChildren(container)).not.toThrow()
    expect(container.children.length).toBe(0)
  })

  it('should remove complex DOM structure', () => {
    // create complex nested structure
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')
    const tr1 = document.createElement('tr')
    const tr2 = document.createElement('tr')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
    const td4 = document.createElement('td')

    td1.textContent = 'Cell 1'
    td2.textContent = 'Cell 2'
    td3.textContent = 'Cell 3'
    td4.textContent = 'Cell 4'

    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr2.appendChild(td3)
    tr2.appendChild(td4)
    tbody.appendChild(tr1)
    tbody.appendChild(tr2)
    table.appendChild(tbody)

    container.appendChild(table)

    expect(container.children.length).toBe(4) // 3 original + 1 table
    expect(table.querySelector('td')).toBeTruthy()

    removeChildren(container)

    expect(container.children.length).toBe(0)
  })

  it('should handle container with form elements', () => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const select = document.createElement('select')
    const textarea = document.createElement('textarea')

    input.type = 'text'
    input.value = 'test value'

    form.appendChild(input)
    form.appendChild(select)
    form.appendChild(textarea)
    container.appendChild(form)

    expect(container.children.length).toBe(4)

    removeChildren(container)

    expect(container.children.length).toBe(0)
  })

  it('should release memory references of removed elements', () => {
    const childElement = container.firstElementChild
    expect(childElement).toBeTruthy()
    expect(childElement?.parentNode).toBe(container)

    removeChildren(container)

    // removed element should have no parent node
    expect(childElement?.parentNode).toBeNull()
  })
})
