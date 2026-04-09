import { useMemo, useState } from 'react'

type Movie = {
  name: string
  vector: [number, number, number]
}

const MOVIES: Movie[] = [
  { name: 'Titanic', vector: [0.88, 0.35, 0.2] },
  { name: 'The Dark Knight', vector: [0.15, 0.92, 0.18] },
  { name: 'La La Land', vector: [0.82, 0.12, 0.55] },
  { name: 'Mad Max: Fury Road', vector: [0.08, 0.97, 0.1] },
  { name: 'The Princess Bride', vector: [0.75, 0.45, 0.8] }
]

const mono = '"IBM Plex Mono", monospace'

const fmt = (n: number) => n.toFixed(2)

const distance = (a: [number, number, number], b: [number, number, number]) => {
  const d0 = a[0] - b[0]
  const d1 = a[1] - b[1]
  const d2 = a[2] - b[2]
  return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2)
}

export default function VectorBuilder() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [romance, setRomance] = useState(0.5)
  const [action, setAction] = useState(0.5)
  const [comedy, setComedy] = useState(0.5)
  const [compared, setCompared] = useState(false)

  const userVector = useMemo(() => [romance, action, comedy] as [number, number, number], [romance, action, comedy])

  const moved = useMemo(() => romance !== 0.5 || action !== 0.5 || comedy !== 0.5, [romance, action, comedy])

  const reference = selectedIndex != null ? MOVIES[selectedIndex].vector : null

  const distToReference = useMemo(() => (reference ? distance(userVector, reference) : null), [userVector, reference])

  const ranked = useMemo(() => {
    if (!selectedIndex && selectedIndex !== 0) {
      // no selection: compute distances anyway
    }
    return MOVIES.map((m) => ({ ...m, dist: distance(userVector, m.vector) })).sort((a, b) => a.dist - b.dist)
  }, [userVector])

  const handleSelect = (i: number) => {
    setSelectedIndex(i)
    setCompared(false)
  }

  const handleCompare = () => {
    setCompared(true)
  }

  return (
    <div className="w-full">
      <div className="mb-3" style={{ fontFamily: mono }}>
        <div className="text-[12px] text-text-muted uppercase tracking-widest">EXERCISE 01</div>
      </div>

      <hr className="border-t border-border" />

      <div className="py-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap gap-3">
              {MOVIES.map((m, i) => {
                const selected = i === selectedIndex
                return (
                  <button
                    key={m.name}
                    onClick={() => handleSelect(i)}
                    className={`text-[13px] font-medium ${selected ? 'text-text-primary' : 'text-text-muted'} border px-3 py-1`}
                    style={{
                      fontFamily: mono,
                      background: 'transparent',
                      borderWidth: '1px',
                      borderColor: selected ? 'var(--accent)' : 'var(--border)',
                      outline: 'none'
                    }}
                  >
                    {m.name}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedIndex != null && (
            <div className="flex flex-col gap-4">
              {[
                { label: 'Romance', value: romance, onChange: (v: number) => setRomance(v) },
                { label: 'Action', value: action, onChange: (v: number) => setAction(v) },
                { label: 'Comedy', value: comedy, onChange: (v: number) => setComedy(v) }
              ].map((s) => {
                const pct = Math.round(s.value * 100)
                return (
                  <div key={s.label} className="grid grid-cols-1 gap-2 sm:grid-cols-[8rem_1fr_5rem] sm:items-center sm:gap-4">
                    <div style={{ fontFamily: mono }} className="text-[13px] text-text-secondary sm:w-32">
                      {s.label}
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={s.value}
                      onChange={(e) => s.onChange(Number(e.target.value))}
                      style={{
                        // fill using linear-gradient reflecting value
                        background: `linear-gradient(90deg, var(--accent) ${pct}%, var(--surface-raised) ${pct}%)`,
                        height: 6,
                        flex: 1,
                        appearance: 'none' as const,
                        WebkitAppearance: 'none' as const,
                        accentColor: 'var(--accent)'
                      }}
                      className="rounded-full"
                    />

                    <div style={{ fontFamily: mono }} className="text-[13px] text-text-primary sm:w-20 sm:text-right">
                      {fmt(s.value)}
                    </div>
                  </div>
                )
              })}

              <div style={{ fontFamily: mono }} className="text-[15px] text-text-primary">
                your vector = [{fmt(userVector[0])}, {fmt(userVector[1])}, {fmt(userVector[2])}]
              </div>

              {moved && (
                <div>
                  <button
                    onClick={handleCompare}
                    style={{ fontFamily: mono }}
                    className="text-[13px] text-text-primary border px-3 py-1"
                  >
                    Compare
                  </button>
                </div>
              )}

              {compared && reference && (
                <div className="mt-4 flex flex-col gap-2">
                  <div style={{ fontFamily: mono }} className="text-[15px] text-text-secondary">
                    reference vector = [{fmt(reference[0])}, {fmt(reference[1])}, {fmt(reference[2])}]
                  </div>

                  <div style={{ fontFamily: mono }} className="text-[13px] text-text-muted">
                    distance from reference: {fmt(distToReference ?? 0)}
                  </div>

                  <div className="italic text-[15px] text-text-secondary" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
                    {distToReference !== null && distToReference < 0.2
                      ? 'Your representation is close to the reference. You and the model agree on this movie.'
                      : distToReference !== null && distToReference <= 0.5
                      ? 'Your representation differs from the reference. Neither is wrong; you weighted dimensions differently.'
                      : 'Large disagreement. This is interesting: what dimension drove the difference?'}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div style={{ fontFamily: mono }} className="text-[12px] text-text-muted uppercase tracking-widest">
                  MOST SIMILAR FROM THE SET
                </div>

                <div className="mt-3 overflow-x-auto">
                  <div className="min-w-[560px]">
                    <div className="flex border-b border-border text-[11px] text-text-muted uppercase" style={{ fontFamily: mono }}>
                      <div className="w-48 py-3">movie</div>
                      <div className="flex-1 py-3">vector</div>
                      <div className="w-36 py-3 text-right">distance</div>
                    </div>

                    {ranked.map((r) => {
                      const isClosest = ranked[0].name === r.name
                      return (
                        <div key={r.name} className="flex items-center border-b border-border" style={{ fontFamily: mono }}>
                          <div className={`w-48 py-3 text-[13px] ${isClosest ? 'text-text-primary' : 'text-text-secondary'}`}>{r.name}</div>
                          <div className={`flex-1 py-3 text-[13px] ${isClosest ? 'text-text-primary' : 'text-text-secondary'}`}>
                            [{fmt(r.vector[0])}, {fmt(r.vector[1])}, {fmt(r.vector[2])}]
                          </div>
                          <div className={`w-36 py-3 text-right text-[13px] ${isClosest ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {fmt(r.dist)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 italic text-[15px] text-text-secondary" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
                  This is how recommendation systems work. Nearest neighbors in vector space.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-t border-border" />
    </div>
  )
}
