import * as core from '@actions/core'
import * as fs from 'fs'
import { glob } from 'glob'
import { carbonNow } from './utils/carbonNowInBase64'
import { replaceAsync } from './utils/replaceAsync'

export const run = async () => {
  try {
    const ms: string = core.getInput('milliseconds')

    core.debug(new Date().toTimeString())

    const templateFiles = await glob('**/*.md.template')

    await Promise.all(
      templateFiles.map(async templateFile => {
        core.debug('Processing ' + templateFile)
        const templateFileContent = fs.readFileSync(templateFile, 'utf8')
        const targetFileName = templateFile.replace('.template', '')
        const targetFileNameContent = await replaceAsync(
          templateFileContent,
          /📷(.*)📷/g,
          async match =>
            `![${match}](${await carbonNow(match, 'images', 'test')})`
        )

        core.debug('Writing ' + targetFileName)
        fs.writeFileSync(targetFileName, targetFileNameContent)
      })
    )

    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
