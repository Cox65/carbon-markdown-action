import { exec } from '@actions/exec'
import path from 'path'

export type CarbonNowParams = {
  sourceFile: string
  targetFolder: string
  targetFile: string
  configFile: string
  preset: string
}

export const carbonNow = async ({
  sourceFile,
  targetFolder,
  targetFile,
  configFile,
  preset
}: CarbonNowParams) => {
  const resultFilePath = path.join(targetFolder, targetFile + '.png')
  await exec(
    `carbon-now ${sourceFile} --save-to ${targetFolder} --save-as ${targetFile} --config ${configFile} -p ${preset}`
  )
  return resultFilePath
}
