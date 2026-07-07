'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** Her best close-ups take turns on the record label */
const PHOTOS = [
  '/images/natalie-portrait.jpg',
  '/images/gallery/insta-01-fire-gold.jpg',
  '/images/gallery/insta-06-fern-dream.jpg',
  '/images/gallery/insta-07-golden-hour.jpg'
];

const HOLD_MS = 5600;

/**
 * The hero visual: a slowly spinning vintage vinyl record with a resting
 * tonearm. Natalie's photos are the center label, crossfading with a gentle
 * Ken Burns zoom so the portrait is never static. Glow and shadow follow
 * the theme (cool aurora at night, warm sunrise at dawn).
 */
export default function HeroVinyl({ alt }: { alt: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % PHOTOS.length),
      HOLD_MS
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="relative h-56 w-56 sm:h-72 sm:w-72 lg:h-85 lg:w-85">
      {/* Theme-aware halo so the black disc sits in light, not pasted on it */}
      <div
        aria-hidden="true"
        className="absolute inset-[-30%] rounded-full"
        style={{ background: 'var(--vinyl-halo)' }}
      />

      {/* The record: grooves + a rotating light glint */}
      <div
        aria-hidden="true"
        className="absolute inset-[-26%] rounded-full animate-spin-slow"
        style={{
          background:
            'repeating-radial-gradient(circle at center, var(--vinyl-groove-1) 0px, var(--vinyl-groove-2) 2.5px, var(--vinyl-groove-1) 5px)',
          boxShadow: 'var(--vinyl-shadow)'
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, var(--vinyl-glint-1) 18deg, transparent 50deg, transparent 175deg, var(--vinyl-glint-2) 200deg, transparent 235deg)'
          }}
        />
        {/* outer rim highlight */}
        <div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: 'var(--vinyl-rim)' }}
        />
      </div>

      {/* The label: crossfading photos with a slow Ken Burns drift */}
      <div className="ornate-ring absolute inset-0 overflow-hidden rounded-full bg-midnight-800">
        <AnimatePresence mode="sync">
          <motion.img
            key={PHOTOS[index]}
            src={PHOTOS[index]}
            alt={alt}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
            animate={{
              opacity: 1,
              scale: reduceMotion ? 1 : 1.14,
              transition: {
                opacity: { duration: 1.3, ease: 'easeOut' },
                scale: { duration: (HOLD_MS + 1500) / 1000, ease: 'linear' }
              }
            }}
            exit={{ opacity: 0, transition: { duration: 1.3, ease: 'easeIn' } }}
            className="absolute inset-0 h-full w-full rounded-full object-cover"
          />
        </AnimatePresence>
        {/* soft vignette so every photo sits in the same light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 45px var(--label-vignette)' }}
        />
      </div>

      {/* The tonearm, resting on the groove — pivot at the top right.
          On every photo change it lifts off and drops back (changing tracks);
          while playing it micro-wobbles like a needle tracking the groove. */}
      <motion.div
        aria-hidden="true"
        key={reduceMotion ? 'static-arm' : `arm-${index}`}
        initial={false}
        animate={reduceMotion ? { rotate: 0 } : { rotate: [0, -14, -14, 0] }}
        transition={{
          duration: 1.7,
          times: [0, 0.22, 0.62, 1],
          ease: 'easeInOut'
        }}
        style={{ transformOrigin: '76.7% 13.75%' }}
        className="absolute -top-[24%] -right-[30%] h-[72%] w-[54%]"
      >
        <motion.svg
          viewBox="0 0 120 160"
          preserveAspectRatio="xMidYMid meet"
          animate={reduceMotion ? undefined : { rotate: [0, 0.6, 0, -0.5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '76.7% 13.75%' }}
          className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
        >
          {/* pivot base */}
          <circle cx="92" cy="22" r="15" fill="var(--arm-base)" stroke="#b8942a" strokeWidth="1.6" />
          <circle cx="92" cy="22" r="6.5" fill="var(--arm-hole)" stroke="#ecd9a0" strokeWidth="1" />
          {/* arm: straight from pivot, then an elbow toward the groove */}
          <path
            d="M92 22 L64 84 L42 122"
            fill="none"
            stroke="var(--arm-tube)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M92 22 L64 84 L42 122"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* counterweight behind the pivot */}
          <rect x="96" y="2" width="12" height="14" rx="3" transform="rotate(24 102 9)" fill="var(--arm-weight)" stroke="#b8942a" strokeWidth="1" />
          {/* headshell + needle at the end */}
          <g transform="rotate(30 42 122)">
            <rect x="34" y="114" width="16" height="22" rx="3" fill="var(--arm-base)" stroke="#ecd9a0" strokeWidth="1.2" />
            <rect x="39" y="136" width="6" height="5" rx="1" fill="#d4af37" />
          </g>
        </motion.svg>
      </motion.div>
    </div>
  );
}
