/** Small pill that sizes to its text and wraps with its siblings (Stitch chip). */
export function Chip({ className, dot = false, children }: { className: string; dot?: boolean; children: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-px text-[10px] font-semibold leading-4 ${className}`}>
      {dot && <span className="h-1 w-1 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
