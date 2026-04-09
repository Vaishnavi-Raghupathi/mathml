import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type HookProps = {
  onComplete: () => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Hook({ onComplete }: HookProps) {
  const [dimensionNames, setDimensionNames] = useState<string[]>(['', '', '']);
  const [values, setValues] = useState<number[]>([0.5, 0.5, 0.5]);

  const vectorLabel = useMemo(
    () => `[${values.map((v) => v.toFixed(2)).join(', ')}]`,
    [values],
  );

  const updateDimension = (index: number, next: string) => {
    setDimensionNames((prev) => prev.map((name, i) => (i === index ? next : name)));
  };

  const updateValue = (index: number, next: number) => {
    setValues((prev) => prev.map((value, i) => (i === index ? next : value)));
  };

  return (
    <section className="max-w-[680px]">
      <div className="space-y-10">
        <div className="space-y-6">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.65, delay: 0 }}
            className="font-serif text-3xl leading-tight tracking-tight md:text-4xl"
          >
            In 2013, researchers at Google published a result that confused a lot of people.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.2, delay: 0 }}
            className="font-serif text-base leading-8 text-[#d1d5db] md:text-lg"
          >
            They took a word, &apos;king,&apos; subtracted another word, &apos;man,&apos; and added
            &apos;woman.&apos; The result was a vector that pointed almost exactly at &apos;queen.&apos; No one
            programmed that. The system never read a dictionary. It just did arithmetic on lists of
            numbers, and meaning fell out.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.2, delay: 0 }}
            className="font-serif text-base leading-8 text-[#d1d5db] md:text-lg"
          >
            That is what this module is about. Not the arithmetic. The fact that meaning can live in
            numbers at all, and what happens when you design that encoding carefully versus
            carelessly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
          className="p-6 md:p-8"
        >
          <h2 className="font-serif text-xl text-[#f9fafb] md:text-2xl">Before we define anything:</h2>
          <p className="mt-3 font-serif text-base leading-7 text-[#d1d5db] md:text-lg">
            Imagine you had to describe a movie using only three numbers. What would you measure?
          </p>

          <div className="mt-6 space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="grid gap-3 md:grid-cols-[minmax(0,1fr),220px] md:items-center">
                <input
                  type="text"
                  value={dimensionNames[index]}
                  onChange={(event) => updateDimension(index, event.target.value)}
                  placeholder="dimension name, e.g. romance"
                  className="w-full px-0 py-1 text-sm outline-none"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={values[index]}
                    onChange={(event) => updateValue(index, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer accent-[#1d4ed8]"
                  />
                  <span className="w-11 text-right font-mono text-xs text-[#9ca3af]">
                    {values[index].toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 px-0 py-1">
            <p className="text-xs uppercase tracking-wide text-[#6f85a8]">Current vector</p>
            <p className="mt-1 font-mono text-base text-[#d6e0f2]">{vectorLabel}</p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="mt-6 inline-flex items-center text-sm text-[#60a5fa] transition hover:text-[#93c5fd]"
          >
            See how this module does it →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
