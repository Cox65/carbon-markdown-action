import * as core from '@actions/core'

import * as fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import * as shortuuid from 'short-uuid'
import { carbonNow } from './utils/carbonNow'
import { buildGithubFileUrl } from './utils/github'
import { buildMarkdownImage, buildMarkdownLink } from './utils/markdown'

const CARBON_REGEX = /(\[(\{[\s\S]*?\})\]: 🎨)(?:\r?\n(.*!\[🎨.*))?/gm

type CarbonDefinition = {
  filename: string
  preset?: string
}

type ReplacementOperation = {
  search: string
  value: string
}

export const run = async () => {
  try {
    core.debug(new Date().toTimeString())

    const searchPatterns = process.env.SEARCH_PATTERNS!
    const ignorePatterns = process.env.IGNORE_PATTERNS!
    const outputFolderName = process.env.OUTPUT_FOLDER_NAME!
    const carbonConfigFile = process.env.CARBON_CONFIG_FILE!
    const defaultCarbonPreset = process.env.DEFAULT_CARBON_PRESET!

    core.debug(searchPatterns.toString())
    core.debug(ignorePatterns.toString())
    core.debug(outputFolderName)
    core.debug(carbonConfigFile)
    core.debug(defaultCarbonPreset)
    const markdownFiles = await glob(searchPatterns, {
      ignore: ignorePatterns
    })

    await Promise.all(
      markdownFiles.map(async markdownFile => {
        core.info('Processing ' + markdownFile)

        const templateFileContent = fs.readFileSync(markdownFile, 'utf8')
        const matches = [...templateFileContent.matchAll(CARBON_REGEX)]
        const carbonTargetFolder = path.join(
          path.dirname(markdownFile),
          outputFolderName
        )

        fs.rmSync(carbonTargetFolder, { recursive: true, force: true })

        const replacements = await Promise.all(
          matches.map(async match => {
            const [
              ,
              carbonFullTag,
              carbonDefinitionString,
              existingCarbonResult
            ] = match

            const uuid = shortuuid.generate()
            const carbonDefinition = JSON.parse(
              carbonDefinitionString
            ) as CarbonDefinition

            const filePath = path.join(
              path.dirname(markdownFile),
              carbonDefinition.filename
            )

            const linkUrl = buildGithubFileUrl(filePath, 'blob')

            const targetFolder = path.join(carbonTargetFolder, uuid)

            core.info('Deleting folder  ' + targetFolder)

            const imageUrl = buildGithubFileUrl(
              await carbonNow({
                sourceFile: filePath,
                targetFolder,
                targetFile: path.basename(carbonDefinition.filename),
                configFile: carbonConfigFile,
                preset: carbonDefinition.preset ?? defaultCarbonPreset
              }),
              'raw'
            )

            const value = `${buildMarkdownLink({
              content: buildMarkdownImage({
                altText: '🎨' + carbonDefinition.filename,
                imageUrl: imageUrl
              }),
              linkUrl: linkUrl
            })}`

            return {
              search: existingCarbonResult
                ? existingCarbonResult
                : carbonFullTag,
              value: existingCarbonResult
                ? value
                : carbonFullTag + '\r\n' + value
            } as ReplacementOperation
          })
        )
        const transformedContent = replacements.reduce(
          (transformedText, replacement) => {
            return transformedText.replace(
              replacement.search,
              replacement.value
            )
          },
          templateFileContent
        )

        fs.writeFileSync(markdownFile, transformedContent)
      })
    )

    core.debug(new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
