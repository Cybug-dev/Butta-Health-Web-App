import { useEffect, useMemo, useState } from "react";
import { buttaApi, type AppUser } from "../services/api";
import { buildDoctorSummary, mockBackend } from "../services/mockApi";
import type { DailyCheckIn, DashboardSnapshot, DoctorSummary, HealthRecord } from "../types";
import { browserTimezone } from "../utils/format";

/** Loads the workspace data (events, dashboard snapshot, today's check-in) and derives record views from it. */
export function useHealthRecords(user: AppUser) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [recordsReload, setRecordsReload] = useState(0);
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<DoctorSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setRecordsError("");

    const workspaceRequest = user.demo
      ? Promise.all([mockBackend.getRecords(), mockBackend.getTodayCheckIn()])
          .then(([events, checkIn]) => ({ events, checkIn, dashboard: null }))
      : Promise.all([
          buttaApi.getHealthEvents({ limit: 100 }),
          buttaApi.getDashboard(browserTimezone),
          buttaApi.getTodayCheckIn(browserTimezone),
        ]).then(([eventData, dashboardData, checkInData]) => ({
          events: eventData.events,
          dashboard: dashboardData.dashboard,
          checkIn: checkInData.checkIn,
        }));

    workspaceRequest
      .then((data) => {
        if (cancelled) return;
        setRecords(data.events);
        setDashboard(data.dashboard);
        setTodayCheckIn(data.checkIn);
        setSelectedIds(data.events.slice(0, 3).map((record) => record.id));
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRecordsError(error instanceof Error ? error.message : "Your health events could not be loaded.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recordsReload, user]);

  useEffect(() => {
    if (!loading) {
      setSummary(buildDoctorSummary(records, selectedIds));
    }
  }, [loading, records, selectedIds]);

  const selectedRecords = useMemo(
    () => records.filter((record) => selectedIds.includes(record.id)),
    [records, selectedIds],
  );

  const metrics = useMemo(() => {
    if (!user.demo && dashboard) {
      return {
        monitoring: dashboard.monitoringCount,
        symptoms: dashboard.symptomCount,
        records: dashboard.totalEvents,
      };
    }
    const monitoring = records.filter((record) => record.status === "Needs monitoring").length;
    const symptoms = records.filter((record) => record.type === "SYMPTOM").length;
    return { monitoring, symptoms, records: records.length };
  }, [dashboard, records, user.demo]);

  /** Re-fetches workspace data from the server. */
  function reload() {
    setRecordsReload((value) => value + 1);
  }

  /** Prepends a newly saved record and keeps it selected for doctor preparation. */
  function addRecord(record: HealthRecord) {
    setRecords((current) => [record, ...current]);
    setSelectedIds((current) => [record.id, ...current].slice(0, 5));
  }

  return {
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
  };
}
