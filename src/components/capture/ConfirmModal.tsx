import gsap from "gsap";
import { AlertTriangle, ArrowRight, Info, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { AiSafetyMetadata, ExtractedRecord } from "../../types";
import { DraftBadge, EntityTile, ExtractionHeader, FieldGrid, SeverityMeter } from "./ExtractionPreview";

const SEVERITIES: ExtractedRecord["severity"][] = ["Mild", "Moderate", "Severe", "Not specified"];

export function ConfirmModal({
  extracted,
  setExtracted,
  original,
  safety,
  educationalContext,
  saving,
  error,
  onClose,
  onSave,
}: {
  extracted: ExtractedRecord;
  setExtracted: (record: ExtractedRecord) => void;
  original: string;
  safety: AiSafetyMetadata | null;
  educationalContext: string[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!modalRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(".modal-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, clearProps: "opacity,visibility,willChange" });
      gsap.fromTo(".modal-panel", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" });
    }, modalRef);
    return () => context.revert();
  }, []);

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Review before saving">
      <div className="modal-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel relative max-h-[92vh] w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-t-3xl border border-line bg-white p-5 shadow-2xl sm:max-h-[88vh] sm:max-w-xl sm:rounded-3xl sm:p-6">
        <ExtractionHeader
          title="Review before saving"
          aside={
            <span className="flex items-center gap-2">
              <DraftBadge />
              <button type="button" onClick={onClose} aria-label="Close review" className="grid h-8 w-8 place-items-center rounded-full bg-well text-muted transition hover:text-ink">
                <X size={16} />
              </button>
            </span>
          }
        />

        {safety?.urgent && (
          <div role="alert" className="mb-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-500" />
            <p className="text-xs font-semibold leading-relaxed text-rose-700">{safety.advisory}</p>
          </div>
        )}

        {educationalContext.length > 0 && (
          <div className="mb-3 rounded-2xl border border-teal/20 bg-teal/5 p-3.5">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-tealDark" />
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-tealDark">General education, not a diagnosis</p>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-muted">
                  {educationalContext.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] leading-relaxed text-faint">
                  This is general information, not advice about your specific case. Butta Health does not diagnose conditions or recommend treatment — talk to a clinician for medical guidance.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <EntityTile label="What you said">
            <p className="text-xs leading-relaxed text-muted sm:text-sm">{original}</p>
          </EntityTile>

          <EntityTile label="Title">
            <input
              value={extracted.title}
              onChange={(event) => setExtracted({ ...extracted, title: event.target.value })}
              aria-label="Title"
              className="field-input mt-1 h-10 w-full px-3 text-sm font-bold"
            />
          </EntityTile>

          <EntityTile label="Severity" aside={<SeverityMeter severity={extracted.severity} />}>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Severity">
              {SEVERITIES.map((level) => {
                const active = extracted.severity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setExtracted({ ...extracted, severity: level })}
                    className={`rounded-xl border px-2.5 py-1 text-xs font-semibold transition ${
                      active ? "border-leaf bg-leaf text-white shadow-sm" : "border-line bg-white text-muted hover:border-teal/40 hover:text-ink"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </EntityTile>

          <EntityTile label="Treatment">
            <input
              value={extracted.treatment}
              onChange={(event) => setExtracted({ ...extracted, treatment: event.target.value })}
              aria-label="Treatment"
              placeholder="Anything you took or did to help"
              className="field-input mt-1 h-10 w-full px-3 text-sm"
            />
          </EntityTile>

          <div className="rounded-2xl border border-teal/10 bg-field p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-faint">Fields extracted</span>
              <span className="text-xs font-bold text-ink">{extracted.symptoms.length} extracted</span>
            </div>
            <FieldGrid items={extracted.symptoms} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-bold text-muted transition hover:text-ink">
            Keep editing
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-leaf/20 transition-all enabled:hover:bg-tealDark enabled:active:scale-95 disabled:cursor-wait disabled:opacity-70 sm:text-sm"
          >
            {saving ? "Saving..." : "Confirm & save"}
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
        {error && <p role="alert" className="mt-3 text-right text-xs font-semibold text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
