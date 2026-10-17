import gsap from "gsap";
import { ClipboardList, ExternalLink, TrendingDown, TrendingUp, UserRound, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { AppUser } from "../../services/api";
import type { HealthRecord, ViewId } from "../../types";

export function InsightRailContent({
  user,
  records,
  selectedRecords,
  setActiveView,
}: {
  user: AppUser;
  records: HealthRecord[];
  selectedRecords: HealthRecord[];
  setActiveView: (view: ViewId) => void;
}) {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recentCount = records.filter((record) => now - new Date(record.eventDate).getTime() <= sevenDaysMs).length;
  const priorCount = records.filter((record) => {
    const age = now - new Date(record.eventDate).getTime();
    return age > sevenDaysMs && age <= sevenDaysMs * 2;
  }).length;
  const trend =
    priorCount === 0 && recentCount === 0
      ? { label: "No activity yet", icon: null }
      : recentCount > priorCount
        ? { label: "More than last week", icon: TrendingUp }
        : recentCount < priorCount
          ? { label: "Fewer than last week", icon: TrendingDown }
          : { label: "Same as last week", icon: null };
  const TrendIcon = trend.icon;
  const activityBarWidth = Math.min(100, (recentCount / Math.max(1, recentCount, priorCount)) * 100);

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-line bg-field p-4">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-faint">Patient context</p>
        <div className="mb-3.5 flex items-center gap-3.5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal text-white shadow-sm">
            <UserRound size={20} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold leading-tight text-ink" title={`${user.firstName} ${user.lastName}`}>
              {user.firstName} {user.lastName}
            </span>
            <span className="mt-0.5 inline-block rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-leaf">
              {user.demo ? "Demo profile" : "Private profile"}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Stat label="Records" value={records.length} />
          <Stat label="Selected" value={selectedRecords.length} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-field p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-faint">Recent activity</p>
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-2">
          <h3 className="text-base font-bold tracking-tight text-ink">Events logged</h3>
          <span className="whitespace-nowrap text-xs text-muted">
            <span className="text-sm font-extrabold text-ink">{recentCount}</span> last 7 days
          </span>
        </div>
        <div className="mb-2.5 h-2 w-full overflow-hidden rounded-full bg-track">
          <div className="h-2 rounded-full bg-teal transition-[width] duration-500" style={{ width: `${activityBarWidth}%` }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wider">
          <span className="text-faint">Prior week: {priorCount}</span>
          <span className="flex items-center gap-1 font-bold text-teal">
            {trend.label}
            {TrendIcon && <TrendIcon size={13} />}
          </span>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setActiveView("doctor-summary")}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-teal px-4 py-3.5 text-left text-sm font-semibold text-white shadow-md shadow-teal/20 transition hover:bg-tealDark active:scale-[0.98]"
      >
        <span className="flex items-center gap-2.5">
          <ClipboardList size={18} /> Open doctor snapshot
        </span>
        <ExternalLink size={17} />
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-card">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-faint">{label}</span>
      <span className="mt-0.5 block text-2xl font-black tracking-tight text-ink">{value}</span>
    </div>
  );
}

function InsightHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-line pb-3.5">
      <span className="flex items-center gap-2">
        <span className="inline-block h-3.5 w-1.5 rounded-full bg-teal" />
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">Patient insights</h2>
      </span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close patient insights"
          className="grid h-7 w-7 place-items-center rounded-lg border border-line text-faint transition hover:bg-field hover:text-ink active:scale-95"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export function InsightRail({
  user,
  records,
  selectedRecords,
  setActiveView,
}: {
  user: AppUser;
  records: HealthRecord[];
  selectedRecords: HealthRecord[];
  setActiveView: (view: ViewId) => void;
}) {
  return (
    <aside className="fixed bottom-0 right-0 top-[72px] z-20 hidden w-[320px] overflow-y-auto border-l border-line bg-paper p-4 2xl:block">
      <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
        <InsightHeader />
        <InsightRailContent user={user} records={records} selectedRecords={selectedRecords} setActiveView={setActiveView} />
      </div>
    </aside>
  );
}

export function MobileInsightDrawer({
  user,
  records,
  selectedRecords,
  setActiveView,
  onClose,
}: {
  user: AppUser;
  records: HealthRecord[];
  selectedRecords: HealthRecord[];
  setActiveView: (view: ViewId) => void;
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!drawerRef.current) return;
    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const context = gsap.context(() => {
      gsap.fromTo(".insight-drawer-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, clearProps: "opacity,visibility,willChange" });
      gsap.fromTo(
        ".insight-drawer-panel",
        mobile ? { autoAlpha: 0, y: -32 } : { autoAlpha: 0, x: 42 },
        { autoAlpha: 1, x: 0, y: 0, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" },
      );
    }, drawerRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div ref={drawerRef} className="fixed inset-0 z-50 2xl:hidden" role="dialog" aria-modal="true" aria-label="Patient insights">
      <div className="insight-drawer-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className="insight-drawer-panel absolute inset-x-3.5 top-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-3xl border border-line bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:bottom-3 sm:right-3 sm:top-3 sm:w-full sm:max-w-sm">
        <InsightHeader onClose={onClose} />
        <InsightRailContent user={user} records={records} selectedRecords={selectedRecords} setActiveView={setActiveView} />
      </div>
    </div>
  );
}
