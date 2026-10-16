import { Leaf } from "lucide-react";

export function BrandBlock() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal to-leaf text-white shadow-md shadow-leaf/20">
          <Leaf size={20} fill="currentColor" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-lg font-extrabold leading-5 text-ink">Butta Health</p>
          <p className="mt-1 text-xs font-semibold text-muted">Your health. Your story.</p>
        </div>
      </div>
    </div>
  );
}
