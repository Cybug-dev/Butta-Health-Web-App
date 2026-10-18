import { Activity, ChevronRight, FileCheck2, HeartPulse, Keyboard, ListChecks, Mic, Pill, Sparkles, Utensils, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { HealthRecord, RecordType } from "../../types";
import { severityStyles, statusStyles, typeLabels, typeStyles } from "../../constants/records";
import { formatDate } from "../../utils/format";
import { Chip } from "../ui/Chip";

const typeIcons: Record<RecordType, LucideIcon> = {
  SYMPTOM: HeartPulse,
  MEDICATION: Pill,
  DIGESTIVE: Utensils,
  DOCTOR_VISIT: FileCheck2,
  CHECK_IN: ListChecks,
};

const sourceMeta: Record<HealthRecord["source"], { icon: LucideIcon; label: string }> = {
  Typed: { icon: Keyboard, label: "Typed entry" },
  Voice: { icon: Mic, label: "Voice note" },
  Preset: { icon: Sparkles, label: "Quick log" },
};

/** Left edge shows the event's level, as in the Stitch timeline. Unspecified events stay plain.
 *  Important modifiers: .surface-card's border (components.css loads after Tailwind) would otherwise win. */
const levelEdge: Record<HealthRecord["severity"], string> = {
  Mild: "!border-l-4 !border-l-emerald",
  Moderate: "!border-l-4 !border-l-amber-500",
  Severe: "!border-l-4 !border-l-rust",
  "Not specified": "",
};

export function TimelineCard({ record }: { record: HealthRecord }) {
  const [open, setOpen] = useState(false);
  const Icon = typeIcons[record.type] ?? Activity;
  const source = sourceMeta[record.source];
  const SourceIcon = source.icon;
  const preview = record.notes.trim();
  const hasDetails = Boolean(preview || record.treatment.trim() || record.symptoms.length);

  return (
    <article className={`surface-card stagger-in overflow-hidden rounded-2xl transition hover:border-teal/30 hover:shadow-float ${levelEdge[record.severity]}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-start gap-2.5 p-3.5 text-left sm:gap-3 sm:p-4">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border sm:h-10 sm:w-10 border-teal/15 bg-mist text-teal`}>
          <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-[15px] font-bold text-ink" title={record.title}>
              {record.title}
            </h3>
            <ChevronRight size={18} className={`shrink-0 text-faint transition ${open ? "rotate-90 text-teal" : ""}`} />
          </span>

          <span className="mt-2 flex flex-wrap items-center gap-1">
            <Chip dot compact className={typeStyles[record.type]}>{typeLabels[record.type]}</Chip>
            {record.severity !== "Not specified" && <Chip dot compact className={severityStyles[record.severity]}>{record.severity}</Chip>}
            <Chip compact className={statusStyles[record.status]}>{record.status}</Chip>
          </span>

          {preview && !open && (
            <span className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-field px-2.5 py-2 text-xs text-muted">
              <span className="flex min-w-0 items-baseline italic">
                <span aria-hidden="true">&quot;</span>
                <span className="truncate">{preview}</span>
                <span aria-hidden="true">&quot;</span>
              </span>
              <span className="shrink-0 text-[10px] font-bold text-teal">Details →</span>
            </span>
          )}

          <span className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
            <span className="text-[10px] font-medium text-faint sm:text-[11px]">{formatDate(record.eventDate)}</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-well px-1.5 py-px text-[9px] font-medium text-muted sm:text-[10px]">
              <SourceIcon size={10} /> {source.label}
            </span>
          </span>
        </span>
      </button>

      {open && (
        <div className="mx-3.5 mb-3.5 grid gap-3 rounded-2xl bg-field p-3.5 sm:mx-4 sm:mb-4 md:grid-cols-[1fr_1.25fr]">
          {!hasDetails && <p className="text-xs text-muted md:col-span-2">No extra details were recorded for this event.</p>}
          {record.symptoms.length > 0 && (
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-faint">Extracted symptoms</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {record.symptoms.map((symptom) => (
                  <Chip key={symptom} className="border-line bg-white text-muted">{symptom}</Chip>
                ))}
              </div>
            </div>
          )}
          {(preview || record.treatment.trim()) && (
            <div className="min-w-0 space-y-2">
              {preview && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-faint">Your notes</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{preview}</p>
                </div>
              )}
              {record.treatment.trim() && (
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-faint">What helped</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{record.treatment}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
