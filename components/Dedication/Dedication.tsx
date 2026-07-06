import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal/Reveal';

/** The reason this site exists: a birthday letter, written in the sky. */
export default function Dedication() {
  const t = useTranslations('dedication');

  return (
    <section className="relative z-10 px-4 py-28 sm:px-6">
      {/* Her banner, glowing faintly behind the letter */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-midnight-900 via-transparent to-midnight-900" />
      </div>

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <p
          aria-hidden="true"
          className="text-2xl tracking-[1em] text-gold-500/70"
        >
          ✦ ✦ ✦
        </p>

        <h2 className="mt-6 font-script text-4xl leading-tight text-gold-gradient text-gold-gradient-animated sm:text-6xl">
          {t('heading')}
        </h2>

        <p className="mt-8 font-display text-2xl leading-relaxed text-parchment italic sm:text-[1.7rem]">
          “{t('wish')}”
        </p>

        <p className="mt-8 text-lg tracking-wide text-parchment-dim">
          {t('signature')}
        </p>

        <p
          aria-hidden="true"
          className="mt-10 text-xl tracking-[1em] text-gold-500/50"
        >
          ✦
        </p>
      </Reveal>
    </section>
  );
}
