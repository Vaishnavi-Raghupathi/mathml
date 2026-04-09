import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import * as math from 'mathjs'

const WIDTH = 500
const HEIGHT = 440
const SCALE = 60
const ORIGIN_X = 170
const ORIGIN_Y = 220
const mono = '"IBM Plex Mono", monospace'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const NormExplorer = () => {
  const [tip, setTip] = useState({ x: ORIGIN_X + 2 * SCALE, y: ORIGIN_Y - 1.5 * SCALE })
  const [isDragging, setIsDragging] = useState(false)
  const [showIdleHint, setShowIdleHint] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const idleTimerRef = useRef<number | null>(null)

  const startIdleTimer = () => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current)
    }

    idleTimerRef.current = window.setTimeout(() => {
      setShowIdleHint(true)
    }, 5000)
  }

  useEffect(() => {
    startIdleTimer()

    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current)
      }
    }
  }, [])

  const vector = useMemo(() => {
    const x = (tip.x - ORIGIN_X) / SCALE
    const y = (ORIGIN_Y - tip.y) / SCALE
    return [x, y]
  }, [tip])

  const pixelDistanceFromOrigin = useMemo(() => {
    return Number(math.distance([tip.x, tip.y], [ORIGIN_X, ORIGIN_Y]))
  }, [tip])

  const normL2 = useMemo(() => {
    if (pixelDistanceFromOrigin <= 3) {
      return 0
    }

    return Number(math.norm(vector, 2))
  }, [vector, pixelDistanceFromOrigin])

  const unitVector = useMemo(() => {
    if (pixelDistanceFromOrigin <= 3 || normL2 === 0) {
      return null
    }

    const divided = math.divide(vector, normL2)
    const values = Array.isArray(divided) ? divided : (divided as { valueOf: () => number[] }).valueOf()
    return [Number(values[0]), Number(values[1])] as [number, number]
  }, [vector, normL2, pixelDistanceFromOrigin])

  const normRadiusPx = Number(math.multiply(normL2, SCALE))

  const verticalGridX = useMemo(() => {
    const values: number[] = []

    for (let x = ORIGIN_X; x <= WIDTH; x += SCALE) {
      values.push(x)
    }

    for (let x = ORIGIN_X - SCALE; x >= 0; x -= SCALE) {
      values.push(x)
    }

    return values.sort((a, b) => a - b)
  }, [])

  const horizontalGridY = useMemo(() => {
    const values: number[] = []

    for (let y = ORIGIN_Y; y <= HEIGHT; y += SCALE) {
      values.push(y)
    }

    for (let y = ORIGIN_Y - SCALE; y >= 0; y -= SCALE) {
      values.push(y)
    }

    return values.sort((a, b) => a - b)
  }, [])

  const updateTipFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) {
      return
    }

    const rect = svgRef.current.getBoundingClientRect()
    const nextX = clamp(clientX - rect.left, 20, WIDTH - 20)
    const nextY = clamp(clientY - rect.top, 20, HEIGHT - 20)
    setTip({ x: nextX, y: nextY })
  }

  const handlePointerDown = (event: PointerEvent<SVGCircleElement>) => {
    setIsDragging(true)
    setShowIdleHint(false)
    startIdleTimer()
    event.currentTarget.setPointerCapture(event.pointerId)
    updateTipFromPointer(event.clientX, event.clientY)
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      updateTipFromPointer(event.clientX, event.clientY)
    }

    setShowIdleHint(false)
    startIdleTimer()
  }

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false)
      if (svgRef.current?.hasPointerCapture(event.pointerId)) {
        svgRef.current.releasePointerCapture(event.pointerId)
      }
      startIdleTimer()
    }
  }

  const fmt = (value: number) => value.toFixed(2)

  return (
    <section className="w-full max-w-[680px]">
      <div className="text-[12px] uppercase tracking-[0.1em] text-text-muted" style={{ fontFamily: mono }}>
        EXERCISE 01
      </div>

      <p className="mt-4 whitespace-pre-line text-[1em] italic leading-[1.8] text-text-secondary">
        {`Drag the vector tip.
Watch the norm update.

Notice: the norm is the distance from the origin.
Moving further out means a larger vector — more 'signal.'
Moving toward the origin means a smaller vector — less.`}
      </p>

      <div className="mt-6 w-full overflow-x-auto">
        <svg
          ref={svgRef}
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block max-w-[500px]"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ background: 'var(--background)' }}
          role="img"
          aria-label="Norm explorer with draggable vector"
        >
          <g opacity="0.12" stroke="var(--border)">
            {verticalGridX.map((x) => {
              return <line key={`gv-${x}`} x1={x} y1={0} x2={x} y2={HEIGHT} strokeWidth="1" />
            })}
            {horizontalGridY.map((y) => {
              return <line key={`gh-${y}`} x1={0} y1={y} x2={WIDTH} y2={y} strokeWidth="1" />
            })}
          </g>

          <line x1={ORIGIN_X} y1={0} x2={ORIGIN_X} y2={HEIGHT} stroke="var(--border-strong)" strokeWidth="1" opacity="0.9" />
          <line x1={0} y1={ORIGIN_Y} x2={WIDTH} y2={ORIGIN_Y} stroke="var(--border-strong)" strokeWidth="1" opacity="0.9" />

          <circle
            cx={ORIGIN_X}
            cy={ORIGIN_Y}
            r={normRadiusPx}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            opacity="0.28"
          />

          <line x1={ORIGIN_X} y1={ORIGIN_Y} x2={tip.x} y2={tip.y} stroke="#7C3AED" strokeWidth="2" />

          <circle
            cx={tip.x}
            cy={tip.y}
            r={9}
            fill="#7C3AED"
            stroke="none"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onPointerDown={handlePointerDown}
          />
        </svg>
      </div>

      <div className="mt-5 text-[15px] text-text-primary" style={{ fontFamily: mono }}>
        <div>v = ({fmt(vector[0])}, {fmt(vector[1])})</div>
        <div>‖v‖₂ = {fmt(normL2)}</div>
        <div>
          unit vector:{' '}
          {unitVector ? `(${fmt(unitVector[0])}, ${fmt(unitVector[1])})` : 'undefined'}
        </div>
      </div>

      <p
        className={`mt-4 text-[15px] italic text-text-secondary transition-opacity ${
          showIdleHint ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: showIdleHint ? '400ms' : '200ms' }}
      >
        Every point on that circle has the same norm.
        Same size. Different direction.
      </p>
    </section>
  )
}

export default NormExplorer
