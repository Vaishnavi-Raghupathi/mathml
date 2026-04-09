import { useEffect, useRef, useState } from 'react'
import { axisBottom, axisLeft } from 'd3-axis'
import { drag } from 'd3-drag'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'

type MoviePoint = {
  name: string
  romance: number
  action: number
}

type RankedMovie = MoviePoint & {
  distance: number
}

const MOVIES: MoviePoint[] = [
  { name: 'Titanic', romance: 0.88, action: 0.35 },
  { name: 'The Dark Knight', romance: 0.15, action: 0.92 },
  { name: 'La La Land', romance: 0.82, action: 0.12 },
  { name: 'Mad Max: Fury Road', romance: 0.08, action: 0.97 },
  { name: 'The Princess Bride', romance: 0.75, action: 0.45 }
]

const WIDTH = 600
const HEIGHT = 440
const PADDING_X = 50
const PADDING_Y = 40
const PLOT_WIDTH = WIDTH - PADDING_X * 2
const PLOT_HEIGHT = HEIGHT - PADDING_Y * 2

const mono = '"IBM Plex Mono", monospace'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const format = (value: number) => value.toFixed(2)

const distance = (a: { romance: number; action: number }, b: { romance: number; action: number }) => {
  const dx = a.romance - b.romance
  const dy = a.action - b.action
  return Math.sqrt(dx * dx + dy * dy)
}

const rankMovies = (point: { romance: number; action: number }): RankedMovie[] => {
  return MOVIES.map((movie) => ({ ...movie, distance: distance(point, movie) })).sort((a, b) => a.distance - b.distance)
}

const VectorSpacePlot = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const hasDraggedRef = useRef(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [dragPoint, setDragPoint] = useState({ romance: 0.5, action: 0.5 })
  const [ranked, setRanked] = useState<RankedMovie[]>(() => rankMovies({ romance: 0.5, action: 0.5 }))

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    const xScale = scaleLinear().domain([0, 1]).range([PADDING_X, PADDING_X + PLOT_WIDTH])
    const yScale = scaleLinear().domain([0, 1]).range([HEIGHT - PADDING_Y, HEIGHT - PADDING_Y - PLOT_HEIGHT])

    const gridXTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]
    const gridYTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]

    const xGrid = axisBottom(xScale)
      .tickValues(gridXTicks)
      .tickSize(-PLOT_HEIGHT)
      .tickFormat(() => '')

    const yGrid = axisLeft(yScale)
      .tickValues(gridYTicks)
      .tickSize(-PLOT_WIDTH)
      .tickFormat(() => '')

    const xGridLayer = svg
      .append('g')
      .attr('transform', `translate(0, ${HEIGHT - PADDING_Y})`)
      .call(xGrid)

    const yGridLayer = svg.append('g').attr('transform', `translate(${PADDING_X}, 0)`).call(yGrid)

    xGridLayer.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-width', 1)
    yGridLayer.selectAll('line').attr('stroke', 'var(--border)').attr('stroke-width', 1)
    xGridLayer.selectAll('.domain').remove()
    yGridLayer.selectAll('.domain').remove()

    const xAxis = axisBottom(xScale).tickValues([]).tickSize(0)
    const yAxis = axisLeft(yScale).tickValues([]).tickSize(0)

    svg
      .append('g')
      .attr('transform', `translate(0, ${HEIGHT - PADDING_Y})`)
      .call(xAxis)
      .select('.domain')
      .attr('stroke', 'var(--border-strong)')
      .attr('stroke-width', 1)

    svg
      .append('g')
      .attr('transform', `translate(${PADDING_X}, 0)`)
      .call(yAxis)
      .select('.domain')
      .attr('stroke', 'var(--border-strong)')
      .attr('stroke-width', 1)

    svg
      .append('text')
      .attr('x', PADDING_X + PLOT_WIDTH)
      .attr('y', HEIGHT - 10)
      .attr('text-anchor', 'end')
      .attr('fill', 'var(--text-muted)')
      .attr('font-size', 11)
      .attr('font-family', mono)
      .text('romance →')

    svg
      .append('text')
      .attr('x', PADDING_X)
      .attr('y', 18)
      .attr('text-anchor', 'start')
      .attr('fill', 'var(--text-muted)')
      .attr('font-size', 11)
      .attr('font-family', mono)
      .text('action →')

    const fixedLayer = svg.append('g')

    const fixedPoints = fixedLayer
      .selectAll('g.fixed-point')
      .data(MOVIES)
      .enter()
      .append('g')
      .attr('class', 'fixed-point')
      .attr('transform', (d: MoviePoint) => `translate(${xScale(d.romance)}, ${yScale(d.action)})`)

    fixedPoints
      .append('circle')
      .attr('r', 6)
      .attr('fill', 'var(--border-strong)')

    fixedPoints
      .append('text')
      .attr('x', (d: MoviePoint) => (xScale(d.romance) > WIDTH - 120 ? -10 : 10))
      .attr('y', 4)
      .attr('text-anchor', (d: MoviePoint) => (xScale(d.romance) > WIDTH - 120 ? 'end' : 'start'))
      .attr('fill', 'var(--text-secondary)')
      .attr('font-family', mono)
      .attr('font-size', 11)
      .text((d: MoviePoint) => d.name)

    fixedPoints
      .on('mouseenter', function (this: SVGGElement) {
        const group = select(this)
        group.select('circle').attr('fill', 'var(--accent)')
        group.select('text').attr('fill', 'var(--text-primary)')
      })
      .on('mouseleave', function (this: SVGGElement) {
        const group = select(this)
        group.select('circle').attr('fill', 'var(--border-strong)')
        group.select('text').attr('fill', 'var(--text-secondary)')
      })

    const overlayLayer = svg.append('g')

    const connector = overlayLayer
      .append('line')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4')
      .attr('opacity', 0.4)

    const userLabel = overlayLayer
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .attr('font-family', mono)
      .attr('font-size', 11)
      .text('you are here')

    const userPoint = overlayLayer
      .append('circle')
      .attr('r', 10)
      .attr('fill', 'var(--accent)')
      .style('cursor', 'grab')

    const updateVisuals = (svgX: number, svgY: number) => {
      userPoint.attr('cx', svgX).attr('cy', svgY)
      userLabel.attr('x', svgX).attr('y', svgY - 16)
    }

    const updateConnector = (point: { romance: number; action: number }, nearest: RankedMovie | null) => {
      if (!nearest) {
        connector.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0)
        return
      }

      connector
        .attr('x1', xScale(point.romance))
        .attr('y1', yScale(point.action))
        .attr('x2', xScale(nearest.romance))
        .attr('y2', yScale(nearest.action))
    }

    const updateFromSvgPosition = (rawX: number, rawY: number, commit: boolean) => {
      const clampedX = clamp(rawX, PADDING_X, PADDING_X + PLOT_WIDTH)
      const clampedY = clamp(rawY, PADDING_Y, HEIGHT - PADDING_Y)

      updateVisuals(clampedX, clampedY)

      const logicalPoint = {
        romance: (clampedX - PADDING_X) / PLOT_WIDTH,
        action: (HEIGHT - PADDING_Y - clampedY) / PLOT_HEIGHT
      }

      const nextRanked = rankMovies(logicalPoint)
      setRanked(nextRanked)
      updateConnector(logicalPoint, nextRanked[0] ?? null)

      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true
        setHasDragged(true)
      }

      if (commit) {
        setDragPoint(logicalPoint)
      }
    }

    const initialX = xScale(dragPoint.romance)
    const initialY = yScale(dragPoint.action)
    updateVisuals(initialX, initialY)
    updateConnector(dragPoint, rankMovies(dragPoint)[0] ?? null)

    const dragBehavior = drag<SVGCircleElement, unknown>()
      .on('start', () => {
        userPoint.style('cursor', 'grabbing')
      })
      .on('drag', (event: { x: number; y: number }) => {
        updateFromSvgPosition(event.x, event.y, false)
      })
      .on('end', (event: { x: number; y: number }) => {
        userPoint.style('cursor', 'grab')
        updateFromSvgPosition(event.x, event.y, true)
      })

    userPoint.call(dragBehavior)

    return () => {
      userPoint.on('.drag', null)
      svg.selectAll('*').remove()
    }
  }, [dragPoint])

  return (
    <section className="w-full">
      <div className="mb-3 text-[12px] uppercase tracking-widest text-text-muted" style={{ fontFamily: mono }}>
        EXERCISE 02
      </div>

      <hr className="border-0 border-t border-border" />

      <div className="py-6">
        <div className="mx-auto flex w-full max-w-[860px] flex-col items-start justify-center gap-8">
          <svg
            ref={svgRef}
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block h-auto w-full max-w-[600px]"
            role="img"
            aria-label="Vector space movie plot"
          />

          <aside className="w-full max-w-[600px] pt-1">
            <h3 className="mb-3 text-[11px] uppercase tracking-widest text-text-muted" style={{ fontFamily: mono }}>
              nearest movies
            </h3>

            <ul className="m-0 list-none p-0">
              {ranked.map((movie, index) => {
                const isClosest = index === 0
                return (
                  <li key={movie.name} className="flex items-baseline justify-between border-b border-border py-3" style={{ fontFamily: mono }}>
                    <span className={`pr-3 text-[13px] ${isClosest ? 'text-text-primary' : 'text-text-secondary'}`}>{movie.name}</span>
                    <span className="text-[11px] text-text-muted">{format(movie.distance)}</span>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>

        <div className="mx-auto mt-5 w-full max-w-[860px]">
          {hasDragged ? (
            <p className="max-w-none text-left text-[15px] italic text-text-secondary" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
              Notice where the boundaries are. La La Land and The Princess Bride are both high romance, but they are very different films. Romance and action alone cannot capture everything.
            </p>
          ) : null}

          <p className="max-w-none text-left text-[12px] text-text-muted" style={{ fontFamily: mono }}>
            These are only 2 of hundreds of dimensions real systems use.
          </p>
        </div>
      </div>

      <hr className="border-0 border-t border-border" />
    </section>
  )
}

export default VectorSpacePlot