import { exec } from 'child_process'
import { readFileSync, rmSync } from 'fs'
import * as os from 'os'
import path from 'path'
import uniqueString from 'unique-string'
import { promisify } from 'util'

const execPromise = promisify(exec)

export const carbonNowInBase64 = async (fileName: string) => {
  const resultFileName = uniqueString()
  const resultFilePath = path.join(os.tmpdir(), resultFileName + '.png')
  await execPromise(
    `carbon-now ${fileName} --save-to ${os.tmpdir()} --save-as ${resultFileName} --config carbon-config.json -p hacker`
  )
  const buffer = readFileSync(resultFilePath)
  rmSync(resultFilePath)
  return buffer.toString('base64')
}

export const carbonNow = async (
  sourceFile: string,
  targetFolder: string,
  targetFile: string
) => {
  const resultFilePath = path.join(targetFolder, targetFile + '.png')
  await execPromise(
    `carbon-now ${sourceFile} --save-to ${targetFolder} --save-as ${targetFile} --config carbon-config.json -p hacker`
  )
  return resultFilePath
}
