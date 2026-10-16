import {
  Activity,
  ArrowRight,
  Brain,
  ChevronRight,
  Droplets,
  FileCheck2,
  HeartPulse,
  History,
  Info,
  Leaf,
  Moon,
  Pill,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  Utensils,
} from "lucide-react";
import { DailyCheckInCard } from "../components/dashboard/DailyCheckInCard";
import { DashboardMetric } from "../components/dashboard/DashboardMetric";
import { HealthEventIcon } from "../components/dashboard/HealthEventIcon";
import { presets } from "../data";
import type { AppUser, HealthProfile } from "../services/api";
import type { DailyCheckIn, DashboardSnapshot, HealthRecord, ViewId } from "../types";
import { formatDate, getGreeting } from "../utils/format";
import { profileCompletion } from "../utils/profile";

const quickAccess: { icon: typeof Plus; label: string; view: ViewId }[] = [
  { icon: Plus, label: "Log event", view: "capture" },
  { icon: History, label: "History", view: "timeline" },
  { icon: Stethoscope, label: "Visit prep", view: "doctor-prep" },
  { icon: UserRound, label: "Profile", view: "profile" },
];

const quickLogOptions: { icon: typeof Plus; label: string; preset: string }[] = [
  { icon: Brain, label: "Headache", preset: presets[0] },
  { icon: Activity, label: "Dizziness", preset: presets[1] },
  { icon: Utensils, label: "Digestion", preset: presets[2] },
  { icon: Pill, label: "Medication", preset: presets[3] },
  { icon: Moon, label: "Sleep", preset: presets[4] },
  { icon: Droplets, label: "Hydration", preset: presets[5] },
];

export function DashboardPage({
  user,
  profile,
  records,
  dashboard,
  checkIn,
  checkInSaving,
  checkInError,
  onCheckIn,
  loading,
  setActiveView,
  search,
  setSearch,
  onSearch,
  onQuickLog,
}: {
  user: AppUser;
  profile: HealthProfile | null;
  records: HealthRecord[];
  dashboard: DashboardSnapshot | null;
  checkIn: DailyCheckIn | null;
  checkInSaving: boolean;
  checkInError: string;
  onCheckIn: (notes: string) => Promise<void>;
  loading: boolean;
  setActiveView: (view: ViewId) => void;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onQuickLog: (preset: string) => void;
}) {
  const completion = dashboard?.profileCompletion ?? profileCompletion(user, profile);
  const latestRecord = dashboard?.latestEvent ?? records[0];
  const recentRecords = dashboard?.recentEvents ?? records.slice(0, 4);
  const now = new Date();
  const locallyCalculatedMonth = records.filter((record) => {
    const date = new Date(record.eventDate);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const thisMonthRecords = dashboard?.eventsThisMonth ?? locallyCalculatedMonth;
  const locallyCalculatedDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const count = records.filter((record) => new Date(record.eventDate).toDateString() === date.toDateString()).length;
    return {
      label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
      count,
    };
  });
  const days = dashboard?.activity ?? locallyCalculatedDays;
  const maxDailyCount = Math.max(1, ...days.map((day) => day.count));

  return (
    <div className="dashboard-view">
      <div className="dashboard-enter mb-5 flex flex-col justify-between gap-1 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">{getGreeting()}, {user.firstName}</h1>
          <p className="mt-1 text-base font-medium text-muted">How are you feeling today?</p>
        </div>
        <p className="hidden text-sm font-bold text-muted sm:block">
          {new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(now)}
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="dashboard-enter relative mb-5 lg:hidden"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your health events..."
          aria-label="Search health events"
          className="h-11 w-full rounded-lg border border-line bg-white pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-faint focus:border-teal focus:ring-2 focus:ring-teal/10"
        />
      </form>

      <div className="grid gap-5">
        <div className="min-w-0 space-y-5">
          <section className="dashboard-enter relative flex min-h-[272px] items-center overflow-hidden rounded-lg bg-teal text-white shadow-lift sm:min-h-[240px]">
            <img src="/assets/butta-hero-wellness.png" alt="" className="image-fade-left absolute inset-y-0 right-0 h-full w-[72%] object-cover object-[82%_50%] sm:w-3/5 sm:object-center" />
            <div className="relative z-10 w-[72%] py-7 pl-6 pr-3 sm:w-[56%] sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Quick log</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-3xl">Not feeling well?</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/85">Describe it in your own words and review it before saving.</p>
              <button type="button" onClick={() => setActiveView("capture")} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-extrabold text-teal transition hover:bg-well">
                <Plus size={17} />
                Log how I feel
              </button>
            </div>
          </section>

          <div className="dashboard-enter grid gap-5 lg:grid-cols-2">
            <div className="min-w-0 space-y-5">
              <section>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold tracking-tight">Quick access</h2>
                  <span className="hidden text-xs font-medium text-faint sm:inline">Common actions</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                  {quickAccess.map(({ icon: Icon, label, view }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveView(view)}
                      className="surface-card group flex min-w-0 flex-col items-center gap-2 rounded-lg px-1 py-3 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal sm:p-4"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-teal/10 text-teal transition-colors duration-200 group-hover:bg-teal group-hover:text-white sm:h-12 sm:w-12 sm:rounded-xl"><Icon size={19} strokeWidth={2.2} /></span>
                      <span className="w-full truncate px-0.5 text-xs font-semibold text-ink/80 group-hover:text-ink">{label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="sm:rounded-lg sm:border sm:border-line sm:bg-white/80 sm:p-5 sm:shadow-card">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-bold tracking-tight sm:text-sm">Quick log</h2>
                  <span className="text-xs font-medium text-faint">Tap to start an entry</span>
                </div>
                <div className="scroll-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0">
                  {quickLogOptions.map(({ icon: Icon, label, preset }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onQuickLog(preset)}
                      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-bold text-ink shadow-sm transition active:bg-teal/10 sm:min-h-0 sm:rounded-xl sm:border-teal/15 sm:bg-teal/5 sm:px-3.5 sm:py-2 sm:font-semibold sm:shadow-none sm:hover:border-teal/30 sm:hover:bg-teal/10"
                    >
                      <Icon size={16} className="text-teal" />
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <DailyCheckInCard
              checkIn={checkIn}
              loading={loading}
              saving={checkInSaving}
              error={checkInError}
              onSubmit={onCheckIn}
              onViewHistory={() => setActiveView("timeline")}
            />
          </div>

          <section className="dashboard-enter">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold tracking-tight">Health summary</h2>
              <button type="button" onClick={() => setActiveView("timeline")} className="text-xs font-semibold text-teal hover:text-tealDark hover:underline">See all</button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DashboardMetric
                icon={FileCheck2}
                label="Health events"
                value={String(thisMonthRecords)}
                detail="this month"
                badge="Monthly"
                bars={days.map((day) => day.count / maxDailyCount)}
                onClick={() => setActiveView("timeline")}
              />
              <DashboardMetric
                icon={UserRound}
                label="Profile"
                value={`${completion}%`}
                detail="complete"
                badge="Private"
                progress={completion}
                onClick={() => setActiveView("profile")}
              />
              <div className="col-span-2 h-full sm:col-span-1">
                <DashboardMetric
                  icon={latestRecord?.type === "MEDICATION" ? Pill : HeartPulse}
                  label="Latest event"
                  value={latestRecord?.title || "No events yet"}
                  detail={latestRecord ? formatDate(latestRecord.eventDate) : "Start your history"}
                  badge="Recent"
                  compact
                  onClick={() => setActiveView(latestRecord ? "timeline" : "capture")}
                />
              </div>
            </div>
          </section>

          <section className="surface-card dashboard-enter overflow-hidden rounded-lg">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold">Recent health events</h2>
                <p className="mt-0.5 text-xs font-semibold text-muted">Your newest recorded observations</p>
              </div>
              <button type="button" onClick={() => setActiveView("timeline")} className="inline-flex items-center gap-2 text-sm font-extrabold text-teal hover:text-tealDark">
                View all
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="min-h-[284px]">
              {loading ? (
                <div className="grid min-h-[284px] place-items-center text-sm font-semibold text-muted">Loading your health history...</div>
              ) : recentRecords.length ? (
                recentRecords.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setActiveView("timeline")}
                    className="group grid w-full grid-cols-[64px_42px_minmax(0,1fr)_20px] items-center gap-3 border-b border-line px-5 py-3.5 text-left last:border-b-0 hover:bg-well/60"
                  >
                    <span className="text-xs font-extrabold leading-4 text-muted">
                      {new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(record.eventDate))}
                      <span className="block font-semibold text-faint">{new Date(record.eventDate).getFullYear()}</span>
                    </span>
                    <HealthEventIcon record={record} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-extrabold text-ink">{record.title}</span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-muted">
                        {record.symptoms.slice(0, 2).join(", ") || record.notes}
                      </span>
                    </span>
                    <ChevronRight size={17} className="text-faint transition group-hover:translate-x-0.5 group-hover:text-teal" />
                  </button>
                ))
              ) : (
                <div className="grid min-h-[284px] place-items-center px-6 text-center">
                  <div>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal"><Plus size={20} /></span>
                    <p className="mt-3 text-sm font-extrabold">No health events yet</p>
                    <button type="button" onClick={() => setActiveView("capture")} className="mt-2 text-sm font-bold text-teal">Log your first event</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="dashboard-rail-enter space-y-4 xl:fixed xl:bottom-0 xl:right-0 xl:top-[72px] xl:z-20 xl:flex xl:w-[320px] xl:flex-col xl:overflow-y-auto xl:border-l xl:border-line xl:bg-paper xl:p-4">
          <section className="surface-card rounded-lg p-5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal/10 text-teal"><Info size={16} /></span>
            <h2 className="mt-3 text-sm font-bold text-ink">Log it while it is fresh</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">Note when it started, how strong it felt, and what helped. Small details make your visit brief more useful.</p>
            <button type="button" onClick={() => setActiveView("capture")} className="group mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal transition hover:text-tealDark">
              Start an entry
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </section>

          <section className="relative flex min-h-40 flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-gradient-to-b from-mist to-paper p-5 text-center shadow-card">
            <img src="/assets/butta-sidebar-botanical.png" alt="" className="absolute inset-0 h-full w-full object-cover object-bottom opacity-35" />
            <div className="relative">
              <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-teal/15 text-tealDark"><Leaf size={16} fill="currentColor" strokeWidth={1.4} /></span>
              <p className="mt-2.5 text-sm font-bold leading-snug text-ink">A healthier you starts with a clearer story.</p>
              <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-muted">Every symptom log brings clarity to your next clinical consultation.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
