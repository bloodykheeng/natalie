'use server';

import { cookies } from 'next/headers';
import { routing, type Locale } from '@/i18n/routing';

export async function updateLocaleAction(locale: Locale) {
  if (!routing.locales.includes(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set('locale', locale, { path: '/', maxAge: 31536000 });
  cookieStore.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31536000 });
}
