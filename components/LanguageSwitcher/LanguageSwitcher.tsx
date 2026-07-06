'use client';

import { useLocaleContext } from '@/providers/LocaleProvider';
import type { Locale } from '@/i18n/routing';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'РУ' }
];

export default function LanguageSwitcher() {
  const { locale, setLocale, isPending } = useLocaleContext();

  return (
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
  );
}
