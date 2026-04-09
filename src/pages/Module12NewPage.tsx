import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Hook from '../components/module2/Hook'
import L1Norm from '../components/module2/L1Norm'
import NormFailures from '../components/module2/NormFailures'
import NormGeometry from '../components/module2/NormGeometry'
import NormsInML from '../components/module2/NormsInML'
import Quiz from '../components/module2/Quiz'
import WhatIsANorm from '../components/module2/WhatIsANorm'
import ModuleLayout from '../components/ui/ModuleLayout'
import SectionErrorBoundary from '../components/ui/SectionErrorBoundary'

const sectionNames = [
  'Why Size Matters',
  'What is a Norm',
  'The L1 Norm',
  'Geometry of Norms',
  'Norms in ML',
  'When Norms Fail',
  'Check Your Understanding'
]

const Module12NewPage = () => {
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
        key: 'what-is-a-norm',
        content: (
          <SectionErrorBoundary sectionName="WhatIsANorm">
            <WhatIsANorm />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'l1-norm',
        content: (
          <SectionErrorBoundary sectionName="L1Norm">
            <L1Norm />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'norm-geometry',
        content: (
          <SectionErrorBoundary sectionName="NormGeometry">
            <NormGeometry />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'norms-in-ml',
        content: (
          <SectionErrorBoundary sectionName="NormsInML">
            <NormsInML />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'norm-failures',
        content: (
          <SectionErrorBoundary sectionName="NormFailures">
            <NormFailures />
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
    <ModuleLayout moduleNumber="01.2" moduleTitle="Norms (New)" className="module11-page">
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] bg-[#1a2740]">
        <div
          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#1d4ed8] transition-[width] duration-150"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <aside className="fixed left-8 top-1/2 z-30 hidden w-[250px] -translate-y-1/2 lg:block">
        <ul className="space-y-5">
          {sectionNames.map((name, index) => (
            <li key={name} className="relative">
              <button
                type="button"
                onClick={() => sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`w-full pl-8 text-left text-[14px] ${
                  activeSection === index ? 'font-medium text-[#d6deed]' : 'font-normal text-[#5d6f8e] hover:text-[#9aaccb]'
                }`}
                aria-label={`Go to ${name}`}
              >
                {name}
              </button>
              <span
                className={`absolute left-0 top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border transition-colors duration-150 ${
                  activeSection === index ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-[#3f5b85] bg-[#3f5b85]'
                }`}
              />
            </li>
          ))}
        </ul>
      </aside>

      <div className="module11-clean flex flex-col gap-16">
        <nav className="max-w-[900px] text-sm text-[#94a3b8]">
          <a href="/module/1" className="text-[#94a3b8] no-underline hover:text-[#cbd5e1]">
            Module 1: Vectors and Representations
          </a>
          <span className="px-2">&gt;</span>
          <a href="/module/1/1" className="text-[#94a3b8] no-underline hover:text-[#cbd5e1]">
            1.1 Vectors
          </a>
          <span className="px-2">&gt;</span>
          <span className="text-[#cbd5e1]">1.2 Norms</span>
        </nav>

        {sectionWrappers.map((section, index) => (
          <div key={section.key}>
            <motion.section
              ref={(el) => {
                sectionRefs.current[index] = el
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed[index] ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className={revealed[index] ? '' : 'pointer-events-none h-0 overflow-hidden'}
            >
              {section.content}
            </motion.section>

            {index < sectionWrappers.length - 1 && <hr className="my-10 w-full border-border opacity-35" />}
          </div>
        ))}

        {revealed[6] && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[860px] py-4"
          >
            <div className="flex items-center gap-3">
              <motion.svg
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewBox="0 0 24 24"
                className="h-6 w-6 text-green-400"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            <p className="mt-3 text-text-secondary">
              You can now explain why L1 and L2 regularization produce fundamentally different models.
            </p>

            <a
              href="/module/1/3"
              className="inline-flex items-center rounded bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-[#6d28d9]"
            >
              Next: Vector Addition and Linear Combinations
            </a>
          </motion.section>
        )}
      </div>
    </ModuleLayout>
  )
}

export default Module12NewPage
