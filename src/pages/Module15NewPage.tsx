import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import CurseOfDimensionality from '../components/module5/CurseOfDimensionality'
import DistanceBreaks from '../components/module5/DistanceBreaks'
import HighDimFailures from '../components/module5/HighDimFailures'
import Hook from '../components/module5/Hook'
import Quiz from '../components/module5/Quiz'
import RandomProjections from '../components/module5/RandomProjections'
import SphereEmpties from '../components/module5/SphereEmpties'
import ModuleLayout from '../components/ui/ModuleLayout'
import SectionErrorBoundary from '../components/ui/SectionErrorBoundary'

const sectionNames = [
  'Why Dimensions Matter',
  'Distance Breaks First',
  'The Sphere Empties Out',
  'The Curse of Dimensionality',
  'Random Projections',
  'When High Dimensions Fail',
  'Check Your Understanding'
]

const Module15NewPage = () => {
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

  const sectionWrappers = [
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
  ]

  return (
  <ModuleLayout moduleNumber="01.5" moduleTitle="High-Dimensional Geometry" className="module11-page module15-flat">
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px]" style={{ background: 'var(--border)' }}>
        <div
          className="h-full transition-[width] duration-150"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: 'var(--accent)',
            transitionTimingFunction: 'linear'
          }}
        />
      </div>

      <aside className="fixed left-8 top-1/2 z-30 hidden w-[270px] -translate-y-1/2 lg:block">
        <div className="flex">
          <div className="mr-6 w-px self-stretch" style={{ background: 'var(--border)' }} />
          <ul className="m-0 list-none space-y-5 p-0">
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
        <nav className="max-w-[900px] text-[13px]" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
          <a href="/module/1" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            Module 1: Vectors and Representations
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/1" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            1.1
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/2" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            1.2
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/3" className="text-[#94a3b8] no-underline hover:text-[#64748b]">
            1.3
          </a>
          <span className="px-2">&gt;</span>
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
              <hr className="my-16 w-full border-0" style={{ borderTop: '1px solid var(--border)' }} />
            )}
          </div>
        ))}

        {quizCompleted && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-[680px] py-4 text-center"
          >
            <div className="mx-auto h-10 w-10">
              <svg viewBox="0 0 40 40" width="40" height="40" role="img" aria-label="Module complete">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M11 20 L17 26 L29 14" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p
              className="mt-4"
              style={{
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
              className="inline-flex items-center rounded-[4px] px-4 py-2 text-sm font-medium text-white no-underline"
              style={{
                marginTop: 24,
                background: 'var(--accent)'
              }}
            >
              Continue to Module 2: Inner Products and Similarity
            </a>
          </motion.section>
        )}

      </div>
    </ModuleLayout>
  )
}

export default Module15NewPage
