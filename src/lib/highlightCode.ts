const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const pythonKeywordRegex = /\b(import|from|def|return|for|in|if|else|lambda|class|with|as|True|False|None|and|or|not)\b/g
const functionCallRegex = /\b([A-Za-z_]\w*)(?=\s*\()/g
const numberRegex = /(?<![\w.])(\d+(?:\.\d+)?)(?![\w.])/g

const wrap = (color: string, text: string) => `<span style="color: ${color};">${text}</span>`

export const highlightCode = (code: string): string => {
  const isNarrativeLine = (line: string) => {
    const trimmed = line.trim()

    if (trimmed.length === 0) {
      return false
    }

    if (trimmed.startsWith('#')) {
      return false
    }

    if (/^(import|from|def|return|for|if|else|lambda|class|with)\b/.test(trimmed)) {
      return false
    }

    if (/[=()[\]{}.,]/.test(trimmed)) {
      return false
    }

    return /[A-Za-z]/.test(trimmed)
  }

  const highlightCodeLine = (line: string) => {
    const comments: string[] = []
    const strings: string[] = []
    const htmlTokens: string[] = []

    let working = line

    // 1) comments first
    working = working.replace(/#.*$/g, (match) => {
      const token = `__COMMENT_${comments.length}__`
      comments.push(match)
      return token
    })

    // 2) strings
    working = working.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => {
      const token = `__STRING_${strings.length}__`
      strings.push(match)
      return token
    })

    working = escapeHtml(working)

    const insertHtmlToken = (html: string) => {
      const token = `__HTML_${htmlTokens.length}__`
      htmlTokens.push(html)
      return token
    }

    // 3) keywords
    working = working.replace(pythonKeywordRegex, (match) => insertHtmlToken(wrap('#7AA2F7', match)))

    // 4) function calls
    working = working.replace(functionCallRegex, (match) => insertHtmlToken(wrap('#7DCFFF', match)))

    // 5) numbers
    working = working.replace(numberRegex, (_, value: string) => insertHtmlToken(wrap('#FF9E64', value)))

    working = working.replace(/__STRING_(\d+)__/g, (_, index: string) => wrap('#9ECE6A', escapeHtml(strings[Number(index)])))
    working = working.replace(/__COMMENT_(\d+)__/g, (_, index: string) => wrap('#3D5068', escapeHtml(comments[Number(index)])))
    working = working.replace(/__HTML_(\d+)__/g, (_, index: string) => htmlTokens[Number(index)])

    return working
  }

  return code
    .split('\n')
    .map((line) => {
      if (line.trim().length === 0) {
        return '&nbsp;'
      }

      if (isNarrativeLine(line)) {
        return `<span style="display: inline-block; color: #7A8FA8; font-style: italic; opacity: 0.92;">${escapeHtml(line)}</span>`
      }

      return highlightCodeLine(line)
    })
    .join('\n')
}
