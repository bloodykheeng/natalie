import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always', // locale always shows in URL, e.g. /en, /ru
  localeDetection: false, // NO auto browser detection — cookie + URL prefix only
  localeCookie: true,
  pathnames: {
    '/': '/'
  }
});

export type Locale = (typeof routing.locales)[number];
