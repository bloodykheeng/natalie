import { useTranslations } from 'next-intl';
import Ornament from '@/components/Ornament/Ornament';
import Reveal from '@/components/Reveal/Reveal';

const GENRES = [
  {
    key: 'jazz',
    accent: 'text-gold-400 border-gold-500/25 hover:border-gold-500/60',
    songs: ['Dream a Little Dream of Me', 'Happy Time — Bob Crosby']
  },
  {
    key: 'gothic',
    accent:
      'text-aurora-violet border-aurora-violet/25 hover:border-aurora-violet/60',
    songs: ['Swamped — Lacuna Coil', 'Harpens Kraft — Myrkur']
  },
  {
    key: 'rock',
    accent:
      'text-aurora-teal border-aurora-teal/25 hover:border-aurora-teal/60',
    songs: [
      'Rhiannon — Fleetwood Mac',
      'Edge of Seventeen — Stevie Nicks',
      'Angel of the Morning — Juice Newton',
      "It's My Party — Lesley Gore"
    ]
  },
  {
    key: 'screen',
    accent:
      'text-aurora-blue border-aurora-blue/25 hover:border-aurora-blue/60',
    songs: ['Come What May — Moulin Rouge!', 'Do You — American Horror Story']
  }
] as const;

export default function Repertoire() {
  const t = useTranslations('repertoire');

  return (
    <section
      id="repertoire"
      className="relative z-10 scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="font-display text-sm font-semibold tracking-[0.35em] text-aurora-teal uppercase">
            {t('kicker')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-gold-gradient sm:text-5xl">
            {t('heading')}
          </h2>
          <Ornament className="my-8" />
          <p className="mx-auto max-w-2xl text-lg text-parchment-dim">
            {t('intro')}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {GENRES.map((genre, i) => (
            <Reveal key={genre.key} delay={i * 90}>
              <article
                className={`group h-full rounded-xl border bg-midnight-800/70 p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:bg-midnight-800/90 ${genre.accent}`}
              >
                <h3 className="font-display text-2xl font-semibold">
                  {t(`genres.${genre.key}.title`)}
                </h3>
                <p className="mt-1 text-sm tracking-wide text-parchment-dim italic">
                  {t(`genres.${genre.key}.mood`)}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-current/15 pt-5">
                  {genre.songs.map((song) => (
                    <li
                      key={song}
                      className="flex items-baseline gap-2.5 text-parchment"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="currentColor"
                        aria-hidden="true"
                        className="shrink-0 translate-y-px opacity-70"
                      >
                        <path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8Z" />
                      </svg>
                      <span className="leading-snug">{song}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
