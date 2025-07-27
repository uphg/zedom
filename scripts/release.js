// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import pico from 'picocolors'
import semver from 'semver'
import enquirer from 'enquirer'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { exec } from './utils.js'
import { parseArgs } from 'node:util'

const { prompt } = enquirer
const currentVersion = createRequire(import.meta.url)('../package.json').version
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dry: {
      type: 'boolean'
    },
    skipBuild: {
      type: 'boolean'
    },
    skipTests: {
      type: 'boolean'
    },
    skipGit: {
      type: 'boolean'
    },
    skipPrompts: {
      type: 'boolean'
    }
  }
})

const isDryRun = args.dry
const skipTests = args.skipTests
const skipBuild = args.skipBuild
const skipGit = args.skipGit
const skipPrompts = args.skipPrompts

/** @type {ReadonlyArray<import('semver').ReleaseType>} */
const versionIncrements = ['patch', 'minor', 'major']

const inc = (/** @type {import('semver').ReleaseType} */ i) =>
  semver.inc(currentVersion, i)

const run = async(
  /** @type {string} */ bin,
  /** @type {ReadonlyArray<string>} */ args,
  /** @type {import('node:child_process').SpawnOptions} */ opts = {}
) => exec(bin, args, { stdio: 'inherit', ...opts })

const dryRun = async(
  /** @type {string} */ bin,
  /** @type {ReadonlyArray<string>} */ args
) => console.log(pico.blue(`[dryrun] ${bin} ${args.join(' ')}`))

const runIfNotDry = isDryRun ? dryRun : run
const step = (/** @type {string} */ msg) => console.log(pico.cyan(msg))

async function main() {
  let targetVersion = positionals[0]

  if (!targetVersion) {
    /** @type {{ release: string }} */
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map(i => `${i} (${inc(i)})`)
        .concat(['custom'])
    })

    if (release === 'custom') {
      /** @type {{ version: string }} */
      const result = await prompt({
        type: 'input',
        name: 'version',
        message: 'Enter custom version number',
        initial: currentVersion
      })
      targetVersion = result.version
    } else {
      targetVersion = release.match(/\((.*)\)/)?.[1] ?? ''
    }
  }

  // @ts-expect-error
  if (versionIncrements.includes(targetVersion)) {
    // @ts-expect-error
    targetVersion = inc(targetVersion)
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`)
  }

  if (!skipPrompts) {
    /** @type {{ yes: boolean }} */
    const { yes: confirmRelease } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Release v${targetVersion}, confirm to continue?`
    })

    if (!confirmRelease) {
      return
    }
  }

  step(`Releasing v${targetVersion}...`)

  // Run tests
  if (!skipTests) {
    step('\nRunning tests...')
    if (!isDryRun) {
      await run('pnpm', ['test:run'])
    } else {
      console.log('Skipped (dry run)')
    }
  } else {
    step('Skip tests')
  }

  // Update version
  step('\nUpdating version...')
  updateVersion(targetVersion)

  // Generate changelog
  step('\nGenerating changelog...')
  await run('pnpm', ['run', 'changelog'])

  if (!skipPrompts) {
    /** @type {{ yes: boolean }} */
    const { yes: changelogOk } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: 'Changelog generated. Does it look good?'
    })

    if (!changelogOk) {
      return
    }
  }

  // Build project
  if (!skipBuild) {
    step('\nBuilding project...')
    if (!isDryRun) {
      await run('pnpm', ['build'])
    } else {
      console.log('Skipped (dry run)')
    }
  } else {
    step('Skip build')
  }

  // Code check
  step('\nRunning code check...')
  if (!isDryRun) {
    await run('pnpm', ['lint:check'])
  } else {
    console.log('Skipped (dry run)')
  }

  if (!skipGit) {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      step('\nCommitting changes...')
      await runIfNotDry('git', ['add', '-A'])
      await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit')
    }

    step('\nPushing to remote repository...')
    await runIfNotDry('git', ['tag', `v${targetVersion}`])
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await runIfNotDry('git', ['push'])
  }

  // Publish to npm
  step('\nPublishing to npm...')
  if (!isDryRun) {
    await run('pnpm', ['publish', '--access', 'public'], { cwd: path.resolve(__dirname, '../dist') })
    console.log(pico.green(`Successfully published ${targetVersion}`))
  } else {
    console.log('Skipped (dry run)')
  }

  if (isDryRun) {
    console.log('\nDry run completed - run git diff to see changes')
  }
}

function updateVersion(version) {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
