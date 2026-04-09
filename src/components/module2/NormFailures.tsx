import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const l2Weights = Array.from({ length: 42 }, (_, i) => {
  const base = 0.12 + ((i % 7) + 1) * 0.035
  return Number(base.toFixed(3))
})

const l1Weights = Array.from({ length: 42 }, (_, i) => {
  if (i % 9 === 0 || i % 14 === 0) {
    return Number((0.55 + (i % 5) * 0.08).toFixed(3))
  }
  return 0
})

const toX = (x: number) => 100 + x * 60
const toY = (y: number) => 140 - y * 60

const normalize = (v: [number, number]): [number, number] => {
  const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2)
  if (mag === 0) return [0, 0]
  return [v[0] / mag, v[1] / mag]
}

const drawLossPath = (points: Array<[number, number]>) =>
  points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ')

const NormFailures = () => {
  const [visibleStep, setVisibleStep] = useState(1)
  const [normalizedDocs, setNormalizedDocs] = useState(false)

  const docA: [number, number] = [2.8, 1.03]
  const docB: [number, number] = [0.9, 0.33]
  const shownDocA = normalizedDocs ? normalize(docA) : docA
  const shownDocB = normalizedDocs ? normalize(docB) : docB

  const explodingLoss = useMemo(
    () =>
      drawLossPath([
        [20, 170],
        [70, 145],
        [120, 132],
        [170, 120],
        [220, 110],
        [250, 96],
        [280, 92],
        [300, 90],
        [320, 88],
        [340, 30],
        [352, 12]
      ]),
    []
  )

  const clippedLoss = useMemo(
    () =>
      drawLossPath([
        [20, 170],
        [70, 148],
        [120, 132],
        [170, 120],
        [220, 109],
        [270, 100],
        [320, 95],
        [352, 91]
      ]),
    []
  )

  return (
    <section className="max-w-[900px] space-y-10 text-[#f9fafb]">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4 }}
        className="text-base leading-8 text-[#e5e7eb]"
      >
        Norms are simple. But choosing the wrong one, or applying one without thinking, produces failures that are
        hard to debug because the math runs perfectly.
      </motion.p>

      <AnimatePresence>
        {visibleStep >= 1 && (
          <motion.article
            variants={cardAnim}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.4 }}
            className="space-y-4 rounded-xl border border-[#334155] p-6"
          >
            <h3 className="text-xl text-[#f8fafc]">Failure 1: The Wrong Norm</h3>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              A fraud detection model uses L2 regularization. The input has 500 features. Most are irrelevant noise.
              The model learns small nonzero weights for all 500 features. It performs well in development. In
              production it is slow, expensive to serve, and brittle to small input changes.
            </p>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              L2 kept all features alive. L1 would have zeroed out the noise. The norm choice was a statement about
              feature structure, and the statement was wrong.
            </p>

            <div className="overflow-x-auto">
              <svg viewBox="0 0 640 230" className="h-auto w-full min-w-[560px]" role="img" aria-label="L2 vs L1 weights">
                <line x1="40" y1="180" x2="300" y2="180" stroke="#475569" />
                <line x1="40" y1="40" x2="40" y2="180" stroke="#475569" />
                <text x="170" y="202" fill="#93c5fd" fontSize="11" textAnchor="middle">
                  L2 (all 500 nonzero, represented)
                </text>

                {l2Weights.map((value, i) => {
                  const x = 45 + i * 6
                  const h = value * 70
                  return <rect key={`l2-${i}`} x={x} y={180 - h} width="4" height={h} fill="#60a5fa" opacity="0.9" />
                })}

                <line x1="340" y1="180" x2="600" y2="180" stroke="#475569" />
                <line x1="340" y1="40" x2="340" y2="180" stroke="#475569" />
                <text x="470" y="202" fill="#fbbf24" fontSize="11" textAnchor="middle">
                  L1 (most zero, few significant)
                </text>

                {l1Weights.map((value, i) => {
                  const x = 345 + i * 6
                  const h = value * 70
                  return (
                    <rect
                      key={`l1-${i}`}
                      x={x}
                      y={180 - h}
                      width="4"
                      height={h}
                      fill={value === 0 ? '#334155' : '#f59e0b'}
                      opacity={value === 0 ? '0.45' : '0.95'}
                    />
                  )
                })}
              </svg>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: '#a78bfa' }}>
              <p className="text-sm leading-7 text-[#ddd6fe]">
                If you do not know which features matter, L1 is often safer. It will tell you which ones matter by
                eliminating the rest.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(2)}
              className="text-sm text-[#60a5fa] underline underline-offset-4"
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
            transition={{ duration: 0.4 }}
            className="space-y-4 rounded-xl border border-[#334155] p-6"
          >
            <h3 className="text-xl text-[#f8fafc]">Failure 2: Normalizing Away the Signal</h3>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              A text classifier represents documents as word-count vectors. A developer normalizes all vectors to unit
              length before training. The model stops distinguishing long documents from short ones.
            </p>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              A 10-word document and a 1000-word document now live at the same distance from the origin. The magnitude
              carried information about certainty and depth of coverage. Normalization deleted it.
            </p>

            <div className="space-y-3">
              <svg viewBox="0 0 420 280" className="h-auto w-full max-w-[520px]" role="img" aria-label="Before and after normalization">
                <line x1="30" y1="140" x2="390" y2="140" stroke="#475569" />
                <line x1="100" y1="20" x2="100" y2="250" stroke="#475569" />

                <motion.line
                  x1={100}
                  y1={140}
                  x2={toX(shownDocA[0])}
                  y2={toY(shownDocA[1])}
                  stroke="#60a5fa"
                  strokeWidth="3"
                  animate={{ x2: toX(shownDocA[0]), y2: toY(shownDocA[1]) }}
                />
                <motion.line
                  x1={100}
                  y1={140}
                  x2={toX(shownDocB[0])}
                  y2={toY(shownDocB[1])}
                  stroke="#f59e0b"
                  strokeWidth="3"
                  animate={{ x2: toX(shownDocB[0]), y2: toY(shownDocB[1]) }}
                />

                <text x="242" y="32" fill="#cbd5e1" fontSize="11">
                  {normalizedDocs ? 'After normalization' : 'Before normalization'}
                </text>
              </svg>

              <button
                type="button"
                onClick={() => setNormalizedDocs((current) => !current)}
                className="text-sm text-[#60a5fa] underline underline-offset-4"
              >
                {normalizedDocs ? 'Show before normalization' : 'After normalization'}
              </button>

              <p className="text-sm text-[#cbd5e1]">Same direction, same norm. But they were not the same document.</p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: '#a78bfa' }}>
              <p className="text-sm leading-7 text-[#ddd6fe]">
                Normalization is not always the right preprocessing step. It is a decision to care only about
                direction. Make sure direction is all you care about.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(3)}
              className="text-sm text-[#60a5fa] underline underline-offset-4"
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
            transition={{ duration: 0.4 }}
            className="space-y-4 rounded-xl border border-[#334155] p-6"
          >
            <h3 className="text-xl text-[#f8fafc]">Failure 3: The Exploding Gradient</h3>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              A recurrent network trained on long sequences. No gradient clipping. After 3 hours of training the loss
              suddenly goes to NaN. The weights have become millions. The model is destroyed.
            </p>
            <p className="text-sm leading-7 text-[#cbd5e1]">
              One bad batch produced a gradient with an enormous norm. The optimizer took a massive step. The weights
              landed somewhere catastrophic. Without clipping, there was nothing to stop it.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <svg viewBox="0 0 380 230" className="h-auto w-full" role="img" aria-label="Loss explosion without clipping">
                <line x1="28" y1="190" x2="360" y2="190" stroke="#475569" />
                <line x1="28" y1="24" x2="28" y2="190" stroke="#475569" />
                <path d={explodingLoss} fill="none" stroke="#ef4444" strokeWidth="3" />
                <text x="34" y="18" fill="#fecaca" fontSize="11">
                  No clipping
                </text>
              </svg>

              <svg viewBox="0 0 380 230" className="h-auto w-full" role="img" aria-label="Stable loss with clipping">
                <line x1="28" y1="190" x2="360" y2="190" stroke="#475569" />
                <line x1="28" y1="24" x2="28" y2="190" stroke="#475569" />
                <path d={clippedLoss} fill="none" stroke="#60a5fa" strokeWidth="3" />
                <text x="34" y="18" fill="#bfdbfe" fontSize="11">
                  With clipping
                </text>
              </svg>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: '#a78bfa' }}>
              <p className="text-sm leading-7 text-[#ddd6fe]">
                Gradient clipping is cheap. Not using it is expensive exactly once, when it matters most.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVisibleStep(4)}
              className="text-sm text-[#60a5fa] underline underline-offset-4"
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
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <h3 className="text-lg text-[#dbeafe]">Diagnosis checklist</h3>
            <div className="overflow-x-auto">
              <table className="min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-[#93c5fd]">
                    <th className="border-b border-[#334155] px-3 py-2 font-medium">Failure</th>
                    <th className="border-b border-[#334155] px-3 py-2 font-medium">Root cause</th>
                    <th className="border-b border-[#334155] px-3 py-2 font-medium">Question to ask</th>
                  </tr>
                </thead>
                <tbody className="text-[#e2e8f0]">
                  <tr>
                    <td className="border-b border-[#1f2937] px-3 py-2">Wrong norm</td>
                    <td className="border-b border-[#1f2937] px-3 py-2">Norm choice implied wrong structure</td>
                    <td className="border-b border-[#1f2937] px-3 py-2">
                      Do I believe most features matter, or just a few?
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-[#1f2937] px-3 py-2">Over-normalization</td>
                    <td className="border-b border-[#1f2937] px-3 py-2">Removed magnitude that carried signal</td>
                    <td className="border-b border-[#1f2937] px-3 py-2">
                      Is direction the only thing I care about comparing?
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">No gradient clipping</td>
                    <td className="px-3 py-2">Unbounded norm destroyed training</td>
                    <td className="px-3 py-2">Have I bounded the norm of my gradients?</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default NormFailures
