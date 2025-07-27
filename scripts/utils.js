// @ts-check
import pico from 'picocolors'
import { execa } from 'execa'
import { spawn } from 'node:child_process'

// Build type constants
export const BUILD_TYPES = {
  TSC: { name: 'TypeScript', type: 'compiled' },
  CJS: { name: 'CJS', type: 'bundle built' },
  ESM: { name: 'ESM', type: 'bundle built' },
  UMD: { name: 'UMD', type: 'bundle built' }
}

/**
 * Format build time display
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
export function formatBuildTime(ms) {
  if (ms < 1000) return pico.green(`${ms}ms`)
  if (ms < 5000) return pico.yellow(`${(ms / 1000).toFixed(1)}s`)
  return pico.red(`${(ms / 1000).toFixed(1)}s`)
}

/**
 * Silent execution wrapper, collect build information
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {object} options - Execution options
 * @returns {Promise<{success: boolean, duration: number, command: string, args: string[], result?: any, error?: any}>} Build result
 */
export async function execaQuiet(command, args = [], options = {}) {
  const startTime = Date.now()
  try {
    const result = await execa(command, args, options)
    const duration = Date.now() - startTime
    return { success: true, duration, command, args, result }
  }
  catch(error) {
    const duration = Date.now() - startTime
    return { success: false, duration, command, args, error }
  }
}

/**
 * Handle build results uniformly
 * @param {Object} result - Build result
 * @param {string} type - Build type
 * @param {string} action - Build action
 */
export function handleBuildResult(result, type, action) {
  if (result.success) {
    console.log(pico.green('✓') + pico.dim(` ${type} ${action} in `) + formatBuildTime(result.duration))
  }
  else {
    console.log(pico.red('✗') + pico.dim(` ${type} failed in `) + formatBuildTime(result.duration))
    throw result.error
  }
}

/**
 * Execute command line instructions
 * @param {string} command
 * @param {ReadonlyArray<string>} args
 * @param {object} [options]
 */
export async function exec(command, args, options) {
  return new Promise((resolve, reject) => {
    const _process = spawn(command, args, {
      stdio: [
        'ignore', // stdin
        'pipe', // stdout
        'pipe' // stderr
      ],
      ...options,
      shell: process.platform === 'win32'
    })

    /** @type {Buffer[]} */
    const stderrChunks = []
    /** @type {Buffer[]} */
    const stdoutChunks = []

    _process.stderr?.on('data', (chunk) => {
      stderrChunks.push(chunk)
    })

    _process.stdout?.on('data', (chunk) => {
      stdoutChunks.push(chunk)
    })

    _process.on('error', (error) => {
      reject(error)
    })

    _process.on('exit', (code) => {
      const ok = code === 0
      const stderr = Buffer.concat(stderrChunks).toString().trim()
      const stdout = Buffer.concat(stdoutChunks).toString().trim()

      if (ok) {
        const result = { ok, code, stderr, stdout }
        resolve(result)
      } else {
        reject(
          new Error(
            `Failed to execute command: ${command} ${args.join(' ')}: ${stderr}`
          )
        )
      }
    })
  })
}
