import { Activity, Leaf } from "lucide-react";
import type { AppUser } from "../../services/api";
import { AccountMenu } from "../account/AccountMenu";
import { NotificationBell } from "./NotificationBell";

export function MobileTopbar({
  user,
  onProfile,
  onSettings,
  onSignOut,
  showInsightTrigger,
  onOpenInsightRail,
}: {
  user: AppUser;
  onProfile: () => void;
  onSettings: () => void;
  onSignOut: () => void;
  showInsightTrigger: boolean;
  onOpenInsightRail: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between bg-paper/90 px-4 backdrop-blur-md sm:px-6 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf text-white shadow-md shadow-leaf/20">
          <Leaf size={18} fill="currentColor" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold leading-none tracking-tight text-ink">Butta Health</p>
          <p className="mt-0.5 truncate text-[10px] font-semibold tracking-wide text-muted">Your health. Your story.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {showInsightTrigger && (
          <button
            onClick={onOpenInsightRail}
            className="rounded-xl p-2 text-muted transition-colors hover:bg-well hover:text-ink 2xl:hidden"
            aria-label="Open patient insights"
            title="Patient insights"
          >
            <Activity size={18} />
          </button>
        )}
        <NotificationBell onProfile={onProfile} />
        <AccountMenu user={user} onProfile={onProfile} onSettings={onSettings} onSignOut={onSignOut} variant="mobile" />
      </div>
    </header>
  );
}
