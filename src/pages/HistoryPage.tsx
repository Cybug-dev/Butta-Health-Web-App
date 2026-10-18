import { ArrowDownUp, FileCheck2, Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { TimelineCard } from "../components/history/TimelineCard";
import { HeaderBand } from "../components/layout/HeaderBand";
import { filters, typeLabels } from "../constants/records";
import type { HealthRecord, RecordType, ViewId } from "../types";

export function HistoryPage({
  records,
  rawCount,
  metrics,
  search,
  setSearch,
  filter,
  setFilter,
  watchOnly,
  setWatchOnly,
  setActiveView,
}: {
  records: HealthRecord[];
  rawCount: number;
  metrics: { monitoring: number; symptoms: number; records: number };
  search: string;
  setSearch: (value: string) => void;
  filter: RecordType | "ALL";
  setFilter: (value: RecordType | "ALL") => void;
  watchOnly: boolean;
  setWatchOnly: (value: boolean) => void;
  setActiveView: (view: ViewId) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(filter !== "ALL");
  const [newestFirst, setNewestFirst] = useState(true);

  const sorted = useMemo(
    () =>
      [...records].sort((a, b) => {
        const diff = new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        return newestFirst ? diff : -diff;
      }),
    [records, newestFirst],
  );

  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-gradient-to-br from-teal/10 to-transparent blur-2xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal">
              <span className="h-2 w-2 rounded-full bg-teal" /> Longitudinal health record
            </p>
            <h1 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">Clinical timeline</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              Search and filter everything you've logged, and open any entry for the details a doctor would want.
            </p>
          </div>
          <div className="relative w-full min-w-0 lg:max-w-md">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field-input h-12 w-full pl-10 pr-10 text-sm"
              placeholder="Search records, symptoms, notes..."
              aria-label="Search records"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-faint transition hover:text-ink">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
              filtersOpen || filter !== "ALL" ? "border-teal/40 bg-mist text-leaf" : "border-line bg-well text-leaf hover:bg-mist"
            }`}
          >
            <Filter size={15} /> Filter entries
            {filter !== "ALL" && <span className="rounded-full bg-teal px-1.5 text-[10px] text-white">1</span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveView("doctor-prep")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-3.5 py-2 text-xs font-bold text-white shadow-lift transition hover:bg-tealDark active:scale-95"
          >
            <FileCheck2 size={15} /> Doctor visit prep
          </button>
        </div>

        {watchOnly && (
          <div className="relative mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 py-1 pl-3 pr-1 text-xs font-bold text-amber-700">
              Needs attention only
              <button type="button" onClick={() => setWatchOnly(false)} aria-label="Show all entries" className="grid h-5 w-5 place-items-center rounded-full transition hover:bg-amber-100">
                <X size={12} />
              </button>
            </span>
          </div>
        )}

        {filtersOpen && (
          <div className="scroll-row relative -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:flex-wrap sm:overflow-visible sm:px-6">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
                className={`min-h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition ${
                  filter === item ? "border-teal bg-teal text-white" : "border-line bg-white text-muted hover:border-teal/40 hover:text-ink"
                }`}
              >
                {item === "ALL" ? "All" : typeLabels[item]}
              </button>
            ))}
          </div>
        )}
      </section>

      <HeaderBand metrics={metrics} className="mb-0" />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-1">
          <h2 className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-leaf">
            Logged events ({records.length !== rawCount ? `${records.length} of ${rawCount}` : records.length})
          </h2>
          <button type="button" onClick={() => setNewestFirst((value) => !value)} className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-teal hover:underline">
            <ArrowDownUp size={13} /> {newestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {sorted.length ? (
          <div className="grid items-start gap-3 xl:grid-cols-2">
            {sorted.map((record) => (
              <TimelineCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-2xl p-8 text-center text-sm text-muted">
            {rawCount ? `No matching records found in ${rawCount} entries.` : "Nothing logged yet. Your events will show up here."}
          </div>
        )}
      </section>
    </div>
  );
}
