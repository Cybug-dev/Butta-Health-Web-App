import { Activity } from "lucide-react";

export function DashboardMetric({
  icon: Icon,
  label,
  value,
  detail,
  badge,
  progress,
  bars,
  compact = false,
  onClick,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  badge: string;
  progress?: number;
  bars?: number[];
  compact?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal/10 text-teal"><Icon size={19} /></span>
        <span className="badge max-w-[88px] border border-line bg-well text-muted"><span>{badge}</span></span>
      </div>
      <p className="mt-3 text-xs font-bold text-muted">{label}</p>
      <p className={`mt-0.5 overflow-hidden font-extrabold text-ink ${compact ? "truncate text-base" : "text-2xl"}`} title={value}>{value}</p>
      <p className="mt-0.5 truncate text-xs font-semibold text-faint">{detail}</p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-well"><div className="h-full rounded-full bg-teal" style={{ width: `${progress}%` }} /></div>
      )}
      {bars && (
        <div className="mt-3 flex h-6 items-end gap-1" aria-hidden="true">
          {bars.map((height, index) => (
            <span key={index} className={`flex-1 rounded-full transition-[height] duration-500 ${height > 0 ? "bg-teal" : "bg-well"}`} style={{ height: `${Math.max(16, height * 100)}%` }} />
          ))}
        </div>
      )}
    </>
  );

  const className = "surface-card w-full min-w-0 rounded-lg p-4 text-left transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-lift";
  return onClick ? <button type="button" onClick={onClick} className={className}>{content}</button> : <div className={className}>{content}</div>;
}
