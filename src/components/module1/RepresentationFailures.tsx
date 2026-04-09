import { AnimatePresence, motion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';

type FailureType = 'Missing dimension' | 'Collapsed meaning' | 'Metric mismatch';

type Scenario = {
  id: number;
  text: string;
  expected: FailureType;
  explanation: string;
};

type ScenarioAnswer = {
  selected: '' | FailureType;
  change: string;
  revealed: boolean;
};

type MissingPoint = {
  id: string;
  label: string;
  pacing: number;
  initial: { x: number; y: number };
  expanded: { x: number; y: number };
};

const missingDimensionPoints: MissingPoint[] = [
  {
    id: 'blade-runner',
    label: 'Blade Runner',
    pacing: 0.22,
    initial: { x: 0.33, y: 0.68 },
    expanded: { x: 0.2, y: 0.72 },
  },
  {
    id: '2001',
    label: '2001',
    pacing: 0.1,
    initial: { x: 0.28, y: 0.62 },
    expanded: { x: 0.12, y: 0.62 },
  },
  {
    id: 'arrival',
    label: 'Arrival',
    pacing: 0.35,
    initial: { x: 0.38, y: 0.57 },
    expanded: { x: 0.32, y: 0.54 },
  },
];

const actionClusterPoints = [
  { x: 0.22, y: 0.82 },
  { x: 0.15, y: 0.74 },
  { x: 0.3, y: 0.86 },
  { x: 0.18, y: 0.9 },
  { x: 0.27, y: 0.78 },
];

const scenarios: Scenario[] = [
  {
    id: 1,
    text: 'Music system recommends party music to a late-night solo listener.',
    expected: 'Missing dimension',
    explanation:
      'Likely missing dimension. The representation captures genre/tempo but ignores listening context like time, mood, and social setting.',
  },
  {
    id: 2,
    text: 'Search for "broken heart" returns cardiology articles.',
    expected: 'Collapsed meaning',
    explanation:
      'Collapsed meaning. The phrase has emotional and medical senses; one static representation merges both meanings.',
  },
  {
    id: 3,
    text: 'Hiring tool ranks one university above equally skilled others.',
    expected: 'Metric mismatch',
    explanation:
      'Metric mismatch. The distance optimizes institutional prestige proxies instead of direct job-relevant capability.',
  },
];

const xScale = scaleLinear().domain([0, 1]).range([52, 530]);
const yScale = scaleLinear().domain([0, 1]).range([268, 26]);

const blendBlueToRed = (t: number) => {
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(59 + (239 - 59) * clamped);
  const g = Math.round(130 + (68 - 130) * clamped);
  const b = Math.round(246 + (68 - 246) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
};

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function RepresentationFailures() {
  const [visibleStep, setVisibleStep] = useState(1);
  const [expandedMissingDimension, setExpandedMissingDimension] = useState(false);
  const [splitBank, setSplitBank] = useState(false);

  const [answers, setAnswers] = useState<Record<number, ScenarioAnswer>>({
    1: { selected: '', change: '', revealed: false },
    2: { selected: '', change: '', revealed: false },
    3: { selected: '', change: '', revealed: false },
  });

  const shownMissingPoints = useMemo(
    () =>
      missingDimensionPoints.map((point) => ({
        ...point,
        current: expandedMissingDimension ? point.expanded : point.initial,
      })),
    [expandedMissingDimension],
  );

  const scenarioResults = useMemo(() => {
    return scenarios.map((scenario) => {
      const answer = answers[scenario.id];
      const isMatch = answer.selected === scenario.expected;
      return { scenario, answer, isMatch };
    });
  }, [answers]);

  const revealScenario = (id: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], revealed: true },
    }));
  };

  const canShowCard = (index: number) => visibleStep >= index;

  return (
    <section className="max-w-[680px]">
      <div className="space-y-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="font-serif text-lg leading-8 text-[#e5e7eb] md:text-2xl"
        >
          Everything we&apos;ve built assumes one thing: that the geometry you designed actually
          captures what matters. Sometimes it doesn&apos;t. And when it doesn&apos;t, the math still runs
          perfectly. No errors. No warnings. Just confidently wrong outputs.
        </motion.p>

        <AnimatePresence>
          {canShowCard(1) && (
            <motion.article
              variants={cardAnim}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 0.45 }}
              className="rounded-xl border border-[#7c3aed]/30 bg-[#111827] p-6 md:p-8"
            >
              <h3 className="font-serif text-2xl text-[#f8fafc]">Failure 1: The Missing Dimension</h3>
              <p className="mt-3 font-serif text-base leading-8 text-[#d1d5db]">
                A user loves slow, atmospheric science fiction. Your system keeps recommending loud
                action films because your representation tracks action intensity and spectacle, but not
                pacing.
              </p>

              <svg
                viewBox="0 0 580 300"
                className="mt-5 h-auto w-full rounded-lg border border-[#1f2937] bg-[#0b1220]"
              >
                <line x1="52" y1="268" x2="530" y2="268" stroke="#475569" />
                <line x1="52" y1="268" x2="52" y2="26" stroke="#475569" />
                <text x="292" y="289" fontSize="12" fill="#94a3b8" textAnchor="middle">
                  romance →
                </text>
                <text x="16" y="150" fontSize="12" fill="#94a3b8" transform="rotate(-90 16 150)">
                  action →
                </text>
                {actionClusterPoints.map((point, index) => (
                  <circle
                    key={`action-${index}`}
                    r="4.5"
                    cx={xScale(point.x)}
                    cy={yScale(point.y)}
                    fill="#64748b"
                    opacity={0.35}
                  />
                ))}

                {shownMissingPoints.map((point) => (
                  <motion.g
                    key={point.id}
                    initial={false}
                    animate={{ x: xScale(point.current.x), y: yScale(point.current.y) }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  >
                    <circle
                      r="8"
                      fill={expandedMissingDimension ? blendBlueToRed(point.pacing) : '#c084fc'}
                      stroke="#f8fafc"
                      strokeWidth="1.2"
                    />
                    <text textAnchor="middle" dy="-12" fontSize="11" fill="#e2e8f0">
                      {point.label}
                    </text>
                  </motion.g>
                ))}
              </svg>

              <button
                type="button"
                onClick={() => setExpandedMissingDimension(true)}
                className="mt-4 rounded-lg border border-[#7c3aed]/50 bg-[#7c3aed]/10 px-4 py-2 text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20"
              >
                Add pacing dimension
              </button>

              <p className="mt-4 rounded-lg border border-[#334155] bg-[#0b1220] px-4 py-3 text-sm text-[#cbd5e1]">
                When your model produces confident wrong answers, ask first: does my representation
                contain the information needed to answer this question at all.
              </p>

              <button
                type="button"
                onClick={() => setVisibleStep(2)}
                className="mt-4 rounded-lg border border-[#334155] px-4 py-2 text-sm text-[#dbeafe] transition hover:border-[#7c3aed]/40"
              >
                I understand this failure →
              </button>
            </motion.article>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canShowCard(2) && (
            <motion.article
              variants={cardAnim}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 0.45 }}
              className="rounded-xl border border-[#7c3aed]/30 bg-[#111827] p-6 md:p-8"
            >
              <h3 className="font-serif text-2xl text-[#f8fafc]">Failure 2: One Vector, Two Meanings</h3>
              <p className="mt-3 font-serif text-base leading-8 text-[#d1d5db]">
                In classic word2vec, the word &quot;bank&quot; has one vector. But &quot;river bank&quot; and &quot;bank
                loan&quot; are different meanings. One point collapses two ideas.
              </p>

              <div className="mt-5 rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
                <svg viewBox="0 0 580 260" className="h-auto w-full">
                  {[
                    { label: 'river', x: 130, y: 80 },
                    { label: 'water', x: 98, y: 120 },
                    { label: 'stream', x: 158, y: 130 },
                    { label: 'current', x: 120, y: 155 },
                  ].map((w) => (
                    <g key={w.label} transform={`translate(${w.x}, ${w.y})`}>
                      <circle r="5" fill="#38bdf8" />
                      <text y="-10" textAnchor="middle" fontSize="10" fill="#bae6fd">
                        {w.label}
                      </text>
                    </g>
                  ))}

                  {[
                    { label: 'money', x: 450, y: 78 },
                    { label: 'loan', x: 480, y: 118 },
                    { label: 'deposit', x: 425, y: 128 },
                    { label: 'interest', x: 460, y: 155 },
                  ].map((w) => (
                    <g key={w.label} transform={`translate(${w.x}, ${w.y})`}>
                      <circle r="5" fill="#f472b6" />
                      <text y="-10" textAnchor="middle" fontSize="10" fill="#fbcfe8">
                        {w.label}
                      </text>
                    </g>
                  ))}

                  <AnimatePresence mode="wait">
                    {!splitBank ? (
                      <motion.g
                        key="single-bank"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transform="translate(290,120)"
                      >
                        <circle r="8" fill="#c4b5fd" stroke="#ede9fe" />
                        <text y="-12" textAnchor="middle" fontSize="11" fill="#e9d5ff">
                          bank
                        </text>
                      </motion.g>
                    ) : (
                      <>
                        <motion.g
                          key="bank-river"
                          initial={{ opacity: 0, x: 290, y: 120 }}
                          animate={{ opacity: 1, x: 215, y: 112 }}
                          transition={{ duration: 0.6 }}
                        >
                          <circle r="8" fill="#38bdf8" stroke="#bae6fd" />
                          <text y="-12" textAnchor="middle" fontSize="11" fill="#bae6fd">
                            bank (river)
                          </text>
                        </motion.g>
                        <motion.g
                          key="bank-finance"
                          initial={{ opacity: 0, x: 290, y: 120 }}
                          animate={{ opacity: 1, x: 365, y: 122 }}
                          transition={{ duration: 0.6 }}
                        >
                          <circle r="8" fill="#f472b6" stroke="#fbcfe8" />
                          <text y="-12" textAnchor="middle" fontSize="11" fill="#fbcfe8">
                            bank (finance)
                          </text>
                        </motion.g>
                      </>
                    )}
                  </AnimatePresence>
                </svg>
              </div>

              <button
                type="button"
                onClick={() => setSplitBank(true)}
                className="mt-4 rounded-lg border border-[#7c3aed]/50 bg-[#7c3aed]/10 px-4 py-2 text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20"
              >
                Show BERT&apos;s solution
              </button>

              <p className="mt-4 rounded-lg border border-[#334155] bg-[#0b1220] px-4 py-3 text-sm text-[#cbd5e1]">
                BERT computes vectors dynamically using the full sentence. Same word, different
                geometry, depending on context.
              </p>

              <button
                type="button"
                onClick={() => setVisibleStep(3)}
                className="mt-4 rounded-lg border border-[#334155] px-4 py-2 text-sm text-[#dbeafe] transition hover:border-[#7c3aed]/40"
              >
                I understand this failure →
              </button>
            </motion.article>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canShowCard(3) && (
            <motion.article
              variants={cardAnim}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 0.45 }}
              className="rounded-xl border border-[#7c3aed]/30 bg-[#111827] p-6 md:p-8"
            >
              <h3 className="font-serif text-2xl text-[#f8fafc]">Failure 3: Geometry Without Understanding</h3>
              <p className="mt-3 font-serif text-base leading-8 text-[#d1d5db]">
                Two political articles use nearly identical word frequencies. The model marks them as
                almost the same, even though one supports a policy and the other criticizes it.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
                  <p className="text-sm text-[#cbd5e1]">Document vectors</p>
                  <svg viewBox="0 0 280 140" className="mt-2 h-32 w-full">
                    <line x1="20" y1="120" x2="260" y2="120" stroke="#475569" />
                    <line x1="20" y1="120" x2="20" y2="18" stroke="#475569" />
                    <circle cx="130" cy="66" r="7" fill="#60a5fa" />
                    <circle cx="146" cy="70" r="7" fill="#f472b6" />
                    <line x1="130" y1="66" x2="146" y2="70" stroke="#94a3b8" strokeDasharray="4 4" />
                    <text x="138" y="54" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      distance 0.08
                    </text>
                  </svg>
                </div>

                <div className="rounded-lg border border-[#1f2937] bg-[#0b1220] p-4">
                  <p className="text-sm text-[#cbd5e1]">Word frequencies (nearly identical)</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { term: 'policy', a: 0.82, b: 0.8 },
                      { term: 'economy', a: 0.64, b: 0.66 },
                      { term: 'jobs', a: 0.58, b: 0.57 },
                      { term: 'tax', a: 0.48, b: 0.5 },
                    ].map((row) => (
                      <div key={row.term} className="space-y-1">
                        <p className="text-[11px] text-[#94a3b8]">{row.term}</p>
                        <div className="h-1.5 rounded bg-[#1f2937]">
                          <div className="h-1.5 rounded bg-[#60a5fa]" style={{ width: `${row.a * 100}%` }} />
                        </div>
                        <div className="h-1.5 rounded bg-[#1f2937]">
                          <div className="h-1.5 rounded bg-[#f472b6]" style={{ width: `${row.b * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#9ca3af]">
                Word frequency captures what words are present. It ignores what those words are
                doing.
              </p>

              <p className="mt-4 rounded-lg border border-[#334155] bg-[#0b1220] px-4 py-3 text-sm text-[#cbd5e1]">
                Metric mismatch: the distance you can compute is not the distance that matters for your
                task.
              </p>

              <button
                type="button"
                onClick={() => setVisibleStep(4)}
                className="mt-4 rounded-lg border border-[#334155] px-4 py-2 text-sm text-[#dbeafe] transition hover:border-[#7c3aed]/40"
              >
                I understand this failure →
              </button>
            </motion.article>
          )}
        </AnimatePresence>

        {visibleStep >= 4 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-xl border border-[#1f2937] bg-[#111827]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1f2937] bg-[#0f172a] text-[#cbd5e1]">
                    <th className="px-4 py-3">Failure</th>
                    <th className="px-4 py-3">What went wrong</th>
                    <th className="px-4 py-3">Question to ask</th>
                  </tr>
                </thead>
                <tbody className="text-[#d1d5db]">
                  <tr className="border-b border-[#1f2937]">
                    <td className="px-4 py-3">Missing dimension</td>
                    <td className="px-4 py-3">Relevant info not in space</td>
                    <td className="px-4 py-3">Does my representation contain what I need?</td>
                  </tr>
                  <tr className="border-b border-[#1f2937]">
                    <td className="px-4 py-3">Collapsed meaning</td>
                    <td className="px-4 py-3">Multiple meanings, one point</td>
                    <td className="px-4 py-3">Does one vector per object make sense here?</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Metric mismatch</td>
                    <td className="px-4 py-3">Wrong distance for the task</td>
                    <td className="px-4 py-3">Am I measuring what the task requires?</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              {scenarioResults.map(({ scenario, answer, isMatch }) => (
                <div key={scenario.id} className="rounded-xl border border-[#1f2937] bg-[#111827] p-5">
                  <p className="font-serif text-base text-[#f8fafc]">{scenario.id}. {scenario.text}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[220px,1fr]">
                    <select
                      value={answer.selected}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [scenario.id]: {
                            ...prev[scenario.id],
                            selected: event.target.value as ScenarioAnswer['selected'],
                          },
                        }))
                      }
                      className="px-0 py-1 text-sm text-[#c8d4e8] outline-none"
                    >
                      <option value="">Select failure type</option>
                      <option value="Missing dimension">Missing dimension</option>
                      <option value="Collapsed meaning">Collapsed meaning</option>
                      <option value="Metric mismatch">Metric mismatch</option>
                    </select>

                    <input
                      type="text"
                      value={answer.change}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [scenario.id]: { ...prev[scenario.id], change: event.target.value },
                        }))
                      }
                      placeholder="What would you change in the representation?"
                      className="px-0 py-1 text-sm text-[#c8d4e8] placeholder:text-[#6f85a8] outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => revealScenario(scenario.id)}
                    className="mt-4 rounded-lg border border-[#7c3aed]/50 bg-[#7c3aed]/10 px-4 py-2 text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20"
                  >
                    Reveal Analysis
                  </button>

                  {answer.revealed && (
                    <div className="mt-3 px-0 py-1">
                      <p className={`text-sm ${isMatch ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {isMatch
                          ? `Good diagnosis: ${scenario.expected}.`
                          : `Suggested diagnosis: ${scenario.expected}.`}
                      </p>
                      <p className="mt-1 text-sm text-[#cbd5e1]">{scenario.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </section>
  );
}
