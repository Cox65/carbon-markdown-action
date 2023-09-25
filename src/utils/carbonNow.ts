import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'

const execPromise = promisify(exec)

export const carbonNow = async (
  sourceFile: string,
  targetFolder: string,
  targetFile: string
) => {
  const resultFilePath = path.join(targetFolder, targetFile + '.png')
  await execPromise(
    `npx carbon-now ${sourceFile} --engine webkit --save-to ${targetFolder} --save-as ${targetFile} --config carbon-config.json -p hacker`
  )
  return resultFilePath
}
