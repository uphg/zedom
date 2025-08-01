import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import getStyle from '../src/getStyle'

describe('getStyle', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })

  it('should return null when element is null', () => {
    expect(getStyle(null as any, 'color')).toBe(null)
  })

  it('should return null when style name is empty', () => {
    expect(getStyle(element, '')).toBe(null)
  })

  it('should get inline style values', () => {
    element.style.color = 'red'
    expect(getStyle(element, 'color')).toBe('red')
  })

  it('should get camelCase style names', () => {
    element.style.backgroundColor = 'blue'
    expect(getStyle(element, 'backgroundColor')).toBe('blue')
  })

  it('should convert kebab-case to camelCase', () => {
    element.style.backgroundColor = 'green'
    expect(getStyle(element, 'background-color')).toBe('green')
  })

  it('should get numeric type styles', () => {
    element.style.width = '100px'
    expect(getStyle(element, 'width')).toBe('100px')
  })

  it('should return default value for unset styles', () => {
    // for unset styles, return value may be empty string or undefined
    const result = getStyle(element, 'margin')
    expect(result === '' || result === undefined).toBe(true)
  })

  it('should handle CSS custom property names', () => {
    element.style.setProperty('--custom-color', 'purple')
    // note: getStyle function may not support CSS custom properties, depends on implementation
    // 这个测试主要是验证不会出错
    expect(() => getStyle(element, '--custom-color')).not.toThrow()
  })

  it('should handle compound style properties', () => {
    element.style.border = '1px solid black'
    expect(getStyle(element, 'border')).toBe('1px solid black')
  })

  it('should handle font-related styles', () => {
    element.style.fontSize = '16px'
    element.style.fontWeight = 'bold'

    expect(getStyle(element, 'fontSize')).toBe('16px')
    expect(getStyle(element, 'font-size')).toBe('16px')
    expect(getStyle(element, 'fontWeight')).toBe('bold')
    expect(getStyle(element, 'font-weight')).toBe('bold')
  })

  it('should handle transform styles', () => {
    element.style.transform = 'translateX(10px)'
    expect(getStyle(element, 'transform')).toBe('translateX(10px)')
  })

  it('should handle position-related styles', () => {
    element.style.position = 'absolute'
    element.style.top = '10px'
    element.style.left = '20px'

    expect(getStyle(element, 'position')).toBe('absolute')
    expect(getStyle(element, 'top')).toBe('10px')
    expect(getStyle(element, 'left')).toBe('20px')
  })
})
