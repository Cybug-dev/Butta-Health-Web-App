import { Activity, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { HealthRecord } from "../../types";
import { formatDate } from "../../utils/format";
import { SeverityBadge, StatusBadge, TypeBadge } from "../ui/RecordBadges";

export function TimelineCard({ record }: { record: HealthRecord }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="surface-card stagger-in overflow-hidden rounded-lg p-4 transition-shadow hover:shadow-float">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start gap-4 text-left"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
          <Activity size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center">
            <h3 className="min-w-0 max-w-full truncate font-serif text-xl sm:flex-1" title={record.title}>{record.title}</h3>
            <div className="flex max-w-full gap-2 overflow-hidden">
              <TypeBadge type={record.type} />
              <SeverityBadge severity={record.severity} />
            </div>
          </div>
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold text-faint">
            <span>{formatDate(record.eventDate)}</span>
            <span>{record.source}</span>
            <StatusBadge status={record.status} />
          </div>
        </div>
        <ChevronRight className={`mt-2 shrink-0 text-faint transition ${open ? "rotate-90" : ""}`} size={18} />
      </button>
      {open && (
        <div className="mt-4 grid gap-3 border-t border-line pt-4 md:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Extracted symptoms</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {record.symptoms.map((symptom) => (
                <span key={symptom} className="badge border border-line bg-well text-muted" title={symptom}>
                  <span>{symptom}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Patient notes</p>
            <p className="mt-2 text-sm leading-6 text-muted">{record.notes}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{record.treatment}</p>
          </div>
        </div>
      )}
    </article>
  );
}
