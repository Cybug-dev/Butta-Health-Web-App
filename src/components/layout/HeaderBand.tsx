import { Activity, AlertTriangle, FileCheck2, HeartPulse } from "lucide-react";

export function HeaderBand({ metrics }: { metrics: { monitoring: number; symptoms: number; records: number } }) {
  return (
    <div className="scroll-row -mx-4 mb-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
      <Metric icon={FileCheck2} label="Structured records" value={metrics.records} detail="Ready for review" />
      <Metric icon={HeartPulse} label="Symptom events" value={metrics.symptoms} detail="Timeline ready" />
      <Metric icon={AlertTriangle} label="Watch items" value={metrics.monitoring} detail="Needs attention" />
    </div>
  );
}

export function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="surface-card stagger-in min-w-[216px] snap-start rounded-lg px-4 py-4 sm:min-w-0">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
          <Icon size={19} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold text-muted">{label}</span>
          <span className="mt-0.5 block text-2xl font-extrabold leading-7 text-ink">{value}</span>
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-2 text-xs font-semibold text-muted">{detail}</p>
    </div>
  );
}
