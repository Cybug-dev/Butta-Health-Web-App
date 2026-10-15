import { Check, FileCheck2, HeartPulse, Pill } from "lucide-react";
import type { HealthRecord } from "../../types";

export function HealthEventIcon({ record }: { record: HealthRecord }) {
  const Icon = record.type === "MEDICATION" ? Pill : record.type === "DOCTOR_VISIT" ? FileCheck2 : record.type === "CHECK_IN" ? Check : HeartPulse;
  const color = record.type === "MEDICATION" || record.type === "CHECK_IN" ? "bg-teal/10 text-teal" : record.type === "DOCTOR_VISIT" ? "bg-gold/20 text-[#8a6800]" : "bg-rust/10 text-rust";
  return <span className={`grid h-10 w-10 place-items-center rounded-full ${color}`}><Icon size={18} /></span>;
}
