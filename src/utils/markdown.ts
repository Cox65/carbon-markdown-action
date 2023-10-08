export type MarkdownImageProps = {
  imageUrl: string
  altText: string
}

export type MarkdownLinkProps = {
  linkUrl: string
  content: string
}

export const buildMarkdownImage = ({ imageUrl, altText }: MarkdownImageProps) =>
  `![${altText}](${imageUrl})`

export const buildMarkdownLink = ({ linkUrl, content }: MarkdownLinkProps) =>
  `<a href="${linkUrl}" target="_blank">${content}</a>`
