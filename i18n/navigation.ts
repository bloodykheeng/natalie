import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Use these instead of next/link / next/navigation for locale-aware routing
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
