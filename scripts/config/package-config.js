import { readFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '../..')

export function createPackageConfig(version = '0.1.0') {
  const mainPackagePath = join(rootDir, 'package.json')
  const mainPackage = JSON.parse(readFileSync(mainPackagePath, 'utf-8'))
  
  return {
    name: mainPackage.name,
    version,
    description: mainPackage.description,
    keywords: mainPackage.keywords,
    homepage: mainPackage.homepage,
    repository: mainPackage.repository,
    bugs: mainPackage.bugs,
    author: mainPackage.author,
    license: mainPackage.license,
    main: 'dist/index.umd.js',
    module: 'dist/index.js',
    types: 'dist/index.d.ts',
    files: [
      'dist',
      'README.md',
      'LICENSE'
    ],
    dependencies: mainPackage.dependencies
  }
}