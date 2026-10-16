import { ChevronDown, FlaskConical } from "lucide-react";
import { useState } from "react";
import { typeLabels } from "../../constants/records";
import type { HealthRecord } from "../../types";

export function ClinicalPanel({ records }: { records: HealthRecord[] }) {
  const [open, setOpen] = useState(false);
  const recentRecords = records.filter((record) => Date.now() - new Date(record.eventDate).getTime() <= 48 * 60 * 60 * 1000);
  const latest = recentRecords[0];

  return (
    <section className="surface-card rounded-3xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-teal/20 bg-mist text-leaf shadow-sm">
          <FlaskConical size={20} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-tealDark">Your history</span>
          <h3 className="text-base font-extrabold leading-tight tracking-tight text-ink">48-hour context</h3>
          <p className="mt-0.5 truncate text-xs font-semibold text-muted">
            {latest ? (
              <>
                {typeLabels[latest.type]}: <span className="font-normal text-faint">{latest.title}</span>
              </>
            ) : (
              <span className="font-normal text-faint">No events in the last 48 hours</span>
            )}
          </p>
        </div>
        {recentRecords.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Hide 48-hour details" : "Show 48-hour details"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-well text-muted transition hover:text-leaf"
          >
            <ChevronDown size={16} strokeWidth={2.4} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {open && (
        <ul className="mt-3 space-y-2 border-t border-line pt-3">
          {recentRecords.map((record) => (
            <li key={record.id} className="flex items-baseline justify-between gap-3 text-xs">
              <span className="min-w-0 truncate">
                <span className="font-semibold text-ink">{typeLabels[record.type]}:</span> <span className="text-muted">{record.title}</span>
              </span>
              <span className="shrink-0 text-[10px] font-medium text-faint">
                {new Intl.DateTimeFormat("en", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(record.eventDate))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
