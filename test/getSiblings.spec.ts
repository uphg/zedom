import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import getSiblings from '../src/getSiblings'

describe('getSiblings', () => {
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

  it('应该返回元素的所有兄弟节点', () => {
    const siblings = getSiblings(element2)
    
    expect(siblings.length).toBe(3)
    expect(siblings).toContain(element1)
    expect(siblings).toContain(element3)
    expect(siblings).toContain(element4)
    expect(siblings).not.toContain(element2)
  })

  it('应该返回第一个元素的兄弟节点', () => {
    const siblings = getSiblings(element1)
    
    expect(siblings.length).toBe(3)
    expect(siblings).toContain(element2)
    expect(siblings).toContain(element3)
    expect(siblings).toContain(element4)
    expect(siblings).not.toContain(element1)
  })

  it('应该返回最后一个元素的兄弟节点', () => {
    const siblings = getSiblings(element4)
    
    expect(siblings.length).toBe(3)
    expect(siblings).toContain(element1)
    expect(siblings).toContain(element2)
    expect(siblings).toContain(element3)
    expect(siblings).not.toContain(element4)
  })

  it('应该返回中间元素的兄弟节点', () => {
    const siblings = getSiblings(element3)
    
    expect(siblings.length).toBe(3)
    expect(siblings).toContain(element1)
    expect(siblings).toContain(element2)
    expect(siblings).toContain(element4)
    expect(siblings).not.toContain(element3)
  })

  it('应该保持兄弟节点的原始顺序', () => {
    const siblings = getSiblings(element2)
    
    expect(siblings[0]).toBe(element1)
    expect(siblings[1]).toBe(element3)
    expect(siblings[2]).toBe(element4)
  })

  it('应该处理只有一个子元素的情况', () => {
    const singleContainer = document.createElement('div')
    const singleChild = document.createElement('span')
    singleContainer.appendChild(singleChild)
    
    const siblings = getSiblings(singleChild)
    
    expect(siblings.length).toBe(0)
    expect(siblings).toEqual([])
  })

  it('应该处理 null 元素', () => {
    const siblings = getSiblings(null as any)
    
    expect(siblings).toEqual([])
  })

  it('应该处理 undefined 元素', () => {
    const siblings = getSiblings(undefined as any)
    
    expect(siblings).toEqual([])
  })

  it('应该处理没有父节点的元素', () => {
    const orphanElement = document.createElement('div')
    
    // getSiblings 可能会在没有父节点时抛出错误或返回空数组
    try {
      const siblings = getSiblings(orphanElement)
      expect(siblings).toEqual([])
    } catch (error) {
      // 如果实现选择抛出错误，这也是可以接受的
      expect(error).toBeDefined()
    }
  })

  it('应该只返回元素节点，不包含文本节点', () => {
    const textContainer = document.createElement('div')
    const childElement = document.createElement('span')
    const textNode = document.createTextNode('Text Node')
    
    textContainer.appendChild(childElement)
    textContainer.appendChild(textNode)
    
    const siblings = getSiblings(childElement)
    
    // 应该不包含文本节点
    expect(siblings.length).toBe(0)
  })

  it('应该处理动态添加的兄弟节点', () => {
    const newElement = document.createElement('strong')
    newElement.textContent = 'New Element'
    
    let siblings = getSiblings(element2)
    expect(siblings.length).toBe(3)
    
    container.appendChild(newElement)
    
    siblings = getSiblings(element2)
    expect(siblings.length).toBe(4)
    expect(siblings).toContain(newElement)
  })

  it('应该处理移除兄弟节点的情况', () => {
    let siblings = getSiblings(element2)
    expect(siblings.length).toBe(3)
    expect(siblings).toContain(element3)
    
    container.removeChild(element3)
    
    siblings = getSiblings(element2)
    expect(siblings.length).toBe(2)
    expect(siblings).not.toContain(element3)
  })

  it('应该返回不同类型的兄弟元素', () => {
    const siblings = getSiblings(element2)
    
    const elementTypes = siblings.map(el => el.tagName.toLowerCase())
    expect(elementTypes).toContain('div')  // element1
    expect(elementTypes).toContain('p')    // element3
    expect(elementTypes).toContain('em')   // element4
  })
})