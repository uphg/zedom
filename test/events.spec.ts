import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { on, off } from '../src/events'

describe('events', () => {
  let container: HTMLElement
  let button: HTMLElement
  let child: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'
    
    button = document.createElement('button')
    button.id = 'test-button'
    button.className = 'btn'
    button.textContent = 'Click me'
    
    child = document.createElement('span')
    child.id = 'child'
    child.className = 'child-element'
    child.textContent = 'Child'
    
    button.appendChild(child)
    container.appendChild(button)
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    vi.clearAllMocks()
  })

  describe('on', () => {
    it('应该能添加简单的事件监听器', () => {
      const handler = vi.fn()
      
      on(button, 'click', handler)
      
      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('应该能处理事件委托', () => {
      const handler = vi.fn()
      
      // 在容器上监听按钮的点击事件
      on(container, 'click', '.btn', handler)
      
      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(Event))
    })

    it('应该能处理深层级的事件委托', () => {
      const handler = vi.fn()
      
      // 在容器上监听子元素的点击事件
      on(container, 'click', '.child-element', handler)
      
      child.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('应该能通过 ID 选择器处理事件委托', () => {
      const handler = vi.fn()
      
      on(container, 'click', '#test-button', handler)
      
      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('应该能处理不匹配选择器的情况', () => {
      const handler = vi.fn()
      
      on(container, 'click', '.non-existent', handler)
      
      button.click()
      expect(handler).not.toHaveBeenCalled()
    })

    it('应该返回元素本身', () => {
      const handler = vi.fn()
      
      const result = on(button, 'click', handler)
      expect(result).toBe(button)
    })

    it('应该处理 null 元素', () => {
      const handler = vi.fn()
      
      expect(() => on(null, 'click', handler)).not.toThrow()
    })

    it('应该处理空事件名', () => {
      const handler = vi.fn()
      
      expect(() => on(button, '', handler)).not.toThrow()
    })

    it('应该处理空选择器', () => {
      const handler = vi.fn()
      
      expect(() => on(button, 'click', '')).not.toThrow()
    })

    it('应该能传递事件选项', () => {
      const handler = vi.fn()
      
      on(button, 'click', handler, { once: true })
      
      button.click()
      button.click()
      
      // 应该只触发一次
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('应该能处理多种事件类型', () => {
      const clickHandler = vi.fn()
      const mouseoverHandler = vi.fn()
      
      on(button, 'click', clickHandler)
      on(button, 'mouseover', mouseoverHandler)
      
      button.click()
      button.dispatchEvent(new MouseEvent('mouseover'))
      
      expect(clickHandler).toHaveBeenCalledTimes(1)
      expect(mouseoverHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('off', () => {
    it('应该能移除事件监听器', () => {
      const handler = vi.fn()
      
      on(button, 'click', handler)
      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
      
      off(button, 'click', handler)
      button.click()
      expect(handler).toHaveBeenCalledTimes(1) // 不应该再增加
    })

    it('应该能移除委托事件监听器', () => {
      const handler = vi.fn()
      
      on(container, 'click', '.btn', handler)
      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
      
      off(container, 'click', handler)
      button.click()
      expect(handler).toHaveBeenCalledTimes(1) // 不应该再增加
    })

    it('应该返回元素本身', () => {
      const handler = vi.fn()
      on(button, 'click', handler)
      
      const result = off(button, 'click', handler)
      expect(result).toBe(button)
    })

    it('应该处理 null 元素', () => {
      const handler = vi.fn()
      
      expect(() => off(null, 'click', handler)).not.toThrow()
    })

    it('应该处理空事件名', () => {
      const handler = vi.fn()
      
      expect(() => off(button, '', handler)).not.toThrow()
    })

    it('应该处理 null 处理器', () => {
      expect(() => off(button, 'click', null as any)).not.toThrow()
    })

    it('应该能传递事件选项', () => {
      const handler = vi.fn()
      
      on(button, 'click', handler, { capture: true })
      off(button, 'click', handler, { capture: true })
      
      button.click()
      expect(handler).not.toHaveBeenCalled()
    })

    it('应该只移除指定的处理器', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      on(button, 'click', handler1)
      on(button, 'click', handler2)
      
      off(button, 'click', handler1)
      
      button.click()
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledTimes(1)
    })
  })

  describe('事件委托的上下文', () => {
    it('委托事件处理器的 this 应该指向匹配的元素', () => {
      let contextElement: Element | null = null
      
      function handler(this: Element, event: Event) {
        contextElement = this
      }
      
      on(container, 'click', '.btn', handler)
      button.click()
      
      expect(contextElement).toBe(button)
    })

    it('委托事件应该能找到父级匹配的元素', () => {
      let contextElement: Element | null = null
      
      function handler(this: Element, event: Event) {
        contextElement = this
      }
      
      on(container, 'click', '.btn', handler)
      child.click() // 点击子元素，应该冒泡到按钮
      
      expect(contextElement).toBe(button)
    })
  })
})