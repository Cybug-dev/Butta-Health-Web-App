import { FileCheck2, Search } from "lucide-react";
import { TimelineCard } from "../components/history/TimelineCard";
import { filters, typeLabels } from "../constants/records";
import type { HealthRecord, RecordType, ViewId } from "../types";

export function HistoryPage({
  records,
  rawCount,
  search,
  setSearch,
  filter,
  setFilter,
  setActiveView,
}: {
  records: HealthRecord[];
  rawCount: number;
  search: string;
  setSearch: (value: string) => void;
  filter: RecordType | "ALL";
  setFilter: (value: RecordType | "ALL") => void;
  setActiveView: (view: ViewId) => void;
}) {
  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in rounded-lg p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Longitudinal health record</p>
            <h2 className="mt-2 font-serif text-4xl">Clinical timeline</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Searchable, structured patient entries with category filtering and expandable doctor context.
            </p>
          </div>
          <div className="relative min-w-0 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded border border-line bg-well pl-10 pr-3 outline-none transition focus:border-teal focus:ring-1 focus:ring-teal"
              placeholder="Search records"
            />
          </div>
        </div>
        <button type="button" onClick={() => setActiveView("doctor-prep")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-extrabold text-teal transition hover:border-teal/40 hover:bg-well">
          <FileCheck2 size={17} />
          Prepare for a doctor visit
        </button>
        <div className="scroll-row -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-extrabold transition ${
                filter === item
                  ? "border-teal bg-teal text-paper"
                  : "border-line bg-paper text-muted hover:border-teal/40 hover:text-ink"
              }`}
            >
              {item === "ALL" ? "All" : typeLabels[item]}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        {records.map((record) => (
          <TimelineCard key={record.id} record={record} />
        ))}
        {!records.length && (
          <div className="surface-card rounded-lg p-8 text-center text-muted">
            No matching records found in {rawCount} entries.
          </div>
        )}
      </div>
    </div>
  );
}
