import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SPRING_EASE } from "../../constants/motion";
import type { Attachment } from "../../types";

export type LocalAttachment = Attachment & { previewUrl: string; file: File };

export function ThumbRemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <span
      role="button"
      tabIndex={0}
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onClick();
        }
      }}
      className="absolute right-1 top-1 z-10 grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-black/60 text-white opacity-0 shadow-sm transition-all duration-150 group-hover:opacity-100 hover:bg-black/80"
      aria-label={label}
    >
      <X size={11} />
    </span>
  );
}

export function AttachmentThumb({
  attachment,
  onRemove,
  onOpen,
  registerRef,
}: {
  attachment: LocalAttachment;
  onRemove: () => void;
  onOpen: (rect: DOMRect) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      ref={(el) => {
        btnRef.current = el;
        registerRef(el);
      }}
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        if (btnRef.current) onOpen(btnRef.current.getBoundingClientRect());
      }}
      className="group relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/30 bg-white/10 outline-none transition-transform duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.05] active:scale-95"
      aria-label={`Open preview of ${attachment.originalName}`}
    >
      <img src={attachment.previewUrl} alt={attachment.originalName} className="size-full object-cover" draggable={false} />
      <ThumbRemoveButton onClick={onRemove} label={`Remove ${attachment.originalName}`} />
    </button>
  );
}

export function AttachmentGalleryModal({
  attachment,
  originRect,
  onClose,
}: {
  attachment: LocalAttachment;
  originRect: DOMRect;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const width = Math.min(window.innerWidth * 0.7, 900);
    const height = Math.min(window.innerHeight * 0.7, 720);
    setTargetRect({
      top: (window.innerHeight - height) / 2,
      left: (window.innerWidth - width) / 2,
      width,
      height,
    });
    const raf = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setPhase("closing");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isOpen = phase === "open";
  const geometry = isOpen && targetRect
    ? { ...targetRect, radius: 20 }
    : { top: originRect.top, left: originRect.left, width: originRect.width, height: originRect.height, radius: 12 };
  const duration = phase === "closing" ? "0.28s" : "0.42s";
  const easing = phase === "closing" ? "ease-out" : SPRING_EASE;
  const transition = `top ${duration} ${easing}, left ${duration} ${easing}, width ${duration} ${easing}, height ${duration} ${easing}, border-radius ${duration} ${easing}`;

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setPhase("closing")} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" style={{ opacity: isOpen ? 1 : 0 }} />
      <div
        style={{
          position: "fixed",
          top: geometry.top,
          left: geometry.left,
          width: geometry.width,
          height: geometry.height,
          borderRadius: geometry.radius,
          transition,
          overflow: "hidden",
          boxShadow: isOpen ? "0 24px 60px -12px rgb(0 0 0 / 0.45)" : "0 0 0 0 rgb(0 0 0 / 0)",
        }}
        className="bg-ink"
        onTransitionEnd={() => {
          if (phase === "closing") onClose();
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={attachment.previewUrl}
          alt={attachment.originalName}
          className={`size-full ${isOpen ? "object-contain" : "object-cover"}`}
          draggable={false}
        />
      </div>
      <button
        type="button"
        onClick={() => setPhase("closing")}
        style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? "scale(1)" : "scale(0.7)" }}
        className={`fixed right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-white ${!isOpen ? "pointer-events-none" : ""}`}
        aria-label="Close preview"
      >
        <X size={18} />
      </button>
    </div>
  );
}
