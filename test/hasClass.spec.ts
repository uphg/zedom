import { describe, it, expect, beforeEach } from 'vitest'
import hasClass from '../src/hasClass'

describe('hasClass', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
  })

  it('应该返回 false 当元素为 null 时', () => {
    expect(hasClass(null as any, 'test-class')).toBe(false)
  })

  it('应该返回 false 当类名为空时', () => {
    expect(hasClass(element, '')).toBe(false)
  })

  it('应该返回 true 当元素有指定类名时', () => {
    element.className = 'test-class'
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('应该返回 false 当元素没有指定类名时', () => {
    element.className = 'other-class'
    expect(hasClass(element, 'test-class')).toBe(false)
  })

  it('应该正确检查多个类名中的某一个', () => {
    element.className = 'class1 test-class class2'
    expect(hasClass(element, 'test-class')).toBe(true)
    expect(hasClass(element, 'class1')).toBe(true)
    expect(hasClass(element, 'class2')).toBe(true)
    expect(hasClass(element, 'non-existent')).toBe(false)
  })

  it('应该处理前后有空格的类名', () => {
    element.className = ' test-class '
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('应该处理类名之间有多个空格的情况', () => {
    element.className = 'class1   test-class   class2'
    expect(hasClass(element, 'test-class')).toBe(true)
  })

  it('应该在没有 classList 支持时正常工作', () => {
    // 模拟旧浏览器环境
    const mockElement = {
      classList: null,
      getAttribute: (attr: string) => attr === 'class' ? 'test-class other-class' : null
    } as any

    expect(hasClass(mockElement, 'test-class')).toBe(true)
    expect(hasClass(mockElement, 'other-class')).toBe(true)
    expect(hasClass(mockElement, 'non-existent')).toBe(false)
  })

  it('应该在元素没有 class 属性时返回 false', () => {
    const mockElement = {
      classList: null,
      getAttribute: () => null
    } as any

    expect(hasClass(mockElement, 'test-class')).toBe(false)
  })
})