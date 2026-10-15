import { Plus } from "lucide-react";
import { navItems } from "../../data";
import type { ViewId } from "../../types";

const mobileNavLabels: Partial<Record<ViewId, string>> = { dashboard: "Home", timeline: "History", profile: "Profile", settings: "Settings" };

const mobileNavLeft: ViewId[] = ["dashboard", "timeline"];

const mobileNavRight: ViewId[] = ["profile", "settings"];

export function MobileNav({ activeView, onChange }: { activeView: ViewId; onChange: (view: ViewId) => void }) {
  const renderItem = (id: ViewId) => {
    const item = navItems.find((entry) => entry.id === id);
    if (!item) return null;
    const Icon = item.icon;
    const active = activeView === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-[64px] flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition ${active ? "text-teal" : "text-muted"}`}
      >
        <Icon size={21} strokeWidth={active ? 2.4 : 2} />
        <span className="max-w-full truncate">{mobileNavLabels[id] ?? item.label}</span>
      </button>
    );
  };

  return (
    <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 items-center">
        {mobileNavLeft.map(renderItem)}
        <div className="grid place-items-center">
          <button
            type="button"
            onClick={() => onChange("capture")}
            aria-label="Log a health event"
            aria-current={activeView === "capture" ? "page" : undefined}
            className={`-mt-8 grid h-14 w-14 place-items-center rounded-full text-white shadow-lift ring-4 ring-white transition active:scale-95 ${activeView === "capture" ? "bg-tealDark" : "bg-teal hover:bg-tealDark"}`}
          >
            <Plus size={26} strokeWidth={2.6} />
          </button>
        </div>
        {mobileNavRight.map(renderItem)}
      </div>
    </nav>
  );
}
