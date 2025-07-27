import { describe, it, expect } from 'vitest'
import { isServer, isClient } from '../src/env'

describe('env', () => {
  describe('isServer', () => {
    it('应该在测试环境中返回 false', () => {
      // 在 jsdom 测试环境中，window 对象存在，所以 isServer 应该是 false
      expect(isServer).toBe(false)
      expect(typeof isServer).toBe('boolean')
    })

    it('应该与 window 对象的存在性相关', () => {
      // isServer 应该与 window 是否未定义相关
      expect(isServer).toBe(typeof window === 'undefined')
    })
  })

  describe('isClient', () => {
    it('应该在测试环境中返回 true', () => {
      // 在 jsdom 测试环境中，window 对象存在，所以 isClient 应该是 true
      expect(isClient).toBe(true)
      expect(typeof isClient).toBe('boolean')
    })

    it('应该与 window 对象的存在性相关', () => {
      // isClient 应该与 window 是否定义相关
      expect(isClient).toBe(typeof window !== 'undefined')
    })

    it('应该与 isServer 相反', () => {
      // isClient 和 isServer 应该是相反的
      expect(isClient).toBe(!isServer)
    })
  })

  describe('环境检测的一致性', () => {
    it('isServer 和 isClient 应该是互斥的', () => {
      expect(isServer && isClient).toBe(false)
      expect(isServer || isClient).toBe(true)
    })

    it('应该只有一个为 true', () => {
      const count = [isServer, isClient].filter(Boolean).length
      expect(count).toBe(1)
    })
  })

  describe('在不同环境下的行为', () => {
    it('应该正确检测浏览器环境', () => {
      // 在测试环境中模拟浏览器环境
      if (typeof window !== 'undefined') {
        expect(isClient).toBe(true)
        expect(isServer).toBe(false)
      }
    })

    it('应该具有正确的类型', () => {
      expect(typeof isServer).toBe('boolean')
      expect(typeof isClient).toBe('boolean')
    })
  })

  describe('运行时检测', () => {
    it('应该基于全局对象存在性进行检测', () => {
      // 验证检测逻辑是基于全局对象的存在性
      const hasWindow = typeof window !== 'undefined'
      expect(isClient).toBe(hasWindow)
      expect(isServer).toBe(!hasWindow)
    })

    it('应该在模块加载时就确定值', () => {
      // isServer 和 isClient 应该是常量，不会在运行时改变
      const initialServer = isServer
      const initialClient = isClient

      // 再次访问应该得到相同的值
      expect(isServer).toBe(initialServer)
      expect(isClient).toBe(initialClient)
    })
  })
})
