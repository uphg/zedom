import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test file matching pattern
    include: ['test/**/*.{spec,test}.ts'],
    // Excluded files
    exclude: ['node_modules/**', 'docs/**'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60
      }
    },
    // Environment configuration
    environment: 'jsdom',
    // Show cleaner file paths, remove absolute path prefix
    root: process.cwd(),
    // Show test execution time, tests exceeding this time will be marked as slow
    slowTestThreshold: 500,
    // Sort test files by filename, group tests from same module together
    sequence: {
      shuffle: false,
      concurrent: false
    }
  }
})
