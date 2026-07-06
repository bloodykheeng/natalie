'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/providers/ThemeProvider';

/** Sun/moon toggle between the night sky and the dawn sky. */
export default function ThemeToggle() {
  const t = useTranslations('navbar');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('themeLight') : t('themeDark')}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-colors duration-200 hover:border-gold-400 hover:text-gold-300"
    >
      {isDark ? (
        /* Sun — switch to the dawn sky */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
        </svg>
      ) : (
        /* Moon — back to the night sky */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.6 14.1A8.6 8.6 0 0 1 9.9 3.4a.7.7 0 0 0-.9-.9 9.8 9.8 0 1 0 12.5 12.5.7.7 0 0 0-.9-.9Z" />
        </svg>
      )}
    </button>
  );
}
