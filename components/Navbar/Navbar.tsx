'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

const SECTION_IDS = ['about', 'repertoire', 'gallery', 'videos'] as const;

export default function Navbar() {
  const t = useTranslations('navbar');
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the link of the section crossing the middle band
  useEffect(() => {
    const sections = ['top', ...SECTION_IDS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === 'top' ? '' : entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const links = SECTION_IDS.map((id) => ({
    id,
    href: `#${id}`,
    label: t(id)
  }));

  // Close the menu first, then scroll — otherwise the collapsing menu
  // shifts the layout mid-scroll and the browser lands in the wrong place
  const onMobileLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setOpen(false);
    history.replaceState(null, '', `#${id}`);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 260); // just after the menu collapse animation (220ms)
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open
        ? 'border-b border-gold-500/15 bg-midnight-950/90 backdrop-blur-md'
        : 'bg-transparent'
        }`}
    >
      <nav
        aria-label={t('ariaMain')}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-script text-2xl leading-none text-gold-gradient sm:text-3xl"
        >
          Northern Sky
        </a>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Desktop links */}
          <ul className="hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative py-2 font-display text-lg tracking-wide transition-colors duration-200 ${active === link.id
                    ? 'text-gold-400'
                    : 'text-parchment-dim hover:text-gold-400'
                    }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold-400 transition-transform duration-300 ${active === link.id ? 'scale-x-100' : 'scale-x-0'
                      }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />
          <LanguageSwitcher />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('menuClose') : t('menuOpen')}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-colors duration-200 hover:text-gold-300 sm:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" />
              ) : (
                <path d="M3 5.5h14M3 10h14M3 14.5h14" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-gold-500/10 sm:hidden"
          >
            <ul className="space-y-1 bg-midnight-950/95 px-4 py-4">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => onMobileLinkClick(e, link.id)}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 font-display text-xl tracking-wide transition-colors duration-200 ${active === link.id
                      ? 'bg-gold-500/10 text-gold-400'
                      : 'text-parchment hover:bg-gold-500/5 hover:text-gold-400'
                      }`}
                  >
                    {active === link.id && (
                      <span aria-hidden="true" className="mr-2 text-sm">
                        ✦
                      </span>
                    )}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
