/**
 * star-field.tsx
 * T2-01 — Canvas-based ambient star particle field.
 * One concern: ambient star layer fixed behind all page content.
 *
 * Pure browser Canvas API — no npm packages.
 * Fixed position so it never scrolls with content (real sky effect).
 * requestAnimationFrame auto-pauses when tab is not visible.
 *
 * Placement: inside <body> in layout.tsx, before the main content wrapper.
 * Ensure main content wrapper has `relative z-10` to render above the canvas.
 *
 * Performance: 80 stars at 1–1.5px each is negligible GPU load.
 */

'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface StarFieldProps {
  /** Number of stars to render (default 80) */
  count?: number;
}

export function StarField({ count = 80 }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars with randomized properties
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() < 0.75 ? 1 : 1.5,
      opacity: Math.random() * 0.35 + 0.08,
      speedX: (Math.random() - 0.5) * 0.04,
      speedY: (Math.random() - 0.5) * 0.04,
      twinkleSpeed: 0.003 + Math.random() * 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = frame * 0.01;

      for (const star of stars) {
        // Slow drift
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle via sine wave on opacity
        const alpha =
          star.opacity *
          (0.6 + 0.4 * Math.sin(t * star.twinkleSpeed * 100 + star.twinkleOffset));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
