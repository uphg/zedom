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

  it('应该返回 null 当元素为 null 时', () => {
    expect(getStyle(null as any, 'color')).toBe(null)
  })

  it('应该返回 null 当样式名为空时', () => {
    expect(getStyle(element, '')).toBe(null)
  })

  it('应该能获取内联样式值', () => {
    element.style.color = 'red'
    expect(getStyle(element, 'color')).toBe('red')
  })

  it('应该能获取 camelCase 样式名', () => {
    element.style.backgroundColor = 'blue'
    expect(getStyle(element, 'backgroundColor')).toBe('blue')
  })

  it('应该能将 kebab-case 转换为 camelCase', () => {
    element.style.backgroundColor = 'green'
    expect(getStyle(element, 'background-color')).toBe('green')
  })

  it('应该能获取数值类型的样式', () => {
    element.style.width = '100px'
    expect(getStyle(element, 'width')).toBe('100px')
  })

  it('应该返回未设置样式的默认值', () => {
    // 对于未设置的样式，返回值可能是空字符串或 undefined
    const result = getStyle(element, 'margin')
    expect(result === '' || result === undefined).toBe(true)
  })

  it('应该处理 CSS 自定义属性名', () => {
    element.style.setProperty('--custom-color', 'purple')
    // 注意：getStyle 函数可能不支持 CSS 自定义属性，这取决于实现
    // 这个测试主要是验证不会出错
    expect(() => getStyle(element, '--custom-color')).not.toThrow()
  })

  it('应该处理复合样式属性', () => {
    element.style.border = '1px solid black'
    expect(getStyle(element, 'border')).toBe('1px solid black')
  })

  it('应该处理 font 相关样式', () => {
    element.style.fontSize = '16px'
    element.style.fontWeight = 'bold'
    
    expect(getStyle(element, 'fontSize')).toBe('16px')
    expect(getStyle(element, 'font-size')).toBe('16px')
    expect(getStyle(element, 'fontWeight')).toBe('bold')
    expect(getStyle(element, 'font-weight')).toBe('bold')
  })

  it('应该处理 transform 样式', () => {
    element.style.transform = 'translateX(10px)'
    expect(getStyle(element, 'transform')).toBe('translateX(10px)')
  })

  it('应该处理 position 相关样式', () => {
    element.style.position = 'absolute'
    element.style.top = '10px'
    element.style.left = '20px'
    
    expect(getStyle(element, 'position')).toBe('absolute')
    expect(getStyle(element, 'top')).toBe('10px')
    expect(getStyle(element, 'left')).toBe('20px')
  })
})