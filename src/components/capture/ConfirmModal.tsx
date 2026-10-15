import gsap from "gsap";
import { AlertTriangle, ArrowRight, Info, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { AiSafetyMetadata, ExtractedRecord } from "../../types";
import { EditField } from "../ui/FormFields";

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
      gsap.fromTo(".modal-panel", { autoAlpha: 0, x: 42 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" });
    }, modalRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={modalRef} className="fixed inset-0 z-50">
      <div className="modal-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel absolute bottom-0 right-0 top-auto max-h-[92vh] w-full overscroll-contain overflow-y-auto overflow-x-hidden rounded-t-lg border border-line bg-paper p-5 shadow-2xl sm:bottom-4 sm:right-4 sm:top-4 sm:max-w-2xl sm:rounded-lg sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Confirmation gate</p>
            <h2 className="mt-2 font-serif text-4xl">Review before saving</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded border border-line bg-paper2">
            <X size={18} />
          </button>
        </div>
        {safety?.urgent && (
          <div role="alert" className="mt-4 flex items-start gap-3 rounded-lg border border-rust/30 bg-rust/5 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rust" />
            <p className="text-sm font-semibold leading-6 text-rust">{safety.advisory}</p>
          </div>
        )}
        {educationalContext.length > 0 && (
          <div className="mt-4 rounded-lg border border-teal/25 bg-teal/5 p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="mt-0.5 shrink-0 text-tealDark" />
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-tealDark">
                  General education, not a diagnosis
                </p>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted">
                  {educationalContext.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs leading-5 text-faint">
                  This is general information, not advice about your specific case. Butta Health does not
                  diagnose conditions or recommend treatment — talk to a clinician for medical guidance.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="surface-card min-w-0 rounded-lg p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">What you said</p>
            <p className="mt-3 text-base leading-7 text-muted">{original}</p>
          </div>
          <div className="surface-card min-w-0 rounded-lg p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Extracted medical record</p>
            <div className="mt-3 space-y-3">
              <EditField
                label="Title"
                value={extracted.title}
                onChange={(value) => setExtracted({ ...extracted, title: value })}
              />
              <EditField
                label="Treatment"
                value={extracted.treatment}
                onChange={(value) => setExtracted({ ...extracted, treatment: value })}
              />
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Severity</span>
                <select
                  value={extracted.severity}
                  onChange={(event) => setExtracted({ ...extracted, severity: event.target.value as ExtractedRecord["severity"] })}
                  className="mt-1 h-10 w-full rounded border border-line bg-paper px-3 text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                >
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Not specified</option>
                </select>
              </label>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Symptoms</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {extracted.symptoms.map((item) => (
                    <span key={item} className="badge border border-line bg-well text-muted" title={item}>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded border border-line bg-paper2 px-5 py-3 font-semibold text-ink">
            Keep editing
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded bg-teal px-5 py-3 font-semibold text-paper transition hover:bg-tealDark disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? "Saving record" : "Confirm and save record"}
            <ArrowRight size={18} />
          </button>
        </div>
        {error && <p role="alert" className="mt-3 text-right text-sm font-semibold text-rust">{error}</p>}
      </div>
    </div>
  );
}
