import { Search } from "lucide-react";
import type { AppUser } from "../../services/api";
import { AccountMenu } from "../account/AccountMenu";
import { NotificationBell } from "./NotificationBell";

export function DashboardTopbar({
  user,
  search,
  setSearch,
  onSearch,
  onProfile,
  onSettings,
  onSignOut,
}: {
  user: AppUser;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 hidden h-[72px] items-center justify-between border-b border-line bg-white/95 px-8 backdrop-blur-md lg:flex">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="relative w-full max-w-lg"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} strokeWidth={2.2} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your health events, symptoms, doctors..."
          aria-label="Search health events"
          className="field-input h-11 w-full pl-10 pr-4 text-sm"
        />
      </form>

      <div className="ml-6 flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-tealDark">
          <span className="h-2 w-2 rounded-full bg-teal motion-safe:animate-pulse" />
          Vault Encrypted
        </div>
        <NotificationBell onProfile={onProfile} />
        <div className="h-6 w-px bg-line" />
        <AccountMenu user={user} onProfile={onProfile} onSettings={onSettings} onSignOut={onSignOut} variant="desktop" />
      </div>
    </header>
  );
}
