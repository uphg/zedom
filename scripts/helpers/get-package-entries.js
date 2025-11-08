import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { rootDir } from './_root-dir.js'

export function getPackageEntries(keySuffix = false) {
  const srcDir = join(rootDir, 'src')
  const entries = { }

  const modules = readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const module of modules) {
    if (module === 'internal') continue

    const moduleIndexPath = join(srcDir, module, 'index.ts')
    try {
      const content = readFileSync(moduleIndexPath, 'utf-8')
      const exports = content.match(/export.*from\s+['"]\.\/([^'"]+)['"]/g)
      if (exports) {
        for (const exportLine of exports) {
          const match = exportLine.match(/export.*from\s+['"]\.\/([^'"]+)['"]/)
          if (match && match[1]) {
            const functionName = match[1]
            const key = keySuffix ? `${functionName}/index` : functionName
            entries[key] = `src/${module}/${functionName}.ts`
          }
        }
      }
    } catch(error) {
      console.warn(`Could not read ${moduleIndexPath}:`, error.message)
    }
  }

  return entries
}