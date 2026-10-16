import { Leaf, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { navItems } from "../../data";
import type { ViewId } from "../../types";
import { BrandBlock } from "./BrandBlock";
import { DesktopNav } from "./DesktopNav";
import { StatusStrip } from "./StatusStrip";

type SidebarProps = {
  activeView: ViewId;
  onChange: (view: ViewId) => void;
  recordCount: number;
  selectedCount: number;
  onSignOut: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const RAIL_ITEM = "[data-rail-item]";

export function Sidebar({ activeView, onChange, recordCount, selectedCount, onSignOut, collapsed, setCollapsed }: SidebarProps) {
  const [hoverBlank, setHoverBlank] = useState(false);

  function isBlank(event: MouseEvent<HTMLElement>) {
    return !(event.target as HTMLElement).closest(RAIL_ITEM);
  }

  return (
    <aside
      onMouseMove={collapsed ? (event) => setHoverBlank(isBlank(event)) : undefined}
      onMouseLeave={() => setHoverBlank(false)}
      onClick={
        collapsed
          ? (event) => {
              if (isBlank(event)) {
                setHoverBlank(false);
                setCollapsed(false);
              }
            }
          : undefined
      }
      className={`fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-line bg-white/95 backdrop-blur-md transition-[width] duration-300 ease-out lg:flex ${
        collapsed ? `w-20 ${hoverBlank ? "cursor-pointer" : ""}` : "w-64"
      }`}
    >
      {collapsed ? (
        <div className="flex h-full w-20 shrink-0 flex-col items-center">
          <div className="flex w-full flex-col items-center p-3.5">
            <button
              type="button"
              data-rail-item
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="group/logo relative mb-6 grid h-11 w-11 place-items-center rounded-2xl focus:outline-none"
            >
              <span
                className={`absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-teal to-leaf text-white shadow-md shadow-leaf/20 transition-opacity duration-200 group-hover/logo:opacity-0 group-focus-visible/logo:opacity-0 ${
                  hoverBlank ? "opacity-0" : "opacity-100"
                }`}
              >
                <Leaf size={20} fill="currentColor" strokeWidth={1.5} />
              </span>
              <span
                className={`absolute inset-0 grid place-items-center rounded-2xl border border-line bg-well text-teal transition-opacity duration-200 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 ${
                  hoverBlank ? "opacity-100" : "opacity-0"
                }`}
              >
                <PanelLeftOpen size={19} />
              </span>
            </button>

            <nav className="w-full space-y-2" aria-label="Primary">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-rail-item
                    onClick={() => onChange(item.id)}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl transition-all duration-200 ${
                      active ? "border border-teal/20 bg-teal/10 shadow-sm" : "text-muted hover:bg-teal/5 hover:text-teal"
                    }`}
                  >
                    {active ? (
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-tealDark text-white shadow-sm shadow-tealDark/20">
                        <Icon size={16} strokeWidth={2.2} />
                      </span>
                    ) : (
                      <Icon size={20} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto flex w-full flex-col items-center gap-3 border-t border-line p-3">
            <span
              data-rail-item
              title="Small steps. A healthier you."
              className="grid h-10 w-10 place-items-center rounded-2xl border border-teal/20 bg-gradient-to-br from-mist to-teal/10 text-tealDark shadow-sm"
            >
              <Leaf size={16} fill="currentColor" strokeWidth={1.5} />
            </span>
            <button
              type="button"
              data-rail-item
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="grid h-10 w-10 place-items-center rounded-xl text-faint transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-64 shrink-0 animate-fade-in flex-col overflow-y-auto px-5 py-5">
          <div className="flex items-start justify-between gap-2">
            <BrandBlock />
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="-mr-1 rounded-xl p-2 text-faint transition-colors hover:bg-well hover:text-ink"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
          <DesktopNav activeView={activeView} onChange={onChange} />
          <div className="mt-auto pt-6">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-teal/10 bg-well">
              <img src="/assets/butta-sidebar-botanical.png" alt="Watercolor eucalyptus and sage leaves" className="absolute inset-0 h-full w-full object-cover object-bottom" />
              <div className="absolute inset-x-0 bottom-0 bg-teal px-3 py-2.5 text-center">
                <p className="text-xs font-extrabold leading-5 text-white">Small steps. A healthier you.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4 border-t border-line pt-4">
              <StatusStrip label="Records synced" value={`${recordCount} entries`} />
              <StatusStrip label="Doctor view" value={`${selectedCount} selected`} />
              <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-extrabold text-muted transition hover:bg-well hover:text-ink">
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
