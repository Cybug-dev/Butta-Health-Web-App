import { useMemo, useState } from "react";
import type { HealthRecord, RecordType } from "../types";

export function useRecordFilters(records: HealthRecord[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RecordType | "ALL">("ALL");
  const [watchOnly, setWatchOnly] = useState(false);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesType = filter === "ALL" || record.type === filter;
      const matchesWatch = !watchOnly || record.status === "Needs monitoring";
      const matchesSearch =
        !term ||
        [record.title, record.notes, record.treatment, ...record.symptoms].some((value) =>
          value.toLowerCase().includes(term),
        );
      return matchesType && matchesWatch && matchesSearch;
    });
  }, [filter, records, search, watchOnly]);

  return { search, setSearch, filter, setFilter, watchOnly, setWatchOnly, filteredRecords };
}
