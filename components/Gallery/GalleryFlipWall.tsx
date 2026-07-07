'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const VISIBLE = 3;

/**
 * One photo card that flips in 3D around its center axis. The hidden face is
 * loaded with the next photo before the turn, so the flip reveals it — the
 * classic two-face card technique, driven by an unpredictable timer.
 */
function FlipCard({
  initial,
  exchange,
  alt,
  className = ''
}: {
  initial: string;
  /** swap the current photo for a fresh one from the shared pool */
  exchange: (current: string) => string;
  alt: string;
  className?: string;
}) {
  const [front, setFront] = useState(initial);
  const [back, setBack] = useState(initial);
  const [flipped, setFlipped] = useState(false);
  const state = useRef({ front: initial, back: initial, flipped: false, hover: false });
  const reduceMotion = useReducedMotion();

  const flip = useCallback(() => {
    const s = state.current;
    const current = s.flipped ? s.back : s.front;
    const next = exchange(current);
    if (next === current) return; // pool empty — nothing new to show
    if (s.flipped) {
      s.front = next;
      setFront(next);
    } else {
      s.back = next;
      setBack(next);
    }
    s.flipped = !s.flipped;
    setFlipped(s.flipped);
  }, [exchange]);

  // Unpredictable auto-flip: each card keeps its own random rhythm,
  // pausing while the visitor's cursor rests on it
  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const loop = () => {
      timer = setTimeout(() => {
        if (stopped) return;
        if (!state.current.hover) flip();
        loop();
      }, 3800 + Math.random() * 6200);
    };
    loop();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [flip, reduceMotion]);

  const face =
    'absolute inset-0 overflow-hidden rounded-xl border border-gold-500/35 bg-midnight-800 shadow-[0_10px_40px_rgba(0,0,0,0.35)] [backface-visibility:hidden]';

  return (
    <div
      className={`[perspective:1200px] ${className}`}
      onMouseEnter={() => (state.current.hover = true)}
      onMouseLeave={() => (state.current.hover = false)}
    >
      <motion.button
        type="button"
        onClick={flip}
        aria-label={alt}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.9, ease: [0.32, 0.72, 0.35, 1] }
        }
        className="group relative block aspect-3/4 w-full cursor-pointer [transform-style:preserve-3d]"
      >
        <span className={face}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local gallery files */}
          <img src={front} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        </span>
        <span className={`${face} [transform:rotateY(180deg)]`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local gallery files */}
          <img src={back} alt="" className="h-full w-full object-cover" />
        </span>
      </motion.button>

      {/* Gold pin holding the photo to the sky */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-xl text-gold-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]"
      >
        ✦
      </span>
    </div>
  );
}

/**
 * A living photo wall: three pinned photos of Natalie that flip over in 3D
 * at random moments to reveal the rest of the collection.
 */
export default function GalleryFlipWall({ images }: { images: string[] }) {
  const t = useTranslations('gallery');
  const visible = images.slice(0, Math.min(VISIBLE, images.length));
  // Photos not currently on the wall wait here; exchange() keeps it fair
  const pool = useRef<string[]>(images.slice(visible.length));

  const exchange = useCallback((current: string) => {
    const spare = pool.current.shift();
    if (!spare) return current;
    pool.current.push(current);
    return spare;
  }, []);

  // Collage feel: each card hangs at a slightly different angle and height
  const hang = [
    'sm:-rotate-2',
    'sm:rotate-1 sm:translate-y-6',
    'sm:-rotate-1 sm:translate-y-2'
  ];

  return (
    <div>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-8">
        {visible.map((src, i) => (
          <FlipCard
            key={src}
            initial={src}
            exchange={exchange}
            alt={`${t('photoAlt')} ${i + 1}`}
            className={`relative transition-transform duration-300 hover:z-10 hover:scale-[1.03] ${hang[i % hang.length]} ${
              i === 2 ? 'col-span-2 mx-auto w-1/2 sm:col-span-1 sm:mx-0 sm:w-auto' : ''
            }`}
          />
        ))}
      </div>
      <p className="mt-10 text-center text-sm tracking-wide text-parchment-dim italic">
        {t('flipHint')}
      </p>
    </div>
  );
}
