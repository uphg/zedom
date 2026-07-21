import { defineConfig } from 'tsdown'
import { getPackageEntries } from './scripts/helpers/get-package-entries.js'

const { BUILD_ENV } = process.env || {}

const esmEntries = Object.assign({ ['index']: 'src/index.ts' }, getPackageEntries(true))

const configs = {
  esm: {
    entry: esmEntries,
    format: ['esm'],
    dts: true,
    outDir: './dist',
    sourcemap: true,
    clean: false,
    outputOptions: {
      preserveModules: true
    }
  },
  umd: {
    entry: ['./src/index.ts'],
    format: ['umd'],
    outDir: './dist',
    sourcemap: true,
    clean: false,
    outputOptions: {
      name: 'zedom'
    }
  }
}

export default () => {
  const defaultConfig = configs[BUILD_ENV as keyof typeof configs ?? 'esm'] as any
  return defineConfig(defaultConfig)
}
