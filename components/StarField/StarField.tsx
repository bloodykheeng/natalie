'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  depth: number; // 0.15 (far) .. 1 (near) — drives parallax, size, drift
  radius: number;
  phase: number; // twinkle offset
  speed: number; // twinkle speed
  vx: number; // slow autonomous drift (galaxy is alive)
  vy: number;
};

type ShootingStar = {
  x: number;
  y: number;
  angle: number;
  speed: number; // px per ms
  born: number;
  life: number; // ms
};

/**
 * Full-viewport canvas galaxy:
 * - stars twinkle AND drift slowly on their own (the sky is alive)
 * - depth-based parallax on scroll / mouse
 * - shooting stars streak across at random, unpredictable intervals
 * - star color follows the theme (--star-rgb)
 * Renders a static sky when prefers-reduced-motion is set.
 */
export default function StarField({ count = 110 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let mouseX = 0.5;
    let scrollY = 0;
    let lastT = 0;

    // Star color comes from the theme (--star-rgb): pale silver at night,
    // faint indigo at dawn. data-music makes the sky dance to her songs.
    let starRGB = '226, 232, 240';
    let musicOn = false;
    const readFlags = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--star-rgb')
        .trim();
      if (value) starRGB = value;
      musicOn = document.documentElement.dataset.music === 'on';
    };
    readFlags();
    const themeObserver = new MutationObserver(() => {
      readFlags();
      if (reduceMotion) draw(0); // repaint the static frame in the new color
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-music']
    });

    const stars: Star[] = Array.from({ length: count }, () => {
      const depth = 0.15 + Math.random() * 0.85;
      return {
        x: Math.random(),
        y: Math.random(),
        depth,
        radius: 0.4 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.1,
        // Gentle sideways-and-up drift, faster for near stars
        vx: (Math.random() - 0.5) * 0.000006 * depth,
        vy: -(0.000002 + Math.random() * 0.000005) * depth
      };
    });

    // ——— Shooting stars: unpredictable, one at a time, gold-white streaks ———
    const shooting: ShootingStar[] = [];
    let nextShootAt = performance.now() + 3000 + Math.random() * 6000;

    const maybeSpawnShootingStar = (t: number) => {
      if (t < nextShootAt) return;
      // 5–16s normally; twice as often while her music plays
      const wait = 5000 + Math.random() * 11000;
      nextShootAt = t + (musicOn ? wait / 2 : wait);
      shooting.push({
        x: (0.1 + Math.random() * 0.8) * width,
        y: (0.05 + Math.random() * 0.35) * height,
        angle: Math.PI * (0.15 + Math.random() * 0.2) * (Math.random() < 0.5 ? 1 : -1) + Math.PI / 2 - Math.PI / 2, // shallow diagonal
        speed: 0.35 + Math.random() * 0.3,
        born: t,
        life: 700 + Math.random() * 500
      });
    };

    const drawShootingStars = (t: number) => {
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        const age = t - s.born;
        if (age > s.life) {
          shooting.splice(i, 1);
          continue;
        }
        const progress = age / s.life;
        const fade = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const dist = age * s.speed;
        const hx = s.x + Math.cos(s.angle) * dist;
        const hy = s.y + Math.sin(s.angle) * dist * 0.45 + dist * 0.25; // arcs down
        const tail = 90 + 60 * progress;
        const tx = hx - Math.cos(s.angle) * tail;
        const ty = hy - (Math.sin(s.angle) * tail * 0.45 + tail * 0.25);

        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
        grad.addColorStop(0.6, `rgba(236, 217, 160, ${0.35 * fade})`);
        grad.addColorStop(1, `rgba(255, 250, 235, ${0.9 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        // bright head
        ctx.beginPath();
        ctx.arc(hx, hy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 235, ${fade})`;
        ctx.fill();
      }
    };

    const resize = () => {
      // Cap DPR at 1.5 — background stars don't need retina sharpness
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      const dt = lastT ? Math.min(t - lastT, 50) : 16;
      lastT = t;
      ctx.clearRect(0, 0, width, height);

      // While her music plays the whole sky pulses on a ~100bpm heartbeat
      // (YouTube's iframe hides its audio stream, so the beat is simulated)
      const beat = musicOn
        ? 0.65 + 0.6 * Math.pow(Math.abs(Math.sin((t / 1000) * Math.PI * (100 / 60))), 2.2)
        : 1;
      const tempo = musicOn ? 2.4 : 1;

      for (const s of stars) {
        // Autonomous drift — wraps around the edges, livelier with music
        if (!reduceMotion) {
          s.x = ((s.x + s.vx * dt * tempo) % 1 + 1) % 1;
          s.y = ((s.y + s.vy * dt * tempo) % 1 + 1) % 1;
        }

        // Parallax: near (deep) stars react more to scroll and mouse
        const px =
          ((s.x + (mouseX - 0.5) * 0.03 * s.depth) % 1 + 1) % 1 * width;
        const py =
          ((s.y - (scrollY * 0.00012 * s.depth)) % 1 + 1) % 1 * height;

        const tw =
          (reduceMotion
            ? 0.75
            : 0.45 +
              0.55 * Math.abs(Math.sin(s.phase + t * 0.001 * s.speed * tempo))) *
          beat;

        const r = s.radius * (0.6 + s.depth * 0.7);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRGB}, ${tw * (0.35 + s.depth * 0.6)})`;
        ctx.fill();

        // Faint gold halo on the nearest stars
        if (s.depth > 0.88) {
          ctx.beginPath();
          ctx.arc(px, py, r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${tw * 0.08})`;
          ctx.fill();
        }
      }

      if (!reduceMotion) {
        maybeSpawnShootingStar(t);
        drawShootingStars(t);
        raf = requestAnimationFrame(draw);
      }
    };

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX / width;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (reduceMotion) {
      draw(0); // single static frame
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
