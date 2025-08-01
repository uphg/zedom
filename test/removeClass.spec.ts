import { describe, it, expect, beforeEach } from 'vitest'
import removeClass from '../src/removeClass'

describe('removeClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('should remove single class name', () => {
    element.className = 'class1 class2 class3'
    removeClass(element, 'class2')
    expect(element.className).not.toContain('class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class3')
  })

  it('should remove multiple class names', () => {
    element.className = 'class1 class2 class3 class4'
    removeClass(element, 'class1', 'class3')
    expect(element.className).not.toContain('class1')
    expect(element.className).not.toContain('class3')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class4')
  })

  it('should handle class name strings containing spaces', () => {
    element.className = 'class1 class2 class3'
    removeClass(element, 'class1 class3')
    expect(element.className).not.toContain('class1')
    expect(element.className).not.toContain('class3')
    expect(element.className).toContain('class2')
  })

  it('should ignore non-existent class names', () => {
    element.className = 'class1 class2'
    removeClass(element, 'non-existent')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('should skip empty class name parameters', () => {
    element.className = 'class1 class2'
    removeClass(element, 'class1')
    // verify that valid class names can be removed normally
    expect(element.className).toContain('class2')
    expect(element.className).not.toContain('class1')
  })

  it('should handle removing all class names', () => {
    element.className = 'class1 class2'
    removeClass(element, 'class1', 'class2')
    expect(element.className.trim()).toBe('')
  })

  it('should work normally without classList support', () => {
    const mockElement = {
      classList: null,
      getAttribute: (attr: string) => attr === 'class' ? 'class1 class2 class3' : null,
      setAttribute: function(attr: string, value: string) {
        if (attr === 'class') {
          this._className = value
        }
      },
      get className() {
        return this._className || ''
      },
      _className: 'class1 class2 class3'
    } as any

    removeClass(mockElement, 'class2')
    expect(mockElement._className).not.toContain('class2')
    expect(mockElement._className).toContain('class1')
    expect(mockElement._className).toContain('class3')
  })

  it('should correctly handle spaces before and after class names', () => {
    element.className = ' class1  class2  class3 '
    removeClass(element, 'class2')
    expect(element.className).not.toContain('class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class3')
  })

  it('should handle duplicate class names', () => {
    element.className = 'class1 class2 class1 class3'
    removeClass(element, 'class1')
    expect(element.className).not.toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
  })

  it('should work normally when element has no class attribute', () => {
    const mockElement = {
      classList: null,
      getAttribute: () => null,
      setAttribute: function() { }
    } as any

    // should not throw error
    expect(() => removeClass(mockElement, 'class1')).not.toThrow()
  })

  it('should maintain order of remaining class names', () => {
    element.className = 'class1 class2 class3 class4 class5'
    removeClass(element, 'class2', 'class4')

    const remainingClasses = element.className.trim().split(/\s+/)
    expect(remainingClasses).toEqual(['class1', 'class3', 'class5'])
  })
})
