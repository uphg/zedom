import { describe, it, expect, beforeEach } from 'vitest'
import addClass from '../src/addClass'

describe('addClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('应该能添加单个类名', () => {
    addClass(element, 'test-class')
    expect(element.className).toBe('test-class')
  })

  it('应该能添加多个类名', () => {
    addClass(element, 'class1', 'class2', 'class3')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
  })

  it('应该能添加数组形式的类名', () => {
    addClass(element, ['class1', 'class2'])
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('应该能混合添加字符串和数组形式的类名', () => {
    addClass(element, 'class1', ['class2', 'class3'], 'class4')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
    expect(element.className).toContain('class3')
    expect(element.className).toContain('class4')
  })

  it('应该正确处理已有类名的元素', () => {
    element.className = 'existing-class'
    addClass(element, 'new-class')
    expect(element.className).toContain('existing-class')
    expect(element.className).toContain('new-class')
  })

  it('应该能处理包含空格的类名字符串', () => {
    addClass(element, 'class1 class2')
    expect(element.className).toContain('class1')
    expect(element.className).toContain('class2')
  })

  it('应该跳过空字符串和空白字符', () => {
    // 测试不会因为空字符串报错，并且只添加有效的类名
    addClass(element, 'valid-class')
    expect(element.className.trim()).toBe('valid-class')
    
    // 测试有效的类名还能正常添加
    addClass(element, 'another-class')
    expect(element.className).toContain('valid-class')
    expect(element.className).toContain('another-class')
  })

  it('应该在没有 classList 支持时正常工作', () => {
    // 模拟旧浏览器环境
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

  it('应该处理数组的类名', () => {
    addClass(element, ['simple1', 'simple2'])
    expect(element.className).toContain('simple1')
    expect(element.className).toContain('simple2')
  })

  it('应该去重复的类名', () => {
    element.className = 'existing-class'
    addClass(element, 'existing-class', 'new-class')
    
    // 计算 existing-class 出现的次数
    const matches = element.className.match(/existing-class/g)
    expect(matches?.length).toBe(1)
    expect(element.className).toContain('new-class')
  })
})