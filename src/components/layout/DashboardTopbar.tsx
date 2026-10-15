import { Bell, Search, UserRound } from "lucide-react";
import { useState } from "react";
import type { AppUser } from "../../services/api";
import { AccountMenu } from "../account/AccountMenu";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 hidden h-[72px] items-center justify-between border-b border-line bg-white/95 px-8 backdrop-blur lg:flex">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="relative w-full max-w-md"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your health events..."
          aria-label="Search health events"
          className="h-11 w-full rounded-lg border border-transparent bg-well pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-faint focus:border-teal/30 focus:bg-white focus:ring-2 focus:ring-teal/10"
        />
      </form>

      <div className="relative ml-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative grid h-10 w-10 place-items-center rounded-lg text-muted transition hover:bg-well hover:text-ink"
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rust ring-2 ring-white" />
        </button>
        <AccountMenu user={user} onProfile={onProfile} onSettings={onSettings} onSignOut={onSignOut} showName />

        {notificationsOpen && (
          <div className="absolute right-0 top-[54px] w-80 overflow-hidden rounded-lg border border-line bg-white shadow-float">
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-extrabold">Notifications</p>
            </div>
            <button type="button" onClick={onProfile} className="flex w-full gap-3 px-4 py-4 text-left transition hover:bg-well">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
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
    </header>
  );
}
