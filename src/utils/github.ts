const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_REF_NAME } = process.env

export const buildGithubFileUrl = (filePath: string, urlType: 'blob' | 'raw') =>
  `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/${urlType}/${GITHUB_REF_NAME}/${filePath}`
