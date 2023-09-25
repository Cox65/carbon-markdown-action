const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_REF_NAME } = process.env

export const buildGithubFileUrl = (filePath: string) =>
  `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/raw/${GITHUB_REF_NAME}/${filePath}`
