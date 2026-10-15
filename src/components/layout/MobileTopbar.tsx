import { Activity, Leaf } from "lucide-react";
import type { AppUser } from "../../services/api";
import { AccountMenu } from "../account/AccountMenu";

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
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal text-paper">
          <Leaf size={20} fill="currentColor" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-base font-extrabold leading-5">Butta Health</p>
          <p className="text-xs font-semibold text-muted">Your health. Your story.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showInsightTrigger && (
          <button
            onClick={onOpenInsightRail}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-paper2 text-muted 2xl:hidden"
            aria-label="Open patient insights"
            title="Patient insights"
          >
            <Activity size={18} />
          </button>
        )}
        <AccountMenu user={user} onProfile={onProfile} onSettings={onSettings} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
