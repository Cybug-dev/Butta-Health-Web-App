import { LogOut } from "lucide-react";
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
};

export function Sidebar({ activeView, onChange, recordCount, selectedCount, onSignOut }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-line bg-paper2 px-5 py-5 lg:flex">
      <BrandBlock />
      <DesktopNav activeView={activeView} onChange={onChange} />
      <div className="mt-auto pt-6">
        <div className="relative h-40 overflow-hidden rounded-lg border border-teal/10 bg-well">
          <img src="/assets/butta-sidebar-botanical.png" alt="Watercolor eucalyptus and sage leaves" className="absolute inset-0 h-full w-full object-cover object-bottom" />
          <div className="absolute inset-x-0 bottom-0 bg-teal px-3 py-2.5 text-center">
            <p className="text-xs font-extrabold leading-5 text-white">Small steps. A healthier you.</p>
          </div>
        </div>
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <StatusStrip label="Records synced" value={`${recordCount} entries`} />
          <StatusStrip label="Doctor view" value={`${selectedCount} selected`} />
          <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-extrabold text-muted transition hover:bg-well hover:text-ink">
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
