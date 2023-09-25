import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import { replaceAsync } from './utils/replaceAsync'
import { promisify } from 'util'
import { exec } from 'child_process'
import { clipboard } from 'clipboard-sys'

export const run = async () => {
  try {
    const ms: string = core.getInput('milliseconds')

    core.debug(new Date().toTimeString())

    const toto = fs.readFileSync(
      path.join(__dirname, '../README.md.template'),
      'utf8'
    )
    const execPromise = promisify(exec)

    const template = await replaceAsync(toto, /📷(.*)📷/g, async match => {
      await execPromise('carbon-now ' + match + ' --to-clipboard')
      const image = await clipboard.readImage()

      return (
        '![' +
        match +
        '](data:image/png;base64,' +
        image.toString('base64') +
        ')'
      )
    })

    console.log(template)

    fs.writeFileSync(path.join(__dirname, '../README.md'), template)

    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
