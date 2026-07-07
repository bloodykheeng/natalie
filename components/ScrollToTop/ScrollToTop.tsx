'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

/** Floating back-to-top star, appears once you've scrolled into the night */
export default function ScrollToTop() {
  const t = useTranslations('scrollToTop');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t('label')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="group fixed right-4.5 bottom-22 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gold-500/50 bg-midnight-950/90 text-gold-400 shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-colors hover:text-gold-300"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            <path d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
