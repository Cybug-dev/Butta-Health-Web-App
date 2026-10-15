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

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
