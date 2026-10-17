import gsap from "gsap";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";

/** Bottom sheet on mobile, centered card on sm+ — same motion as the review modal. */
export function ModalShell({ label, onClose, className = "sm:max-w-md", children }: { label: string; onClose: () => void; className?: string; children: ReactNode }) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!modalRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(".modal-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, clearProps: "opacity,visibility,willChange" });
      gsap.fromTo(".modal-panel", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" });
    }, modalRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div className="modal-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className={`modal-panel relative max-h-[92vh] w-full overflow-y-auto overflow-x-hidden overscroll-contain rounded-t-3xl border border-line bg-white p-5 shadow-2xl sm:max-h-[88vh] sm:rounded-3xl sm:p-6 ${className}`}>
        <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full bg-glow/25 blur-2xl" />
        {children}
      </div>
    </div>
  );
}

export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-well text-muted transition hover:text-ink">
      <X size={16} />
    </button>
  );
}
