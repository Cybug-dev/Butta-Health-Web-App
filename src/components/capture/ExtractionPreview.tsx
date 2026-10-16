import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { typeLabels } from "../../constants/records";
import { parseObservation } from "../../services/mockApi";
import type { ExtractedRecord } from "../../types";

const SEVERITY_LEVEL: Record<ExtractedRecord["severity"], number> = { "Not specified": 0, Mild: 1, Moderate: 2, Severe: 3 };
const SEVERITY_COLOR: Record<ExtractedRecord["severity"], string> = { "Not specified": "bg-barIdle", Mild: "bg-teal", Moderate: "bg-amber", Severe: "bg-rose-500" };

export function ExtractionHeader({ title, aside }: { title: string; aside: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">Clinical extraction</span>
        <h3 className="text-base font-extrabold tracking-tight text-ink">{title}</h3>
      </div>
      {aside}
    </div>
  );
}

export function DraftBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
      <span className="h-2 w-2 rounded-full bg-amber" />
      Draft
    </span>
  );
}

export function EntityTile({ label, children, aside }: { label: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-teal/10 bg-field p-3.5 transition hover:border-teal/30">
      <div className="min-w-0 flex-1">
        <span className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-faint">{label}</span>
        {children}
      </div>
      {aside}
    </div>
  );
}

export function SeverityMeter({ severity }: { severity: ExtractedRecord["severity"] }) {
  const level = SEVERITY_LEVEL[severity];
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
      {[1, 2, 3].map((step) => (
        <span key={step} className={`h-2 w-5 rounded-full ${step <= level ? SEVERITY_COLOR[severity] : "bg-barIdle"}`} />
      ))}
    </span>
  );
}

export function FieldGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      {items.map((item) => (
        <div key={item} className="min-w-0 rounded-xl border border-teal/10 bg-white p-2 shadow-sm">
          <span className="block text-[9px] font-bold uppercase text-faint">Detail</span>
          <span className="block truncate text-xs font-semibold text-ink" title={item}>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function ExtractionPreview({
  observation,
  tags,
  disabled,
  onEdit,
  onConfirm,
}: {
  observation: string;
  tags: string[];
  disabled: boolean;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const preview = observation.trim() ? parseObservation(observation, "Typed", tags) : null;

  return (
    <section className="surface-card rounded-3xl p-5">
      <ExtractionHeader title="Detected entities" aside={<DraftBadge />} />
      {preview ? (
        <>
          <div className="space-y-2.5">
            <EntityTile label="Type" aside={<span className="rounded-xl border border-teal/15 bg-white px-2.5 py-1 text-xs font-semibold text-tealDark shadow-sm">Detected</span>}>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal" />
                <span className="text-sm font-bold tracking-tight text-ink">{typeLabels[preview.type]}</span>
              </span>
            </EntityTile>
            <EntityTile label="Severity" aside={<SeverityMeter severity={preview.severity} />}>
              <span className="text-sm font-bold tracking-tight text-ink">{preview.severity}</span>
            </EntityTile>
            <EntityTile label="Title">
              <span className="block truncate text-sm font-bold tracking-tight text-ink" title={preview.title}>{preview.title}</span>
            </EntityTile>
            <div className="rounded-2xl border border-teal/10 bg-field p-3.5 transition hover:border-teal/30">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-faint">Fields extracted</span>
                <span className="text-xs font-bold text-ink">{preview.symptoms.length} extracted</span>
              </div>
              <FieldGrid items={preview.symptoms} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <button type="button" onClick={onEdit} disabled={disabled} className="px-3 py-2 text-xs font-bold text-muted transition hover:text-ink disabled:opacity-50">
              Edit fields
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-leaf/20 transition-all enabled:hover:bg-tealDark enabled:active:scale-95 disabled:opacity-60"
            >
              Confirm &amp; save
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-field p-4 text-center text-xs font-medium text-muted">
          Describe how you feel above to preview the extracted fields.
        </p>
      )}
    </section>
  );
}

export function Entity({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-well/70 px-3 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 truncate font-bold text-ink" title={value}>{value}</p>
    </div>
  );
}
