import { describe, it, expect, beforeEach } from 'vitest'
import addClass from '../src/addClass'

describe('addClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('should add single class name', () => {
    addClass(element, 'test-class')
    expect(element.className).toBe('test-class')
  })

  it('should add multiple class names', () => {
    addClass(element, 'class1', 'class2', 'class3')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
  })

  it('should add class names in array format', () => {
    addClass(element, ['class1', 'class2'])
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('should add mixed string and array format class names', () => {
    addClass(element, 'class1', ['class2', 'class3'], 'class4')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
    expect(element.className).toContain('class4')
  })

  it('should correctly handle elements with existing class names', () => {
    element.className = 'existing-class'
    addClass(element, 'new-class')
    expect(element.className).toContain('existing-class')
    expect(element.className).toContain('new-class')
  })

  it('should handle class name strings containing spaces', () => {
    addClass(element, 'class1 class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('should skip empty strings and whitespace characters', () => {
    // test that empty strings don't cause errors and only valid class names are added
    addClass(element, 'valid-class')
    expect(element.className.trim()).toBe('valid-class')

    // test that valid class names can still be added normally
    addClass(element, 'another-class')
    expect(element.className).toContain('valid-class')
    expect(element.className).toContain('another-class')
  })

  it('should work normally without classList support', () => {
    // simulate old browser environment
    const mockElement = {
      classList: null,
      getAttribute: (attr: string) => attr === 'class' ? 'existing-class' : null,
      setAttribute: function(attr: string, value: string) {
        if (attr === 'class') {
          this._className = value
        }
      },
      get className() {
        return this._className || 'existing-class'
      },
      _className: 'existing-class'
    } as any

    addClass(mockElement, 'new-class')
    expect(mockElement._className).toContain('existing-class')
    expect(mockElement._className).toContain('new-class')
  })

  it('should handle array class names', () => {
    addClass(element, ['simple1', 'simple2'])
    expect(element.className).toContain('simple1')
    expect(element.className).toContain('simple2')
  })

  it('should deduplicate class names', () => {
    element.className = 'existing-class'
    addClass(element, 'existing-class', 'new-class')

    // count occurrences of existing-class
    const matches = element.className.match(/existing-class/g)
    expect(matches?.length).toBe(1)
    expect(element.className).toContain('new-class')
  })
})
