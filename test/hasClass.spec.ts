import { describe, it, expect, beforeEach } from 'vitest'
import hasClass from '../src/hasClass'

describe('hasClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('should return false when element is null', () => {
    expect(hasClass(null as any, 'test-class')).toBe(false)
  })

  it('should return false when class name is empty', () => {
    expect(hasClass(element, '')).toBe(false)
  })

  it('should return true when element has specified class name', () => {
    element.className = 'test-class'
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('should return false when element does not have specified class name', () => {
    element.className = 'other-class'
    expect(hasClass(element, 'test-class')).toBe(false)
  })

  it('should correctly check for one of multiple class names', () => {
    element.className = 'class1 test-class class2'
    expect(hasClass(element, 'test-class')).toBe(true)
    expect(hasClass(element, 'class1')).toBe(true)
    expect(hasClass(element, 'class2')).toBe(true)
    expect(hasClass(element, 'non-existent')).toBe(false)
  })

  it('should handle class names with leading and trailing spaces', () => {
    element.className = ' test-class '
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('should handle multiple spaces between class names', () => {
    element.className = 'class1   test-class   class2'
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('should work normally without classList support', () => {
    // simulate old browser environment
    const mockElement = {
      classList: null,
      getAttribute: (attr: string) => attr === 'class' ? 'test-class other-class' : null
    } as any

    expect(hasClass(mockElement, 'test-class')).toBe(true)
    expect(hasClass(mockElement, 'other-class')).toBe(true)
    expect(hasClass(mockElement, 'non-existent')).toBe(false)
  })

  it('should return false when element has no class attribute', () => {
    const mockElement = {
      classList: null,
      getAttribute: () => null
    } as any

    expect(hasClass(mockElement, 'test-class')).toBe(false)
  })
})
