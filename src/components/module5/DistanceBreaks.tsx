import { motion, Variants } from 'framer-motion'

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

const dotsContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03
    }
  }
}

const dotVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
}

const distances10D = [4, 9, 13, 18, 23, 28, 34, 38, 43, 47, 52, 57, 61, 66, 71, 77, 83, 88, 93, 97]
const distances1000D = [40.5, 41.2, 42.4, 43.1, 44.6, 45.2, 46.3, 47.5, 48.1, 48.9, 50.2, 51.1, 52.3, 53, 54.4, 55.1, 56.2, 57.4, 58.5, 59.2]

type DotPlotProps = {
  label: string
  points: number[]
  caption: string
  clustered?: boolean
}

const DotPlot = ({ label, points, caption, clustered = false }: DotPlotProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      style={{ width: 340 }}
    >
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 14
        }}
      >
        {label}
      </div>

      <div style={{ position: 'relative', height: 64 }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 30,
            borderTop: '1px solid #1e293b'
          }}
        />

        <motion.div variants={dotsContainer} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          {points.map((x, idx) => {
            let color = '#475569'
            if (!clustered) {
              if (idx < 5) color = '#3b82f6'
              else if (idx >= 15) color = '#94a3b8'
            }

            return (
              <motion.span
                key={`${label}-${idx}`}
                variants={dotVariant}
                style={{
                  position: 'absolute',
                  left: `calc(${x}% - 4px)`,
                  top: 26,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color
                }}
              />
            )
          })}
        </motion.div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            color: '#475569'
          }}
        >
          near
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            color: '#475569'
          }}
        >
          far
        </div>
      </div>

      <p
        style={{
          marginTop: 16,
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          lineHeight: 1.5,
          color: '#94a3b8'
        }}
      >
        {caption}
      </p>
    </motion.div>
  )
}

const DistanceBreaks = () => {
  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
        {/* PART 1 - Opening */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={openingContainer}>
          <motion.p variants={openingParagraph} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            The first thing that breaks in high dimensions
            is distance. Not the formula. The formula is identical.
            What breaks is what distance tells you.
          </motion.p>

          <motion.p variants={openingParagraph} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            In 3D, distance is informative. Some things
            are close, some things are far. The ratio between the
            nearest neighbor distance and the farthest neighbor
            distance is large. You can meaningfully say: this point
            is much closer than that one.
          </motion.p>

          <motion.p variants={openingParagraph} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            In high dimensions, everything becomes
            approximately the same distance from everything else.
            The nearest neighbor and the farthest neighbor are
            almost equidistant from any query point. Distance
            loses its ability to discriminate.
          </motion.p>
        </motion.div>

        {/* PART 2 - Distance concentration visualization */}
        <h3 style={{ color: '#f9fafb', fontSize: 26, lineHeight: 1.2, marginBottom: 24 }}>Watch discrimination collapse</h3>

        <div
          style={{
            display: 'flex',
            gap: 40,
            flexWrap: 'wrap',
            marginBottom: 44
          }}
        >
          <DotPlot
            label="10 DIMENSIONS"
            points={distances10D}
            caption={"Clear near/far distinction.\nNearest neighbor is meaningful."}
          />

          <DotPlot
            label="1000 DIMENSIONS"
            points={distances1000D}
            clustered
            caption={"Everything clusters at the same distance.\nNearest neighbor is nearly arbitrary."}
          />
        </div>

        {/* PART 3 - The math behind it */}
        <div
          style={{
            background: '#1e3a5f',
            borderLeft: '3px solid #3b82f6',
            padding: '20px 24px',
            marginBottom: 36
          }}
        >
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#e2e8f0', margin: 0 }}>
            For random unit vectors in n dimensions, the expected
            distance between any two of them converges to sqrt(2)
            as n grows. The variance around that value shrinks to
            zero. In the limit, all pairwise distances are
            identical. Your nearest neighbor search is choosing
            between things that are geometrically indistinguishable.
          </p>
        </div>

        {/* PART 4 - ML consequence */}
        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
          This is why naive nearest-neighbor search
          breaks at scale. A k-NN classifier trained in 2D
          generalizes beautifully. The same classifier in 512
          dimensions is nearly guessing, not because the math
          is wrong but because distance has stopped being
          informative. The geometry degraded.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 28 }}>
          Every system that relies on distance-based
          similarity, retrieval systems, recommendation engines,
          k-NN classifiers, faces this. The solution is never
          to use a different distance formula. The solution is
          to reduce dimensionality first, or to learn a metric
          that preserves the distinctions that matter.
        </p>

        <div
          style={{
            background: '#2d1a0e',
            borderLeft: '3px solid #f59e0b',
            padding: '20px 24px'
          }}
        >
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#e2e8f0', margin: 0 }}>
            When a retrieval system returns poor results
            despite good embeddings, the first diagnostic question
            is not the retrieval logic. It is whether the embedding
            dimension is so high that distance has become
            uninformative. Dimensionality reduction before
            retrieval often fixes what looks like a model problem.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DistanceBreaks
