import * as core from '@actions/core'
import * as fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import simpleGit from 'simple-git'
import { carbonNow } from './utils/carbonNow'
import { buildGithubFileUrl } from './utils/github'
import { buildMarkdownImage, buildMarkdownLink } from './utils/markdown'
import { replaceAsync } from './utils/replaceAsync'

const CARBON_IMAGES_FOLDER = 'carbon'
const git = simpleGit()

export const run = async () => {
  try {
    core.debug(new Date().toTimeString())

    const markdownFiles = await glob('**/*.md')

    fs.rmSync(CARBON_IMAGES_FOLDER, { recursive: true, force: true })

    await Promise.all(
      markdownFiles.map(async markdownFile => {
        core.debug('Processing ' + markdownFile)
        const templateFileContent = fs.readFileSync(markdownFile, 'utf8')
        const targetFileNameContent = await replaceAsync(
          templateFileContent,
          /\[(📷.*)\]\((.*)\)/g,
          async match => {
            const filename = match[1].replace('📷', '')
            const linkUrl = buildGithubFileUrl(filename)
            const imageUrl = buildGithubFileUrl(
              await carbonNow(
                filename,
                path.join(CARBON_IMAGES_FOLDER, path.dirname(filename)),
                path.basename(filename)
              )
            )

            return `${buildMarkdownLink({
              content: buildMarkdownImage({
                altText: match[1],
                imageUrl: imageUrl
              }),
              linkUrl: linkUrl
            })})`
          }
        )
        fs.writeFileSync(markdownFile, targetFileNameContent)
      })
    )

    await git
      .addConfig('user.email', 'users.noreply@github.com')
      .addConfig('user.name', 'Github actions')

    await git.add('-A')

    await git.commit('files changed')

    await git.push(undefined, undefined, {
      '--force-with-lease': ''
    })

    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
