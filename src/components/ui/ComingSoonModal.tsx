import { Hourglass, Sparkles, type LucideIcon } from "lucide-react";
import { ModalClose, ModalShell } from "./ModalShell";

export type ComingSoonFeature = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

/** Shared placeholder for features that are designed but not wired up yet. */
export function ComingSoonModal({ feature, onClose }: { feature: ComingSoonFeature | null; onClose: () => void }) {
  if (!feature) return null;
  const Icon = feature.icon ?? Sparkles;

  return (
    <ModalShell label={`${feature.title} coming soon`} onClose={onClose}>
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-teal/20 bg-mist text-leaf shadow-sm">
          <Icon size={22} />
        </span>
        <ModalClose onClose={onClose} />
      </div>

      <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
        <Hourglass size={12} /> Coming soon
      </span>
      <h2 className="relative mt-2 text-xl font-extrabold text-ink">{feature.title}</h2>
      <p className="relative mt-1.5 text-sm leading-relaxed text-muted">{feature.description}</p>

      <div className="relative mt-4 rounded-2xl border border-teal/10 bg-field p-3.5 text-xs leading-relaxed text-muted">
        We're still building this. Everything else on this screen works and saves as normal.
      </div>

      <div className="relative mt-4 flex justify-end border-t border-line pt-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-leaf px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-leaf/20 transition-all hover:bg-tealDark active:scale-95 sm:text-sm"
        >
          Got it
        </button>
      </div>
    </ModalShell>
  );
}
