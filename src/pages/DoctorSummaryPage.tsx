import { Download, Printer } from "lucide-react";
import { TypeBadge } from "../components/ui/RecordBadges";
import type { DoctorSummary, HealthRecord } from "../types";
import { formatDate } from "../utils/format";

export function DoctorSummaryPage({
  summary,
  selectedRecords,
}: {
  summary: DoctorSummary | null;
  selectedRecords: HealthRecord[];
}) {
  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in rounded-lg p-5 print:border-0 print:bg-white print:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Doctor-facing export</p>
            <h2 className="mt-2 font-serif text-4xl">Clinical snapshot</h2>
            <p className="mt-2 max-w-3xl text-muted">
              A concise, printable report organized for a physician workflow.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded border border-line bg-paper px-4 py-2 font-semibold">
              <Printer size={17} />
              Print
            </button>
            <button className="inline-flex items-center gap-2 rounded bg-teal px-4 py-2 font-semibold text-paper">
              <Download size={17} />
              Export
            </button>
          </div>
        </div>
      </section>

      <section className="surface-card stagger-in overflow-hidden rounded-lg p-5 print:shadow-none">
        <div className="border-b border-line pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Butta Health clinical summary</p>
          <h3 className="mt-2 font-serif text-3xl">{summary?.chiefComplaint || "Preparing summary"}</h3>
          <p className="mt-2 text-sm text-muted">
            Generated {summary ? formatDate(summary.generatedAt, "long") : "after records load"} from {summary?.selectedCount || selectedRecords.length} selected records.
          </p>
        </div>
        <div className="grid gap-5 py-5 md:grid-cols-2">
          <ReportBlock title="Chief complaint" value={summary?.chiefComplaint || "No chief complaint available"} />
          <ReportBlock title="Reported frequency" value={summary?.frequency || "No frequency calculated"} />
          <ReportBlock title="Active profile" value="Adult patient profile, medications and allergies not verified in prototype." />
          <ReportBlock title="Clinical boundary" value="Patient-generated record. Non-diagnostic system output. Confirm details during visit." />
        </div>
        <div className="border-t border-line pt-5">
          <h4 className="font-serif text-2xl">Selected timeline</h4>
          <div className="mt-3 divide-y divide-line">
            {(summary?.records || selectedRecords).map((record) => (
              <div key={record.id} className="grid min-w-0 gap-2 py-3 md:grid-cols-[148px_minmax(0,1fr)_140px]">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{formatDate(record.eventDate)}</p>
                <div>
                  <p className="font-semibold text-ink">{record.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{record.notes}</p>
                </div>
                <div className="min-w-0 md:justify-self-end"><TypeBadge type={record.type} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ReportBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}
