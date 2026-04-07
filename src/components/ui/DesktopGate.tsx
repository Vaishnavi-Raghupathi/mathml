import { ReactNode, useEffect, useState } from 'react'

type DesktopGateProps = {
  children: ReactNode
}

const DesktopGate = ({ children }: DesktopGateProps) => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isDesktop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center text-text-primary">
        <p className="max-w-lg text-lg">
          This experience requires a desktop or laptop. Please visit on a larger
          screen.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default DesktopGate