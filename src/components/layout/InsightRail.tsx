import gsap from "gsap";
import { FileCheck2, UserRound, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { AppUser } from "../../services/api";
import type { HealthRecord, ViewId } from "../../types";
import { Entity } from "../capture/ExtractionPreview";

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
  const trendLabel =
    priorCount === 0 && recentCount === 0
      ? "No activity yet"
      : recentCount > priorCount
        ? "More than last week"
        : recentCount < priorCount
          ? "Fewer than last week"
          : "Same as last week";
  const activityBarWidth = Math.min(100, (recentCount / Math.max(1, recentCount, priorCount)) * 100);

  return (
    <div className="space-y-4 pr-1">
      <section className="surface-card rounded-lg p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Patient context</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal text-paper">
            <UserRound size={22} />
          </div>
          <div>
            <h3 className="truncate font-serif text-2xl" title={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{user.demo ? "Demo profile" : "Private profile"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Entity label="Records" value={String(records.length)} />
          <Entity label="Selected" value={String(selectedRecords.length)} />
        </div>
      </section>
      <section className="surface-card rounded-lg p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Recent activity</p>
        <div className="mt-3 flex items-end justify-between">
          <h3 className="font-serif text-2xl">Events logged</h3>
          <p className="whitespace-nowrap text-xl font-extrabold">{recentCount} <span className="text-xs text-faint">last 7 days</span></p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-well">
          <div className="h-full rounded-full bg-emerald transition-[width] duration-500" style={{ width: `${activityBarWidth}%` }} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
          <span>Prior week: {priorCount}</span>
          <span className="text-emerald">{trendLabel}</span>
        </div>
      </section>
      <button
        onClick={() => setActiveView("doctor-summary")}
        className="flex w-full items-center justify-between rounded-lg bg-teal px-4 py-4 text-left font-semibold text-paper transition hover:bg-tealDark"
      >
        <span>Open doctor snapshot</span>
        <FileCheck2 size={19} />
      </button>
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
    <aside className="fixed bottom-0 right-0 top-[72px] z-20 hidden w-[320px] overflow-y-auto border-l border-line bg-paper p-5 2xl:block">
      <InsightRailContent user={user} records={records} selectedRecords={selectedRecords} setActiveView={setActiveView} />
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
    const context = gsap.context(() => {
      gsap.fromTo(".insight-drawer-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, clearProps: "opacity,visibility,willChange" });
      gsap.fromTo(".insight-drawer-panel", { autoAlpha: 0, x: 42 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" });
    }, drawerRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={drawerRef} className="fixed inset-0 z-50 2xl:hidden">
      <div className="insight-drawer-backdrop absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className="insight-drawer-panel absolute bottom-0 right-0 top-0 w-full max-w-sm overflow-y-auto border-l border-line bg-paper p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Patient insights</p>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded border border-line bg-paper2" aria-label="Close patient insights">
            <X size={18} />
          </button>
        </div>
        <InsightRailContent user={user} records={records} selectedRecords={selectedRecords} setActiveView={setActiveView} />
      </div>
    </div>
  );
}
