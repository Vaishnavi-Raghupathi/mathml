import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type Vec2 = [number, number]

const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

const visSize = 300
const visPad = 30
const visMin = -3
const visMax = 3
const visPlot = visSize - visPad * 2

const toX = (x: number) => visPad + ((x - visMin) / (visMax - visMin)) * visPlot
const toY = (y: number) => visPad + ((visMax - y) / (visMax - visMin)) * visPlot

const arrowHead = (from: Vec2, to: Vec2) => {
  const fromX = toX(from[0])
  const fromY = toY(from[1])
  const toXv = toX(to[0])
  const toYv = toY(to[1])

  const angle = Math.atan2(toYv - fromY, toXv - fromX)
  const length = 10
  const width = 5

  const leftX = toXv - length * Math.cos(angle) + width * Math.sin(angle)
  const leftY = toYv - length * Math.sin(angle) - width * Math.cos(angle)
  const rightX = toXv - length * Math.cos(angle) - width * Math.sin(angle)
  const rightY = toYv - length * Math.sin(angle) + width * Math.cos(angle)

  return `${toXv},${toYv} ${leftX},${leftY} ${rightX},${rightY}`
}

const toVector = (angleDeg: number, mag: number): Vec2 => {
  const theta = (angleDeg * Math.PI) / 180
  return [Math.cos(theta) * mag, Math.sin(theta) * mag]
}

const wedgePath = (startAngleDeg: number, endAngleDeg: number, radius: number) => {
  const start = toVector(startAngleDeg, radius)
  const end = toVector(endAngleDeg, radius)
  return `M ${toX(0)} ${toY(0)} L ${toX(start[0])} ${toY(start[1])} A ${((radius / (visMax - visMin)) * visPlot).toFixed(2)} ${((radius / (visMax - visMin)) * visPlot).toFixed(2)} 0 0 1 ${toX(end[0])} ${toY(end[1])} Z`
}

const LinearCombinationFailures = () => {
  const [visibleStep, setVisibleStep] = useState(1)
  const [showHealthyInit, setShowHealthyInit] = useState(false)

  const clusteredAngles = [22.5, 24.5, 26, 28.5, 30, 32.5, 34.5, 37]
  const spreadAngles = [0, 45, 90, 135, 180, 225, 270, 315]
  const magnitudes = [2.5, 2.2, 2.6, 2.3, 2.7, 2.1, 2.4, 2.55]
  const vectorColors = ['#1a56db', '#2f66df', '#4777e3', '#5a86e7', '#6d95ea', '#80a4ee', '#8dafef', '#93b4f0']

  const failure1Vectors = useMemo(
    () =>
      (showHealthyInit ? spreadAngles : clusteredAngles).map((angle, idx) => ({
        to: toVector(angle, magnitudes[idx]),
        color: vectorColors[idx]
      })),
    [showHealthyInit]
  )

  const query: Vec2 = [2, 1]
  const key1: Vec2 = [1.9, 1.1]
  const key2: Vec2 = [1.8, 1.2]
  const key3: Vec2 = [-1, 2]

  return (
    <section className="max-w-[900px] space-y-10">
      <p className="text-[17px] leading-[1.8] text-[#1e2d42]">
        Linear combinations are so fundamental that their failures are everywhere. Three of them appear in almost
        every ML system ever built.
      </p>

      <AnimatePresence>
        {visibleStep >= 1 && (
          <motion.article
            variants={cardAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-[680px] space-y-5 rounded-[4px] border p-8"
              style={{ background: 'transparent', borderColor: 'var(--border)' }}
          >
            <div>
              <p
                className="mb-2 text-[11px] font-semibold uppercase"
                style={{ color: '#e07b39', letterSpacing: '1.5px' }}
              >
                FAILURE 01
              </p>
              <h3 className="text-[24px] font-semibold text-[#1a1f36]">Representational Collapse</h3>
            </div>

            <p className="text-[15px] leading-[1.8] text-[#1e2d42]">
              An embedding model is trained on a small dataset. After training, most token embedding vectors have
              drifted to nearly the same direction. The model achieves low training loss. On new data it cannot
              distinguish between concepts that should be different. Accuracy is near random.
            </p>

            <div className="mx-auto w-full max-w-[300px] space-y-3">
              <svg viewBox={`0 0 ${visSize} ${visSize}`} width={300} height={300} className="block h-auto w-full" role="img" aria-label="Representational collapse span visualization">
                <rect x="0" y="0" width={visSize} height={visSize} fill="transparent" />

                {Array.from({ length: 7 }, (_, i) => i - 3).map((x) => (
                  <line key={`f1-gx-${x}`} x1={toX(x)} y1={toY(visMin)} x2={toX(x)} y2={toY(visMax)} stroke="var(--border-strong)" strokeWidth="1" />
                ))}
                {Array.from({ length: 7 }, (_, i) => i - 3).map((y) => (
                  <line key={`f1-gy-${y}`} x1={toX(visMin)} y1={toY(y)} x2={toX(visMax)} y2={toY(y)} stroke="var(--border-strong)" strokeWidth="1" />
                ))}

                <line x1={toX(0)} y1={toY(visMin)} x2={toX(0)} y2={toY(visMax)} stroke="var(--border)" strokeWidth="1" />
                <line x1={toX(visMin)} y1={toY(0)} x2={toX(visMax)} y2={toY(0)} stroke="var(--border)" strokeWidth="1" />

                <motion.path
                  d={wedgePath(22.5, 37, 2.9)}
                  fill="rgba(29,78,216,0.06)"
                  initial={false}
                  animate={{ opacity: showHealthyInit ? 0 : 1 }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                />

                <motion.circle
                  cx={toX(0)}
                  cy={toY(0)}
                  r={(2.9 / (visMax - visMin)) * visPlot}
                  fill="rgba(29,78,216,0.06)"
                  initial={false}
                  animate={{ opacity: showHealthyInit ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                />

                {failure1Vectors.map((vector, idx) => (
                  <g key={`f1-v-${idx}`}>
                    <line x1={toX(0)} y1={toY(0)} x2={toX(vector.to[0])} y2={toY(vector.to[1])} stroke={vector.color} strokeWidth="2" />
                    <polygon points={arrowHead([0, 0], vector.to)} fill={vector.color} />
                  </g>
                ))}

                <text
                  x={toX(0)}
                  y={toY(2.55)}
                  textAnchor="middle"
                  fontSize="13"
                  fill="var(--accent)"
                  fontFamily="Inter, sans-serif"
                >
                  {showHealthyInit ? 'span: all of ℝ²' : 'span: a thin wedge of ℝ²'}
                </text>
              </svg>

              <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {showHealthyInit
                  ? 'Same eight vectors, spread out. Full expressive range.'
                  : 'Eight vectors. Almost no expressive range.'}
              </p>
            </div>

            {!showHealthyInit && (
              <button
                type="button"
                onClick={() => setShowHealthyInit(true)}
                className="rounded-[4px] border px-4 py-2 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'transparent' }}
              >
                Show healthy initialization
              </button>
            )}

            <div className="callout-warning">
              <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
                Representational collapse is why contrastive learning methods like SimCLR add explicit loss terms that
                push representations apart. The math is trying to maximize span, not just minimize prediction error.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(2)}
              className="rounded-[4px] px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--accent)' }}
            >
              I understand this failure
            </button>
          </motion.article>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visibleStep >= 2 && (
          <motion.article
            variants={cardAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-[680px] space-y-5 rounded-[4px] border p-8"
              style={{ background: 'transparent', borderColor: 'var(--border)' }}
          >
            <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase" style={{ color: 'var(--error)', letterSpacing: '1.5px' }}>
                FAILURE 02
              </p>
              <h3 className="text-[24px] font-semibold text-[#1a1f36]">The Linearity Ceiling</h3>
            </div>

            <p className="text-[15px] leading-[1.8] text-[#1e2d42]">
              A model is built using only linear layers, no activation functions. No matter how many layers are
              stacked, the entire network computes one linear combination of the inputs. Depth adds no expressive
              power.
            </p>

            <div className="overflow-x-auto">
              <div className="flex min-w-[640px] gap-5">
                <div className="w-[200px] shrink-0 space-y-2 bg-white">
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>1 linear layer</p>
                  <svg viewBox="0 0 200 130" width="200" height="130" className="block">
                    <line x1="20" y1="65" x2="72" y2="65" stroke="#64748b" strokeWidth="2" />
                    <rect x="72" y="45" width="56" height="40" fill="#f8f9fc" stroke="#e8ecf2" />
                    <line x1="128" y1="65" x2="180" y2="65" stroke="#1a56db" strokeWidth="2" />
                  </svg>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>a1*x1 + a2*x2</p>
                </div>

                <div className="w-[200px] shrink-0 space-y-2" style={{ background: 'transparent' }}>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>2 linear layers</p>
                  <svg viewBox="0 0 200 130" width="200" height="130" className="block">
                    <line x1="10" y1="65" x2="45" y2="65" stroke="#64748b" strokeWidth="2" />
                    <rect x="45" y="45" width="44" height="40" fill="#f8f9fc" stroke="#e8ecf2" />
                    <line x1="89" y1="65" x2="112" y2="65" stroke="#64748b" strokeWidth="2" />
                    <rect x="112" y="45" width="44" height="40" fill="#f8f9fc" stroke="#e8ecf2" />
                    <line x1="156" y1="65" x2="190" y2="65" stroke="#1a56db" strokeWidth="2" />
                  </svg>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>b1*x1 + b2*x2</p>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>still a linear combination</p>
                </div>

                <div className="w-[200px] shrink-0 space-y-2" style={{ background: 'transparent' }}>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>linear + nonlinearity</p>
                  <svg viewBox="0 0 200 130" width="200" height="130" className="block">
                    <line x1="14" y1="65" x2="55" y2="65" stroke="#64748b" strokeWidth="2" />
                    <rect x="55" y="45" width="48" height="40" fill="#f8f9fc" stroke="#e8ecf2" />
                    <line x1="103" y1="65" x2="122" y2="65" stroke="#64748b" strokeWidth="2" />
                    <path d="M 122 80 Q 136 45 152 80" fill="none" stroke="#1a56db" strokeWidth="2" />
                    <line x1="152" y1="65" x2="188" y2="65" stroke="#1a56db" strokeWidth="2" />
                  </svg>
                  <p className="text-center text-[13px]" style={{ color: 'var(--text-primary)' }}>f(a1*x1 + a2*x2)</p>
                  <p className="text-center text-[13px]" style={{ color: 'var(--accent)' }}>can express curves</p>
                </div>
              </div>
            </div>

            <div className="callout-insight">
              <p className="m-0 text-[15px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
                Stacking linear transformations produces one linear transformation. The composition of linear
                combinations is a linear combination. This is why activation functions exist. They are the escape
                hatch from the linearity ceiling.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(3)}
              className="rounded-[4px] px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--accent)' }}
            >
              I understand this failure
            </button>
          </motion.article>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visibleStep >= 3 && (
          <motion.article
            variants={cardAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-[680px] space-y-5 rounded-[4px] border p-8"
              style={{ background: 'transparent', borderColor: 'var(--border)' }}
          >
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase" style={{ color: 'var(--error)', letterSpacing: '1.5px' }}>
                FAILURE 03
              </p>
              <h3 className="text-[24px] font-semibold" style={{ color: 'var(--text-primary)' }}>Conflated Directions</h3>
            </div>

            <p className="text-[15px] leading-[1.8] text-[#1e2d42]">
              An attention mechanism computes similarity between a query vector and key vectors using dot products,
              which measure alignment. If two key vectors point in nearly the same direction, the attention mechanism
              cannot distinguish between them. Both receive nearly identical attention weights regardless of which one
              is actually relevant.
            </p>

              <div className="mx-auto w-full max-w-[300px] space-y-3">
              <svg viewBox={`0 0 ${visSize} ${visSize}`} width="300" height="300" className="block h-auto w-full" role="img" aria-label="Conflated attention directions visualization">
                <rect x="0" y="0" width={visSize} height={visSize} fill="transparent" />

                {Array.from({ length: 7 }, (_, i) => i - 3).map((x) => (
                  <line key={`f3-gx-${x}`} x1={toX(x)} y1={toY(visMin)} x2={toX(x)} y2={toY(visMax)} stroke="var(--border-strong)" strokeWidth="1" />
                ))}
                {Array.from({ length: 7 }, (_, i) => i - 3).map((y) => (
                  <line key={`f3-gy-${y}`} x1={toX(visMin)} y1={toY(y)} x2={toX(visMax)} y2={toY(y)} stroke="var(--border-strong)" strokeWidth="1" />
                ))}

                <line x1={toX(0)} y1={toY(visMin)} x2={toX(0)} y2={toY(visMax)} stroke="var(--border)" strokeWidth="1" />
                <line x1={toX(visMin)} y1={toY(0)} x2={toX(visMax)} y2={toY(0)} stroke="var(--border)" strokeWidth="1" />

                <line x1={toX(0)} y1={toY(0)} x2={toX(query[0])} y2={toY(query[1])} stroke="var(--text-primary)" strokeWidth="2.6" />
                <polygon points={arrowHead([0, 0], query)} fill="var(--text-primary)" />

                <line x1={toX(0)} y1={toY(0)} x2={toX(key1[0])} y2={toY(key1[1])} stroke="var(--accent)" strokeWidth="2" />
                <polygon points={arrowHead([0, 0], key1)} fill="var(--accent)" />

                <line x1={toX(0)} y1={toY(0)} x2={toX(key2[0])} y2={toY(key2[1])} stroke="#93b4f0" strokeWidth="2" />
                <polygon points={arrowHead([0, 0], key2)} fill="#93b4f0" />

                <line x1={toX(0)} y1={toY(0)} x2={toX(key3[0])} y2={toY(key3[1])} stroke="var(--text-secondary)" strokeWidth="2" />
                <polygon points={arrowHead([0, 0], key3)} fill="var(--text-secondary)" />

                {[key1, key2, key3].map((key, idx) => (
                  <line
                    key={`dash-${idx}`}
                    x1={toX(query[0])}
                    y1={toY(query[1])}
                    x2={toX(key[0])}
                    y2={toY(key[1])}
                    stroke="var(--text-secondary)"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                ))}

                <text x={toX(query[0]) + 8} y={toY(query[1]) - 10} fontSize="13" fill="var(--text-primary)" fontFamily="Inter, sans-serif">
                  query
                </text>
                <text x={toX(key1[0]) + 8} y={toY(key1[1]) - 8} fontSize="13" fill="var(--accent)" fontFamily="Inter, sans-serif">
                  key 1
                </text>
                <text x={toX(key2[0]) + 8} y={toY(key2[1]) + 14} fontSize="13" fill="#93b4f0" fontFamily="Inter, sans-serif">
                  key 2
                </text>
                <text x={toX(key3[0]) - 40} y={toY(key3[1]) - 8} fontSize="13" fill="var(--text-secondary)" fontFamily="Inter, sans-serif">
                  key 3
                </text>

                <text x={(toX(query[0]) + toX(key1[0])) / 2 + 10} y={(toY(query[1]) + toY(key1[1])) / 2 - 8} fontSize="12" fill="var(--accent)" fontFamily="Inter, sans-serif">
                  0.41
                </text>
                <text x={(toX(query[0]) + toX(key2[0])) / 2 + 10} y={(toY(query[1]) + toY(key2[1])) / 2 + 6} fontSize="12" fill="var(--text-secondary)" fontFamily="Inter, sans-serif">
                  0.39
                </text>
                <text x={(toX(query[0]) + toX(key3[0])) / 2 - 4} y={(toY(query[1]) + toY(key3[1])) / 2 - 8} fontSize="12" fill="var(--text-secondary)" fontFamily="Inter, sans-serif">
                  0.20
                </text>
              </svg>

              <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Key 1 and key 2 are nearly indistinguishable. The query cannot select one over the other.
              </p>
            </div>

            <div className="callout-insight">
              <p className="m-0 text-[15px] leading-[1.8] text-[#dbe7ff]">
                This is why transformer models use separate learned projections for queries and keys rather than
                comparing embeddings directly. The projections rotate the space so that relevant distinctions are
                amplified. The geometry has to make things distinguishable before attention can select them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(4)}
              className="rounded-[4px] bg-[#1a56db] px-4 py-2 text-sm font-medium text-white"
            >
              I understand this failure
            </button>
          </motion.article>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visibleStep >= 4 && (
          <motion.div
            variants={cardAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-[860px] overflow-hidden rounded-[4px] border"
            style={{ borderColor: '#e8ecf2', background: '#ffffff' }}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr style={{ background: '#f8f9fc' }}>
                  <th
                    className="px-4 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1a1f36', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  >
                    Failure
                  </th>
                  <th
                    className="px-4 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1a1f36', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  >
                    Root cause
                  </th>
                  <th
                    className="px-4 py-3"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1a1f36', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  >
                    Question to ask
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Representational collapse',
                    'Vectors span too narrow a subspace',
                    'Do my representations spread across enough directions?'
                  ],
                  [
                    'Linearity ceiling',
                    'Compositions of linear combinations are still linear',
                    'Where is the nonlinearity that breaks the ceiling?'
                  ],
                  [
                    'Conflated directions',
                    'Parallel vectors are indistinguishable to dot product operations',
                    'Are my key vectors spread far enough apart to support selective attention?'
                  ]
                ].map((row, idx) => (
                  <tr key={row[0]}>
                    <td
                      className="px-4 py-[14px]"
                      style={{
                        borderTop: idx === 0 ? '1px solid #f1f4f9' : '1px solid #f1f4f9',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#1a1f36'
                      }}
                    >
                      {row[0]}
                    </td>
                    <td
                      className="px-4 py-[14px]"
                      style={{ borderTop: '1px solid #f1f4f9', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#1a1f36' }}
                    >
                      {row[1]}
                    </td>
                    <td
                      className="px-4 py-[14px]"
                      style={{ borderTop: '1px solid #f1f4f9', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#1a1f36' }}
                    >
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LinearCombinationFailures
