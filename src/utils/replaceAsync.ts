export const replaceAsync = async (
  str: string,
  regex: RegExp,
  asyncFn: (match: string) => Promise<string>
) => {
  const matches = Array.from(str.matchAll(regex))
  if (!matches) {
    return str
  }
  const data = await Promise.all(matches.map(match => asyncFn(match[1])))
  return str.replace(regex, () => data.shift() ?? '')
}
