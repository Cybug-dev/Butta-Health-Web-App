import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  ChevronRight,
  Droplets,
  FileCheck2,
  History,
  Info,
  Leaf,
  Mic,
  Moon,
  Pill,
  Plus,
  Search,
  Stethoscope,
  Sun,
  Sunrise,
  UserRound,
  Utensils,
} from "lucide-react";
import { DailyCheckInCard } from "../components/dashboard/DailyCheckInCard";
import { DashboardMetric } from "../components/dashboard/DashboardMetric";
import { HealthEventIcon } from "../components/dashboard/HealthEventIcon";
import { LatestEventCard } from "../components/dashboard/LatestEventCard";
import { presets } from "../data";
import type { AppUser, HealthProfile } from "../services/api";
import type { DailyCheckIn, DashboardSnapshot, HealthRecord, ViewId } from "../types";
import { getDayPeriod, getGreeting, type DayPeriod } from "../utils/format";
import { profileCompletion } from "../utils/profile";

const periodIcons: Record<DayPeriod, { icon: typeof Sun; label: string; className: string }> = {
  morning: { icon: Sunrise, label: "Morning", className: "border-amber/20 bg-amber-50 text-amber-600" },
  afternoon: { icon: Sun, label: "Afternoon", className: "border-amber/25 bg-amber-100/70 text-amber-700" },
  evening: { icon: Moon, label: "Night", className: "border-teal/20 bg-teal/10 text-leaf" },
};

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
  voiceNoteSupported,
  onVoiceNote,
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
  voiceNoteSupported: boolean;
  onVoiceNote: () => void;
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
  const period = periodIcons[getDayPeriod(now)];
  const PeriodIcon = period.icon;

  return (
    <div className="dashboard-view">
      <div className="dashboard-enter mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border sm:h-12 sm:w-12 ${period.className}`}
            title={period.label}
            aria-label={period.label}
            role="img"
          >
            <PeriodIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{getGreeting()}, {user.firstName}</h1>
            <p className="mt-0.5 text-xs font-semibold text-muted sm:mt-1 sm:text-sm sm:font-medium">How are you feeling today?</p>
          </div>
        </div>
        <p className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-muted shadow-sm sm:px-3.5 sm:text-xs">
          <CalendarDays size={15} className="text-teal" />
          <span className="sm:hidden">{new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(now)}</span>
          <span className="hidden sm:inline">{new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(now)}</span>
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="dashboard-enter relative mb-5 lg:hidden"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} strokeWidth={2.2} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your health events..."
          aria-label="Search health events"
          className="field-input w-full py-3 pl-10 pr-4 text-xs"
        />
      </form>

      <div className="grid gap-5">
        <div className="min-w-0 space-y-5">
          <section className="dashboard-enter relative flex min-h-[272px] items-center overflow-hidden rounded-3xl bg-teal text-white shadow-lift sm:min-h-[240px]">
            <img src="/assets/butta-hero-wellness.png" alt="" className="image-fade-left absolute inset-y-0 right-0 h-full w-[72%] object-cover object-[82%_50%] sm:w-3/5 sm:object-center" />
            <div className="relative z-10 w-[72%] py-7 pl-6 pr-3 sm:w-[56%] sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-glow/30 bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-glow">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-glow opacity-75 motion-safe:animate-ping-slow" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow" />
                </span>
                Quick log
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">Not feeling well?</h2>
              <p className="mt-2 max-w-lg text-xs font-medium leading-relaxed text-white/85 sm:text-sm lg:text-base">Describe it in your own words and review it before saving. Every detail creates clarity for your doctor.</p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                <button type="button" onClick={() => setActiveView("capture")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-leaf shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-mist active:scale-95 sm:gap-2.5 sm:px-6 sm:py-3 sm:text-sm">
                  <Plus size={18} strokeWidth={2.4} />
                  Log how I feel
                </button>
                {voiceNoteSupported && (
                  <button
                    type="button"
                    onClick={onVoiceNote}
                    aria-label="Voice note"
                    title="Voice note"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 sm:px-4 sm:py-3"
                  >
                    <Mic size={18} />
                    <span className="hidden sm:inline">Voice note</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="dashboard-enter grid gap-5 lg:grid-cols-2">
            <div className="min-w-0 space-y-5">
              <section>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold tracking-tight sm:text-base">Quick access</h2>
                  <span className="text-[11px] font-medium text-faint sm:text-xs">Common actions</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                  {quickAccess.map(({ icon: Icon, label, view }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveView(view)}
                      className="surface-card group flex min-w-0 flex-col items-center gap-2 rounded-lg px-1 py-3 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal sm:p-4"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal/10 text-leaf transition-all duration-200 group-hover:bg-leaf group-hover:text-white sm:h-11 sm:w-11"><Icon size={19} strokeWidth={2.2} /></span>
                      <span className="w-full truncate px-0.5 text-[11px] font-bold text-ink sm:text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="sm:rounded-lg sm:border sm:border-line sm:bg-white/80 sm:p-5 sm:shadow-card">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-bold tracking-tight">Quick log</h2>
                  <span className="text-[11px] font-medium text-faint sm:text-xs">Tap to start an entry</span>
                </div>
                <div className="scroll-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0">
                  {quickLogOptions.map(({ icon: Icon, label, preset }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onQuickLog(preset)}
                      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-fieldLine bg-white px-3.5 text-xs font-semibold text-ink shadow-chip transition-all duration-200 hover:-translate-y-px hover:border-teal hover:text-leaf hover:shadow-chipHover active:scale-95 sm:min-h-0 sm:py-2"
                    >
                      <Icon size={14} className="text-teal" />
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
              <h2 className="text-sm font-bold tracking-tight sm:text-base">Health summary</h2>
              <button type="button" onClick={() => setActiveView("timeline")} className="group inline-flex items-center gap-1 text-xs font-bold text-leaf hover:underline">
                See all
                <ChevronRight size={14} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-3 sm:mt-3 sm:grid-cols-3 sm:gap-4">
              <DashboardMetric
                icon={FileCheck2}
                label="Health events"
                value={String(thisMonthRecords)}
                unit="this month"
                badge="Monthly"
                chart={days}
                onClick={() => setActiveView("timeline")}
              />
              <DashboardMetric
                icon={UserRound}
                label="Profile"
                value={`${completion}%`}
                unit="complete"
                badge="Private"
                badgeTone="teal"
                progress={completion}
                onClick={() => setActiveView("profile")}
              />
              <LatestEventCard
                record={latestRecord}
                onClick={() => setActiveView(latestRecord ? "timeline" : "capture")}
                className="col-span-2 sm:col-span-1"
              />
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
          <section className="surface-card rounded-3xl p-5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal/10 text-teal"><Info size={16} /></span>
            <h2 className="mt-3 text-sm font-bold text-ink">Log it while it is fresh</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">Note when it started, how strong it felt, and what helped. Small details make your visit brief more useful.</p>
            <button type="button" onClick={() => setActiveView("capture")} className="group mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal transition hover:text-tealDark">
              Start an entry
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </section>

          <section className="relative flex min-h-40 flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-mist to-paper p-5 text-center shadow-card">
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
