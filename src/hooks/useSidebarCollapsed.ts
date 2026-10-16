import { useEffect, useState } from "react";

const STORAGE_KEY = "butta.sidebarCollapsed";

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // Storage can be blocked (private mode); the sidebar still works for this visit.
    }
  }, [collapsed]);

  return [collapsed, setCollapsed] as const;
}
