import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type Vec2 = [number, number]

type ArrowSpec = {
  from: Vec2
  to: Vec2
  color: string
  strokeWidth: number
  label: string
  labelColor: string
  dashed?: boolean
}

const mono = '"IBM Plex Mono", monospace'

const xMin = -1
const xMax = 5
const yMin = -1
const yMax = 5

const svgSize = 480
const pad = 48
const plot = svgSize - pad * 2

const xToSvg = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plot
const yToSvg = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * plot

const lineLength = (from: Vec2, to: Vec2) => {
  const dx = xToSvg(to[0]) - xToSvg(from[0])
  const dy = yToSvg(to[1]) - yToSvg(from[1])
  return Math.hypot(dx, dy)
}

const AnimatedArrow = ({
  markerId,
  arrow,
  delay = 0,
  labelOffset = [8, -8]
}: {
  markerId: string
  arrow: ArrowSpec
  delay?: number
  labelOffset?: [number, number]
}) => {
  const fromX = xToSvg(arrow.from[0])
  const fromY = yToSvg(arrow.from[1])
  const toX = xToSvg(arrow.to[0])
  const toY = yToSvg(arrow.to[1])
  const length = lineLength(arrow.from, arrow.to)
  const dashArray = arrow.dashed ? '8 4' : undefined

  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill={arrow.color} />
        </marker>
      </defs>

      <motion.path
        d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
        fill="none"
        stroke={arrow.color}
        strokeWidth={arrow.strokeWidth}
        strokeDasharray={dashArray ?? `${length}`}
        initial={{ strokeDashoffset: length, opacity: 1 }}
        animate={{ strokeDashoffset: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'linear', delay }}
        markerEnd={`url(#${markerId})`}
      />

      <motion.text
        x={toX + labelOffset[0]}
        y={toY + labelOffset[1]}
        fill={arrow.labelColor}
        fontSize="13"
        fontFamily="Inter, sans-serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: delay + 0.2 }}
      >
        {arrow.label}
      </motion.text>
    </>
  )
}

const BaseGrid = () => {
  const ticks = useMemo(() => Array.from({ length: xMax - xMin + 1 }, (_, i) => i + xMin), [])

  return (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      width={svgSize}
      height={svgSize}
    className="mx-auto block h-auto w-full max-w-[480px]"
      role="img"
      aria-label="Vector addition coordinate grid"
    >
      {ticks.map((x) => (
        <line key={`gx-${x}`} x1={xToSvg(x)} y1={yToSvg(yMin)} x2={xToSvg(x)} y2={yToSvg(yMax)} stroke="var(--border-strong)" strokeWidth="1" />
      ))}
      {ticks.map((y) => (
        <line key={`gy-${y}`} x1={xToSvg(xMin)} y1={yToSvg(y)} x2={xToSvg(xMax)} y2={yToSvg(y)} stroke="var(--border-strong)" strokeWidth="1" />
      ))}

      <line x1={xToSvg(0)} y1={yToSvg(yMin)} x2={xToSvg(0)} y2={yToSvg(yMax)} stroke="var(--border)" strokeWidth="1" />
      <line x1={xToSvg(xMin)} y1={yToSvg(0)} x2={xToSvg(xMax)} y2={yToSvg(0)} stroke="var(--border)" strokeWidth="1" />

      <text x={xToSvg(xMax) + 8} y={yToSvg(0) + 4} fontFamily={mono} fontSize="11" fill="var(--text-secondary)">
        x
      </text>
      <text x={xToSvg(0) - 8} y={yToSvg(yMax) - 8} textAnchor="end" fontFamily={mono} fontSize="11" fill="var(--text-secondary)">
        y
      </text>
    </svg>
  )
}

const openingParagraphs = [
  'Vector addition is the simplest operation in this entire course. You add component by component. That is all.',
  'But the geometric interpretation is what makes this interesting. Adding two vectors means: follow the first one, then follow the second one from where you ended up.'
]

const VectorAddition = () => {
  const [step, setStep] = useState(1)

  const arrowA: ArrowSpec = {
    from: [0, 0],
    to: [3, 1],
    color: '#1a56db',
    strokeWidth: 2,
    label: 'a = [3, 1]',
    labelColor: '#1a56db'
  }

  const arrowB: ArrowSpec = {
    from: [3, 1],
    to: [4, 3],
    color: '#64748b',
    strokeWidth: 2,
    label: 'b = [1, 2]',
    labelColor: '#64748b'
  }

  const arrowResult: ArrowSpec = {
    from: [0, 0],
    to: [4, 3],
    color: '#1a1f36',
    strokeWidth: 2.5,
    label: 'a + b = [4, 3]',
    labelColor: '#1a1f36',
    dashed: true
  }

  const pauseA: ArrowSpec = {
    from: [0, 0],
    to: [1, 0],
    color: '#1a56db',
    strokeWidth: 2,
    label: 'a = [1, 0]',
    labelColor: '#1a56db'
  }

  const pauseB: ArrowSpec = {
    from: [1, 0],
    to: [1, 1],
    color: '#64748b',
    strokeWidth: 2,
    label: 'b = [0, 1]',
    labelColor: '#64748b'
  }

  const pauseResult: ArrowSpec = {
    from: [0, 0],
    to: [1, 1],
    color: '#1a1f36',
    strokeWidth: 2.5,
    label: 'a + b = [1, 1]',
    labelColor: '#1a1f36',
    dashed: true
  }

  return (
    <section className="max-w-[900px] space-y-14">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.3 } } }}
        className="space-y-6"
      >
        <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} transition={{ duration: 0.3, ease: 'easeOut' }} className="text-[17px] leading-[1.8] text-[#1e2d42]">
          {openingParagraphs[0]}
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-[4px] border px-6 py-5"
          style={{ background: 'transparent', borderColor: 'var(--border)' }}
        >
          <pre className="m-0 whitespace-pre text-[15px]" style={{ fontFamily: mono, color: 'var(--text-primary)' }}>{`[1, 2, 3]
 [4, 5, 6]
 = [5, 7, 9]`}</pre>
        </motion.div>

        <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} transition={{ duration: 0.3, ease: 'easeOut' }} className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Each position adds independently. Position 1 knows nothing about position 2.
        </motion.p>

        <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} transition={{ duration: 0.3, ease: 'easeOut' }} className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          {openingParagraphs[1]}
        </motion.p>
      </motion.div>

      <div className="space-y-4">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="relative">
            <BaseGrid />
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width={svgSize} height={svgSize} className="pointer-events-none absolute inset-0 mx-auto block h-auto w-full max-w-[480px]">
              {step >= 1 && <AnimatedArrow markerId="m-a" arrow={arrowA} delay={0} labelOffset={[8, -8]} />}
              {step >= 2 && <AnimatedArrow markerId="m-b" arrow={arrowB} delay={0} labelOffset={[8, -8]} />}
              {step >= 3 && <AnimatedArrow markerId="m-r" arrow={arrowResult} delay={0} labelOffset={[8, 18]} />}
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            disabled={step >= 3}
            onClick={() => setStep((prev) => Math.min(prev + 1, 3))}
            className="rounded-[4px] px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            Next Step
          </button>
        </div>

  <p className="text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>Follow a, then follow b. The result is where you land.</p>
      </div>

      <div className="space-y-6">
        <p className="text-[17px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
          You have two vectors. A = [1, 0] pointing right. B = [0, 1] pointing up. What does A + B produce? Do not
          calculate. Draw it in your head.
        </p>

        <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          A vector pointing up-right. Specifically [1,1], halfway between the two originals. Both answers are correct
          depending on the specific vectors. The direction is always a combination of both.
        </p>

        <div className="mx-auto w-full max-w-[480px]">
          <div className="relative">
            <BaseGrid />
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width={svgSize} height={svgSize} className="pointer-events-none absolute inset-0 mx-auto block h-auto w-full max-w-[480px]">
              <AnimatedArrow markerId="pm-a" arrow={pauseA} delay={0} labelOffset={[8, -8]} />
              <AnimatedArrow markerId="pm-b" arrow={pauseB} delay={0.4} labelOffset={[8, -8]} />
              <AnimatedArrow markerId="pm-r" arrow={pauseResult} delay={0.8} labelOffset={[8, 18]} />
            </svg>
          </div>
        </div>
      </div>

        <div className="mx-auto w-full max-w-[680px] space-y-5">
        <div className="px-12 py-12" style={{ background: 'var(--surface-raised)' }}>
          <pre className="m-0 whitespace-pre-wrap text-[15px]" style={{ fontFamily: mono, color: 'var(--text-primary)' }}>{`word_vector("king") - word_vector("man")
word_vector("woman")`}</pre>

          <p className="mt-8 text-center text-[32px]" style={{ fontFamily: mono, color: 'var(--text-primary)' }}>
            ≈ word_vector("queen")
          </p>

          <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            This is vector addition. Three additions on 300-dimensional vectors. Meaning fell out of the geometry.
          </p>
        </div>

        <div className="callout-insight">
          <p className="m-0 text-[15px] leading-[1.8] text-[#dbe7ff]">
            The model did not learn that king minus man equals some royal-female concept. It learned positions in
            space. The arithmetic worked because the training process arranged the space so that gender and royalty
            exist as consistent directions. Addition followed the directions.
          </p>
        </div>
      </div>
    </section>
  )
}

export default VectorAddition
