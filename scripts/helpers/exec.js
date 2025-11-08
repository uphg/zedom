import { execa } from 'execa'
import pc from 'picocolors'

export const BUILD_TYPES = {
  TSC: { name: 'TypeScript', type: 'compiler' },
  ESM: { name: 'ESM Bundle', type: 'bundler' },
  UMD: { name: 'UMD Bundle', type: 'bundler' },
  TSDOWN: { name: 'TSDOWN', type: 'bundler' }
}

export async function execaQuiet(command, options = {}) {
  try {
    const result = await execa(command, {
      shell: true,
      ...options
    })
    return {
      success: true,
      stdout: result.stdout,
      stderr: result.stderr
    }
  } catch (error) {
    return {
      success: false,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message
    }
  }
}

export function handleBuildResult(result, name, type) {
  if (result.success) {
    console.log(pc.green('✓') + pc.dim(` ${name} built successfully`))
  } else {
    console.log(pc.red('✗') + pc.dim(` ${name} build failed`))
    if (result.stderr) {
      console.log(pc.red('  Error:'), result.stderr)
    }
  }
}