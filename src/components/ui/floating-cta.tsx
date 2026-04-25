'use client';

import { useState, useEffect } from 'react';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-hidden={!visible}
    >
      <a
        href="/corp/join"
        className="
          flex items-center gap-2 px-5 py-2.5
          bg-sr-bg/90 backdrop-blur-sm
          border border-accent/30
          text-xs font-mono tracking-[0.15em] uppercase text-accent
          hover:bg-accent/10 hover:border-accent/60
          transition-all duration-200
          shadow-[0_0_20px_rgba(232,164,74,0.12)]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        "
        tabIndex={visible ? 0 : -1}
      >
        Join the Corp →
      </a>
    </div>
  );
}
