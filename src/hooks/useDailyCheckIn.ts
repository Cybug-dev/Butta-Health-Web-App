import { useState } from "react";
import { buttaApi, type AppUser } from "../services/api";
import { mockBackend } from "../services/mockApi";
import type { DailyCheckIn, HealthRecord } from "../types";

type UseDailyCheckInOptions = {
  user: AppUser;
  checkIn: DailyCheckIn | null;
  setCheckIn: (checkIn: DailyCheckIn) => void;
  addRecord: (record: HealthRecord) => void;
  reload: () => void;
};

export function useDailyCheckIn({ user, checkIn, setCheckIn, addRecord, reload }: UseDailyCheckInOptions) {
  const [checkInSaving, setCheckInSaving] = useState(false);
  const [checkInError, setCheckInError] = useState("");

  async function respondToDailyCheckIn(notes: string) {
    if (!checkIn || checkIn.respondedAt) return;
    setCheckInSaving(true);
    setCheckInError("");
    try {
      const result = user.demo
        ? await mockBackend.respondToCheckIn(checkIn, notes)
        : await buttaApi.respondToCheckIn(checkIn.id, { notes });
      setCheckIn(result.checkIn);
      addRecord(result.healthEvent);
      if (!user.demo) reload();
    } catch (error) {
      setCheckInError(error instanceof Error ? error.message : "Today's check-in could not be saved.");
    } finally {
      setCheckInSaving(false);
    }
  }

  return { checkInSaving, checkInError, respondToDailyCheckIn };
}
