import { exec } from '@actions/exec'
import path from 'path'

export const carbonNow = async (
  sourceFile: string,
  targetFolder: string,
  targetFile: string
) => {
  const resultFilePath = path.join(targetFolder, targetFile + '.png')
  await exec(
    `npx carbon-now ${sourceFile} --engine webkit --save-to ${targetFolder} --save-as ${targetFile} --config carbon-config.json -p hacker`
  )
  return resultFilePath
}
