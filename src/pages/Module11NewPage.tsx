import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Geometry from '../components/module1/Geometry'
import Hook from '../components/module1/Hook'
import Quiz from '../components/module1/Quiz'
import RepresentationFailures from '../components/module1/RepresentationFailures'
import TheCode from '../components/module1/TheCode'
import WhatIsAVector from '../components/module1/WhatIsAVector'
import ModuleLayout from '../components/ui/ModuleLayout'
import SectionErrorBoundary from '../components/ui/SectionErrorBoundary'

const sectionNames = [
  'Vectors as Representations',
  'What is a Vector',
  'The Code',
  'The Geometry',
  'When Representations Fail',
  'Check Your Understanding'
]

const Module11NewPage = () => {
  const [revealed, setRevealed] = useState<boolean[]>([true, false, false, false, false, false])
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

      // Reveal next section once user has scrolled past 80% of current section.
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
        key: 'what-is-vector',
        content: (
          <SectionErrorBoundary sectionName="WhatIsAVector">
            <WhatIsAVector />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'the-code',
        content: (
          <SectionErrorBoundary sectionName="TheCode">
            <TheCode />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'geometry',
        content: (
          <SectionErrorBoundary sectionName="Geometry">
            <Geometry />
          </SectionErrorBoundary>
        )
      },
      {
        key: 'representation-failures',
        content: (
          <SectionErrorBoundary sectionName="RepresentationFailures">
            <RepresentationFailures />
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
    <ModuleLayout moduleNumber="01.1" moduleTitle="Vectors as Representations (New)" className="module11-page">
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] bg-[#1a2740]">
        <div
          className="h-full bg-[#1d4ed8] transition-[width] duration-150"
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
                  activeSection === index ? 'border-[#1d4ed8] bg-[#1d4ed8]' : 'border-[#3f5b85] bg-[#3f5b85]'
                }`}
              />
            </li>
          ))}
        </ul>
      </aside>

      <div className="module11-clean flex flex-col gap-16">
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

              {revealed[index] && index > 0 && index < sectionWrappers.length - 1 && !revealed[index + 1] && (
                <div className="max-w-[680px] pt-4">
                  <button
                    type="button"
                    onClick={() => revealNextFrom(index)}
                    className="text-sm text-text-primary underline underline-offset-4"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </motion.section>

            {index < sectionWrappers.length - 1 && <hr className="my-10 w-full border-border opacity-35" />}
          </div>
        ))}

        {revealed[5] && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[680px] py-4"
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
              <h3 className="mb-0">Module Complete</h3>
            </div>

            <p className="mt-3 text-text-secondary">
              You can now explain what a vector is without using the word arrow.
            </p>

            <a
              href="/module/1/2"
              className="inline-flex items-center text-sm text-[#60a5fa] no-underline transition hover:text-[#93c5fd]"
            >
              Next: Norms →
            </a>
          </motion.section>
        )}
      </div>
    </ModuleLayout>
  )
}

export default Module11NewPage
