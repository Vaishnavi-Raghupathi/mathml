import { motion, Variants } from 'framer-motion'
import { useMemo, useState } from 'react'

const openingContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3
    }
  }
}

const paragraphFade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

const interpolateColor = (from: string, to: string, t: number) => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  const p = clamp(t, 0, 1)
  const r = Math.round(lerp(a.r, b.r, p))
  const g = Math.round(lerp(a.g, b.g, p))
  const bch = Math.round(lerp(a.b, b.b, p))
  return `rgb(${r}, ${g}, ${bch})`
}

const seededNoise = (i: number, j: number) => {
  const v = Math.sin(i * 127.1 + j * 311.7 + i * j * 0.217) * 43758.5453
  return (v - Math.floor(v)) * 2 - 1 // [-1, 1]
}

// Hardcoded lookup table as requested (2..50).
const ERROR_LOOKUP: Record<number, number> = {
  2: 45,
  3: 40,
  4: 36,
  5: 33,
  6: 30,
  7: 27,
  8: 24,
  9: 21,
  10: 18,
  11: 17.2,
  12: 16.4,
  13: 15.7,
  14: 15,
  15: 14.4,
  16: 13.8,
  17: 13.2,
  18: 12.6,
  19: 12,
  20: 11.5,
  21: 11,
  22: 10.6,
  23: 10.2,
  24: 9.8,
  25: 9.5,
  26: 9.2,
  27: 8.9,
  28: 8.6,
  29: 8.3,
  30: 8,
  31: 7.8,
  32: 7.6,
  33: 7.4,
  34: 7.2,
  35: 7,
  36: 6.8,
  37: 6.6,
  38: 6.4,
  39: 6.2,
  40: 6,
  41: 5.9,
  42: 5.8,
  43: 5.7,
  44: 5.6,
  45: 5.5,
  46: 5.4,
  47: 5.3,
  48: 5.2,
  49: 5.1,
  50: 5
}

const GRID_SIZE = 20
const CELL = 12
const HEATMAP_SIZE = GRID_SIZE * CELL

const buildOriginalDistanceMatrix = () => {
  const matrix = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0))

  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = i; j < GRID_SIZE; j += 1) {
      if (i === j) {
        matrix[i][j] = 0
      } else {
        // deterministic pseudo "distance" in [0, 1]
        const structural = Math.abs(i - j) / (GRID_SIZE - 1)
        const noise = (seededNoise(i + 1, j + 1) + 1) / 2
        const distance = clamp(0.62 * structural + 0.38 * noise, 0, 1)
        matrix[i][j] = distance
        matrix[j][i] = distance
      }
    }
  }

  return matrix
}

const originalMatrix = buildOriginalDistanceMatrix()

const buildProjectedMatrix = (k: number) => {
  const errorPct = ERROR_LOOKUP[k] ?? 45
  const errorScale = errorPct / 100

  return originalMatrix.map((row, i) =>
    row.map((value, j) => {
      if (i === j) return 0
      const direction = seededNoise(i + k, j + k * 3)
      const perturbed = value * (1 + direction * errorScale)
      return clamp(perturbed, 0, 1)
    })
  )
}

type HeatmapProps = {
  label: string
  caption: string
  matrix: number[][]
}

const Heatmap = ({ label, caption, matrix }: HeatmapProps) => {
  return (
    <div style={{ width: 300 }}>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 10
        }}
      >
        {label}
      </div>

      <svg viewBox={`0 0 ${HEATMAP_SIZE} ${HEATMAP_SIZE}`} width="300" height="300" role="img" aria-label={label}>
        {matrix.map((row, i) =>
          row.map((value, j) => {
            const x = j * CELL
            const y = i * CELL
            const color = interpolateColor('#1e293b', '#3b82f6', value)
            return <rect key={`${label}-${i}-${j}`} x={x} y={y} width={CELL} height={CELL} fill={color} />
          })
        )}
      </svg>

      <p style={{ marginTop: 10, fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.5, color: '#94a3b8' }}>{caption}</p>
    </div>
  )
}

const RandomProjections = () => {
  const [k, setK] = useState(2)

  const sliderFillPercent = ((k - 2) / (50 - 2)) * 100

  const projectedMatrix = useMemo(() => buildProjectedMatrix(k), [k])

  const avgError = ERROR_LOOKUP[k] ?? 45

  return (
    <section style={{ background: '#0a0f1e', padding: '48px 20px', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .random-proj-range {
          -webkit-appearance: none;
          appearance: none;
          width: min(680px, 100%);
          height: 6px;
          border-radius: 999px;
          outline: none;
        }

        .random-proj-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }

        .random-proj-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: transparent;
        }

        .random-proj-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #0a0f1e;
          border: 2px solid #3b82f6;
          margin-top: -6px;
          cursor: pointer;
        }

        .random-proj-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #0a0f1e;
          border: 2px solid #3b82f6;
          cursor: pointer;
        }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* PART 1 */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.45 }} variants={openingContainer}>
          <motion.p variants={paragraphFade} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            If high dimensions are the problem,
            the obvious solution is to reduce them. But reducing
            dimensions destroys information. Right?
          </motion.p>

          <motion.p variants={paragraphFade} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            Not necessarily. There is a result
            called the Johnson-Lindenstrauss lemma that says
            something remarkable: you can project a set of
            points from a very high-dimensional space into
            a much lower-dimensional space using a random
            matrix, and pairwise distances are preserved
            to within a controllable error.
          </motion.p>

          <motion.p variants={paragraphFade} style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 34 }}>
            You do not need to know what to
            preserve. A random projection preserves it anyway,
            with high probability. The geometry survives
            compression almost for free.
          </motion.p>
        </motion.div>

        {/* PART 2 */}
        <div style={{ background: '#1e3a5f', borderLeft: '3px solid #3b82f6', padding: '24px 28px', marginBottom: 38 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 600
            }}
          >
            JOHNSON-LINDENSTRAUSS LEMMA
          </p>

          <p style={{ margin: '12px 0 0 0', fontSize: 15, color: '#e2e8f0', lineHeight: 1.8 }}>
            Given n points in high-dimensional space and an
            error tolerance epsilon, there exists a projection
            to k dimensions where k = O(log(n) / epsilon^2)
            such that all pairwise distances are preserved
            within a factor of (1 +/- epsilon).
          </p>

          <p style={{ margin: '12px 0 0 0', fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            In plain terms: you only need log(n) dimensions
            to approximately preserve all pairwise distances
            among n points. The required dimension grows
            logarithmically with the number of points,
            not with the original dimension.
          </p>
        </div>

        {/* PART 3 */}
        <h3 style={{ color: '#f9fafb', fontSize: 28, lineHeight: 1.2, marginBottom: 10 }}>Distance preservation under projection</h3>

        <p style={{ fontSize: 16, color: '#e2e8f0', lineHeight: 1.7, marginBottom: 14 }}>
          20 points in 100-dimensional space.
          We project them down to k dimensions using a
          random Gaussian matrix. Watch what happens
          to pairwise distances.
        </p>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="target-k" style={{ display: 'block', marginBottom: 10, fontSize: 14, color: '#e2e8f0' }}>
            Target dimensions k: {k}
          </label>
          <input
            id="target-k"
            className="random-proj-range"
            type="range"
            min={2}
            max={50}
            step={1}
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderFillPercent}%, #1e293b ${sliderFillPercent}%, #1e293b 100%)`
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 18 }}>
          <Heatmap
            label="ORIGINAL DISTANCES (100D)"
            matrix={originalMatrix}
            caption="True pairwise distances between 20 points"
          />

          <Heatmap
            label={`PROJECTED DISTANCES (${k}D)`}
            matrix={projectedMatrix}
            caption="Distances after random projection"
          />
        </div>

        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 20,
            color: '#3b82f6',
            marginBottom: 8
          }}
        >
          Average distance error: {avgError.toFixed(0)}%
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 34 }}>
          Even at k=10, distances are preserved within 18%.
          At k=30, within 8%. The original space had 100 dimensions.
        </p>

        {/* PART 4 */}
        <p style={{ fontSize: 17, color: '#e2e8f0', lineHeight: 1.8, marginBottom: 16 }}>
          Random projections are used in production
          ML systems for exactly this reason. LSH, locality
          sensitive hashing, uses random projections to build
          approximate nearest neighbor indexes that scale to
          billions of vectors. FAISS, the vector search library
          used by Meta, implements variants of this. The math
          is Johnson-Lindenstrauss applied at scale.
        </p>

        <p style={{ fontSize: 17, color: '#e2e8f0', lineHeight: 1.8, marginBottom: 22 }}>
          A less obvious application: random
          projections explain why overparameterized neural
          networks generalize. When a network has far more
          parameters than training examples, classical
          statistics says it should memorize and fail to
          generalize. But if the data lives on a
          low-dimensional manifold, the network is effectively
          working in a much lower-dimensional space than
          its parameter count suggests. The curse of
          dimensionality does not apply to the intrinsic
          dimension of the data, only to the ambient dimension.
        </p>

        <div style={{ background: '#1e3a5f', borderLeft: '3px solid #3b82f6', padding: '20px 24px' }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#e2e8f0' }}>
            Intrinsic dimension is the actual number of degrees
            of freedom in your data, regardless of how many
            dimensions you used to represent it. A curve in 3D
            has intrinsic dimension 1. A surface has intrinsic
            dimension 2. Most real datasets have intrinsic
            dimension far below their representation dimension.
            This gap is why compression works, why embeddings
            work, and why deep learning works.
          </p>
        </div>
      </div>
    </section>
  )
}

export default RandomProjections
