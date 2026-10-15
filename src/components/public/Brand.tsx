import { Leaf } from "lucide-react";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${inverse ? "text-white" : "text-ink"}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-lg ${inverse ? "bg-white/15" : "bg-teal text-white shadow-lift"}`}>
        <Leaf size={22} fill="currentColor" strokeWidth={1.5} />
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-5 sm:text-xl">Butta Health</span>
        <span className={`mt-1 hidden text-xs font-semibold sm:block ${inverse ? "text-white/70" : "text-muted"}`}>Your health. Your story.</span>
      </span>
    </div>
  );
}
