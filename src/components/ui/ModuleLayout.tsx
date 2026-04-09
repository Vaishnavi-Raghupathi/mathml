import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'

type ModuleLayoutProps = {
  moduleNumber: string
  moduleTitle: string
  children: ReactNode
  className?: string
}

const monoFont = '"IBM Plex Mono", monospace'

const moduleSequence = [
  { number: '01', name: 'Vectors', href: '/module/1' },
  { number: '02', name: 'Dot Product', href: '/module/2' },
  { number: '03', name: 'Matrices', href: '/module/3' }
]

const getNextModule = (moduleNumber: string) => {
  const currentIndex = moduleSequence.findIndex((module) => module.number === moduleNumber)

  if (currentIndex < 0 || currentIndex === moduleSequence.length - 1) {
    return null
  }

  return moduleSequence[currentIndex + 1]
}

const ModuleLayout = ({ moduleNumber, moduleTitle, children, className = '' }: ModuleLayoutProps) => {
  const nextModule = getNextModule(moduleNumber)

  return (
    <div className={`app-ui-system min-h-screen bg-background text-text-primary ${className}`}>
      <NavBar />

      <main className="mx-auto w-full max-w-[680px] px-4 pb-16 pt-20 sm:px-8 sm:pb-20">
        <header className="mb-10 pt-6 sm:mb-12 sm:pt-10">
          <p
            className="mb-3 max-w-none text-left uppercase"
            style={{
              fontFamily: 'IBM Plex Sans, system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '1.5px',
              color: '#4f5f7b'
            }}
          >
            Module {moduleNumber}
          </p>
          <h1>{moduleTitle}</h1>
          <hr className="mt-8 border-0 border-t border-border" />
        </header>

        <section>{children}</section>

        {nextModule ? (
          <footer className="mt-16 pb-6">
            <Link
              to={nextModule.href}
              className="text-[13px] text-text-muted no-underline transition-colors duration-150 hover:text-text-primary"
              style={{ fontFamily: monoFont }}
            >
              Next: {nextModule.name} →
            </Link>
          </footer>
        ) : null}
      </main>
    </div>
  )
}

export default ModuleLayout
