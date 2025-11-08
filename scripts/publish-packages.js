import path from 'path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import pc from 'picocolors'
import { getPackageEntries } from './helpers/get-package-entries.js'
import { hyphenate } from './helpers/hyphenate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const npmPackagesDir = path.resolve(__dirname, '../npm-packages')

run()

async function run() {
  try {
    console.log(pc.dim('Publishing individual packages...'))

    // 获取所有函数条目
    const entries = Object.keys(getPackageEntries())

    // 为每个包运行发布
    const publishResults = []
    for (const functionName of entries) {
      const packageDir = path.join(npmPackagesDir, functionName)
      const packageJsonPath = path.join(packageDir, 'package.json')
      
      if (fs.existsSync(packageJsonPath)) {
        const hyphName = hyphenate(functionName)
        console.log(pc.dim(`Publishing @fun-demo/${hyphName}...`))

        try {
          // 进入包目录并发布
          await execa('npm', ['publish'], {
            cwd: packageDir,
            stdio: 'inherit'
          })
          publishResults.push({ functionName, success: true })
          console.log(pc.green('✓') + pc.dim(` @fun-demo/${hyphName} published successfully!`))
        } catch (error) {
          publishResults.push({ functionName, success: false, error: error.message })
          console.log(pc.red('✗') + pc.dim(` Failed to publish @fun-demo/${hyphName}: ${error.message}`))
        }
      } else {
        console.log(pc.yellow('(!)') + pc.dim(` Package not found for ${functionName}: ${packageJsonPath}`))
      }
    }

    // 统计发布结果
    const successful = publishResults.filter(r => r.success).length
    const failed = publishResults.filter(r => !r.success).length

    console.log(pc.dim('\nPublish Summary:'))
    console.log(pc.green('✓') + pc.dim(` Successful publishes: ${successful}`))
    if (failed > 0) {
      console.log(pc.red('✗') + pc.dim(` Failed publishes: ${failed}`))
    }

    if (failed === 0) {
      console.log(pc.green('✓') + pc.bold(' All packages published successfully!'))
    } else {
      console.log(pc.red('✗') + pc.bold(' Some packages failed to publish!'))
      process.exit(1)
    }
  }
  catch(error) {
    console.error(pc.red('✗') + pc.bold(' Publish failed: ') + pc.red(error.message))
    process.exit(1)
  }
}