import { Activity, AlertTriangle, Check, FileCheck2, HeartPulse } from "lucide-react";
import type { ReactNode } from "react";

export function HeaderBand({ metrics, className = "mb-5" }: { metrics: { monitoring: number; symptoms: number; records: number }; className?: string }) {
  return (
    <div className={`scroll-row -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 ${className}`}>
      <Metric icon={FileCheck2} tone="teal" label="Structured records" value={String(metrics.records)} footer="Ready for review" indicator={<span className="h-2 w-2 rounded-full bg-teal" />} />
      <Metric icon={Activity} tone="teal" label="Timeline status" value="Active sync" compact footer="Auto-encrypted" indicator={<Check size={14} strokeWidth={2.4} className="text-teal" />} />
      <Metric icon={HeartPulse} tone="rose" label="Symptom events" value={String(metrics.symptoms)} footer="Timeline ready" indicator={<span className="h-2 w-2 rounded-full bg-rose-400" />} />
      <Metric icon={AlertTriangle} tone="amber" label="Watch items" value={String(metrics.monitoring)} footer="Needs attention" indicator={<span className="h-2 w-2 rounded-full bg-amber" />} />
    </div>
  );
}

const toneClasses = {
  teal: "bg-teal/10 text-tealDark",
  rose: "bg-rose-50 text-rose-500",
  amber: "bg-amber-50 text-amber-700",
};

function Metric({
  icon: Icon,
  tone,
  label,
  value,
  compact = false,
  footer,
  indicator,
}: {
  icon: typeof Activity;
  tone: keyof typeof toneClasses;
  label: string;
  value: string;
  compact?: boolean;
  footer: string;
  indicator: ReactNode;
}) {
  return (
    <div className="surface-card stagger-in flex min-w-[168px] snap-start flex-col justify-between rounded-2xl p-3.5 sm:min-w-0">
      <div className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${toneClasses[tone]}`}>
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <span className="block truncate text-[10px] font-bold uppercase tracking-tight text-muted">{label}</span>
          <span className={`block font-extrabold leading-tight text-ink ${compact ? "mt-1 text-base" : "text-2xl"}`}>{value}</span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2">
        <span className="truncate text-[11px] font-semibold text-muted">{footer}</span>
        {indicator}
      </div>
    </div>
  );
}
