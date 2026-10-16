export const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export function formatDate(value: string, mode: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(mode === "long" ? { year: "numeric" } : {}),
  }).format(new Date(value));
}

export type DayPeriod = "morning" | "afternoon" | "evening";

export function getDayPeriod(date = new Date()): DayPeriod {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function getGreeting() {
  return `Good ${getDayPeriod()}`;
}
