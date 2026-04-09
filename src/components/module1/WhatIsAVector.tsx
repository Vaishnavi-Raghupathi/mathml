import { motion, useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const vectorValues = [0.88, 0.35, 0.2];
const vectorLabels = ['romance', 'action', 'comedy'];

const contributionData = [
  { label: 'Romance', value: 0.64 },
  { label: 'Action', value: 0.38 },
  { label: 'Comedy', value: 0.01 },
];

export default function WhatIsAVector() {
  const breakdownRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(breakdownRef, { once: false, margin: '-20% 0px -20% 0px' });

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [dimensionChoice, setDimensionChoice] = useState<string | null>(null);
  const [similarityChoice, setSimilarityChoice] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!inView) {
      setActiveIndex(-1);
      return;
    }

    let current = 0;
    setActiveIndex(current);

    const interval = window.setInterval(() => {
      current = (current + 1) % vectorLabels.length;
      setActiveIndex(current);
    }, 1100);

    return () => window.clearInterval(interval);
  }, [inView]);

  const totalContribution = useMemo(
    () => contributionData.reduce((sum, item) => sum + item.value, 0),
    [],
  );

  const submitPrediction = () => {
    setShowAnswer(true);
  };

  return (
    <section className="max-w-[680px]">
      <div className="space-y-12">
        <div className="space-y-5 rounded-xl bg-[#0a0f1e]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, delay: 0 }}
            className="font-serif text-lg leading-8 text-[#f3f4f6] md:text-2xl"
          >
            Here is something strange. A movie is two hours of light and sound. A novel is 100,000
            words of human experience. A song is emotion compressed into four minutes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.15, delay: 0 }}
            className="h-3"
            aria-hidden
          />

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.15, delay: 0 }}
            className="font-serif text-xl text-[#f9fafb] md:text-2xl"
          >
            A machine learning model sees none of that.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.15, delay: 0 }}
            className="h-3"
            aria-hidden
          />

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.15, delay: 0 }}
            className="font-serif text-base text-[#d1d5db] md:text-lg"
          >
            What it sees is this:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0 }}
            className="raw-model-panel rounded-xl border border-[#1f2937] bg-[#050814] px-6 py-8"
          >
            <p className="text-center font-mono text-3xl text-[#f9fafb] md:text-4xl">
              [0.88, 0.35, 0.20]
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.15, delay: 0 }}
            className="text-center text-sm text-[#9ca3af]"
          >
            That is Titanic. Three numbers. That is the entire object as far as the model is
            concerned.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="rounded-xl border border-[#7c3aed]/40 bg-[#111827] p-6 md:p-8"
        >
          <p className="font-serif text-lg leading-8 text-[#f3e8ff] md:text-xl">
            Most ML failures are not model failures. They are representation failures. The math
            worked perfectly on the wrong description of reality.
          </p>
        </motion.div>

        <motion.div
          ref={breakdownRef}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-[#1f2937] bg-[#0b1220] p-6 md:p-8"
        >
          <p className="font-serif text-lg text-[#dbeafe] md:text-xl">
            Titanic ={' '}
            <span className="font-mono text-[#f9fafb]">
              [
              {vectorValues.map((value, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.span
                    key={vectorLabels[index]}
                    animate={{
                      color: isActive ? '#c4b5fd' : '#f9fafb',
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.35 }}
                    className="inline-block"
                  >
                    {index > 0 ? ' ' : ''}
                    {value.toFixed(2)}
                    {index < vectorValues.length - 1 ? ',' : ''}
                  </motion.span>
                );
              })}
              ]
            </span>
          </p>

          <div className="mt-5 min-h-16">
            {activeIndex >= 0 && (
              <motion.p
                key={vectorLabels[activeIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-serif text-base text-[#c4b5fd] md:text-lg"
              >
                {vectorLabels[activeIndex]}
              </motion.p>
            )}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-[#1f2937] bg-[#111827] p-5"
          >
            <p className="font-serif text-xl text-[#f9fafb]">Engineer A</p>
            <p className="mt-3 font-mono text-lg text-[#dbeafe]">[0.88, 0.35, 0.20]</p>
            <p className="mt-2 text-sm text-[#9ca3af]">romance, action, comedy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.2, delay: 0 }}
            className="rounded-xl border border-[#1f2937] bg-[#111827] p-5"
          >
            <p className="font-serif text-xl text-[#f9fafb]">Engineer B</p>
            <p className="mt-3 font-mono text-lg text-[#dbeafe]">[0.71, 0.90, 0.40]</p>
            <p className="mt-2 text-sm text-[#9ca3af]">
              emotional intensity, visual complexity, pacing
            </p>
          </motion.div>
        </div>

        <p className="-mt-2 text-center font-serif text-sm italic text-[#9ca3af] md:text-base">
          Both are valid. Neither is complete. The task will eventually expose which one fails.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-[#7c3aed]/35 bg-[#111827] p-6 md:p-8"
        >
          <h3 className="font-serif text-xl text-[#f9fafb] md:text-2xl">Try this quick check</h3>

          <div className="mt-4 space-y-2 font-mono text-sm text-[#d1d5db] md:text-base">
            <p>Titanic: [0.88, 0.35, 0.20]</p>
            <p>Mad Max Fury Road: [0.08, 0.97, 0.10]</p>
          </div>

          <p className="mt-5 font-serif text-base leading-7 text-[#e5e7eb] md:text-lg">
            Without calculating anything, which dimension is doing most of the work in separating
            these two movies?
          </p>

          <p className="mt-3 text-sm text-[#9ca3af]">
            Tap one option in each row, then submit to compare with the computed result.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {['Romance', 'Action', 'Comedy'].map((choice) => (
              <button
                key={choice}
                type="button"
                aria-pressed={dimensionChoice === choice}
                onClick={() => {
                  setDimensionChoice(choice);
                  setShowAnswer(false);
                }}
                className={`module11-choice-btn rounded-full border px-4 py-2 text-sm transition ${
                  dimensionChoice === choice
                    ? 'module11-choice-selected'
                    : 'border-[#1f2937] bg-[#0b1220] text-[#d1d5db] hover:border-[#7c3aed]/40'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <p className="mt-6 font-serif text-base text-[#e5e7eb]">How similar are they?</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Very Similar', 'Somewhat', 'Very Different'].map((choice) => (
              <button
                key={choice}
                type="button"
                aria-pressed={similarityChoice === choice}
                onClick={() => {
                  setSimilarityChoice(choice);
                  setShowAnswer(false);
                }}
                className={`module11-choice-btn rounded-full border px-4 py-2 text-sm transition ${
                  similarityChoice === choice
                    ? 'module11-choice-selected'
                    : 'border-[#1f2937] bg-[#0b1220] text-[#d1d5db] hover:border-[#7c3aed]/40'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={submitPrediction}
            disabled={!dimensionChoice || !similarityChoice}
            className="mt-6 rounded-lg border border-[#7c3aed]/50 bg-[#7c3aed]/10 px-4 py-2 font-serif text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20"
          >
            Submit prediction
          </button>

          {(!dimensionChoice || !similarityChoice) && (
            <p className="mt-2 text-xs text-[#9ca3af]">Choose one answer in both rows to enable submit.</p>
          )}

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4 rounded-lg border border-[#1f2937] bg-[#0b1220] p-4"
            >
              <p className="font-serif text-lg text-[#f9fafb]">Actual distance: 0.99</p>

              <div className="space-y-3">
                {contributionData.map((item) => {
                  const width = (item.value / totalContribution) * 100;
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-xs text-[#9ca3af]">
                        <span>{item.label}</span>
                        <span>{item.value.toFixed(2)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#1f2937]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="font-serif text-sm text-[#d1d5db]">
                Action is close. But romance does most of the work.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
