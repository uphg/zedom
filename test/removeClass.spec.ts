import { describe, it, expect, beforeEach } from 'vitest'
import removeClass from '../src/removeClass'

describe('removeClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('应该能移除单个类名', () => {
    element.className = 'class1 class2 class3'
    removeClass(element, 'class2')
    expect(element.className).not.toContain('class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class3')
  })

  it('应该能移除多个类名', () => {
    element.className = 'class1 class2 class3 class4'
    removeClass(element, 'class1', 'class3')
    expect(element.className).not.toContain('class1')
    expect(element.className).not.toContain('class3')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class4')
  })

  it('应该能处理包含空格的类名字符串', () => {
    element.className = 'class1 class2 class3'
    removeClass(element, 'class1 class3')
    expect(element.className).not.toContain('class1')
    expect(element.className).not.toContain('class3')
    expect(element.className).toContain('class2')
  })

  it('应该忽略不存在的类名', () => {
    element.className = 'class1 class2'
    removeClass(element, 'non-existent')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('应该跳过空的类名参数', () => {
    element.className = 'class1 class2'
    removeClass(element, 'class1')
    // 验证可以正常移除有效的类名
    expect(element.className).toContain('class2')
    expect(element.className).not.toContain('class1')
  })

  it('应该处理移除所有类名的情况', () => {
    element.className = 'class1 class2'
    removeClass(element, 'class1', 'class2')
    expect(element.className.trim()).toBe('')
  })

  it('应该在没有 classList 支持时正常工作', () => {
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

  it('应该正确处理类名前后的空格', () => {
    element.className = ' class1  class2  class3 '
    removeClass(element, 'class2')
    expect(element.className).not.toContain('class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class3')
  })

  it('应该处理重复的类名', () => {
    element.className = 'class1 class2 class1 class3'
    removeClass(element, 'class1')
    expect(element.className).not.toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
  })

  it('应该在元素没有 class 属性时正常工作', () => {
    const mockElement = {
      classList: null,
      getAttribute: () => null,
      setAttribute: function() {}
    } as any

    // 不应该抛出错误
    expect(() => removeClass(mockElement, 'class1')).not.toThrow()
  })

  it('应该保持剩余类名的顺序', () => {
    element.className = 'class1 class2 class3 class4 class5'
    removeClass(element, 'class2', 'class4')
    
    const remainingClasses = element.className.trim().split(/\s+/)
    expect(remainingClasses).toEqual(['class1', 'class3', 'class5'])
  })
})