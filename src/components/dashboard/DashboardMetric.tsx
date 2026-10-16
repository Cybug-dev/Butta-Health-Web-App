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
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal"><Icon size={19} /></span>
        <span className="max-w-[88px] truncate rounded-full bg-well px-2.5 py-0.5 text-[11px] font-semibold text-muted">{badge}</span>
      </div>
      <p className="mt-4 text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 overflow-hidden font-extrabold tracking-tight text-ink ${compact ? "truncate text-sm font-bold" : "text-3xl"}`} title={value}>{value}</p>
      <p className="mt-1 truncate text-[11px] font-medium text-faint">{detail}</p>
      {typeof progress === "number" && (
        <div className="mt-auto pt-3"><div className="h-1.5 overflow-hidden rounded-full bg-well"><div className="h-full rounded-full bg-teal" style={{ width: `${progress}%` }} /></div></div>
      )}
      {bars && (
        <div className="mt-auto pt-3" aria-hidden="true">
          <div className="flex h-6 items-end gap-1">
            {bars.map((height, index) => (
              <span key={index} className={`flex-1 rounded-full transition-[height] duration-500 ${height > 0 ? "bg-teal" : "bg-well"}`} style={{ height: `${Math.max(16, height * 100)}%` }} />
            ))}
          </div>
        </div>
      )}
    </>
  );

  const className = "surface-card flex h-full min-h-[204px] w-full min-w-0 flex-col rounded-lg p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lift";
  return onClick ? <button type="button" onClick={onClick} className={className}>{content}</button> : <div className={className}>{content}</div>;
}
