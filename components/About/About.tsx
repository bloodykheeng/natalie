import { useTranslations } from 'next-intl';
import Ornament from '@/components/Ornament/Ornament';
import Reveal from '@/components/Reveal/Reveal';

export default function About() {
  const t = useTranslations('about');

  const facts = [
    { value: t('facts.originValue'), label: t('facts.originLabel') },
    { value: t('facts.genresValue'), label: t('facts.genresLabel') },
    { value: t('facts.voiceValue'), label: t('facts.voiceLabel') }
  ];

  return (
    <section
      id="about"
      className="relative z-10 scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-display text-sm font-semibold tracking-[0.35em] text-aurora-violet uppercase">
            {t('kicker')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-gold-gradient sm:text-5xl">
            {t('heading')}
          </h2>
          <Ornament className="my-8" />
        </Reveal>

        <Reveal delay={100}>
          <p className="text-xl leading-relaxed text-parchment first-letter:float-left first-letter:mr-3 first-letter:font-script first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold-400">
            {t('paragraph1')}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 text-xl leading-relaxed text-parchment-dim">
            {t('paragraph2')}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-lg border border-gold-500/20 bg-midnight-800/80 px-5 py-6 transition-colors duration-300 hover:border-gold-500/45"
              >
                <dt className="order-2 mt-1 text-sm tracking-widest text-parchment-dim uppercase">
                  {fact.label}
                </dt>
                <dd className="font-display text-2xl font-semibold text-gold-400">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
