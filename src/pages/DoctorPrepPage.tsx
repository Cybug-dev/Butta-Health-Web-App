import { ArrowRight, Check, FileText, Link2, ListChecks, MessageCircleQuestion, Search, type LucideIcon } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { HeaderBand } from "../components/layout/HeaderBand";
import { Chip } from "../components/ui/Chip";
import { ComingSoonModal, type ComingSoonFeature } from "../components/ui/ComingSoonModal";
import { severityStyles, statusStyles, typeLabels, typeStyles } from "../constants/records";
import type { HealthRecord, RecordType, ViewId } from "../types";
import { formatDate } from "../utils/format";

type PrepFilter = "ALL" | "SELECTED" | RecordType;

const FILTERS: { id: PrepFilter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "SELECTED", label: "Selected" },
  { id: "SYMPTOM", label: "Symptoms" },
  { id: "MEDICATION", label: "Medications" },
  { id: "DIGESTIVE", label: "Digestive" },
  { id: "DOCTOR_VISIT", label: "Doctor visits" },
];

const SOURCE_LABELS: Record<HealthRecord["source"], string> = { Typed: "Typed note", Voice: "Voice note", Preset: "Quick log" };

const COMING_SOON = {
  questions: { title: "Questions for your doctor", description: "Write down what you want to ask, and they'll appear at the top of your visit summary.", icon: MessageCircleQuestion },
  medicalFile: { title: "Clinic-ready file", description: "Send your summary in a format clinic computer systems can read directly.", icon: FileText },
  secureLink: { title: "Private share link", description: "Share your summary with a link that only opens with a PIN you choose.", icon: Link2 },
} satisfies Record<string, ComingSoonFeature>;

const FORMATS: { id: string; title: string; detail: string; feature?: ComingSoonFeature }[] = [
  { id: "pdf", title: "One-page PDF", detail: "Print or save" },
  { id: "file", title: "Clinic file", detail: "For clinic systems", feature: COMING_SOON.medicalFile },
  { id: "link", title: "Private link", detail: "PIN protected", feature: COMING_SOON.secureLink },
];

function levelChip(record: HealthRecord) {
  return record.severity !== "Not specified"
    ? { label: record.severity, className: severityStyles[record.severity] }
    : { label: record.status, className: statusStyles[record.status] };
}

export function DoctorPrepPage({
  records,
  metrics,
  selectedIds,
  setSelectedIds,
  setActiveView,
}: {
  records: HealthRecord[];
  metrics: { monitoring: number; symptoms: number; records: number };
  selectedIds: string[];
  setSelectedIds: (value: string[]) => void;
  setActiveView: (view: ViewId) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PrepFilter>("ALL");
  const [comingSoon, setComingSoon] = useState<ComingSoonFeature | null>(null);
  const closeComingSoon = useCallback(() => setComingSoon(null), []);

  const selected = useMemo(() => records.filter((record) => selectedIds.includes(record.id)), [records, selectedIds]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      if (filter === "SELECTED" && !selectedIds.includes(record.id)) return false;
      if (filter !== "ALL" && filter !== "SELECTED" && record.type !== filter) return false;
      if (!query) return true;
      return [record.title, record.notes, record.treatment, ...record.symptoms].some((text) => text.toLowerCase().includes(query));
    });
  }, [records, selectedIds, filter, search]);

  const bundle = useMemo(() => {
    const counts = new Map<RecordType, number>();
    selected.forEach((record) => counts.set(record.type, (counts.get(record.type) ?? 0) + 1));
    return [...counts].map(([type, count]) => `${count} ${typeLabels[type].toLowerCase()}`).join(", ");
  }, [selected]);

  function toggle(id: string) {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  function countFor(id: PrepFilter) {
    if (id === "ALL") return records.length;
    if (id === "SELECTED") return selectedIds.length;
    return records.filter((record) => record.type === id).length;
  }

  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-gradient-to-br from-teal/10 to-transparent blur-2xl" />
        <span className="relative inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-mist px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-leaf">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Visit planner
        </span>
        <h1 className="relative mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">Doctor visit prep</h1>
        <p className="relative mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
          Pick the entries you want to talk about, and we'll turn them into a short summary for your doctor. Only what you select is included.
        </p>
        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedIds(records.slice(0, 5).map((record) => record.id))}
            className="rounded-xl border border-line bg-well px-3.5 py-2 text-xs font-bold text-leaf transition hover:bg-mist"
          >
            Select recent five
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds(records.filter((record) => record.type === "SYMPTOM").map((record) => record.id))}
            className="rounded-xl border border-line bg-well px-3.5 py-2 text-xs font-bold text-leaf transition hover:bg-mist"
          >
            Select symptoms
          </button>
          {selectedIds.length > 0 && (
            <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-muted transition hover:text-ink">
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveView("doctor-summary")}
            disabled={!selectedIds.length}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white shadow-lift transition enabled:hover:bg-tealDark enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto"
          >
            <FileText size={15} /> Generate summary
          </button>
        </div>
      </section>

      <HeaderBand metrics={metrics} className="mb-0" />

      <section className="space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} strokeWidth={2.2} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search records, symptoms, notes..."
            aria-label="Search records"
            className="field-input w-full py-3 pl-10 pr-4 text-xs"
          />
        </div>
        <div className="scroll-row -mx-4 flex gap-1.5 overflow-x-auto px-4 py-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter records">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold transition ${
                filter === id ? "border-teal bg-teal text-white" : "border-line bg-white text-muted hover:border-teal/40 hover:text-ink"
              }`}
            >
              {label} ({countFor(id)})
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1">
          <h2 className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-leaf">Entries for your visit</h2>
          <span className="whitespace-nowrap text-[11px] font-semibold text-muted">
            {selectedIds.length} of {records.length} included
          </span>
        </div>

        {visible.length ? (
          <div className="grid items-start gap-3 lg:grid-cols-2">
            {visible.map((record) => (
              <PrepCard key={record.id} record={record} selected={selectedIds.includes(record.id)} onToggle={() => toggle(record.id)} />
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-3xl p-8 text-center text-sm text-muted">
            {records.length ? "No entries match this search or filter." : "Nothing logged yet. Log a few events and they'll show up here."}
          </div>
        )}
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <PrepSection
          icon={MessageCircleQuestion}
          title="Questions for your doctor"
          aside={
            <button type="button" onClick={() => setComingSoon(COMING_SOON.questions)} className="whitespace-nowrap text-xs font-bold text-teal hover:underline">
              + Add
            </button>
          }
        >
          <p className="text-xs leading-relaxed text-muted">Jot down what you want to ask so nothing gets forgotten. They'll sit at the top of your summary.</p>
          <button
            type="button"
            onClick={() => setComingSoon(COMING_SOON.questions)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-teal/40 py-2.5 text-xs font-bold text-teal transition hover:bg-mist"
          >
            + Add a question
          </button>
        </PrepSection>

        <PrepSection icon={ListChecks} title="Summary format">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-2">
            {FORMATS.map((format) => {
              const active = !format.feature;
              return (
                <button
                  key={format.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => format.feature && setComingSoon(format.feature)}
                  className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-center transition ${
                    active ? "border-2 border-teal bg-mist" : "border border-line bg-white hover:bg-well"
                  }`}
                >
                  <span className={`text-xs font-bold ${active ? "text-leaf" : "text-ink"}`}>{format.title}</span>
                  <span className={`text-[10px] ${active ? "text-teal" : "text-faint"}`}>{format.feature ? "Soon" : format.detail}</span>
                </button>
              );
            })}
          </div>
        </PrepSection>
      </div>

      {selected.length > 0 && (
        <div className="sticky bottom-[5.5rem] z-30 lg:bottom-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-leaf p-3 pl-4 text-white shadow-float">
            <span className="min-w-0">
              <span className="block text-sm font-extrabold">
                {selected.length} {selected.length === 1 ? "entry" : "entries"} ready
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-white/75">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                <span>Includes {bundle}</span>
              </span>
            </span>
            <button
              type="button"
              onClick={() => setActiveView("doctor-summary")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/25 active:scale-95"
            >
              View summary <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      <ComingSoonModal feature={comingSoon} onClose={closeComingSoon} />
    </div>
  );
}

function PrepCard({ record, selected, onToggle }: { record: HealthRecord; selected: boolean; onToggle: () => void }) {
  const level = levelChip(record);
  const note = record.notes.trim() || record.treatment.trim();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`stagger-in flex w-full items-start gap-3 rounded-3xl p-4 text-left shadow-card transition ${
        selected ? "border-2 border-teal bg-mist/70" : "border-2 border-transparent bg-white ring-1 ring-line hover:ring-teal/40"
      }`}
    >
      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg transition ${selected ? "bg-teal text-white" : "border-2 border-fieldLine bg-white"}`}>
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <span className="min-w-0 flex-1 basis-40 text-sm font-bold leading-snug text-ink">{record.title}</span>
          <Chip className={level.className}>{level.label}</Chip>
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-faint">{formatDate(record.eventDate)}</span>
        {note && <span className="mt-2 block text-xs leading-relaxed text-muted">{note}</span>}
        <span className="mt-2.5 flex flex-wrap items-center gap-1">
          <Chip dot className={typeStyles[record.type]}>{typeLabels[record.type]}</Chip>
          <Chip className="border-line bg-white text-muted">{SOURCE_LABELS[record.source]}</Chip>
        </span>
      </span>
    </button>
  );
}

function PrepSection({ icon: Icon, title, aside, children }: { icon: LucideIcon; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="surface-card stagger-in space-y-3 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mist text-teal">
            <Icon size={15} />
          </span>
          <h2 className="text-sm font-bold text-ink">{title}</h2>
        </span>
        {aside}
      </div>
      {children}
    </section>
  );
}
