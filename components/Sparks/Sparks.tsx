'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type SparkKind = 'firefly' | 'note' | 'star';

type Spark = {
  id: number;
  kind: SparkKind;
  x: number; // vw %
  bottom: number; // vh % where it starts
  rise: number; // px it floats up
  wobble: number; // px sideways sway
  duration: number; // s
  scale: number;
};

const NOTES = ['♪', '♫', '♩'];
const MAX_SPARKS = 7;

function makeSpark(id: number, musicOn: boolean): Spark {
  const roll = Math.random();
  // While she sings, the night fills with music notes
  const kind: SparkKind = musicOn
    ? roll < 0.6
      ? 'note'
      : roll < 0.85
        ? 'firefly'
        : 'star'
    : roll < 0.55
      ? 'firefly'
      : roll < 0.8
        ? 'note'
        : 'star';
  return {
    id,
    kind,
    x: 4 + Math.random() * 92,
    bottom: Math.random() * 55,
    rise: 140 + Math.random() * 240,
    wobble: (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 26),
    duration: 7 + Math.random() * 6,
    scale: 0.7 + Math.random() * 0.7
  };
}

/**
 * The night is inhabited: fireflies, drifting music notes and tiny stars
 * appear at random, unpredictable moments, float up and dissolve.
 * Pure transform/opacity animation; disabled entirely for reduced motion.
 */
export default function Sparks() {
  const reduceMotion = useReducedMotion();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = () => {
      // Unpredictable cadence — quicker while her music plays
      const musicOn = document.documentElement.dataset.music === 'on';
      const delay = musicOn
        ? 800 + Math.random() * 2400
        : 1500 + Math.random() * 4500;
      timer = setTimeout(() => {
        if (cancelled) return;
        const nowPlaying = document.documentElement.dataset.music === 'on';
        setSparks((current) => {
          if (current.length >= MAX_SPARKS) return current;
          return [...current, makeSpark(nextId.current++, nowPlaying)];
        });
        schedule();
      }, delay);
    };
    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-5 overflow-hidden"
    >
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 0.9, 0.75, 0],
              y: -spark.rise,
              x: [0, spark.wobble, -spark.wobble * 0.6, spark.wobble * 0.3]
            }}
            transition={{ duration: spark.duration, ease: 'easeOut' }}
            onAnimationComplete={() =>
              setSparks((current) => current.filter((s) => s.id !== spark.id))
            }
            style={{
              left: `${spark.x}vw`,
              bottom: `${spark.bottom}vh`,
              scale: spark.scale
            }}
            className="absolute will-change-transform"
          >
            {spark.kind === 'firefly' ? (
              <span className="block h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_10px_3px_rgba(212,175,55,0.55)]" />
            ) : spark.kind === 'note' ? (
              <span className="font-display text-xl text-gold-400/80">
                {NOTES[spark.id % NOTES.length]}
              </span>
            ) : (
              <span className="text-sm text-gold-300/90">✦</span>
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
