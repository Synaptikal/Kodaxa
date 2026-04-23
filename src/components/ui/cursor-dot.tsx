/**
 * cursor-dot.tsx
 * T2-04 — Custom teal cursor dot with smooth lag follow.
 * One concern: ambient cursor enhancement for desktop users only.
 *
 * Uses accent (teal) = Kodaxa corporate identity color on cursor.
 * Only renders on non-touch devices.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -20, y: -20 });
  const actual = useRef({ x: -20, y: -20 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let animId: number;
    const animate = () => {
      actual.current.x += (pos.current.x - actual.current.x) * 0.12;
      actual.current.y += (pos.current.y - actual.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${actual.current.x - 4}px, ${actual.current.y - 4}px)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent/60 pointer-events-none z-[9999] mix-blend-screen"
      aria-hidden="true"
    />
  );
}
