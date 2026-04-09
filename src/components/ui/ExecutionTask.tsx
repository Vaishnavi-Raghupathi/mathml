import { useRef, useState } from 'react'

type ExecutionTaskProps = {
  taskNumber: string
  title: string
  setup: string
  steps: string[]
  codeScaffold: string
  observations: string[]
  hint: string | null
}

const monoFont = '"IBM Plex Mono", monospace'
const serifFont = '"IBM Plex Serif", serif'

const ExecutionTask = ({
  taskNumber,
  title,
  setup,
  steps,
  codeScaffold,
  observations,
  hint
}: ExecutionTaskProps) => {
  const pyodideRef = useRef<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [code, setCode] = useState(codeScaffold)
  const [runtimeStatus, setRuntimeStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [checkMessage, setCheckMessage] = useState<string>('')

  const ensureRuntime = async () => {
    if (pyodideRef.current) {
      return pyodideRef.current
    }

    setRuntimeStatus('loading')

    try {
      const importFromUrl = new Function('url', 'return import(url)') as (url: string) => Promise<any>
      const pyodideModule = await importFromUrl('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs')

      const { loadPyodide } = pyodideModule
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'
      })
      await pyodide.loadPackage('numpy')
      pyodideRef.current = pyodide
      setRuntimeStatus('ready')
      return pyodide
    } catch {
      setRuntimeStatus('error')
      throw new Error('Failed to initialize Python runtime in browser.')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setCopied(false)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    setCheckMessage('')
    setOutput('')

    try {
      const pyodide = await ensureRuntime()
      let stdOutBuffer = ''
      let stdErrBuffer = ''

      pyodide.setStdout({
        batched: (message: string) => {
          stdOutBuffer += `${message}\n`
        }
      })

      pyodide.setStderr({
        batched: (message: string) => {
          stdErrBuffer += `${message}\n`
        }
      })

      await pyodide.runPythonAsync(code)

      const combinedOutput = `${stdOutBuffer}${stdErrBuffer}`.trim()
      setOutput(combinedOutput.length > 0 ? combinedOutput : 'Code ran successfully. No printed output.')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setOutput(`Runtime error:\n${message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCheckAnswer = () => {
    const checks = [
      {
        ok: !code.includes('?'),
        message: 'Replace the ? placeholders with numeric values.'
      },
      {
        ok: /print\(\s*my_movie\.shape\s*\)/.test(code),
        message: 'Print my_movie.shape to confirm vector shape.'
      },
      {
        ok: /np\.linalg\.norm\(\s*my_movie\s*-\s*titanic\s*\)/.test(code),
        message: 'Compute distance between my_movie and titanic with np.linalg.norm.'
      },
      {
        ok: /np\.append\(\s*my_movie\s*,/.test(code) && /np\.append\(\s*titanic\s*,/.test(code),
        message: 'Add a 4D extension for both vectors using np.append.'
      }
    ]

    const missing = checks.filter((check) => !check.ok).map((check) => check.message)

    if (missing.length === 0) {
      setCheckMessage('Looks good. Run the code and compare your output with “what to notice”.')
      return
    }

    setCheckMessage(`Check these before running:\n- ${missing.join('\n- ')}`)
  }

  const handleReset = () => {
    setCode(codeScaffold)
    setOutput('')
    setCheckMessage('')
  }

  return (
    <section className="w-full" aria-label="Execution task section">
      <div className="h-px w-full" style={{ backgroundColor: '#1E2D42' }} />

      <div
        className="mt-4 text-[11px] uppercase tracking-[0.12em]"
        style={{
          fontFamily: monoFont,
          color: '#3D5068'
        }}
      >
        try this
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span
          className="text-[13px]"
          style={{
            fontFamily: monoFont,
            color: '#3D5068'
          }}
        >
          {taskNumber}.
        </span>

        <h3 className="m-0 text-[18px] leading-[1.4] text-text-primary">{title}</h3>
      </div>

      <p
        className="mt-4 max-w-[620px] text-[16px] leading-[1.8] text-text-secondary"
        style={{
          fontFamily: serifFont
        }}
      >
        {setup}
      </p>

      <div className="mt-5 flex flex-col gap-[10px]">
        {steps.map((step, index) => (
          <div key={`${index + 1}-${step}`} className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-4">
            <span
              className="text-[12px]"
              style={{
                fontFamily: monoFont,
                color: '#3D5068'
              }}
            >
              {index + 1}
            </span>

            <p className="m-0 text-[15px] leading-[1.8] text-text-primary" style={{ fontFamily: serifFont }}>
              {step}
            </p>
          </div>
        ))}
      </div>

      <div
        className="relative mt-6 overflow-x-auto rounded-[4px] p-6"
        style={{
          backgroundColor: '#0A1628'
        }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-4 top-3 text-[11px] lowercase"
          style={{
            fontFamily: monoFont,
            color: '#3D5068'
          }}
        >
          {copied ? 'copied' : 'copy'}
        </button>

        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          spellCheck={false}
          className="mt-2 block h-[420px] w-full resize-y bg-transparent p-0"
          style={{
            fontFamily: monoFont,
            fontSize: '14px',
            lineHeight: 1.9,
            color: '#E8EDF5',
            whiteSpace: 'pre',
            outline: 'none',
            border: 'none'
          }}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || runtimeStatus === 'loading'}
            className="px-3 py-1 text-[12px]"
            style={{
              fontFamily: monoFont,
              border: '1px solid #1E2D42',
              color: '#E8EDF5',
              backgroundColor: 'transparent',
              opacity: isRunning ? 0.7 : 1
            }}
          >
            {isRunning ? 'running…' : runtimeStatus === 'loading' ? 'loading python…' : 'run code'}
          </button>

          <button
            type="button"
            onClick={handleCheckAnswer}
            className="px-3 py-1 text-[12px]"
            style={{
              fontFamily: monoFont,
              border: '1px solid #1E2D42',
              color: '#7A8FA8',
              backgroundColor: 'transparent'
            }}
          >
            check answer
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 text-[12px]"
            style={{
              fontFamily: monoFont,
              border: '1px solid #1E2D42',
              color: '#3D5068',
              backgroundColor: 'transparent'
            }}
          >
            reset scaffold
          </button>

          <span className="text-[11px]" style={{ fontFamily: monoFont, color: '#3D5068' }}>
            {runtimeStatus === 'ready' ? 'python runtime ready' : runtimeStatus === 'error' ? 'python runtime failed' : 'runtime not loaded'}
          </span>
        </div>
      </div>

      {(checkMessage || output) && (
        <div className="mt-4 space-y-3">
          {checkMessage && (
            <pre
              className="m-0 whitespace-pre-wrap text-[13px]"
              style={{
                fontFamily: monoFont,
                color: '#7A8FA8'
              }}
            >
              {checkMessage}
            </pre>
          )}

          {output && (
            <div className="rounded-[4px] border p-4" style={{ borderColor: '#1E2D42', backgroundColor: '#0A1628' }}>
              <div className="mb-2 text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: monoFont, color: '#3D5068' }}>
                output
              </div>
              <pre className="m-0 whitespace-pre-wrap text-[13px]" style={{ fontFamily: monoFont, color: '#E8EDF5' }}>
                {output}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-5">
        <div
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{
            fontFamily: monoFont,
            color: '#3D5068'
          }}
        >
          what to notice
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {observations.map((item, index) => (
            <div key={`${index + 1}-${item}`} className="flex items-start gap-2">
              <span
                className="mt-[2px] text-[14px] leading-none"
                style={{
                  fontFamily: monoFont,
                  color: '#3D5068'
                }}
              >
                ›
              </span>
              <p
                className="m-0 text-[15px] italic leading-[1.8]"
                style={{
                  fontFamily: serifFont,
                  color: '#7A8FA8'
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {hint && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="text-[12px]"
            style={{
              fontFamily: monoFont,
              color: '#3D5068'
            }}
          >
            {showHint ? 'hide hint ↑' : 'show hint ↓'}
          </button>

          {showHint && (
            <p
              className="mt-2 m-0 text-[14px] italic leading-[1.7]"
              style={{
                fontFamily: serifFont,
                color: '#7A8FA8'
              }}
            >
              {hint}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 h-px w-full" style={{ backgroundColor: '#1E2D42' }} />
    </section>
  )
}

export default ExecutionTask
