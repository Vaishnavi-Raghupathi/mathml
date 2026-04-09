import { useState } from 'react'
import { motion, Variants } from 'framer-motion'

type Props = {
  onComplete?: () => void
}

const part1Container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } }
}

const paraVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
}

const statsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.5 } }
}

const statVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

const stats = [
  {
    value: '768',
    label: 'dimensions in a BERT sentence embedding'
  },
  {
    value: '12,288',
    label: 'dimensions in a GPT-4 hidden layer'
  },
  {
    value: '1,536',
    label: 'dimensions in an OpenAI text-embedding-3-small vector'
  }
]

export default function Hook({ onComplete }: Props) {
  const [selection, setSelection] = useState<'yes' | 'no' | null>(null)

  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
        {/* PART 1 - Opening text block */}
        <motion.div initial="hidden" animate="show" variants={part1Container}>
          <motion.p variants={paraVariant} style={{ marginBottom: 16, fontSize: 17, lineHeight: 1.8 }}>
            Everything we have built so far has been
            in 2D or 3D. You could see the vectors. You could watch
            the distances change. You could place points on a grid.
          </motion.p>

          <motion.p variants={paraVariant} style={{ marginBottom: 16, fontSize: 17, lineHeight: 1.8 }}>
            GPT-4 works in 12,288 dimensions. BERT
            works in 768. A basic word embedding works in 300. None
            of these spaces can be visualized. None of them behave
            the way your intuition expects.
          </motion.p>

          <motion.p variants={paraVariant} style={{ marginBottom: 8, fontSize: 17, lineHeight: 1.8 }}>
            This module is about what actually happens
            in high dimensions. Not the formula. The behavior.
            Because if you do not understand how high-dimensional
            space breaks your intuition, you will misread every
            embedding, every distance metric, and every similarity
            score you encounter in production.
          </motion.p>
        </motion.div>

        {/* PART 2 - Inverted light panel */}
        <div style={{ background: '#f8f9fc', maxWidth: 680, padding: 48, margin: '48px auto', borderRadius: 0, textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={statsContainer}
            style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.value} variants={statVariant}>
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 48, color: '#0f1629', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ marginTop: 8, fontSize: 15, color: '#475569' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p style={{ marginTop: -20, marginBottom: 48, fontSize: 14, color: '#94a3b8', lineHeight: 1.6, textAlign: 'center' }}>
          These are not large numbers in the engineering sense.
          They are large in the geometric sense. 
          The space they define behaves nothing like 3D.
        </p>

        {/* PART 3 - Pause and predict */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 4, padding: 24, maxWidth: 680, margin: '0 auto 24px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              BEFORE WE START
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              In 2D, if you pick a random point inside
              a circle, it will probably land somewhere in the
              interior, away from the edge. Do you think the same
              is true in 100 dimensions?
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setSelection('yes')}
              aria-pressed={selection === 'yes'}
              style={{
                padding: '10px 16px',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--text-primary)',
                border: selection === 'yes' ? '1px solid var(--accent)' : '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              Yes, probably interior
            </button>

            <button
              type="button"
              onClick={() => setSelection('no')}
              aria-pressed={selection === 'no'}
              style={{
                padding: '10px 16px',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--text-primary)',
                border: selection === 'no' ? '1px solid var(--accent)' : '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              No, probably near the edge
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, color: '#94a3b8' }}>
              Hold that. The answer will surprise most people.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => onComplete && onComplete()}
              style={{ padding: '10px 18px', borderRadius: 4, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
