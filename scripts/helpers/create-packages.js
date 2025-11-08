import { getPackageEntries } from './get-package-entries.js'
import { mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { rootDir } from './_root-dir.js'
import { hyphenate } from './hyphenate.js'

const npmPackagesDir = join(rootDir, 'npm-packages')

export async function createPackages() {
  const entries = getPackageEntries()
  for (const [functionName, entryPath] of Object.entries(entries)) {
    const functionDir = join(npmPackagesDir, functionName)

    // Create directory for the function
    mkdirSync(functionDir, { recursive: true })
    await createTsdownConfig(functionName, { functionDir, entryPath })
    await createMetaDocs(functionName, { functionDir })
  }
  console.log(`Created ${Object.keys(entries).length} package configs`)
}

export async function createTsdownConfig(functionName, { functionDir, entryPath }) {
  // Generate tsdown.config.ts content
  const configContent = `import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: '${entryPath}',
  },
  format: ['esm', 'umd'],
  outDir: './npm-packages/${functionName}/dist',
  dts: true,
  sourcemap: true,
  clean: true,
  outputOptions: {
    name: 'fun_demo_${functionName.replace(/[-]/g, '_')}',
  }
})
`

  // Write tsdown.config.ts file
  const configPath = join(functionDir, 'tsdown.config.ts')
  writeFileSync(configPath, configContent)

  console.log(`Created config for ${functionName} at ${configPath}`)
}

export async function createMetaDocs(functionName, { functionDir }) {
  // Read main package.json to get version
  const mainPackagePath = join(rootDir, 'package.json')
  const mainPackage = JSON.parse(readFileSync(mainPackagePath, 'utf-8'))
  const version = mainPackage.version
  const hyphName = hyphenate(functionName)
  // Create package.json
  const packageJson = {
    name: `@fun-demo/${hyphName}`,
    version,
    license: 'MIT',
    main: 'dist/index.umd.js',
    module: 'dist/index.js',
    types: 'dist/index.d.ts',
    description: '一个轻量级的 JavaScript 数学运算库',
    keywords: [
      'javascript',
      'typescript',
      'math',
      'utils',
      'utility',
      'functions',
      'library',
      'tools'
    ],
    homepage: 'https://github.com/your-username/fun-demo#readme',
    repository: 'your-username/fun-demo',
    bugs: 'https://github.com/your-username/fun-demo/issues',
    author: 'Your Name <your.email@example.com>'
  }

  writeFileSync(
    join(functionDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  // Create README.md
  const readmeContent = `# @fun-demo/${hyphName} v${version}

## Installation

Using npm

\`\`\`bash
$ npm i @fun-demo/${hyphName}
\`\`\`

See the documentation or package source for more details.
`

  writeFileSync(join(functionDir, 'README.md'), readmeContent)

  console.log(`Created meta docs for ${functionName} at ${functionDir}`)
}