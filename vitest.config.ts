import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test file matching pattern
    include: ['test/**/*.{spec,test}.ts'],
    // Excluded files
    exclude: ['node_modules/**'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    // Environment configuration
    environment: 'node',
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
