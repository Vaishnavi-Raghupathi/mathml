import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { drag, D3DragEvent, select } from 'd3'
import { abs, add, divide, floor, max, min, multiply, sqrt, subtract } from 'mathjs'

export type Vector2 = [number, number]

type VectorDemoProps = {
  onVectorsChange?: (vecA: Vector2, vecB: Vector2) => void
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 500
const UNIT_SCALE = 40
const MAX_X_UNITS = divide(CANVAS_WIDTH, multiply(2, UNIT_SCALE)) as number
const MAX_Y_UNITS = divide(CANVAS_HEIGHT, multiply(2, UNIT_SCALE)) as number
const UPDATE_EPSILON = 0.001
const ARROW_MIN_MAGNITUDE = 0.2

const toSVG = ([x, y]: Vector2): Vector2 => {
  const centerX = divide(CANVAS_WIDTH, 2) as number
  const centerY = divide(CANVAS_HEIGHT, 2) as number

  return [
    add(centerX, multiply(x, UNIT_SCALE)) as number,
    subtract(centerY, multiply(y, UNIT_SCALE)) as number
  ]
}

const toMath = ([x, y]: Vector2): Vector2 => {
  const centerX = divide(CANVAS_WIDTH, 2) as number
  const centerY = divide(CANVAS_HEIGHT, 2) as number

  return [
    divide(subtract(x, centerX), UNIT_SCALE) as number,
    divide(subtract(centerY, y), UNIT_SCALE) as number
  ]
}

const isFiniteVector = ([x, y]: Vector2): boolean => {
  return Number.isFinite(x) && Number.isFinite(y)
}

const clampVectorToBounds = ([x, y]: Vector2): Vector2 => {
  const clampedX = max(-MAX_X_UNITS, min(MAX_X_UNITS, x)) as number
  const clampedY = max(-MAX_Y_UNITS, min(MAX_Y_UNITS, y)) as number
  return [clampedX, clampedY]
}

const vectorMagnitude = ([x, y]: Vector2): number => {
  return sqrt(add(multiply(x, x), multiply(y, y))) as number
}

const VectorDemo = ({ onVectorsChange }: VectorDemoProps) => {
  const [vecA, setVecA] = useState<Vector2>([4, 3])
  const [vecB, setVecB] = useState<Vector2>([2, 5])
  const markerPrefix = useId().replace(/:/g, '-')
  const svgRef = useRef<SVGSVGElement | null>(null)
  const handleARef = useRef<SVGCircleElement | null>(null)
  const handleBRef = useRef<SVGCircleElement | null>(null)
  const pendingARef = useRef<Vector2 | null>(null)
  const pendingBRef = useRef<Vector2 | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!svgRef.current || !handleARef.current || !handleBRef.current) {
      return
    }

    const applyDraggedPoint = (
      event: D3DragEvent<SVGCircleElement, unknown, unknown>,
      pendingRef: React.MutableRefObject<Vector2 | null>
    ) => {
      const draggedSvgPoint: Vector2 = [event.x, event.y]
      const draggedMathPoint = toMath(draggedSvgPoint)

      if (!isFiniteVector(draggedMathPoint)) {
        return
      }

      const clampedMathPoint = clampVectorToBounds(draggedMathPoint)
      pendingRef.current = clampedMathPoint

      if (rafIdRef.current !== null) {
        return
      }

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null

        if (pendingARef.current) {
          const nextA = pendingARef.current
          pendingARef.current = null
          setVecA((prev) => {
            const dx = abs(subtract(nextA[0], prev[0]) as number) as number
            const dy = abs(subtract(nextA[1], prev[1]) as number) as number
            return dx < UPDATE_EPSILON && dy < UPDATE_EPSILON ? prev : nextA
          })
        }

        if (pendingBRef.current) {
          const nextB = pendingBRef.current
          pendingBRef.current = null
          setVecB((prev) => {
            const dx = abs(subtract(nextB[0], prev[0]) as number) as number
            const dy = abs(subtract(nextB[1], prev[1]) as number) as number
            return dx < UPDATE_EPSILON && dy < UPDATE_EPSILON ? prev : nextB
          })
        }
      })
    }

    const dragA = drag<SVGCircleElement, unknown>().on('drag', (event: D3DragEvent<SVGCircleElement, unknown, unknown>) => {
      applyDraggedPoint(event, pendingARef)
    })

    const dragB = drag<SVGCircleElement, unknown>().on('drag', (event: D3DragEvent<SVGCircleElement, unknown, unknown>) => {
      applyDraggedPoint(event, pendingBRef)
    })

    const handleASelection = select(handleARef.current)
    const handleBSelection = select(handleBRef.current)

    handleASelection.call(dragA)
    handleBSelection.call(dragB)

    return () => {
      handleASelection.on('.drag', null)
      handleBSelection.on('.drag', null)

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      pendingARef.current = null
      pendingBRef.current = null
    }
  }, [])

  useEffect(() => {
    onVectorsChange?.(vecA, vecB)
  }, [vecA, vecB, onVectorsChange])

  const derived = useMemo(() => {
    const sum = add(vecA, vecB) as Vector2
    const magnitudeA = vectorMagnitude(vecA)
    const magnitudeB = vectorMagnitude(vecB)
    const magnitudeSum = vectorMagnitude(sum)

    const showArrowA = magnitudeA > ARROW_MIN_MAGNITUDE
    const showArrowB = magnitudeB > ARROW_MIN_MAGNITUDE
    const showArrowSum = magnitudeSum > ARROW_MIN_MAGNITUDE

    const origin = toSVG([0, 0])
    const pointA = toSVG(vecA)
    const pointB = toSVG(vecB)
    const pointSum = toSVG(sum)

    return {
      sum,
      origin,
      pointA,
      pointB,
      pointSum,
      showArrowA,
      showArrowB,
      showArrowSum
    }
  }, [vecA, vecB])

  const gridLines = useMemo(() => {
    const xUnits = floor(divide(CANVAS_WIDTH, multiply(2, UNIT_SCALE))) as number
    const yUnits = floor(divide(CANVAS_HEIGHT, multiply(2, UNIT_SCALE))) as number

    const vertical = Array.from({ length: add(multiply(xUnits, 2), 1) as number }, (_, index) => {
      const xUnit = subtract(index, xUnits) as number
      const [x] = toSVG([xUnit, 0])
      return x
    })

    const horizontal = Array.from({ length: add(multiply(yUnits, 2), 1) as number }, (_, index) => {
      const yUnit = subtract(index, yUnits) as number
      const [, y] = toSVG([0, yUnit])
      return y
    })

    return { vertical, horizontal }
  }, [])

  return (
    <div className="space-y-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="mx-auto w-full max-w-[600px] rounded-lg border border-border bg-background"
        role="img"
        aria-label="Vector visualization"
      >
        <defs>
          <marker
            id={`${markerPrefix}-arrowhead-purple`}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#00F5D4" />
          </marker>
          <marker
            id={`${markerPrefix}-arrowhead-cyan`}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#22D3EE" />
          </marker>
          <marker
            id={`${markerPrefix}-arrowhead-gold`}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#E6F1F5" />
          </marker>
        </defs>

        {gridLines.vertical.map((x) => (
          <line
            key={`grid-v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={CANVAS_HEIGHT}
            stroke="#7AA2B2"
            strokeWidth={0.75}
            opacity={0.2}
          />
        ))}

        {gridLines.horizontal.map((y) => (
          <line
            key={`grid-h-${y}`}
            x1={0}
            y1={y}
            x2={CANVAS_WIDTH}
            y2={y}
            stroke="#7AA2B2"
            strokeWidth={0.75}
            opacity={0.2}
          />
        ))}

        <line
          x1={0}
          y1={derived.origin[1]}
          x2={CANVAS_WIDTH}
          y2={derived.origin[1]}
          stroke="#7AA2B2"
          strokeWidth={1.5}
        />
        <line
          x1={derived.origin[0]}
          y1={0}
          x2={derived.origin[0]}
          y2={CANVAS_HEIGHT}
          stroke="#7AA2B2"
          strokeWidth={1.5}
        />

        <line
          x1={derived.pointA[0]}
          y1={derived.pointA[1]}
          x2={derived.pointSum[0]}
          y2={derived.pointSum[1]}
          stroke="#7AA2B2"
          strokeWidth={1.5}
          strokeDasharray="6 6"
          opacity={0.8}
        />
        <line
          x1={derived.pointB[0]}
          y1={derived.pointB[1]}
          x2={derived.pointSum[0]}
          y2={derived.pointSum[1]}
          stroke="#7AA2B2"
          strokeWidth={1.5}
          strokeDasharray="6 6"
          opacity={0.8}
        />

        <line
          x1={derived.origin[0]}
          y1={derived.origin[1]}
          x2={derived.pointA[0]}
          y2={derived.pointA[1]}
          stroke="#00F5D4"
          strokeWidth={3}
          markerEnd={derived.showArrowA ? `url(#${markerPrefix}-arrowhead-purple)` : undefined}
        />
        <line
          x1={derived.origin[0]}
          y1={derived.origin[1]}
          x2={derived.pointB[0]}
          y2={derived.pointB[1]}
          stroke="#22D3EE"
          strokeWidth={3}
          markerEnd={derived.showArrowB ? `url(#${markerPrefix}-arrowhead-cyan)` : undefined}
        />
        <line
          x1={derived.origin[0]}
          y1={derived.origin[1]}
          x2={derived.pointSum[0]}
          y2={derived.pointSum[1]}
          stroke="#E6F1F5"
          strokeWidth={3}
          markerEnd={derived.showArrowSum ? `url(#${markerPrefix}-arrowhead-gold)` : undefined}
        />

        <circle
          ref={handleARef}
          cx={derived.pointA[0]}
          cy={derived.pointA[1]}
          r={8}
          fill="#00F5D4"
          stroke="#E6F1F5"
          strokeWidth={1.5}
          style={{ cursor: 'grab' }}
        />
        <circle
          ref={handleBRef}
          cx={derived.pointB[0]}
          cy={derived.pointB[1]}
          r={8}
          fill="#22D3EE"
          stroke="#E6F1F5"
          strokeWidth={1.5}
          style={{ cursor: 'grab' }}
        />
        <circle cx={derived.pointSum[0]} cy={derived.pointSum[1]} r={4} fill="#E6F1F5" />

        <text
          x={add(derived.pointA[0], 10) as number}
          y={subtract(derived.pointA[1], 10) as number}
          fill="#00F5D4"
          fontSize="14"
          pointerEvents="none"
        >
          A ({vecA[0]}, {vecA[1]})
        </text>
        <text
          x={add(derived.pointB[0], 10) as number}
          y={subtract(derived.pointB[1], 10) as number}
          fill="#22D3EE"
          fontSize="14"
          pointerEvents="none"
        >
          B ({vecB[0]}, {vecB[1]})
        </text>
        <text
          x={add(derived.pointSum[0], 10) as number}
          y={subtract(derived.pointSum[1], 10) as number}
          fill="#E6F1F5"
          fontSize="14"
          pointerEvents="none"
        >
          A+B ({derived.sum[0]}, {derived.sum[1]})
        </text>
      </svg>

    </div>
  )
}

export default VectorDemo