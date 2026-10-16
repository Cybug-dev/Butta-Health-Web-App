import { Bell, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NotificationBell({ onProfile }: { onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-xl p-2 text-muted transition-colors hover:bg-well hover:text-ink sm:p-2.5"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white sm:right-2 sm:top-2" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-float">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-extrabold">Notifications</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
            className="flex w-full gap-3 px-4 py-4 text-left transition hover:bg-well"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
              <UserRound size={17} />
            </span>
            <span>
              <span className="block text-sm font-bold">Review your health profile</span>
              <span className="mt-1 block text-xs leading-5 text-muted">Keep medications and emergency details current.</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
