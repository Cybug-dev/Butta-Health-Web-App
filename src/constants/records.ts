import type { HealthRecord, RecordType } from "../types";

export const typeStyles: Record<RecordType, string> = {
  SYMPTOM: "border-emerald/25 bg-emerald/10 text-emerald",
  MEDICATION: "border-teal/25 bg-teal/10 text-teal",
  DIGESTIVE: "border-gold/40 bg-gold/15 text-[#725900]",
  DOCTOR_VISIT: "border-rust/25 bg-rust/10 text-rust",
  CHECK_IN: "border-teal/25 bg-teal/10 text-teal",
};

export const statusStyles: Record<HealthRecord["status"], string> = {
  Confirmed: "border-emerald/20 bg-emerald/10 text-emerald",
  "Needs monitoring": "border-amber/25 bg-amber/10 text-amber",
  Prepared: "border-teal/20 bg-teal/10 text-teal",
};

export const severityStyles: Record<HealthRecord["severity"], string> = {
  Mild: "border-emerald/20 bg-emerald/10 text-emerald",
  Moderate: "border-amber/25 bg-amber/10 text-amber",
  Severe: "border-rust/20 bg-rust/10 text-rust",
  "Not specified": "border-line bg-well text-muted",
};

export const typeLabels: Record<RecordType, string> = {
  SYMPTOM: "Symptom",
  MEDICATION: "Medication",
  DIGESTIVE: "Digestive",
  DOCTOR_VISIT: "Doctor visit",
  CHECK_IN: "Check-in",
};

export const filters: Array<RecordType | "ALL"> = ["ALL", "SYMPTOM", "MEDICATION", "DIGESTIVE", "DOCTOR_VISIT", "CHECK_IN"];
