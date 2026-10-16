import { Clock, Home, Plus, Settings, UserRound } from "lucide-react";
import type { ViewId } from "../../types";

type MobileTab = { id: ViewId; label: string; icon: typeof Home };

const mobileNavLeft: MobileTab[] = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "timeline", label: "History", icon: Clock },
];

const mobileNavRight: MobileTab[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "settings", label: "Settings", icon: Settings },
];

export function MobileNav({ activeView, onChange }: { activeView: ViewId; onChange: (view: ViewId) => void }) {
  const renderItem = ({ id, label, icon: Icon }: MobileTab) => {
    const active = activeView === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center justify-center gap-1 transition ${active ? "text-leaf" : "text-faint hover:text-muted"}`}
      >
        <Icon size={20} strokeWidth={active ? 2.2 : 2} />
        <span className={`text-[11px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
      </button>
    );
  };

  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 border-t border-line/70 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur-md lg:hidden">
      <div className="relative flex h-[68px] items-center justify-around px-3">
        {mobileNavLeft.map(renderItem)}
        <div className="relative -top-5 flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => onChange("capture")}
            aria-label="Log a health event"
            aria-current={activeView === "capture" ? "page" : undefined}
            className="grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-[#2D5B46] text-white shadow-[0_8px_20px_-2px_rgba(45,91,70,0.35)] transition-transform active:scale-90"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
        {mobileNavRight.map(renderItem)}
      </div>
    </nav>
  );
}
