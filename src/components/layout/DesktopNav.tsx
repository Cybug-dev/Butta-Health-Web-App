import { navItems } from "../../data";
import type { ViewId } from "../../types";

export function DesktopNav({ activeView, onChange }: { activeView: ViewId; onChange: (view: ViewId) => void }) {
  return (
    <nav className="mt-8 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
              active ? "bg-well text-teal shadow-[inset_3px_0_0_#2F7D69]" : "text-muted hover:bg-well/70 hover:text-ink"
            }`}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
