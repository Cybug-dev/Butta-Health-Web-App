import { Check, FileCheck2, Heart, Pill } from "lucide-react";
import type { HealthRecord } from "../../types";

export function HealthEventIcon({ record }: { record: HealthRecord }) {
  const Icon = record.type === "MEDICATION" ? Pill : record.type === "DOCTOR_VISIT" ? FileCheck2 : record.type === "CHECK_IN" ? Check : Heart;
  const color =
    record.type === "CHECK_IN"
      ? "bg-teal/15 text-leaf"
      : record.type === "MEDICATION"
        ? "bg-teal/10 text-teal"
        : record.type === "DOCTOR_VISIT"
          ? "bg-gold/20 text-[#8a6800]"
          : "bg-rose-50 text-rose-500";
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-white shadow-sm ${color}`}>
      <Icon size={16} strokeWidth={record.type === "CHECK_IN" ? 2.6 : 2.2} />
    </span>
  );
}
