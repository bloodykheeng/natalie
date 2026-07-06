'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Ornament from '@/components/Ornament/Ornament';
import Reveal from '@/components/Reveal/Reveal';
import { videos, type Video } from './video-data';

const GENRE_BADGE: Record<Video['genreKey'], string> = {
  jazz: 'bg-gold-500/15 text-gold-400',
  gothic: 'bg-aurora-violet/15 text-aurora-violet',
  rock: 'bg-aurora-teal/15 text-aurora-teal',
  screen: 'bg-aurora-blue/15 text-aurora-blue'
};

/**
 * Lite YouTube embed: shows the thumbnail with a gold play button and only
 * loads the iframe (with sound) once the visitor chooses to play.
 */
function VideoCard({
  video,
  playLabel,
  genreLabel,
  large = false
}: {
  video: Video;
  playLabel: string;
  genreLabel: string;
  large?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <figure className="group overflow-hidden rounded-xl border border-gold-500/20 bg-midnight-800/80 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-[0_8px_40px_rgba(212,175,55,0.10)]">
      <div className="relative aspect-video w-full overflow-hidden bg-midnight-950">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${playLabel}: ${video.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail, plain img keeps it dependency-free */}
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-linear-to-t from-midnight-950/80 via-transparent to-transparent" />
            <span
              className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-on-gold shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-transform duration-200 group-hover:scale-110 ${
                large ? 'h-20 w-20' : 'h-14 w-14'
              }`}
            >
              <svg
                width={large ? 28 : 20}
                height={large ? 28 : 20}
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                className="translate-x-0.5"
              >
                <path d="M4 2.5v11l9-5.5-9-5.5Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-4 py-3.5">
        <span
          className={`font-display leading-tight font-semibold text-parchment ${
            large ? 'text-xl' : 'text-lg'
          }`}
        >
          {video.title}
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase ${GENRE_BADGE[video.genreKey]}`}
        >
          {genreLabel}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Videos() {
  const t = useTranslations('videos');
  const featured = videos.find((v) => v.featured) ?? videos[0];
  const rest = videos.filter((v) => v !== featured);

  return (
    <section
      id="videos"
      className="relative z-10 scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="font-display text-sm font-semibold tracking-[0.35em] text-aurora-violet uppercase">
            {t('kicker')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-gold-gradient sm:text-5xl">
            {t('heading')}
          </h2>
          <Ornament className="my-8" />
        </Reveal>

        {/* Featured cover */}
        <Reveal>
          <p className="mb-3 text-center font-display text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
            ✦ {t('featured')} ✦
          </p>
          <div className="mx-auto max-w-3xl">
            <VideoCard
              video={featured}
              playLabel={t('play')}
              genreLabel={t(`genres.${featured.genreKey}`)}
              large
            />
          </div>
        </Reveal>

        {/* The rest of the night's programme */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((video, i) => (
            <Reveal key={video.id} delay={(i % 3) * 90}>
              <VideoCard
                video={video}
                playLabel={t('play')}
                genreLabel={t(`genres.${video.genreKey}`)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a
            href="https://www.youtube.com/@Northern_skyy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-gold-500/50 px-7 font-display text-lg text-gold-400 transition-colors duration-200 hover:border-gold-400 hover:text-gold-300"
          >
            {t('channelCta')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 12 12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
