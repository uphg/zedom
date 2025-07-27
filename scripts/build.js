import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import pc from 'picocolors'
import { execaQuiet, handleBuildResult, BUILD_TYPES } from './utils.js'
import { createPackageConfig } from './config/package-config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, '../dist')
const resolve = p => path.resolve(distDir, p)
const argv = minimist(process.argv.slice(2))

// use pnpm build -v 0.1.x
run(argv)

async function run(argv) {
  // Read root package.json to get default version
  const rootPackagePath = path.resolve(__dirname, '../package.json')
  const rootPackage = JSON.parse(await fs.readFile(rootPackagePath, 'utf-8'))
  const { v: version = rootPackage.version } = argv
  const packageJson = createPackageConfig(version)

  try {
    console.log(pc.dim('Building TypeScript...'))
    const tscResult = await execaQuiet('tsc')

    if (fs.existsSync(distDir)) {
      await fs.remove(distDir)
    }

    console.log(pc.dim('Building bundles...'))

    // Execute all rollup builds in parallel
    const [cjsResult, esmResult, umdResult] = await Promise.all([
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--environment', 'CJS', '--configPlugin', '@rollup/plugin-typescript']),
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--environment', 'ESM', '--configPlugin', '@rollup/plugin-typescript']),
      execaQuiet('rollup', ['-c', 'rollup.config.ts', '--configPlugin', '@rollup/plugin-typescript'])
    ])

    // Display build results
    console.log(pc.dim('Build Results:'))

    // Handle build results uniformly
    handleBuildResult(tscResult, BUILD_TYPES.TSC.name, BUILD_TYPES.TSC.type)
    handleBuildResult(cjsResult, BUILD_TYPES.CJS.name, BUILD_TYPES.CJS.type)
    handleBuildResult(esmResult, BUILD_TYPES.ESM.name, BUILD_TYPES.ESM.type)
    handleBuildResult(umdResult, BUILD_TYPES.UMD.name, BUILD_TYPES.UMD.type)

    const strPackage = JSON.stringify(packageJson, null, 2)
    await fs.writeFile(resolve('./package.json'), strPackage)
    await fs.copy('README.md', resolve('README.md'))
    await fs.copy('LICENSE', resolve('LICENSE'))

    // Format bundled code and type files
    console.log(pc.dim('Formatting output files...'))
    try {
      await execa('pnpm', [
        'exec',
        'eslint',
        'dist/**/*.{js,ts,d.ts}',
        '--fix',
        '--no-ignore'
      ], { stdio: 'inherit' })
      console.log(pc.green('✓') + pc.dim(' Files formatted successfully!'))
    }
    catch(error) {
      console.log(pc.yellow('(!)') + pc.dim(' Warning: Some files could not be formatted: ') + pc.red(error.message))
    }

    console.log(pc.green('✓') + pc.bold(' Build completed successfully!'))
  }
  catch(error) {
    console.error(pc.red('✗') + pc.bold(' Build failed: ') + pc.red(error.message))
    if (error.stderr) {
      console.error(pc.red('STDERR:'), error.stderr)
    }
    process.exit(1)
  }
}
