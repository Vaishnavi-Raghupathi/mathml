import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type Movie = {
  name: string;
  vector: [number, number, number];
};

const movies: Movie[] = [
  { name: 'Titanic', vector: [0.88, 0.35, 0.2] },
  { name: 'The Dark Knight', vector: [0.15, 0.92, 0.18] },
  { name: 'La La Land', vector: [0.82, 0.12, 0.55] },
  { name: 'Mad Max', vector: [0.08, 0.97, 0.1] },
  { name: 'The Princess Bride', vector: [0.75, 0.45, 0.8] },
];

const formatVector = (values: number[]) => `[${values.map((v) => v.toFixed(2)).join(', ')}]`;

const distance = (a: number[], b: number[]) => {
  const squared = a.map((value, i) => (value - b[i]) ** 2);
  return Math.sqrt(squared.reduce((sum, value) => sum + value, 0));
};

const stepFade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function TheCode() {
  const [currentStep, setCurrentStep] = useState(1);
  const [query, setQuery] = useState<[number, number, number]>([0.5, 0.5, 0.5]);

  const diffVector = [0.8, -0.62, 0.1];
  const squaredVector = [0.64, 0.38, 0.01];

  const maxStep = 3;

  const movieDistances = useMemo(() => {
    const values = movies.map((movie) => {
      const d = distance(query, movie.vector);
      return { ...movie, distance: d };
    });

    const nearest = values.reduce((best, candidate) =>
      candidate.distance < best.distance ? candidate : best,
    );

    return {
      values,
      nearest,
      maxDistance: Math.max(...values.map((v) => v.distance)),
    };
  }, [query]);

  const nextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, maxStep));
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const updateDimension = (index: number, value: number) => {
    setQuery((prev) => prev.map((v, i) => (i === index ? value : v)) as [number, number, number]);
  };

  return (
    <section className="max-w-[680px]">
      <div className="space-y-12">
        <div className="space-y-5">
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={stepFade}
            transition={{ duration: 0.55 }}
            className="font-serif text-2xl leading-tight md:text-3xl"
          >
            Every recommendation system, at its core, does one thing:
          </motion.p>

          <motion.pre
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.2, delay: 0 }}
            className="overflow-x-auto rounded-xl border border-[#1f2937] bg-[#050814] p-5 text-center font-mono text-xl text-[#93c5fd] md:text-2xl"
          >
            np.linalg.norm(movie_a - movie_b)
          </motion.pre>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={stepFade}
            transition={{ duration: 0.2, delay: 0 }}
            className="font-serif text-base leading-8 text-[#d1d5db] md:text-lg"
          >
            That&apos;s it. Find the thing in your library whose numbers are closest to the thing you&apos;re
            looking for. Everything else is engineering around this one operation.
          </motion.p>
        </div>

        <div className="rounded-xl border border-[#7c3aed]/35 bg-[#111827] p-6 md:p-8">
          <p className="text-sm text-[#9ca3af]">
            Use Previous/Next to walk through the distance calculation one step at a time.
          </p>

          <div className="mt-5 space-y-5">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <p className="font-serif text-lg text-[#f3f4f6]">Step 1: Subtraction</p>
                  <div className="font-mono text-base text-[#dbeafe] md:text-lg">
                    <div>[0.88, 0.35, 0.20]</div>
                    <div>- [0.08, 0.97, 0.10]</div>
                    <div className="mt-1 border-t border-[#1f2937] pt-1">
                      = [
                      {diffVector.map((value, i) => (
                        <motion.span
                          key={`diff-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0 }}
                          className="inline-block text-[#c4b5fd]"
                        >
                          {value.toFixed(2)}
                          {i < diffVector.length - 1 ? ', ' : ''}
                        </motion.span>
                      ))}
                      ]
                    </div>
                  </div>
                  <p className="text-sm text-[#9ca3af]">
                    The difference vector, how far apart on each dimension separately.
                  </p>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <p className="font-serif text-lg text-[#f3f4f6]">Step 2: Squaring</p>
                  <p className="font-mono text-base text-[#dbeafe] md:text-lg">
                    [0.80, -0.62, 0.10] → squared → [0.64, 0.38, 0.01] → summed → 1.03
                  </p>

                  <div className="space-y-3">
                    {squaredVector.map((value, index) => {
                      const label = ['Romance', 'Action', 'Comedy'][index];
                      return (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between text-xs text-[#9ca3af]">
                          <span>{label}</span>
                          <span>{value.toFixed(2)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#1f2937]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 0.64) * 100}%` }}
                            transition={{ duration: 0.2, delay: 0 }}
                            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb]"
                          />
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  <p className="text-sm text-[#9ca3af]">
                    Squaring removes negatives and penalizes large differences more than small ones.
                  </p>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <p className="font-serif text-lg text-[#f3f4f6]">Step 3: Square root</p>
                  <motion.p
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-2xl text-[#e9d5ff] md:text-3xl"
                  >
                    √1.03 = 1.01
                  </motion.p>
                  <p className="text-sm text-[#9ca3af]">Square root brings us back to original units.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep <= 1}
                className="rounded-lg border border-[#334155] bg-[#0b1220] px-3 py-2 text-sm text-[#d1d5db] transition hover:border-[#7c3aed]/45 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous Step
              </button>

              <p className="text-xs text-[#94a3b8]">Step {currentStep} of {maxStep}</p>

              <button
                type="button"
                onClick={nextStep}
                disabled={currentStep >= maxStep}
                className="rounded-lg border border-[#7c3aed]/55 bg-[#7c3aed]/10 px-3 py-2 text-sm text-[#e9d5ff] transition hover:bg-[#7c3aed]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="rounded-xl border border-[#1f2937] bg-[#0b1220] p-6 md:p-8"
        >
          <h3 className="font-serif text-xl md:text-2xl">Scaling up</h3>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-[#1f2937] bg-[#050814] p-4 font-mono text-sm leading-7 text-[#d1d5db]">
            <span className="text-[#f9fafb]">library</span> = <span className="text-[#93c5fd]">np.array</span>([[0.88, 0.35, 0.20],   <span className="text-[#6b7280]"># Titanic</span>{'\n'}
            {'                    '}[0.15, 0.92, 0.18],   <span className="text-[#6b7280]"># The Dark Knight</span>{'\n'}
            {'                    '}[0.82, 0.12, 0.55],   <span className="text-[#6b7280]"># La La Land</span>{'\n'}
            {'                    '}[0.08, 0.97, 0.10]])  <span className="text-[#6b7280]"># Mad Max</span>{'\n'}
            {'\n'}
            <span className="text-[#f9fafb]">distances</span> = <span className="text-[#93c5fd]">np.linalg.norm</span>(library - my_movie,{' '}
            <span
              className="rounded bg-[#2563eb]/20 px-1 text-[#93c5fd]"
              title="Compute the norm of each row simultaneously."
            >
              axis=1
            </span>
            ){'\n'}
            <span className="text-[#f9fafb]">recommendation</span> = library[np.
            <span
              className="rounded bg-[#7c3aed]/20 px-1 text-[#c4b5fd]"
              title="Return the index of the smallest distance. That index is the recommendation."
            >
              argmin
            </span>
            (distances)]
          </pre>
        </motion.div>

        <div className="rounded-xl border border-[#7c3aed]/35 bg-[#111827] p-6 md:p-8">
          <h3 className="font-serif text-xl md:text-2xl">Contribution Explorer</h3>

          <div className="mt-5 space-y-4">
            {[
              { label: 'Romance', index: 0 },
              { label: 'Action', index: 1 },
              { label: 'Comedy', index: 2 },
            ].map((dimension) => (
              <div key={dimension.label} className="grid gap-3 md:grid-cols-[120px,1fr,52px] md:items-center">
                <label className="text-sm text-[#d1d5db]">{dimension.label}</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={query[dimension.index]}
                  onChange={(event) => updateDimension(dimension.index, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#7c3aed]"
                />
                <span className="text-right font-mono text-xs text-[#9ca3af]">
                  {query[dimension.index].toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {movieDistances.values.map((movie) => {
              const width = (movie.distance / movieDistances.maxDistance) * 100;
              const isNearest = movie.name === movieDistances.nearest.name;
              return (
                <div
                  key={movie.name}
                  className={`rounded-lg border px-3 py-3 ${
                    isNearest
                      ? 'border-yellow-400/70 bg-yellow-500/10'
                      : 'border-[#1f2937] bg-[#0b1220]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-[#e5e7eb]">{movie.name}</span>
                    <span className="font-mono text-[#9ca3af]">{movie.distance.toFixed(2)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#1f2937]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.35 }}
                      className={`h-full ${
                        isNearest
                          ? 'bg-gradient-to-r from-yellow-300 to-yellow-500'
                          : 'bg-gradient-to-r from-[#7c3aed] to-[#2563eb]'
                      }`}
                    />
                  </div>
                  {isNearest && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-yellow-300">
                      nearest
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-5 font-serif text-sm text-[#d1d5db] md:text-base">
            Your vector: <span className="font-mono text-[#f9fafb]">{formatVector(query)}</span> -
            Nearest: <span className="text-[#f9fafb]">{movieDistances.nearest.name}</span> at distance{' '}
            <span className="font-mono text-[#f9fafb]">{movieDistances.nearest.distance.toFixed(2)}</span>
          </p>
        </div>

        <div className="rounded-xl border border-[#1f2937] bg-[#0b1220] px-5 py-4">
          <p className="font-serif text-sm italic leading-7 text-[#d1d5db] md:text-base">
            You just used Euclidean distance. But is being far apart on romance the same kind of
            difference as being far apart on action? What if one dimension matters more than another
            for this particular user?
          </p>
          <p className="mt-2 text-xs text-[#9ca3af] md:text-sm">
            We&apos;ll come back to this. It&apos;s the exact question that leads to the dot product.
          </p>
        </div>
      </div>
    </section>
  );
}
