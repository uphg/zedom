/**
 * Generate package.json configuration
 * @param {string} version - Version number
 * @returns {Object} package.json configuration object
 */
export function createPackageConfig(version = '0.1.6') {
  return {
    name: 'zedom',
    version,
    license: 'MIT',
    main: 'index.umd.js',
    module: 'index.js',
    types: 'index.d.ts',
    description: 'A lightweight JavaScript utility library with common functions',
    keywords: ['javascript', 'typescript', 'utils', 'utility', 'functions', 'library', 'tools'],
    homepage: 'https://github.com/lvheng/zedom#readme',
    repository: 'lvheng/zedom',
    bugs: 'https://github.com/lvheng/zedom/issues',
    author: 'Lv Heng <lvheng233@gmail.com>'
  }
}
