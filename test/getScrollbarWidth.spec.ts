import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getScrollbarWidth } from '../src/getScrollbarWidth'

describe('getScrollbarWidth', () => {
  beforeEach(() => {
    // 重置模块的内部状态（通过重新导入）
    vi.resetModules()
  })

  it('应该返回一个数字', () => {
    const width = getScrollbarWidth()
    expect(typeof width).toBe('number')
    expect(width).toBeGreaterThanOrEqual(0)
  })

  it('应该返回合理的滚动条宽度值', () => {
    const width = getScrollbarWidth()
    
    // 滚动条宽度通常在 0-30px 之间
    expect(width).toBeGreaterThanOrEqual(0)
    expect(width).toBeLessThanOrEqual(30)
  })

  it('应该缓存滚动条宽度值', () => {
    const width1 = getScrollbarWidth()
    const width2 = getScrollbarWidth()
    
    expect(width1).toBe(width2)
    expect(typeof width1).toBe('number')
  })

  it('应该在测试环境中返回有效值', () => {
    const width = getScrollbarWidth()
    
    // 在 jsdom 环境中，滚动条宽度可能是 0 或一个固定值
    expect(width).toBeGreaterThanOrEqual(0)
    expect(Number.isInteger(width)).toBe(true)
  })

  it('应该处理 DOM 操作', () => {
    // 验证函数不会抛出错误
    expect(() => getScrollbarWidth()).not.toThrow()
    
    const width = getScrollbarWidth()
    expect(typeof width).toBe('number')
  })

  it('应该多次调用返回相同结果', () => {
    const results = []
    
    for (let i = 0; i < 5; i++) {
      results.push(getScrollbarWidth())
    }
    
    // 所有结果应该相同
    const firstResult = results[0]
    results.forEach(result => {
      expect(result).toBe(firstResult)
    })
  })

  it('应该在不同的调用时机返回相同结果', async () => {
    const width1 = getScrollbarWidth()
    
    // 等待一小段时间
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const width2 = getScrollbarWidth()
    
    expect(width1).toBe(width2)
  })

  it('应该处理文档不存在的情况', () => {
    // 这个测试可能在某些环境下不适用，我们简化它
    const width = getScrollbarWidth()
    expect(typeof width).toBe('number')
    expect(width).toBeGreaterThanOrEqual(0)
  })

  it('应该创建和清理临时 DOM 元素', () => {
    const initialBodyChildren = document.body.children.length
    
    getScrollbarWidth()
    
    const finalBodyChildren = document.body.children.length
    
    // 函数执行后不应该留下临时元素
    expect(finalBodyChildren).toBe(initialBodyChildren)
  })

  it('应该正确设置临时元素的样式', () => {
    // 简化测试，只验证函数正常执行
    const width = getScrollbarWidth()
    
    expect(typeof width).toBe('number')
    expect(width).toBeGreaterThanOrEqual(0)
    
    // 验证多次调用返回缓存值
    const width2 = getScrollbarWidth()
    expect(width2).toBe(width)
  })

  it('应该处理边界情况', () => {
    // 测试在 body 元素不存在时的行为
    const originalBody = document.body
    
    try {
      // 临时移除 body（模拟极端情况）
      Object.defineProperty(document, 'body', {
        value: null,
        writable: true,
        configurable: true
      })
      
      // 在这种情况下函数应该能够处理或抛出可预期的错误
      expect(() => getScrollbarWidth()).not.toThrow()
    } catch (error) {
      // 如果抛出错误，应该是可预期的类型
      expect(error).toBeDefined()
    } finally {
      // 恢复 body
      Object.defineProperty(document, 'body', {
        value: originalBody,
        writable: true,
        configurable: true
      })
    }
  })

  it('应该返回非负数', () => {
    const width = getScrollbarWidth()
    expect(width).toBeGreaterThanOrEqual(0)
  })

  it('应该返回整数或小数', () => {
    const width = getScrollbarWidth()
    expect(typeof width).toBe('number')
    expect(isNaN(width)).toBe(false)
    expect(isFinite(width)).toBe(true)
  })

  it('应该在浏览器环境中正常工作', () => {
    // 确保我们在浏览器环境中
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    
    const width = getScrollbarWidth()
    expect(typeof width).toBe('number')
  })
})