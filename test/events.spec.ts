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
    it('should add simple event listener', () => {
      const handler = vi.fn()

      on(button, 'click', handler)

      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle event delegation', () => {
      const handler = vi.fn()

      // 在容器上监听按钮的点击事件
      on(container, 'click', '.btn', handler)

      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(Event))
    })

    it('should handle deep level event delegation', () => {
      const handler = vi.fn()

      // 在容器上监听子元素的点击事件
      on(container, 'click', '.child-element', handler)

      child.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle event delegation with ID selector', () => {
      const handler = vi.fn()

      on(container, 'click', '#test-button', handler)

      button.click()
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle non-matching selector cases', () => {
      const handler = vi.fn()

      on(container, 'click', '.non-existent', handler)

      button.click()
      expect(handler).not.toHaveBeenCalled()
    })

    it('should return element itself', () => {
      const handler = vi.fn()

      const result = on(button, 'click', handler)
      expect(result).toBe(button)
    })

    it('should handle null element', () => {
      const handler = vi.fn()

      expect(() => on(null, 'click', handler)).not.toThrow()
    })

    it('should handle empty event name', () => {
      const handler = vi.fn()

      expect(() => on(button, '', handler)).not.toThrow()
    })

    it('should handle empty selector', () => {
      const _handler = vi.fn()

      expect(() => on(button, 'click', '')).not.toThrow()
    })

    it('should pass event options', () => {
      const handler = vi.fn()

      on(button, 'click', handler, { once: true })

      button.click()
      button.click()

      // should only trigger once
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple event types', () => {
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
    it('should remove event listener', () => {
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

    it('should handle null element', () => {
      const handler = vi.fn()

      expect(() => off(null, 'click', handler)).not.toThrow()
    })

    it('should handle empty event name', () => {
      const handler = vi.fn()

      expect(() => off(button, '', handler)).not.toThrow()
    })

    it('should handle null handler', () => {
      expect(() => off(button, 'click', null as any)).not.toThrow()
    })

    it('should pass event options', () => {
      const handler = vi.fn()

      on(button, 'click', handler, { capture: true })
      off(button, 'click', handler, { capture: true })

      button.click()
      expect(handler).not.toHaveBeenCalled()
    })

    it('should only remove specified handler', () => {
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

  describe('event delegation context', () => {
    it('delegated event handler this should point to matched element', () => {
      let contextElement: Element | null = null

      function handler(this: Element, _event: Event) {
        contextElement = this
      }

      on(container, 'click', '.btn', handler)
      button.click()

      expect(contextElement).toBe(button)
    })

    it('delegated event should find parent matching element', () => {
      let contextElement: Element | null = null

      function handler(this: Element, _event: Event) {
        contextElement = this
      }

      on(container, 'click', '.btn', handler)
      child.click() // click child element, should bubble to button

      expect(contextElement).toBe(button)
    })
  })
})
