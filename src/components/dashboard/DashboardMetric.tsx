import { Activity } from "lucide-react";

type ChartDay = { label: string; count: number };

export function DashboardMetric({
  icon: Icon,
  label,
  value,
  unit,
  badge,
  badgeTone = "muted",
  chart,
  progress,
  onClick,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  unit: string;
  badge: string;
  badgeTone?: "muted" | "teal";
  chart?: ChartDay[];
  progress?: number;
  onClick?: () => void;
}) {
  const maxCount = Math.max(1, ...(chart ?? []).map((day) => day.count));

  return (
    <button
      type="button"
      onClick={onClick}
      className="surface-card flex h-full w-full min-w-0 flex-col justify-between rounded-2xl p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-teal/10 text-leaf sm:h-8 sm:w-8">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
          </span>
          <span className={`truncate rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeTone === "teal" ? "bg-teal/10 text-leaf" : "bg-well text-muted"}`}>{badge}</span>
        </div>
        <p className="mt-3 text-[11px] font-semibold text-muted sm:text-xs">{label}</p>
        <p className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{value}</span>
          <span className="truncate text-[11px] font-medium text-faint">{unit}</span>
        </p>
      </div>

      {chart && (
        <div className="mt-3 flex h-7 w-full items-end gap-1.5 border-t border-line pt-1.5" role="img" aria-label={`Events per day: ${chart.map((day) => `${day.label} ${day.count}`).join(", ")}`}>
          {chart.map((day, index) => (
            <span
              key={`${day.label}-${index}`}
              title={`${day.label}: ${day.count} ${day.count === 1 ? "event" : "events"}`}
              className={`w-2 rounded-full transition-[height] duration-500 sm:w-2.5 ${day.count > 0 ? "bg-leaf" : "bg-barIdle"}`}
              style={{ height: `${day.count > 0 ? 8 + (day.count / maxCount) * 12 : 6}px` }}
            />
          ))}
        </div>
      )}

      {typeof progress === "number" && (
        <div className="mt-3 w-full border-t border-line pt-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} ${progress}%`}>
          <div className="h-2 w-full overflow-hidden rounded-full bg-track">
            <div className="h-full rounded-full bg-leaf transition-[width] duration-700 ease-out" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        </div>
      )}
    </button>
  );
}
