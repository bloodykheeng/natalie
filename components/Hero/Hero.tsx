'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Ornament from '@/components/Ornament/Ornament';

export default function Hero() {
  const t = useTranslations('hero');
  const portraitRef = useRef<HTMLDivElement>(null);

  // Gentle parallax: the portrait drifts slower than the page scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-dvh items-center overflow-hidden px-4 pt-24 pb-16 sm:px-6"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* ——— Words ——— */}
        <div className="text-center lg:text-left">
          <p className="mb-4 font-display text-sm font-semibold tracking-[0.35em] text-aurora-teal uppercase">
            {t('kicker')}
          </p>

          <h1 className="font-script text-5xl leading-[1.15] text-gold-gradient text-gold-gradient-animated sm:text-7xl lg:text-8xl">
            Northern Sky
          </h1>

          <Ornament className="my-6 lg:justify-start" />

          <p className="mx-auto max-w-xl font-display text-2xl leading-snug text-parchment italic sm:text-3xl lg:mx-0">
            {t('title')}
          </p>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-parchment-dim lg:mx-0">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
            <a
              href="#videos"
              className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-500 px-7 font-display text-lg font-semibold text-on-gold transition-[background-color,box-shadow,transform] duration-200 hover:bg-gold-400 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)] active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5-9-5.5Z" />
              </svg>
              {t('ctaListen')}
            </a>
            <a
              href="#about"
              className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-gold-500/50 px-7 font-display text-lg text-gold-400 transition-colors duration-200 hover:border-gold-400 hover:text-gold-300 active:scale-[0.98]"
            >
              {t('ctaStory')}
            </a>
          </div>
        </div>

        {/* ——— Portrait ——— */}
        <div ref={portraitRef} className="flex justify-center will-change-transform">
          <div className="relative animate-float">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.18),rgba(94,234,212,0.10)_55%,transparent_70%)] blur-xl"
            />
            <Image
              src="/images/natalie-portrait.jpg"
              alt={t('portraitAlt')}
              width={340}
              height={340}
              priority
              className="ornate-ring relative h-auto w-56 rounded-full object-cover sm:w-72 lg:w-85"
            />
            {/* Orbiting star */}
            <div
              aria-hidden="true"
              className="absolute -inset-6.5 animate-spin-slow"
            >
              <span className="absolute top-0 left-1/2 -ml-1 text-lg text-gold-400">
                ✦
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Scroll cue ——— */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold-500/40 pt-2">
          <span className="h-2.5 w-1 rounded-full bg-gold-400 animate-scroll-cue" />
        </div>
      </div>
    </section>
  );
}
