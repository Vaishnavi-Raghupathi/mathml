import { Component, type ErrorInfo, type ReactNode } from 'react'

type SectionErrorBoundaryProps = {
  sectionName: string
  children: ReactNode
}

type SectionErrorBoundaryState = {
  hasError: boolean
}

class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep the app alive and make the failing section visible in console diagnostics.
    console.error(`[SectionErrorBoundary] ${this.props.sectionName}`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="max-w-[680px] py-4">
          <p className="text-sm text-text-secondary">
            Failed to render section: <span className="text-text-primary">{this.props.sectionName}</span>
          </p>
        </section>
      )
    }

    return this.props.children
  }
}

export default SectionErrorBoundary
