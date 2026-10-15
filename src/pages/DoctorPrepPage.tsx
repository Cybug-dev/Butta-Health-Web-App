import { Check } from "lucide-react";
import { TypeBadge } from "../components/ui/RecordBadges";
import type { HealthRecord, ViewId } from "../types";
import { formatDate } from "../utils/format";

export function DoctorPrepPage({
  records,
  selectedIds,
  setSelectedIds,
  setActiveView,
}: {
  records: HealthRecord[];
  selectedIds: string[];
  setSelectedIds: (value: string[]) => void;
  setActiveView: (view: ViewId) => void;
}) {
  function toggle(id: string) {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in rounded-lg p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Consultation builder</p>
        <h2 className="mt-2 font-serif text-4xl">Doctor visit prep</h2>
        <p className="mt-2 max-w-3xl text-muted">
          Select relevant entries and generate a focused clinical bundle. The mock API aggregates only the selected records.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedIds(records.slice(0, 5).map((record) => record.id))}
            className="rounded border border-line bg-paper px-4 py-2 font-semibold text-ink transition hover:border-teal/40"
          >
            Select recent five
          </button>
          <button
            onClick={() => setSelectedIds(records.filter((record) => record.type === "SYMPTOM").map((record) => record.id))}
            className="rounded border border-line bg-paper px-4 py-2 font-semibold text-ink transition hover:border-teal/40"
          >
            Select symptoms
          </button>
          <button
            onClick={() => setActiveView("doctor-summary")}
            className="rounded bg-teal px-4 py-2 font-semibold text-paper transition hover:bg-tealDark"
          >
            Generate summary
          </button>
        </div>
      </section>
      <div className="grid gap-3">
        {records.map((record) => (
          <button
            key={record.id}
            onClick={() => toggle(record.id)}
            className={`stagger-in flex min-w-0 flex-col items-start gap-3 rounded-lg border p-4 text-left shadow-[0_5px_18px_rgba(27,52,45,.04)] transition sm:flex-row sm:gap-4 ${
              selectedIds.includes(record.id)
                ? "border-teal bg-teal/10"
                : "border-line bg-paper2 hover:border-teal/40"
            }`}
          >
            <span
              className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded border ${
                selectedIds.includes(record.id) ? "border-teal bg-teal text-paper" : "border-line bg-paper"
              }`}
            >
              {selectedIds.includes(record.id) && <Check size={15} />}
            </span>
            <span className="min-w-0 max-w-full flex-1">
              <span className="block max-w-full truncate font-serif text-xl" title={record.title}>{record.title}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                {record.id} / {formatDate(record.eventDate)}
              </span>
            </span>
            <span className="max-w-full sm:ml-auto"><TypeBadge type={record.type} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
