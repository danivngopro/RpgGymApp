export function ProgressBar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-3 overflow-hidden rounded-full bg-arena-bg">
      <div className="h-full rounded-full bg-arena-green transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}
