'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { videos } from '@/components/Videos/video-data';

// Her covers that allow embedding become the site's soundtrack
const PLAYLIST = videos.filter((v) => v.embeddable !== false);

// Irregular per-bar patterns so the equalizer never loops in sync
const EQ_BARS = [
  { pattern: [0.3, 1, 0.5, 0.85, 0.3], duration: 1.1, color: 'bg-gold-400' },
  { pattern: [0.7, 0.25, 1, 0.45, 0.7], duration: 1.5, color: 'bg-gold-300' },
  { pattern: [0.4, 0.9, 0.3, 1, 0.4], duration: 0.9, color: 'bg-gold-500' },
  { pattern: [0.85, 0.4, 0.95, 0.25, 0.85], duration: 1.3, color: 'bg-gold-400' }
];

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, number>;
      events: {
        onReady: (e: { target: YTPlayer }) => void;
        onStateChange: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace & { loaded?: number };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Load the official YouTube IFrame API once, on demand */
function loadYouTubeAPI(): Promise<YTNamespace> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    if (!document.getElementById('yt-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'yt-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });
}

/**
 * Floating "now playing" dock: her covers as the site's soundtrack,
 * played through the official YouTube player (views count for her).
 * Browsers require a click before sound — the pulsing vinyl invites it.
 */
export default function MusicDock() {
  const t = useTranslations('musicDock');
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [started, setStarted] = useState(false);
  const [track, setTrack] = useState(0);

  const playerRef = useRef<YTPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef(0);
  trackRef.current = track;

  const start = async () => {
    setStarted(true);
    setExpanded(true);
    const YT = await loadYouTubeAPI();
    if (!mountRef.current || playerRef.current) return;
    new YT.Player(mountRef.current, {
      videoId: PLAYLIST[0].id,
      playerVars: { playsinline: 1, rel: 0 },
      events: {
        onReady: (e) => {
          playerRef.current = e.target;
          e.target.playVideo();
        },
        onStateChange: (e) => {
          if (e.data === 1) setPlaying(true); // playing
          if (e.data === 2) setPlaying(false); // paused
          if (e.data === 0) {
            // ended → next song keeps the night going
            const next = (trackRef.current + 1) % PLAYLIST.length;
            setTrack(next);
            playerRef.current?.loadVideoById(PLAYLIST[next].id);
          }
        }
      }
    });
  };

  const toggle = () => {
    if (!started) {
      void start();
      return;
    }
    if (playing) playerRef.current?.pauseVideo();
    else playerRef.current?.playVideo();
  };

  const nextTrack = () => {
    if (!playerRef.current) return;
    const next = (track + 1) % PLAYLIST.length;
    setTrack(next);
    playerRef.current.loadVideoById(PLAYLIST[next].id);
  };

  // Broadcast the rhythm to the whole sky: StarField, Sparks and every
  // spinning element read data-music and dance while she sings
  useEffect(() => {
    document.documentElement.dataset.music = playing ? 'on' : 'off';
    return () => {
      document.documentElement.dataset.music = 'off';
    };
  }, [playing]);

  useEffect(() => () => playerRef.current?.destroy(), []);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
      {/* Expanded panel: the player itself + song title */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{
              opacity: expanded ? 1 : 0,
              y: expanded ? 0 : 12,
              scale: expanded ? 1 : 0.96,
              pointerEvents: expanded ? 'auto' : 'none'
            }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-20 w-72 max-w-[85vw] overflow-hidden rounded-xl border border-gold-500/30 bg-midnight-950/95 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          >
            {/* Keep the player mounted even while visually collapsed so the
                music keeps playing */}
            <div className={expanded ? 'aspect-video w-full' : 'h-0 w-0 overflow-hidden'}>
              <div ref={mountRef} className="h-full w-full" />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="truncate font-display text-sm text-parchment">
                <span className="mr-1.5 text-gold-400">♪</span>
                {PLAYLIST[track].title}
              </p>
              <button
                type="button"
                onClick={nextTrack}
                aria-label={t('next')}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gold-400 transition-colors hover:text-gold-300"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M2 2.5v11l7.5-5.5L2 2.5Zm9.5 0h2v11h-2v-11Z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-row-reverse items-center gap-3">
        {/* The vinyl button: spins while her voice plays */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t('pause') : t('play')}
          className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-gold-500/50 bg-midnight-950/90 shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-transform hover:scale-105"
        >
          {/* mini record */}
          <span
            aria-hidden="true"
            className={`absolute inset-1.5 rounded-full ${playing ? 'animate-spin-slow' : ''}`}
            style={{
              background:
                'repeating-radial-gradient(circle at center, var(--vinyl-groove-1) 0px, var(--vinyl-groove-2) 2px, var(--vinyl-groove-1) 4px)'
            }}
          >
            <span className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500" />
          </span>
          {/* play / pause glyph on top */}
          <span className="relative z-10 text-on-gold">
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 2h3v10H3V2Zm5 0h3v10H8V2Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" className="translate-x-px">
                <path d="M3.5 2v10l8-5-8-5Z" />
              </svg>
            )}
          </span>
          {/* invitation pulse until first play */}
          {!started && (
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full border border-gold-500/60"
            />
          )}
        </button>

        {/* tiny equalizer dancing with the music (JS-driven, always moves) */}
        {playing && (
          <span
            aria-hidden="true"
            className="flex h-7 items-end gap-1 rounded-full border border-gold-500/25 bg-midnight-950/80 px-2.5 py-1.5"
          >
            {EQ_BARS.map((bar, i) => (
              <motion.span
                key={i}
                animate={{ scaleY: bar.pattern }}
                transition={{
                  duration: bar.duration,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`h-4 w-1 origin-bottom rounded-full ${bar.color}`}
              />
            ))}
          </span>
        )}

        {/* hint bubble before first play; collapse toggle after */}
        {!started ? (
          <span className="rounded-full border border-gold-500/25 bg-midnight-950/80 px-3.5 py-1.5 font-display text-sm text-gold-300">
            {t('hint')}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? t('collapse') : t('expand')}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gold-500/30 bg-midnight-950/80 text-gold-400 transition-colors hover:text-gold-300"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-200 ${expanded ? '' : 'rotate-180'}`}
            >
              <path d="m3 8.5 4-4 4 4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
