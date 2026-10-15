import type { ViewId } from "../types";

export const workspacePaths: Record<ViewId, string> = {
  dashboard: "/app/dashboard",
  profile: "/app/profile",
  capture: "/app/log-event",
  timeline: "/app/history",
  settings: "/app/settings",
  companion: "/app/companion",
  "doctor-prep": "/app/doctor-prep",
  "doctor-summary": "/app/doctor-summary",
};

export function isWorkspacePath(pathname = window.location.pathname) {
  return pathname === "/app" || pathname.startsWith("/app/");
}

export function viewFromPath(pathname = window.location.pathname): ViewId {
  const match = Object.entries(workspacePaths).find(([, path]) => path === pathname);
  return (match?.[0] as ViewId | undefined) || "dashboard";
}
