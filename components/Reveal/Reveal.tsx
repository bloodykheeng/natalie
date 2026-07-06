'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Scroll-triggered entrance (framer-motion): children fade in and rise as
 * they enter the viewport. Skips motion when prefers-reduced-motion is set.
 */
export default function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{
        duration: 0.55,
        delay: delay / 1000,
        ease: [0.22, 0.61, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
