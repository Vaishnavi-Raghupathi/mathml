type ConceptCheckpointProps = {
  items: string[]
  reflection: string
}

const monoFont = '"IBM Plex Mono", monospace'
const serifFont = '"IBM Plex Serif", serif'

const ConceptCheckpoint = ({ items, reflection }: ConceptCheckpointProps) => {
  return (
    <section className="w-full" aria-label="Concept checkpoint section">
      <div className="h-px w-full" style={{ backgroundColor: '#1E2D42' }} />

      <div
        className="mt-4 text-[11px] uppercase tracking-[0.12em]"
        style={{
          fontFamily: monoFont,
          color: '#3D5068'
        }}
      >
        you now understand
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={`${index + 1}-${item}`} className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2">
            <span
              className="text-[15px] leading-[1.8]"
              style={{
                fontFamily: monoFont,
                color: '#3D5068'
              }}
            >
              –
            </span>
            <p className="m-0 text-[16px] leading-[1.8] text-text-primary" style={{ fontFamily: serifFont }}>
              {item}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div
          className="text-[12px]"
          style={{
            fontFamily: monoFont,
            color: '#3D5068'
          }}
        >
          consider:
        </div>

        <p
          className="mt-2 m-0 text-[16px] italic leading-[1.8]"
          style={{
            fontFamily: serifFont,
            color: '#7A8FA8'
          }}
        >
          {reflection}
        </p>
      </div>

      <div className="mt-6 h-px w-full" style={{ backgroundColor: '#1E2D42' }} />
    </section>
  )
}

export default ConceptCheckpoint
