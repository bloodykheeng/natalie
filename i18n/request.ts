import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { cookies } from 'next/headers';
import { routing } from './routing';

// Messages are assembled by spreading co-located translations/${locale}.json
// files into one object. Locale: URL segment → cookies → default.
// ⚠️ Every new translations/ folder MUST be registered with a spread line here.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  let locale: string;
  if (hasLocale(routing.locales, requested)) {
    locale = requested;
  } else {
    const cookieStore = await cookies();
    const fromCookie =
      cookieStore.get('NEXT_LOCALE')?.value ?? cookieStore.get('locale')?.value;
    locale = hasLocale(routing.locales, fromCookie)
      ? fromCookie
      : routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`@/app/[locale]/translations/${locale}.json`)).default,
      ...(await import(`@/components/Navbar/translations/${locale}.json`)).default,
      ...(await import(`@/components/LanguageSwitcher/translations/${locale}.json`)).default,
      ...(await import(`@/components/Hero/translations/${locale}.json`)).default,
      ...(await import(`@/components/About/translations/${locale}.json`)).default,
      ...(await import(`@/components/Repertoire/translations/${locale}.json`)).default,
      ...(await import(`@/components/Videos/translations/${locale}.json`)).default,
      ...(await import(`@/components/Gallery/translations/${locale}.json`)).default,
      ...(await import(`@/components/MusicDock/translations/${locale}.json`)).default,
      ...(await import(`@/components/ScrollToTop/translations/${locale}.json`)).default,
      ...(await import(`@/components/Dedication/translations/${locale}.json`)).default,
      ...(await import(`@/components/Footer/translations/${locale}.json`)).default
    }
  };
});
