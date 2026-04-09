import { motion, Variants } from 'framer-motion'
import { useState } from 'react'

const openingContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3
    }
  }
}

const openingParagraph: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

type FailureCard = {
  eyebrow: string
  title: string
  story: string
  text: string
}

const cards: FailureCard[] = [
  {
    eyebrow: 'FAILURE 01',
    title: 'The Similarity System That Cannot Discriminate',
    story: `A semantic search system is built on top of
768-dimensional sentence embeddings. In testing on
100 documents it works well. Deployed on 10 million
documents, it begins returning results that seem
randomly selected. Cosine similarity scores for
the top 100 results all fall between 0.91 and 0.94.
The system cannot distinguish relevant from irrelevant.`,
    text: `The embeddings are not wrong. The model is not
broken. The space has 768 dimensions and 10 million
points. At that scale, distance concentration means
all similarity scores converge to the same narrow range.
The system is choosing between geometrically
indistinguishable candidates.`
  },
  {
    eyebrow: 'FAILURE 02',
    title: 'The Classifier That Learns Nothing',
    story: `A k-NN classifier achieves 94% accuracy on
a 50-dimensional feature set. A new engineer adds
200 more features that seem potentially useful.
Accuracy drops to 71% without any obvious reason.
No code changed. No model retrained incorrectly.`,
    text: `Adding dimensions dilutes the signal. The 200
new features are weakly informative at best. But in
high dimensions, weak features add noise to every
distance calculation. The nearest neighbors in
250D are no longer the semantically nearest neighbors
in the original 50D space. The curse entered through
the feature engineering door.`
  },
  {
    eyebrow: 'FAILURE 03',
    title: 'The Network That Would Not Train',
    story: `A deep network is initialized with weights
sampled uniformly from [-1, 1]. The first few
batches show normal loss. By batch 50, gradients
have vanished. The network stops learning entirely.
No learning rate tuning fixes it.`,
    text: `In high dimensions, uniform initialization
places nearly all weight vectors at the same magnitude,
near the surface of the hypersphere. The activations
in early layers all have similar scales. As they
compound through depth, the signal either explodes
or vanishes. Xavier initialization fixes this by
scaling weights by 1/sqrt(n), the geometric correction
for high-dimensional sphere surface concentration.`
  }
]

const similarityDocs100 = [0.3, 0.34, 0.38, 0.43, 0.47, 0.52, 0.56, 0.6, 0.64, 0.68, 0.71, 0.74, 0.77, 0.8, 0.83, 0.86, 0.89, 0.91, 0.93, 0.95]
const similarityDocs10M = [0.91, 0.912, 0.914, 0.916, 0.918, 0.919, 0.921, 0.922, 0.924, 0.925, 0.927, 0.928, 0.929, 0.931, 0.932, 0.934, 0.936, 0.937, 0.939, 0.94]

const accuracyCurve = [94, 95, 95.2, 94.8, 93.9, 92, 89.8, 87.2, 84.5, 81.1, 77.4, 74.5, 71]

const uniformBars = [0.95, 0.82, 0.63, 0.44, 0.22, 0.09, 0.04, 0.02, 0.01, 0.005]
const xavierBars = [0.62, 0.6, 0.61, 0.58, 0.59, 0.63, 0.6, 0.62, 0.59, 0.61]

const axisToX = (value: number) => 56 + ((value - 0.3) / (0.95 - 0.3)) * 560

const HighDimFailures = () => {
  const [revealedCards, setRevealedCards] = useState(1)

  const revealNextCard = () => {
    setRevealedCards((current) => Math.min(3, current + 1))
  }

  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Opening */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={openingContainer}>
          <motion.p variants={openingParagraph} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}>
            High-dimensional geometry fails in three specific
            ways in production ML. Each one looks like a different
            problem. Each one has the same geometric root.
          </motion.p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* FAILURE 01 */}
          {revealedCards >= 1 && (
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: 4,
                padding: 32,
                maxWidth: 680
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#f59e0b',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600
                }}
              >
                {cards[0].eyebrow}
              </p>

              <h3 style={{ marginTop: 10, marginBottom: 12, color: '#f9fafb', fontSize: 28, lineHeight: 1.2 }}>{cards[0].title}</h3>

              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, margin: 0, fontSize: 16 }}>{cards[0].story}</p>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, marginTop: 14, marginBottom: 18, fontSize: 16 }}>{cards[0].text}</p>

              <svg viewBox="0 0 680 180" role="img" aria-label="Similarity score distributions for small and large corpora" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <line x1="56" y1="36" x2="616" y2="36" stroke="#1e293b" strokeWidth="1" />
                <line x1="56" y1="98" x2="616" y2="98" stroke="#1e293b" strokeWidth="1" />

                <text x="0" y="40" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fill: '#94a3b8' }}>
                  100 documents
                </text>
                <text x="0" y="102" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fill: '#94a3b8' }}>
                  10 million documents
                </text>

                {similarityDocs100.map((value, idx) => {
                  const x = axisToX(value)
                  const shade = idx / (similarityDocs100.length - 1)
                  const color = `rgb(${71 + Math.round((59 - 71) * shade)}, ${85 + Math.round((130 - 85) * shade)}, ${105 + Math.round((246 - 105) * shade)})`
                  return <circle key={`small-${value}-${idx}`} cx={x} cy="36" r="4" fill={color} />
                })}

                {similarityDocs10M.map((value, idx) => {
                  const x = axisToX(value)
                  const jitter = idx % 2 === 0 ? -1.5 : 1.5
                  return <circle key={`large-${value}-${idx}`} cx={x} cy={98 + jitter} r="4" fill="#475569" />
                })}

                {[0.3, 0.6, 0.9].map((tick) => {
                  const x = axisToX(tick)
                  return (
                    <g key={`tick-${tick}`}>
                      <line x1={x} y1="108" x2={x} y2="114" stroke="#1e293b" strokeWidth="1" />
                      <text
                        x={x}
                        y="128"
                        textAnchor="middle"
                        style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}
                      >
                        {tick.toFixed(1)}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div style={{ background: '#2d1a0e', borderLeft: '3px solid #f59e0b', padding: '16px 18px', marginTop: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#e2e8f0' }}>
                  Fix: reduce embedding dimensionality with PCA before
                  indexing, or use a learned metric that amplifies
                  the distinctions that matter for your task. We cover
                  both in module 5.
                </p>
              </div>

              {revealedCards === 1 && (
                <button
                  type="button"
                  onClick={revealNextCard}
                  style={{
                    marginTop: 18,
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  I understand this failure
                </button>
              )}
            </motion.article>
          )}

          {/* FAILURE 02 */}
          {revealedCards >= 2 && (
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: 4,
                padding: 32,
                maxWidth: 680
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#f59e0b',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600
                }}
              >
                {cards[1].eyebrow}
              </p>

              <h3 style={{ marginTop: 10, marginBottom: 12, color: '#f9fafb', fontSize: 28, lineHeight: 1.2 }}>{cards[1].title}</h3>

              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, margin: 0, fontSize: 16 }}>{cards[1].story}</p>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, marginTop: 14, marginBottom: 18, fontSize: 16 }}>{cards[1].text}</p>

              <svg viewBox="0 0 680 230" role="img" aria-label="k-NN accuracy versus number of dimensions" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <line x1="56" y1="180" x2="640" y2="180" stroke="#1e293b" strokeWidth="1" />
                <line x1="56" y1="28" x2="56" y2="180" stroke="#1e293b" strokeWidth="1" />

                <path
                  d={accuracyCurve
                    .map((value, idx) => {
                      const x = 56 + (idx / (accuracyCurve.length - 1)) * (640 - 56)
                      const y = 180 - ((value - 60) / (95 - 60)) * (180 - 28)
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                <line x1="56" y1="28" x2="56" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="640" y1="28" x2="640" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" />

                <text x="62" y="42" style={{ fontSize: 13, fill: '#94a3b8' }}>
                  original features
                </text>
                <text x="490" y="42" style={{ fontSize: 13, fill: '#f59e0b' }}>
                  after feature addition
                </text>

                <text x="56" y="199" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}>
                  50
                </text>
                <text x="626" y="199" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}>
                  250
                </text>
                <text x="12" y="184" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}>
                  60%
                </text>
                <text x="12" y="33" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fill: '#475569' }}>
                  95%
                </text>
              </svg>

              <div style={{ background: '#2d1a0e', borderLeft: '3px solid #f59e0b', padding: '16px 18px', marginTop: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#e2e8f0' }}>
                  More features is not always better. In high
                  dimensions, irrelevant features actively hurt.
                  Feature selection before k-NN is not optional,
                  it is geometric hygiene.
                </p>
              </div>

              {revealedCards === 2 && (
                <button
                  type="button"
                  onClick={revealNextCard}
                  style={{
                    marginTop: 18,
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  I understand this failure
                </button>
              )}
            </motion.article>
          )}

          {/* FAILURE 03 */}
          {revealedCards >= 3 && (
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: 4,
                padding: 32,
                maxWidth: 680
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#f59e0b',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600
                }}
              >
                {cards[2].eyebrow}
              </p>

              <h3 style={{ marginTop: 10, marginBottom: 12, color: '#f9fafb', fontSize: 28, lineHeight: 1.2 }}>{cards[2].title}</h3>

              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, margin: 0, fontSize: 16 }}>{cards[2].story}</p>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.75, marginTop: 14, marginBottom: 18, fontSize: 16 }}>{cards[2].text}</p>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <svg viewBox="0 0 240 190" role="img" aria-label="Uniform initialization activations by layer" width="240" height="190">
                  <text x="0" y="14" style={{ fontSize: 12, fill: '#94a3b8' }}>
                    Uniform init, layer activations
                  </text>
                  <line x1="0" y1="156" x2="230" y2="156" stroke="#1e293b" strokeWidth="1" />
                  {uniformBars.map((v, idx) => {
                    const h = Math.min(125, v * 170)
                    return <rect key={`u-${idx}`} x={idx * 22 + 6} y={156 - h} width="14" height={h} fill="#f59e0b" />
                  })}
                  <text x="0" y="178" style={{ fontSize: 12, fill: '#94a3b8' }}>
                    Exploding or vanishing signal
                  </text>
                </svg>

                <svg viewBox="0 0 240 190" role="img" aria-label="Xavier initialization activations by layer" width="240" height="190">
                  <text x="0" y="14" style={{ fontSize: 12, fill: '#94a3b8' }}>
                    Xavier init, layer activations
                  </text>
                  <line x1="0" y1="156" x2="230" y2="156" stroke="#1e293b" strokeWidth="1" />
                  {xavierBars.map((v, idx) => {
                    const h = Math.min(125, v * 120)
                    return <rect key={`x-${idx}`} x={idx * 22 + 6} y={156 - h} width="14" height={h} fill="#3b82f6" />
                  })}
                  <text x="0" y="178" style={{ fontSize: 12, fill: '#94a3b8' }}>
                    Stable signal through depth
                  </text>
                </svg>
              </div>

              <div style={{ background: '#1e3a5f', borderLeft: '3px solid #3b82f6', padding: '16px 18px', marginTop: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#e2e8f0' }}>
                  Xavier and He initialization are not magic numbers.
                  They are the direct application of high-dimensional
                  sphere geometry to the problem of keeping activations
                  at a consistent scale through depth.
                </p>
              </div>
            </motion.article>
          )}
        </div>

        {/* Diagnosis table */}
        {revealedCards >= 3 && (
          <div
            style={{
              marginTop: 28,
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: 4,
              overflow: 'hidden',
              maxWidth: 860
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1.3fr', background: '#1a2235' }}>
              {['Failure', 'Geometric cause', 'Fix'].map((label) => (
                <div
                  key={label}
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {[
              ['Similarity search degrades', 'Distance concentration at scale', 'Reduce dimension before indexing'],
              ['k-NN accuracy drops with more features', 'Irrelevant dimensions add noise to all distances', 'Feature selection or dimensionality reduction first'],
              ['Training vanishes or explodes', 'High-dimensional sphere surface concentration', 'Xavier or He initialization']
            ].map((row, idx) => (
              <div
                key={`row-${idx}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1.6fr 1.3fr',
                  borderTop: idx === 0 ? '1px solid #1e293b' : '1px solid #1e293b'
                }}
              >
                {row.map((cell) => (
                  <div key={cell} style={{ padding: '14px 16px', fontSize: 14, color: '#e2e8f0', lineHeight: 1.6 }}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HighDimFailures
