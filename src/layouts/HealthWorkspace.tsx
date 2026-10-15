import { useRef } from "react";
import { ConfirmModal } from "../components/capture/ConfirmModal";
import { DashboardTopbar } from "../components/layout/DashboardTopbar";
import { HeaderBand } from "../components/layout/HeaderBand";
import { InsightRail, MobileInsightDrawer } from "../components/layout/InsightRail";
import { MobileNav } from "../components/layout/MobileNav";
import { MobileTopbar } from "../components/layout/MobileTopbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useAiConsent } from "../hooks/useAiConsent";
import { useDailyCheckIn } from "../hooks/useDailyCheckIn";
import { useHealthProfile } from "../hooks/useHealthProfile";
import { useHealthRecords } from "../hooks/useHealthRecords";
import { useObservationCapture } from "../hooks/useObservationCapture";
import { useRecordFilters } from "../hooks/useRecordFilters";
import { useWorkspaceAnimations } from "../hooks/useWorkspaceAnimations";
import { useWorkspaceNavigation } from "../hooks/useWorkspaceNavigation";
import { CompanionPage } from "../pages/CompanionPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DoctorPrepPage } from "../pages/DoctorPrepPage";
import { DoctorSummaryPage } from "../pages/DoctorSummaryPage";
import { HistoryPage } from "../pages/HistoryPage";
import { LogEventPage } from "../pages/LogEventPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";
import type { AppUser } from "../services/api";
import { clearDemoStorage } from "../services/demoStorage";

export function HealthWorkspace({ user, onSignOut }: { user: AppUser; onSignOut: () => void }) {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const { activeView, navigateView, insightRailOpen, setInsightRailOpen } = useWorkspaceNavigation();
  const {
    records,
    loading,
    recordsError,
    dashboard,
    todayCheckIn,
    setTodayCheckIn,
    selectedIds,
    setSelectedIds,
    selectedRecords,
    summary,
    metrics,
    reload,
    addRecord,
  } = useHealthRecords(user);
  const { search, setSearch, filter, setFilter, filteredRecords } = useRecordFilters(records);
  const { healthProfile, saveHealthProfile } = useHealthProfile(user, reload);
  const { aiConsent, saveAiConsent } = useAiConsent(user);
  const { checkInSaving, checkInError, respondToDailyCheckIn } = useDailyCheckIn({
    user,
    checkIn: todayCheckIn,
    setCheckIn: setTodayCheckIn,
    addRecord,
    reload,
  });
  const capture = useObservationCapture({
    user,
    addRecord,
    reload,
    onSaved: () => navigateView("timeline"),
  });
  useWorkspaceAnimations(viewRef, activeView);

  const showInsightRail = ["capture", "timeline", "companion", "doctor-prep", "doctor-summary"].includes(activeView);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="app-shell min-h-screen w-full">
        <Sidebar
          activeView={activeView}
          onChange={navigateView}
          recordCount={metrics.records}
          selectedCount={selectedRecords.length}
          onSignOut={onSignOut}
        />

        <main className="min-w-0 pb-28 lg:ml-64 lg:pb-0">
          <MobileTopbar
            user={user}
            onProfile={() => navigateView("profile")}
            onSettings={() => navigateView("settings")}
            onSignOut={onSignOut}
            showInsightTrigger={showInsightRail}
            onOpenInsightRail={() => setInsightRailOpen(true)}
          />
          <DashboardTopbar
            user={user}
            search={search}
            setSearch={setSearch}
            onSearch={() => navigateView("timeline")}
            onProfile={() => navigateView("profile")}
            onSettings={() => navigateView("settings")}
            onSignOut={onSignOut}
          />
          <div className="min-h-[calc(100vh-72px)]">
            <section
              ref={viewRef}
              className={`min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-7 ${activeView === "dashboard" ? "xl:pr-[348px]" : showInsightRail ? "2xl:pr-[348px]" : ""}`}
            >
              <div className={`view-panel mx-auto w-full min-w-0 overflow-visible ${activeView === "dashboard" ? "max-w-[1240px]" : "max-w-5xl"}`}>
                {recordsError && (
                  <div role="alert" className="mb-5 flex flex-col gap-3 rounded-lg border border-rust/25 bg-rust/5 px-4 py-3 text-sm font-semibold text-rust sm:flex-row sm:items-center sm:justify-between">
                    <span>{recordsError}</span>
                    <button type="button" onClick={reload} className="self-start rounded border border-rust/30 bg-white px-3 py-2 text-xs font-extrabold sm:self-auto">Try again</button>
                  </div>
                )}
                {activeView !== "dashboard" && activeView !== "profile" && activeView !== "settings" && <HeaderBand metrics={metrics} />}
                {activeView === "dashboard" && (
                  <DashboardPage
                    user={user}
                    profile={healthProfile}
                    records={records}
                    dashboard={dashboard}
                    checkIn={todayCheckIn}
                    checkInSaving={checkInSaving}
                    checkInError={checkInError}
                    onCheckIn={respondToDailyCheckIn}
                    loading={loading}
                    setActiveView={navigateView}
                    search={search}
                    setSearch={setSearch}
                    onSearch={() => navigateView("timeline")}
                    onQuickLog={(preset) => {
                      capture.startQuickLog(preset);
                      navigateView("capture");
                    }}
                  />
                )}
                {activeView === "profile" && (
                  <ProfilePage
                    user={user}
                    profile={healthProfile}
                    onSave={saveHealthProfile}
                  />
                )}
                {activeView === "capture" && (
                  <LogEventPage
                    observation={capture.observation}
                    setObservation={capture.setObservation}
                    openConfirm={capture.openConfirm}
                    extracting={capture.extracting}
                    aiConsent={aiConsent}
                    onEnableAiCapture={() => void saveAiConsent(true)}
                    records={records}
                    isDemo={Boolean(user.demo)}
                  />
                )}
                {activeView === "timeline" && (
                  <HistoryPage
                    records={filteredRecords}
                    rawCount={records.length}
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    setActiveView={navigateView}
                  />
                )}
                {activeView === "companion" && <CompanionPage records={records} />}
                {activeView === "doctor-prep" && (
                  <DoctorPrepPage
                    records={records}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    setActiveView={navigateView}
                  />
                )}
                {activeView === "doctor-summary" && (
                  <DoctorSummaryPage summary={summary} selectedRecords={selectedRecords} />
                )}
                {activeView === "settings" && (
                  <SettingsPage
                    user={user}
                    onSignOut={onSignOut}
                    onResetDemo={() => {
                      clearDemoStorage();
                      onSignOut();
                    }}
                    aiConsent={aiConsent}
                    onSaveAiConsent={saveAiConsent}
                  />
                )}
              </div>
            </section>

            {showInsightRail && (
              <InsightRail user={user} records={records} selectedRecords={selectedRecords} setActiveView={navigateView} />
            )}
            {showInsightRail && insightRailOpen && (
              <MobileInsightDrawer
                user={user}
                records={records}
                selectedRecords={selectedRecords}
                setActiveView={navigateView}
                onClose={() => setInsightRailOpen(false)}
              />
            )}
          </div>
        </main>

        <MobileNav activeView={activeView} onChange={navigateView} />
      </div>

      {capture.extracted && (
        <ConfirmModal
          extracted={capture.extracted}
          setExtracted={capture.setExtracted}
          original={capture.observation}
          safety={capture.extractionSafety}
          educationalContext={capture.educationalContext}
          saving={capture.saving}
          error={capture.saveError}
          onClose={capture.closeConfirm}
          onSave={capture.saveRecord}
        />
      )}
    </div>
  );
}
