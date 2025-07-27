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

  it('应该能添加单个子元素', () => {
    append(parent, child1)

    expect(parent.children.length).toBe(1)
    expect(parent.firstElementChild).toBe(child1)
    expect(child1.parentNode).toBe(parent)
  })

  it('应该能添加多个子元素', () => {
    append(parent, child1, child2, child3)

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('应该能添加数组形式的子元素', () => {
    append(parent, [child1, child2])

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('应该能混合添加单个元素和数组', () => {
    append(parent, child1, [child2, child3])

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('应该保持子元素的顺序', () => {
    append(parent, child3, child1, child2)

    expect(parent.children[0]).toBe(child3)
    expect(parent.children[1]).toBe(child1)
    expect(parent.children[2]).toBe(child2)
  })

  it('应该能添加到已有子元素的父元素', () => {
    parent.appendChild(child1)
    append(parent, child2)

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('应该忽略 null 和 undefined 元素', () => {
    append(parent, child1, null, child2, undefined)

    expect(parent.children.length).toBe(2)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
  })

  it('应该返回父元素', () => {
    const result = append(parent, child1)
    expect(result).toBe(parent)
  })

  it('应该能添加文本节点', () => {
    const textNode = document.createTextNode('Hello World')

    append(parent, textNode)

    expect(parent.childNodes.length).toBe(1)
    expect(parent.firstChild).toBe(textNode)
    expect(parent.textContent).toBe('Hello World')
  })

  it('应该能添加文档片段', () => {
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

  it('应该能处理嵌套数组', () => {
    append(parent, [child1, child2, child3])

    expect(parent.children.length).toBe(3)
    expect(parent.children[0]).toBe(child1)
    expect(parent.children[1]).toBe(child2)
    expect(parent.children[2]).toBe(child3)
  })

  it('应该能移动已存在于 DOM 中的元素', () => {
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
