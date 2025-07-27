import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test file matching patterns
    include: ['test/**/*.{spec,test}.ts'],
    // Excluded files
    exclude: ['node_modules/**'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    // Environment configuration
    environment: 'jsdom'
  }
})
