import { typeLabels } from "../../constants/records";
import { parseObservation } from "../../services/mockApi";

export function ExtractionPreview({ observation }: { observation: string }) {
  const preview = observation.trim() ? parseObservation(observation, "Typed") : null;
  return (
    <div className="surface-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Detected entities</h3>
        <span className="badge border border-amber/20 bg-amber/10 text-amber">
          <span className="badge-dot" />
          <span>Draft</span>
        </span>
      </div>
      {preview ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <Entity label="Type" value={typeLabels[preview.type]} />
          <Entity label="Severity" value={preview.severity} />
          <Entity label="Title" value={preview.title} />
          <Entity label="Fields" value={`${preview.symptoms.length} extracted`} />
        </div>
      ) : (
        <p className="text-sm text-muted">Enter an observation to preview extracted structure.</p>
      )}
    </div>
  );
}

export function Entity({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-well/70 px-3 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-1 truncate font-bold text-ink" title={value}>{value}</p>
    </div>
  );
}
