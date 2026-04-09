'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Hook from '../../../../src/components/module3/Hook'
import LinearCombinationFailures from '../../../../src/components/module3/LinearCombinationFailures'
import LinearCombinations from '../../../../src/components/module3/LinearCombinations'
import Quiz from '../../../../src/components/module3/Quiz'
import ScalarMultiplication from '../../../../src/components/module3/ScalarMultiplication'
import Span from '../../../../src/components/module3/Span'
import VectorAddition from '../../../../src/components/module3/VectorAddition'
import ModuleLayout from '../../../../src/components/ui/ModuleLayout'
import SectionErrorBoundary from '../../../../src/components/ui/SectionErrorBoundary'

const sectionNames = [
  'Why Addition Matters',
  'Vector Addition',
  'Scalar Multiplication',
  'Linear Combinations',
  'Span',
  'When Combinations Fail',
  'Check Your Understanding'
]

const Page = () => {
  const [revealed, setRevealed] = useState<boolean[]>([true, false, false, false, false, false, false])
  const [activeSection, setActiveSection] = useState(0)
  const [progress, setProgress] = useState(0)

  const sectionRefs = useRef<Array<HTMLElement | null>>([])

  const revealUpTo = (index: number) => {
    setRevealed((prev) => {
      const next = [...prev]
      for (let i = 0; i <= index && i < next.length; i += 1) {
        next[i] = true
      }
      return next
    })
  }

  const revealNextFrom = (index: number) => {
    revealUpTo(index + 1)
    const nextRef = sectionRefs.current[index + 1]
    if (nextRef) {
      window.requestAnimationFrame(() => {
        nextRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = documentHeight > 0 ? Math.min(1, Math.max(0, scrollTop / documentHeight)) : 0
      setProgress(ratio)

      let currentActive = 0
      sectionRefs.current.forEach((section, idx) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.35) {
          currentActive = idx
        }
      })
      setActiveSection(currentActive)

      sectionRefs.current.forEach((section, idx) => {
        if (!section || idx >= sectionRefs.current.length - 1) return
        if (revealed[idx + 1]) return

        const trigger = section.offsetTop + section.offsetHeight * 0.8
        const viewportBottom = window.scrollY + window.innerHeight
        if (viewportBottom >= trigger) {
          revealUpTo(idx + 1)
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [revealed])

  const sectionWrappers = useMemo(
    () => [
      {
        key: 'hook',
        content: (
          <SectionErrorBoundary sectionName="Hook">
            <Hook onComplete={() => revealNextFrom(0)} />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'vector-addition',
        content: (
          <SectionErrorBoundary sectionName="VectorAddition">
            <VectorAddition />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'scalar-multiplication',
        content: (
          <SectionErrorBoundary sectionName="ScalarMultiplication">
            <ScalarMultiplication />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'linear-combinations',
        content: (
          <SectionErrorBoundary sectionName="LinearCombinations">
            <LinearCombinations />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'span',
        content: (
          <SectionErrorBoundary sectionName="Span">
            <Span />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'linear-combination-failures',
        content: (
          <SectionErrorBoundary sectionName="LinearCombinationFailures">
            <LinearCombinationFailures />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'quiz',
        content: (
          <SectionErrorBoundary sectionName="Quiz">
            <Quiz />
          </SectionErrorBoundary>
        )
      }
    ],
    []
  )

  return (
    <ModuleLayout moduleNumber="01.3" moduleTitle="Vector Addition and Linear Combinations" className="module11-page">
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px]" style={{ background: 'var(--border)' }}>
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${Math.round(progress * 100)}%`, background: 'var(--accent)', transitionTimingFunction: 'linear' }}
        />
      </div>

      <aside className="fixed left-8 top-1/2 z-30 hidden w-[270px] -translate-y-1/2 lg:block">
        <div className="flex">
          <div className="mr-6 w-px self-stretch" style={{ background: 'var(--border)' }} />
          <ul className="list-none space-y-5 p-0 m-0">
            {sectionNames.map((name, index) => {
              const isActive = activeSection === index
              return (
                <li key={name} className="relative">
                  <button
                    type="button"
                    onClick={() => sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="w-full bg-transparent pl-5 text-left text-[14px]"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                    aria-label={`Go to ${name}`}
                  >
                    {name}
                  </button>

                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2"
                      style={{ width: '2px', height: '14px', background: 'var(--accent)' }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <div className="module11-clean flex flex-col">
        <nav className="max-w-[900px] text-[13px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}>
          <a href="/module/1" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            Module 1: Vectors and Representations
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/1" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            1.1 Vectors
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/2" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            1.2 Norms
          </a>
          <span className="px-2">&gt;</span>
          <span style={{ color: 'var(--text-primary)' }}>1.3 Vector Addition and Linear Combinations</span>
        </nav>

        {sectionWrappers.map((section, index) => (
          <div key={section.key}>
            <motion.section
              ref={(el) => {
                sectionRefs.current[index] = el
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed[index] ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={revealed[index] ? '' : 'pointer-events-none h-0 overflow-hidden'}
            >
              {section.content}
            </motion.section>

            {index < sectionWrappers.length - 1 && <hr className="my-16 w-full border-0" style={{ borderTop: '1px solid var(--border)' }} />}
          </div>
        ))}

        {revealed[6] && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-[680px] py-4 text-center"
          >
            <div className="mx-auto h-10 w-10">
              <svg viewBox="0 0 40 40" className="h-10 w-10" role="img" aria-label="Module completed">
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent)" strokeWidth="2" />
                <path d="M 11 20 L 17 26 L 29 14" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p
              className="mt-4"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '16px' }}
            >
              You can now read a neural network forward pass as a sequence of linear combinations.
            </p>

            <a
              href="/module/1/5"
              className="inline-flex items-center rounded-[4px] px-4 py-2 text-sm font-medium text-white no-underline"
              style={{ background: 'var(--accent)', marginTop: '24px' }}
            >
              Next: High-Dimensional Geometry
            </a>
          </motion.section>
        )}
      </div>
    </ModuleLayout>
  )
}

export default Page
