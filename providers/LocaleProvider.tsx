'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { updateLocaleAction } from '@/actions/locale';
import type { Locale } from '@/i18n/routing';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, setIsPending] = useState(false);
  const pathname = usePathname();

  const setLocale = async (next: Locale) => {
    if (next === locale || isPending) return;
    setIsPending(true);
    setLocaleState(next);
    await updateLocaleAction(next);
    // Full navigation (not a soft router.replace): guarantees the <title>,
    // metadata and every server-rendered string swap language together.
    // The pending veil stays up until the new page loads.
    const search = window.location.search;
    const hash = window.location.hash;
    const newPath =
      pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${next}`) || `/${next}`;
    window.location.assign(newPath + search + hash);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return ctx;
}
