import { AlertTriangle, ArrowDownUp, Download, NotebookPen, Printer, Share2 } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { HeaderBand } from "../components/layout/HeaderBand";
import { Chip } from "../components/ui/Chip";
import { ComingSoonModal, type ComingSoonFeature } from "../components/ui/ComingSoonModal";
import { statusStyles, typeLabels, typeStyles } from "../constants/records";
import type { HealthProfile } from "../services/api";
import type { DoctorSummary, HealthRecord } from "../types";
import { formatDate } from "../utils/format";

const SOURCE_LABELS: Record<HealthRecord["source"], string> = { Typed: "Typed entry", Voice: "Voice note", Preset: "Quick log" };

const COMING_SOON = {
  export: { title: "Export summary", description: "Download this summary as a file you can email or upload to a clinic portal. For now, use Print and choose “Save as PDF”.", icon: Download },
  share: { title: "Share with your care team", description: "Send your doctor a private link to this summary instead of printing it.", icon: Share2 },
} satisfies Record<string, ComingSoonFeature>;

export function DoctorSummaryPage({
  summary,
  selectedRecords,
  profile,
  metrics,
}: {
  summary: DoctorSummary | null;
  selectedRecords: HealthRecord[];
  profile: HealthProfile | null;
  metrics: { monitoring: number; symptoms: number; records: number };
}) {
  const [comingSoon, setComingSoon] = useState<ComingSoonFeature | null>(null);
  const closeComingSoon = useCallback(() => setComingSoon(null), []);
  const [visitNotes, setVisitNotes] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

  const records = [...(summary?.records || selectedRecords)].sort((a, b) => {
    const diff = new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    return newestFirst ? diff : -diff;
  });
  const count = summary?.selectedCount || selectedRecords.length;
  const profileFacts = [
    profile?.bloodGroup && `Blood group: ${profile.bloodGroup}`,
    `Allergies: ${profile?.allergies.length ? profile.allergies.join(", ") : "None noted"}`,
    profile?.existingConditions.length ? `Conditions: ${profile.existingConditions.join(", ")}` : null,
    profile?.currentMedications.length ? `Medications: ${profile.currentMedications.join(", ")}` : null,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in relative overflow-hidden rounded-3xl p-5 sm:p-6 print:border-0 print:shadow-none">
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-mist opacity-60 blur-2xl" />
        <div className="relative space-y-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-well px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> For your doctor
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Clinical snapshot</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">A short, printable summary of the entries you picked, laid out the way doctors like to read them.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-w-[8rem] flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-well active:scale-[0.98] sm:flex-none"
            >
              <Printer size={16} /> Print
            </button>
            <button
              type="button"
              onClick={() => setComingSoon(COMING_SOON.export)}
              className="inline-flex min-w-[8rem] flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-tealDark active:scale-[0.98] sm:flex-none"
            >
              <Download size={16} /> Export
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-teal/15 bg-mist/60 p-2.5 text-xs text-leaf print:hidden">
            <span className="flex items-center gap-1.5 font-medium">
              <Share2 size={14} /> Share with your care team
            </span>
            <button type="button" onClick={() => setComingSoon(COMING_SOON.share)} className="text-[11px] font-bold underline hover:text-tealDark">
              Copy link
            </button>
          </div>
        </div>
      </section>

      <div className="print:hidden">
        <HeaderBand metrics={metrics} className="mb-0" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="surface-card stagger-in space-y-4 rounded-3xl p-5 sm:p-6 print:shadow-none">
          <div className="border-b border-line pb-3.5">
            <span className="rounded bg-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">Main concern</span>
            <h2 className="mt-1.5 text-xl font-extrabold leading-snug text-ink">{summary?.chiefComplaint || "Preparing summary"}</h2>
            <p className="mt-1 text-xs text-muted">
              Generated {summary ? formatDate(summary.generatedAt, "long") : "once your entries load"} from{" "}
              <strong className="text-ink">
                {count} selected {count === 1 ? "record" : "records"}
              </strong>
              .
            </p>
          </div>

          <div className="space-y-3.5 text-sm">
            <Field title="Chief complaint">
              <p className="font-semibold text-ink">{summary?.chiefComplaint || "No chief complaint available"}</p>
            </Field>
            <div className="h-px bg-line" />
            <Field title="Reported frequency">
              <p className="text-muted">{summary?.frequency || "No frequency calculated"}</p>
            </Field>
            <div className="h-px bg-line" />
            <Field title="Health profile">
              <p className="text-xs leading-relaxed text-muted">From the patient's own profile. Not verified by a clinician.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profileFacts.map((fact) => (
                  <span key={fact} className="rounded bg-well px-2 py-0.5 text-[10px] font-medium text-ink">
                    {fact}
                  </span>
                ))}
              </div>
            </Field>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <h3 className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                <AlertTriangle size={12} /> Please note
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-amber-700">Written by the patient, not a diagnosis. Please confirm the details during the visit.</p>
            </div>
          </div>
        </section>

        <section className="surface-card stagger-in space-y-4 rounded-3xl p-5 sm:p-6 print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-ink">Selected timeline</h2>
              <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-bold text-leaf">{records.length}</span>
            </div>
            <button type="button" onClick={() => setNewestFirst((value) => !value)} className="inline-flex items-center gap-1 text-xs font-medium text-muted transition hover:text-ink print:hidden">
              <ArrowDownUp size={13} /> {newestFirst ? "Newest first" : "Oldest first"}
            </button>
          </div>

          {records.length ? (
            <div className="divide-y divide-line">
              {records.map((record, index) => (
                <article key={record.id} className="py-4 first:pt-0 last:pb-0">
                  <div className={`space-y-2 border-l-2 pl-4 ${index === 0 ? "border-teal" : "border-fieldLine"}`}>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{formatDate(record.eventDate)}</p>
                    <h3 className="text-base font-bold leading-snug text-ink">{record.title}</h3>
                    {record.notes.trim() && (
                      <p className={`rounded-xl border border-line bg-field p-3 text-xs leading-relaxed text-muted ${record.source === "Voice" ? "italic" : ""}`}>
                        {record.source === "Voice" ? `“${record.notes.trim()}”` : record.notes.trim()}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <Chip dot className={typeStyles[record.type]}>{typeLabels[record.type]}</Chip>
                      {record.status === "Needs monitoring" && <Chip className={statusStyles[record.status]}>Needs attention</Chip>}
                      <span className="text-[10px] text-faint">{SOURCE_LABELS[record.source]}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No entries selected yet. Go back to Doctor visit prep and pick a few.</p>
          )}
        </section>
      </div>

      <section className="stagger-in space-y-3 rounded-3xl border border-dashed border-teal/30 bg-mist/30 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-leaf">
            <NotebookPen size={15} /> Visit notes
          </h2>
          <span className="text-[10px] italic text-faint">Optional</span>
        </div>
        <textarea
          value={visitNotes}
          onChange={(event) => setVisitNotes(event.target.value)}
          rows={3}
          placeholder="Write anything else you want your doctor to know. It's included when you print."
          aria-label="Visit notes"
          className="field-input w-full resize-y p-3 text-xs"
        />
        <p className="text-[10px] text-muted print:hidden">These notes aren't saved. They stay on this page until you leave it.</p>
      </section>

      <ComingSoonModal feature={comingSoon} onClose={closeComingSoon} />
    </div>
  );
}

function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-faint">{title}</h3>
      <div className="mt-1">{children}</div>
    </div>
  );
}
