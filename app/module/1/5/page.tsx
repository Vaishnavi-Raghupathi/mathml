"use client"

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import CurseOfDimensionality from '../../../../src/components/module5/CurseOfDimensionality'
import DistanceBreaks from '../../../../src/components/module5/DistanceBreaks'
import HighDimFailures from '../../../../src/components/module5/HighDimFailures'
import Hook from '../../../../src/components/module5/Hook'
import Quiz from '../../../../src/components/module5/Quiz'
import RandomProjections from '../../../../src/components/module5/RandomProjections'
import SphereEmpties from '../../../../src/components/module5/SphereEmpties'
import SectionErrorBoundary from '../../../../src/components/ui/SectionErrorBoundary'

const sectionNames = [
  'Why Dimensions Matter',
  'Distance Breaks First',
  'The Sphere Empties Out',
  'The Curse of Dimensionality',
  'Random Projections',
  'When High Dimensions Fail',
  'Check Your Understanding'
]

const Page = () => {
  const [revealed, setRevealed] = useState<boolean[]>([true, false, false, false, false, false, false])
  const [activeSection, setActiveSection] = useState(0)
  const [progress, setProgress] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

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
          <SectionErrorBoundary sectionName="Module1.5 Hook">
            <Hook onComplete={() => revealNextFrom(0)} />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'distance-breaks',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 DistanceBreaks">
            <DistanceBreaks />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'sphere-empties',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 SphereEmpties">
            <SphereEmpties />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'curse-of-dimensionality',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 CurseOfDimensionality">
            <CurseOfDimensionality />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'random-projections',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 RandomProjections">
            <RandomProjections />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'high-dim-failures',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 HighDimFailures">
            <HighDimFailures />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'quiz',
        content: (
          <SectionErrorBoundary sectionName="Module1.5 Quiz">
            <Quiz onComplete={() => setQuizCompleted(true)} />
          </SectionErrorBoundary>
        )
      }
    ],
    []
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: '#1e293b',
          zIndex: 40
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            background: '#3b82f6',
            transition: 'width 150ms linear'
          }}
        />
      </div>

      <aside className="fixed left-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <div style={{ display: 'flex' }}>
          <div style={{ width: 1, background: '#1e293b', marginRight: 20 }} />
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', rowGap: 20 }}>
            {sectionNames.map((name, index) => {
              const isActive = activeSection === index
              return (
                <li key={name} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 0 0 16px',
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? '#3b82f6' : '#475569'
                    }}
                    aria-label={`Go to ${name}`}
                  >
                    {name}
                  </button>

                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 2,
                        height: 14,
                        background: '#3b82f6'
                      }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main style={{ margin: '0 auto', width: '100%', maxWidth: 920, padding: '88px 20px 80px' }}>
        <nav style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#475569', marginBottom: 24 }}>
          <a href="/module/1" style={{ color: '#475569', textDecoration: 'none' }}>
            Module 1: Vectors and Representations
          </a>
          <span style={{ padding: '0 8px' }}>&gt;</span>
          <a href="/module/1/1" style={{ color: '#475569', textDecoration: 'none' }}>
            1.1
          </a>
          <span style={{ padding: '0 8px' }}>&gt;</span>
          <a href="/module/1/2" style={{ color: '#475569', textDecoration: 'none' }}>
            1.2
          </a>
          <span style={{ padding: '0 8px' }}>&gt;</span>
          <a href="/module/1/3" style={{ color: '#475569', textDecoration: 'none' }}>
            1.3
          </a>
          <span style={{ padding: '0 8px' }}>&gt;</span>
          <span style={{ color: '#e2e8f0' }}>1.5 High-Dimensional Geometry</span>
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

            {index < sectionWrappers.length - 1 && (
              <hr style={{ border: 0, borderTop: '1px solid #1e293b', margin: '64px 0' }} />
            )}
          </div>
        ))}

        {quizCompleted && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 40, textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 40 40" width="40" height="40" role="img" aria-label="Module complete">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M11 20 L17 26 L29 14" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p
              style={{
                marginTop: 16,
                fontFamily: 'Inter, sans-serif',
                fontSize: 20,
                fontWeight: 600,
                color: '#f9fafb',
                lineHeight: 1.5
              }}
            >
              You now understand why high-dimensional spaces
              break intuition and how production ML systems
              are designed around that reality.
            </p>

            <a
              href="/module/2/1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginTop: 24,
                padding: '10px 16px',
                borderRadius: 4,
                background: '#3b82f6',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Continue to Module 2: Inner Products and Similarity
            </a>
          </motion.section>
        )}
      </main>
    </div>
  )
}

export default Page
