const monoFont = '"IBM Plex Mono", monospace'

const DesktopGate = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="mb-4 text-xl text-text-secondary">MathML requires a desktop or laptop browser.</p>
        <p className="text-[13px] text-text-muted" style={{ fontFamily: monoFont }}>
          Please visit on a screen wider than 1024px.
        </p>
      </div>
    </div>
  )
}

export default DesktopGate
