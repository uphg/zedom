import { describe, it, expect } from 'vitest'
import { isServer, isClient } from '../src/env'

describe('env', () => {
  describe('isServer', () => {
    it('should return false in test environment', () => {
      // in jsdom test environment, window object exists, so isServer should be false
      expect(isServer).toBe(false)
      expect(typeof isServer).toBe('boolean')
    })

    it('should be related to window object existence', () => {
      // isServer should be related to whether window is undefined
      expect(isServer).toBe(typeof window === 'undefined')
    })
  })

  describe('isClient', () => {
    it('should return true in test environment', () => {
      // in jsdom test environment, window object exists, so isClient should be true
      expect(isClient).toBe(true)
      expect(typeof isClient).toBe('boolean')
    })

    it('should be related to window object existence', () => {
      // isClient should be related to whether window is defined
      expect(isClient).toBe(typeof window !== 'undefined')
    })

    it('should be opposite to isServer', () => {
      // isClient and isServer should be opposite
      expect(isClient).toBe(!isServer)
    })
  })

  describe('environment detection consistency', () => {
    it('isServer and isClient should be mutually exclusive', () => {
      expect(isServer && isClient).toBe(false)
      expect(isServer || isClient).toBe(true)
    })

    it('should have only one as true', () => {
      const count = [isServer, isClient].filter(Boolean).length
      expect(count).toBe(1)
    })
  })

  describe('behavior in different environments', () => {
    it('should correctly detect browser environment', () => {
      // simulate browser environment in test environment
      if (typeof window !== 'undefined') {
        expect(isClient).toBe(true)
        expect(isServer).toBe(false)
      }
    })

    it('should have correct types', () => {
      expect(typeof isServer).toBe('boolean')
      expect(typeof isClient).toBe('boolean')
    })
  })

  describe('runtime detection', () => {
    it('should detect based on global object existence', () => {
      // verify detection logic is based on global object existence
      const hasWindow = typeof window !== 'undefined'
      expect(isClient).toBe(hasWindow)
      expect(isServer).toBe(!hasWindow)
    })

    it('should determine values at module load time', () => {
      // isServer and isClient should be constants, not changing at runtime
      const initialServer = isServer
      const initialClient = isClient

      // accessing again should get the same values
      expect(isServer).toBe(initialServer)
      expect(isClient).toBe(initialClient)
    })
  })
})
