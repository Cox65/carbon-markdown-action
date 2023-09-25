export const replaceAsync = async (
  str: string,
  regex: RegExp,
  asyncFn: (match: RegExpMatchArray) => Promise<string>
) => {
  const matches = Array.from(str.matchAll(regex))
  if (!matches) {
    return str
  }
  const data = await Promise.all(matches.map(match => asyncFn(match)))
  return str.replace(regex, () => data.shift() ?? '')
}
