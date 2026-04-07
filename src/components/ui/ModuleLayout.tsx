import { ComponentType, ReactNode } from 'react'
import ChallengePrompt from './ChallengePrompt'
import MLConnection from './MLConnection'
import MathBlock from './MathBlock'
import NavBar from './NavBar'

type ModuleLayoutProps = {
  moduleNumber: number
  title: string
  description: string
  Demo: ComponentType
  stats: ReactNode
  intuition: string
  formalMath: Array<{ eq: string; annotation: string }>
  challengePrompt: string
  mlConnection: string
}

const ModuleLayout = ({
  moduleNumber,
  title,
  description,
  Demo,
  stats,
  intuition,
  formalMath,
  challengePrompt,
  mlConnection
}: ModuleLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background text-text-primary">
      <NavBar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
        <section className="rounded-xl bg-card p-6">
          <div className="mb-3 inline-flex items-center gap-3">
            <span className="rounded-full bg-accent-purple px-3 py-1 text-sm font-semibold text-white">
              {String(moduleNumber).padStart(2, '0')}
            </span>
            <span className="rounded-full border border-accent-cyan/40 px-3 py-1 text-xs uppercase tracking-wide text-accent-cyan">
              Linear Algebra
            </span>
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-text-secondary">{description}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl bg-card p-6 lg:col-span-3">
            <Demo />
          </div>
          <aside className="rounded-xl bg-card p-6 lg:col-span-2">{stats}</aside>
        </section>

        <section className="rounded-xl bg-card p-6">
          <h2 className="text-2xl font-semibold">The Intuition</h2>
          <p className="mt-3 text-text-secondary">{intuition}</p>
        </section>

        <section className="rounded-xl bg-card p-6">
          <h2 className="text-2xl font-semibold">The Math</h2>
          <div className="mt-4 space-y-4">
            {formalMath.map((item, index) => (
              <div key={`${item.eq}-${index}`} className="rounded-lg bg-background/60 p-4">
                <MathBlock math={item.eq} display />
                <p className="mt-2 text-text-secondary">{item.annotation}</p>
              </div>
            ))}
          </div>
        </section>

        <ChallengePrompt prompt={challengePrompt} />
        <MLConnection text={mlConnection} />

        <div className="rounded-xl border border-text-secondary/20 p-4 text-text-secondary">
          Next module CTA placeholder
        </div>
      </main>
    </div>
  )
}

export default ModuleLayout