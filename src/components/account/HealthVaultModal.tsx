import { Clock, KeyRound, Lock, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";
import { ModalClose, ModalShell } from "../ui/ModalShell";

// Plain-language versions of the real backend protections (docs/MASTER_PROJECT_CONTEXT.md) — no claims it doesn't back up.
const PROTECTIONS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: UserCheck, title: "Only you can see it", detail: "Your profile and health notes belong to your account. Nobody else can open them." },
  { icon: Lock, title: "Locked while it travels and while it's stored", detail: "Your information is scrambled on the way to us and kept locked away when it's saved." },
  { icon: KeyRound, title: "Your password stays secret", detail: "We never keep your actual password, so not even our team can see it." },
  { icon: Clock, title: "You're signed out automatically", detail: "Your sign-in expires after a while, so your records stay safe if you forget to log out." },
  { icon: ShieldCheck, title: "Protected from break-in attempts", detail: "We block repeated wrong password guesses to keep strangers out of your account." },
];

export function HealthVaultModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell label="Your private health vault" onClose={onClose} className="sm:max-w-lg">
      <div className="relative flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-teal/20 bg-mist text-leaf shadow-sm">
            <Lock size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-teal">Privacy &amp; security</span>
            <h2 className="text-xl font-extrabold leading-tight text-ink">Your private health vault</h2>
          </span>
        </span>
        <ModalClose onClose={onClose} />
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-muted">
        Your profile and health events are personal. Here's how Butta Health keeps them that way.
      </p>

      <ul className="relative mt-4 space-y-2.5">
        {PROTECTIONS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3 rounded-2xl bg-field p-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-teal">
              <Icon size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">{title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="relative mt-4 rounded-2xl border border-teal/10 bg-well/60 px-3.5 py-3 text-[11px] leading-relaxed text-faint">
        Butta Health doesn't diagnose or give medical advice. You decide what to share with your clinician.
      </p>

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
