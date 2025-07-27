import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import getScrollParent from '../src/getScrollParent'

describe('getScrollParent', () => {
  let container: HTMLElement
  let scrollableParent: HTMLElement
  let child: HTMLElement
  let grandChild: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'
    
    scrollableParent = document.createElement('div')
    scrollableParent.id = 'scrollable-parent'
    scrollableParent.style.overflow = 'auto'
    scrollableParent.style.height = '200px'
    scrollableParent.style.width = '200px'
    
    child = document.createElement('div')
    child.id = 'child'
    child.style.height = '100px'
    
    grandChild = document.createElement('span')
    grandChild.id = 'grand-child'
    grandChild.textContent = 'Grand Child'
    
    container.appendChild(scrollableParent)
    scrollableParent.appendChild(child)
    child.appendChild(grandChild)
    
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('应该返回 null 当节点为 null 时', () => {
    const result = getScrollParent(null as any)
    expect(result).toBeNull()
  })

  it('应该找到设置了 overflow: auto 的父元素', () => {
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该找到设置了 overflow: scroll 的父元素', () => {
    scrollableParent.style.overflow = 'scroll'
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该找到设置了 overflow: overlay 的父元素', () => {
    scrollableParent.style.overflow = 'overlay'
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该找到设置了 overflowX: auto 的父元素', () => {
    scrollableParent.style.overflow = 'visible'
    scrollableParent.style.overflowX = 'auto'
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该找到设置了 overflowY: scroll 的父元素', () => {
    scrollableParent.style.overflow = 'visible'
    scrollableParent.style.overflowY = 'scroll'
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该跳过 overflow: visible 的元素', () => {
    scrollableParent.style.overflow = 'visible'
    
    // 创建一个更上层的可滚动元素
    const upperScrollable = document.createElement('div')
    upperScrollable.style.overflow = 'auto'
    upperScrollable.appendChild(container)
    document.body.appendChild(upperScrollable)
    
    const result = getScrollParent(grandChild)
    expect(result).toBe(upperScrollable)
    
    // 清理
    document.body.removeChild(upperScrollable)
  })

  it('应该跳过 overflow: hidden 的元素', () => {
    scrollableParent.style.overflow = 'hidden'
    
    const result = getScrollParent(grandChild)
    expect(result).not.toBe(scrollableParent)
  })

  it('应该返回 document 当找不到可滚动父元素时', () => {
    scrollableParent.style.overflow = 'visible'
    
    const result = getScrollParent(grandChild)
    expect(result).toBe(document)
  })

  it('应该处理直接的 document 子元素', () => {
    const directChild = document.createElement('div')
    document.body.appendChild(directChild)
    
    const result = getScrollParent(directChild)
    expect(result).toBe(document)
    
    // 清理
    document.body.removeChild(directChild)
  })

  it('应该递归查找可滚动父元素', () => {
    // 创建多层嵌套，只有最外层可滚动
    const level1 = document.createElement('div')
    const level2 = document.createElement('div')
    const level3 = document.createElement('div')
    const deepChild = document.createElement('span')
    
    level1.style.overflow = 'auto'
    level2.style.overflow = 'visible'
    level3.style.overflow = 'visible'
    
    level1.appendChild(level2)
    level2.appendChild(level3)
    level3.appendChild(deepChild)
    container.appendChild(level1)
    
    const result = getScrollParent(deepChild)
    expect(result).toBe(level1)
  })

  it('应该处理文本节点', () => {
    const textNode = document.createTextNode('Text content')
    child.appendChild(textNode)
    
    const result = getScrollParent(textNode)
    expect(result).toBe(scrollableParent)
  })

  it('应该处理注释节点', () => {
    const commentNode = document.createComment('Comment content')
    child.appendChild(commentNode)
    
    const result = getScrollParent(commentNode)
    expect(result).toBe(scrollableParent)
  })

  it('应该正确处理 body 元素', () => {
    const result = getScrollParent(document.body)
    expect(result).toBe(document)
  })

  it('应该处理混合的 overflow 属性', () => {
    scrollableParent.style.overflow = 'visible'
    scrollableParent.style.overflowX = 'hidden'
    scrollableParent.style.overflowY = 'auto'
    
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该找到最近的可滚动父元素', () => {
    // 创建两个可滚动的父元素
    const outerScrollable = document.createElement('div')
    const innerScrollable = document.createElement('div')
    const testChild = document.createElement('span')
    
    outerScrollable.style.overflow = 'scroll'
    innerScrollable.style.overflow = 'auto'
    
    outerScrollable.appendChild(innerScrollable)
    innerScrollable.appendChild(testChild)
    container.appendChild(outerScrollable)
    
    const result = getScrollParent(testChild)
    expect(result).toBe(innerScrollable) // 应该返回最近的
  })

  it('应该处理动态修改的样式', () => {
    // 初始时没有可滚动的父元素
    scrollableParent.style.overflow = 'visible'
    
    let result = getScrollParent(grandChild)
    expect(result).toBe(document)
    
    // 动态添加滚动样式
    scrollableParent.style.overflow = 'auto'
    
    result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
  })

  it('应该处理 CSS 计算样式', () => {
    // 通过 CSS 类设置样式而不是内联样式
    const style = document.createElement('style')
    style.textContent = `
      .scrollable-test {
        overflow: auto;
      }
    `
    document.head.appendChild(style)
    
    scrollableParent.style.overflow = ''
    scrollableParent.className = 'scrollable-test'
    
    const result = getScrollParent(grandChild)
    expect(result).toBe(scrollableParent)
    
    // 清理
    document.head.removeChild(style)
  })
})