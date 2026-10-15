import { severityStyles, statusStyles, typeLabels, typeStyles } from "../../constants/records";
import type { HealthRecord, RecordType } from "../../types";

export function TypeBadge({ type }: { type: RecordType }) {
  return (
    <span className={`badge border ${typeStyles[type]}`} title={typeLabels[type]}>
      <span className="badge-dot" />
      <span>{typeLabels[type]}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: HealthRecord["status"] }) {
  return (
    <span className={`badge border ${statusStyles[status]}`} title={status}>
      <span className="badge-dot" />
      <span>{status}</span>
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: HealthRecord["severity"] }) {
  return (
    <span className={`badge border ${severityStyles[severity]}`} title={`${severity} severity`}>
      <span>{severity}</span>
    </span>
  );
}
