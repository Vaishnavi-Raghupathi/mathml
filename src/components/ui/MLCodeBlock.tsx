import { highlightCode } from '../../lib/highlightCode'

type LineAnnotation = {
  lineNumber: number
  annotation: string
}

type MLCodeBlockProps = {
  sectionLabel?: string
  context: string
  language?: 'python'
  code: string
  lineAnnotations?: LineAnnotation[]
  closingLine: string
}

const monoFont = '"IBM Plex Mono", monospace'
const serifFont = '"IBM Plex Serif", serif'
const CODE_FONT_SIZE_PX = 14
const CODE_LINE_HEIGHT_PX = 26.6

const MLCodeBlock = ({
  sectionLabel = 'in real ml code',
  context,
  language = 'python',
  code,
  lineAnnotations = [],
  closingLine
}: MLCodeBlockProps) => {
  const highlighted = highlightCode(code)
  const highlightedLines = highlighted.split('\n')
  const sortedAnnotations = [...lineAnnotations].sort((a, b) => a.lineNumber - b.lineNumber)

  return (
    <section className="w-full" aria-label="In real ML code section">
      <div className="h-px w-full" style={{ backgroundColor: '#1E2D42' }} />

      <div
        className="mt-4 text-[11px] uppercase tracking-[0.12em]"
        style={{
          fontFamily: monoFont,
          color: '#3D5068'
        }}
      >
        {sectionLabel}
      </div>

      <p
        className="mt-4 max-w-[620px] text-[16px] italic leading-[1.8]"
        style={{
          fontFamily: serifFont,
          color: '#7A8FA8'
        }}
      >
        {context}
      </p>

      <div
        className="mt-6 overflow-x-auto rounded-[4px] border p-4"
        style={{
          backgroundColor: '#0A1628',
          borderColor: '#1E2D42'
        }}
      >
        <div
          className="m-0"
          style={{
            fontFamily: monoFont,
            fontSize: `${CODE_FONT_SIZE_PX}px`,
            lineHeight: CODE_LINE_HEIGHT_PX / CODE_FONT_SIZE_PX,
            color: '#E8EDF5',
            whiteSpace: 'pre'
          }}
          data-language={language}
        >
          {highlightedLines.map((lineHtml, index) => (
            <div key={`code-line-${index + 1}`} className="grid grid-cols-[38px_minmax(0,1fr)]">
              <span
                className="select-none pr-3 text-right text-[11px]"
                style={{
                  color: '#3D5068',
                  fontFamily: monoFont,
                  borderRight: '1px solid #1E2D42'
                }}
              >
                {index + 1}
              </span>

              <span className="block pl-3" dangerouslySetInnerHTML={{ __html: lineHtml }} />
            </div>
          ))}
        </div>
      </div>

      {sortedAnnotations.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {sortedAnnotations.map((item) => (
            <div key={`${item.lineNumber}-${item.annotation}`}>
              <p
                className="m-0 text-[14px] italic leading-[1.7]"
                style={{
                  fontFamily: serifFont,
                  color: '#7A8FA8'
                }}
              >
                <span style={{ fontFamily: monoFont, color: '#3D5068' }}>{item.lineNumber.toString().padStart(2, '0')} </span>
                {item.annotation}
              </p>
            </div>
          ))}
        </div>
      )}

      <p
        className="mt-6 m-0 text-[14px] leading-[1.8]"
        style={{
          fontFamily: monoFont,
          color: '#E8EDF5'
        }}
      >
        {closingLine}
      </p>

      <div className="mt-6 h-px w-full" style={{ backgroundColor: '#1E2D42' }} />
    </section>
  )
}

export default MLCodeBlock
