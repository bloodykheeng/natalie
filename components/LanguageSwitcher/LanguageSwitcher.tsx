'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocaleContext } from '@/providers/LocaleProvider';
import type { Locale } from '@/i18n/routing';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'РУ' }
];

export default function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const { locale, setLocale, isPending } = useLocaleContext();

  return (
    <>
      <div
        role="group"
        aria-label="Language / Язык"
        className={`flex items-center rounded-full border border-gold-500/40 bg-midnight-900/90 p-1 transition-opacity ${
          isPending ? 'opacity-50' : ''
        }`}
      >
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            disabled={isPending}
            aria-pressed={locale === code}
            className={`min-h-9 min-w-11 cursor-pointer rounded-full px-3 text-sm font-semibold tracking-widest transition-colors duration-200 ${
              locale === code
                ? 'bg-gold-500 text-on-gold'
                : 'text-gold-400 hover:text-gold-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Full-screen veil while the new language loads — the wait is visible,
          not a mysterious freeze */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-5 bg-midnight-950/80 backdrop-blur-sm"
          >
            <motion.span
              aria-hidden="true"
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{
                rotate: { duration: 1.6, ease: 'linear', repeat: Infinity },
                scale: { duration: 1.6, ease: 'easeInOut', repeat: Infinity }
              }}
              className="text-5xl text-gold-400"
            >
              ✦
            </motion.span>
            <p className="font-display text-xl tracking-wide text-parchment">
              {t('switching')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
