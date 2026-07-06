'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number; // 0..1 of width
  y: number; // 0..1 of full document height it drifts within
  depth: number; // 0.15 (far) .. 1 (near) — drives parallax + size
  radius: number;
  phase: number; // twinkle offset
  speed: number; // twinkle speed
};

/**
 * Full-viewport canvas of twinkling stars with depth-based parallax:
 * near stars drift faster than far ones as you scroll / move the mouse.
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

    // Star color comes from the theme (--star-rgb): pale silver at night,
    // faint indigo at dawn. Re-read whenever data-theme changes.
    let starRGB = '226, 232, 240';
    const readStarColor = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--star-rgb')
        .trim();
      if (value) starRGB = value;
    };
    readStarColor();
    const themeObserver = new MutationObserver(() => {
      readStarColor();
      if (reduceMotion) draw(0); // repaint the static frame in the new color
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      depth: 0.15 + Math.random() * 0.85,
      radius: 0.4 + Math.random() * 1.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.1
    }));

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
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        // Parallax: near (deep) stars react more to scroll and mouse
        const px =
          ((s.x + (mouseX - 0.5) * 0.03 * s.depth) % 1 + 1) % 1 * width;
        const py =
          ((s.y - (scrollY * 0.00012 * s.depth)) % 1 + 1) % 1 * height;

        const tw = reduceMotion
          ? 0.75
          : 0.45 + 0.55 * Math.abs(Math.sin(s.phase + t * 0.001 * s.speed));

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
      if (!reduceMotion) raf = requestAnimationFrame(draw);
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
