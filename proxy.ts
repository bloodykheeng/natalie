import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next 16 proxy (formerly middleware): forces the locale prefix on every URL
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
