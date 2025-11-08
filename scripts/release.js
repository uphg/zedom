import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import enquirer from 'enquirer'
import pc from 'picocolors'
import semver from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const argv = minimist(process.argv.slice(2))
const dryRun = argv.dry || argv['dry-run']

run()

async function run() {
  try {
    console.log(pc.dim('Reading package info...'))
    
    const packageJsonPath = path.resolve(__dirname, '../package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    const currentVersion = packageJson.version

    console.log(pc.dim(`Current version: ${currentVersion}`))

    if (!dryRun) {
      const { releaseType } = await enquirer.prompt({
        type: 'select',
        name: 'releaseType',
        message: 'Select release type:',
        choices: [
          { name: 'patch', message: `patch (${semver.inc(currentVersion, 'patch')})` },
          { name: 'minor', message: `minor (${semver.inc(currentVersion, 'minor')})` },
          { name: 'major', message: `major (${semver.inc(currentVersion, 'major')})` }
        ]
      })

      const newVersion = semver.inc(currentVersion, releaseType)
      console.log(pc.dim(`New version: ${newVersion}`))

      const { confirm } = await enquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Release version ${newVersion}?`
      })

      if (!confirm) {
        console.log(pc.yellow('Release cancelled'))
        return
      }

      // Update version in package.json
      packageJson.version = newVersion
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

      // Build the project
      console.log(pc.dim('Building project...'))
      await execa('pnpm', ['build'], { stdio: 'inherit' })

      // Git commit and tag
      console.log(pc.dim('Creating git commit and tag...'))
      await execa('git', ['add', '.'], { stdio: 'inherit' })
      await execa('git', ['commit', '-m', `release: v${newVersion}`], { stdio: 'inherit' })
      await execa('git', ['tag', `-a`, `v${newVersion}`, `-m`, `v${newVersion}`], { stdio: 'inherit' })

      console.log(pc.green('✓') + pc.bold(` Release v${newVersion} completed successfully!`))
      console.log(pc.dim('Run the following commands to push the release:'))
      console.log(pc.dim(`git push origin master`))
      console.log(pc.dim(`git push origin v${newVersion}`))
    } else {
      console.log(pc.blue('DRY RUN: No changes made'))
    }
  }
  catch(error) {
    console.error(pc.red('✗') + pc.bold(' Release failed: ') + pc.red(error.message))
    process.exit(1)
  }
}