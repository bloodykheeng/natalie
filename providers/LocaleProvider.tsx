'use client';

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    startTransition(async () => {
      await updateLocaleAction(next);
      setLocaleState(next);
      // Rewrite the URL prefix (/en/... ↔ /ru/...) preserving query params
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const newPath =
        pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${next}`) || `/${next}`;
      router.replace(newPath + search);
      router.refresh();
    });
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
