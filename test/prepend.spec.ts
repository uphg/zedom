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

  it('应该能在空容器中添加单个子元素', () => {
    prepend(parent, child1)
    
    expect(parent.children.length).toBe(1)
    expect(parent.firstElementChild).toBe(child1)
    expect(child1.parentNode).toBe(parent)
  })

  it('应该能在已有子元素前添加新元素', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1)
    
    expect(parent.children.length).toBe(2)
    expect(parent.firstElementChild).toBe(child1)
    expect(parent.children[1]).toBe(existingChild)
  })

  it('应该能添加多个子元素到开头', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, child2, child3)
    
    expect(parent.children.length).toBe(4)
    // prepend 是逐个插入到开头，所以最后一个参数出现在最前面
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('应该能添加数组形式的子元素', () => {
    parent.appendChild(existingChild)
    prepend(parent, [child1, child2])
    
    expect(parent.children.length).toBe(3)
    // 数组中的元素按顺序插入，最后插入的在最前面
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })

  it('应该能混合添加单个元素和数组', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, [child2, child3])
    
    expect(parent.children.length).toBe(4)
    // 先 child1，然后 [child2, child3]，最后插入的在最前面
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('应该保持添加元素的顺序', () => {
    prepend(parent, child3, child1, child2)
    
    // 最后的参数在最前面
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(child3)
  })

  it('应该忽略 null 和 undefined 元素', () => {
    parent.appendChild(existingChild)
    prepend(parent, child1, null, child2, undefined)
    
    expect(parent.children.length).toBe(3)
    // 最后有效的参数在最前面
    expect(parent.children[0]).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })

  it('应该返回父元素', () => {
    const result = prepend(parent, child1)
    expect(result).toBe(parent)
  })

  it('应该能添加文本节点', () => {
    const textNode = document.createTextNode('Hello World')
    const existingTextNode = document.createTextNode('Existing Text')
    parent.appendChild(existingTextNode)
    
    prepend(parent, textNode)
    
    expect(parent.childNodes.length).toBe(2)
    expect(parent.firstChild).toBe(textNode)
    expect(parent.childNodes[1]).toBe(existingTextNode)
  })

  it('应该能添加文档片段', () => {
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

  it('应该能处理数组', () => {
    parent.appendChild(existingChild)
    prepend(parent, [child1, child2, child3])
    
    expect(parent.children.length).toBe(4)
    // 数组内的元素按顺序插入，最后插入的在最前面
    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child1)
    expect(parent.children[3]).toBe(existingChild)
  })

  it('应该能移动已存在于 DOM 中的元素', () => {
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

  it('应该能在多次调用时保持正确的顺序', () => {
    parent.appendChild(existingChild)
    
    prepend(parent, child1)
    expect(parent.firstElementChild).toBe(child1)
    
    prepend(parent, child2)
    expect(parent.firstElementChild).toBe(child2)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(existingChild)
  })
})