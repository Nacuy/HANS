export function LinearProgress({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-indigo-50 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full bg-indigo-500"
        style={{ width: `${pct}%`, transition: "width 0.6s ease" }}
      />
    </div>
  );
}
