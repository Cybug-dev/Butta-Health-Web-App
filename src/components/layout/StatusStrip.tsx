export function StatusStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.13em]">
      <span className="text-faint">{label}</span>
      <span className="text-teal">{value}</span>
    </div>
  );
}
