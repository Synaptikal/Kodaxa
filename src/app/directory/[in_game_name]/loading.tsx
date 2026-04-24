export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sr-bg">
      <span className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted animate-pulse">
        Syncing…
      </span>
    </div>
  );
}
