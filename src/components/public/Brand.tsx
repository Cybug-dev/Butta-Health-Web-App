import { Leaf } from "lucide-react";

/** Same brand design as the dashboard header: compact on mobile, larger sidebar-style from lg. */
export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-md lg:h-11 lg:w-11 lg:rounded-2xl ${
          inverse ? "bg-white/15 text-white shadow-none" : "bg-leaf text-white shadow-leaf/20 lg:bg-gradient-to-br lg:from-teal lg:to-leaf"
        }`}
      >
        <Leaf className="h-[18px] w-[18px] lg:h-5 lg:w-5" fill="currentColor" strokeWidth={1.5} />
      </span>
      <span className="min-w-0">
        <span className={`block truncate text-sm font-extrabold leading-none tracking-tight lg:text-lg lg:leading-5 ${inverse ? "text-white" : "text-ink"}`}>Butta Health</span>
        <span className={`mt-0.5 block truncate text-[10px] font-semibold tracking-wide lg:mt-1 lg:text-xs ${inverse ? "text-white/70" : "text-muted"}`}>Your health. Your story.</span>
      </span>
    </div>
  );
}
