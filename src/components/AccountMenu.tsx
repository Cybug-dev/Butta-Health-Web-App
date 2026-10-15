import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AppUser } from "../services/api";

type AccountMenuProps = {
  user: AppUser;
  onProfile: () => void;
  onSettings: () => void;
  onSignOut: () => void;
  showName?: boolean;
};

export function AccountMenu({ user, onProfile, onSettings, onSignOut, showName = false }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

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

  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: -8, scale: 0.98, transformOrigin: "top right" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" },
      );
    }, panelRef);
    return () => context.revert();
  }, [open]);

  function choose(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={`flex min-w-0 items-center gap-3 rounded-full transition ${showName ? "py-1 pl-1 pr-3 hover:bg-well" : ""}`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal text-sm font-extrabold text-white shadow-lift">
          {initials}
        </span>
        {showName && (
          <>
            <span className="block max-w-32 truncate text-sm font-extrabold">{user.firstName}</span>
            <ChevronDown size={16} className={`text-faint transition-transform duration-300 ${open ? "rotate-180 text-teal" : ""}`} />
          </>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-lg border border-line bg-white shadow-float"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-extrabold">{user.firstName} {user.lastName}</p>
            <p className="mt-0.5 truncate text-xs font-semibold text-muted">{user.demo ? "Demo profile" : user.email}</p>
          </div>
          <button type="button" role="menuitem" onClick={() => choose(onProfile)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition hover:bg-well">
            <UserRound size={17} className="text-faint" />
            Health profile
          </button>
          <button type="button" role="menuitem" onClick={() => choose(onSettings)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition hover:bg-well">
            <Settings size={17} className="text-faint" />
            Settings
          </button>
          <button type="button" role="menuitem" onClick={() => choose(onSignOut)} className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-left text-sm font-semibold text-muted transition hover:bg-well hover:text-ink">
            <LogOut size={17} className="text-faint" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
