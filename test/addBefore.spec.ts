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

  it('应该能在元素前面插入新元素', () => {
    addBefore(element2, newElement)
    
    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(newElement)
    expect(container.children[2]).toBe(element2)
    expect(container.children[3]).toBe(element3)
  })

  it('应该能在第一个元素前插入', () => {
    addBefore(element1, newElement)
    
    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(newElement)
    expect(container.children[1]).toBe(element1)
    expect(container.children[2]).toBe(element2)
    expect(container.children[3]).toBe(element3)
  })

  it('应该能在最后一个元素前插入', () => {
    addBefore(element3, newElement)
    
    expect(container.children.length).toBe(4)
    expect(container.children[0]).toBe(element1)
    expect(container.children[1]).toBe(element2)
    expect(container.children[2]).toBe(newElement)
    expect(container.children[3]).toBe(element3)
  })

  it('应该能插入文本节点', () => {
    const textNode = document.createTextNode('Text Node')
    addBefore(element2, textNode)
    
    expect(container.childNodes.length).toBe(4)
    expect(container.childNodes[0]).toBe(element1)
    expect(container.childNodes[1]).toBe(textNode)
    expect(container.childNodes[2]).toBe(element2)
    expect(container.childNodes[3]).toBe(element3)
  })

  it('应该移动已存在的元素', () => {
    const existingElement = element3 // 移动 element3 到 element1 前面
    addBefore(element1, existingElement)
    
    expect(container.children.length).toBe(3) // 总数不变
    expect(container.children[0]).toBe(existingElement) // element3 现在在最前面
    expect(container.children[1]).toBe(element1)
    expect(container.children[2]).toBe(element2)
  })

  it('应该处理 null 元素', () => {
    expect(() => addBefore(null as any, newElement)).not.toThrow()
    // 新元素不应该被插入到任何地方
    expect(newElement.parentNode).toBeNull()
  })

  it('应该处理没有父节点的元素', () => {
    const orphanElement = document.createElement('div')
    expect(() => addBefore(orphanElement, newElement)).not.toThrow()
    expect(newElement.parentNode).toBeNull()
  })

  it('应该返回插入的结果', () => {
    const result = addBefore(element2, newElement)
    expect(result).toBe(newElement)
  })

  it('应该能处理单个子元素的情况', () => {
    const singleContainer = document.createElement('div')
    const singleChild = document.createElement('span')
    singleContainer.appendChild(singleChild)
    
    addBefore(singleChild, newElement)
    
    expect(singleContainer.children.length).toBe(2)
    expect(singleContainer.children[0]).toBe(newElement)
    expect(singleContainer.children[1]).toBe(singleChild)
  })

  it('应该能连续插入多个元素', () => {
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

  it('应该能插入文档片段', () => {
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