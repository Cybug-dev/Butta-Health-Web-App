import { ChevronRight, HeartPulse, Pill, Plus } from "lucide-react";
import type { HealthRecord } from "../../types";
import { formatDate } from "../../utils/format";

export function LatestEventCard({ record, onClick, className = "" }: { record?: HealthRecord; onClick: () => void; className?: string }) {
  const Icon = !record ? Plus : record.type === "MEDICATION" ? Pill : HeartPulse;
  const title = record?.title || "No events yet";
  const detail = record ? formatDate(record.eventDate) : "Log your first event";

  const iconTile = (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/10 text-leaf">
      <Icon size={18} />
    </span>
  );
  const labelRow = (
    <span className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Latest event</span>
      {record && <span className="rounded-md bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-leaf">Recent</span>}
    </span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`surface-card group w-full min-w-0 rounded-2xl p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5 ${className}`}
    >
      <span className="flex items-center justify-between gap-3 sm:hidden">
        <span className="flex min-w-0 items-center gap-3.5">
          {iconTile}
          <span className="min-w-0">
            {labelRow}
            <span className="mt-1 block truncate text-xs font-bold text-ink">{title}</span>
            <span className="mt-0.5 block truncate text-[11px] text-faint">{detail}</span>
          </span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-teal" />
      </span>

      <span className="hidden h-full flex-col justify-between sm:flex">
        <span className="flex items-center justify-between gap-2">
          {iconTile}
          <ChevronRight size={16} className="shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-teal" />
        </span>
        <span className="mt-3 block min-w-0">
          {labelRow}
          <span className="mt-1.5 block truncate text-sm font-bold text-ink" title={title}>{title}</span>
          <span className="mt-1 block truncate text-[11px] text-faint">{detail}</span>
        </span>
      </span>
    </button>
  );
}
