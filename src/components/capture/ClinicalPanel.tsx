import { FlaskConical } from "lucide-react";
import { typeLabels } from "../../constants/records";
import type { HealthRecord } from "../../types";

export function ClinicalPanel({ records }: { records: HealthRecord[] }) {
  const recentRecords = records.filter(
    (record) => Date.now() - new Date(record.eventDate).getTime() <= 48 * 60 * 60 * 1000,
  );

  return (
    <div className="surface-card rounded-lg p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded bg-paper text-teal ring-1 ring-line">
          <FlaskConical size={22} />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">Your history</p>
          <h3 className="font-serif text-2xl">48-hour context</h3>
        </div>
      </div>
      {recentRecords.length ? (
        <ul className="mt-4 space-y-2">
          {recentRecords.slice(0, 3).map((record) => (
            <li key={record.id} className="text-base leading-7 text-muted">
              <span className="font-semibold text-ink">{typeLabels[record.type]}:</span> {record.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-base leading-7 text-muted">
          No events recorded in the last 48 hours. New entries will appear here for context as you log them.
        </p>
      )}
    </div>
  );
}
