export function ProfileField({ label, value, onChange, placeholder, disabled = false, type = "text", className = "" }: { label: string; value: string; onChange?: (value: string) => void; placeholder?: string; disabled?: boolean; type?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} disabled={disabled} className="mt-2 h-12 w-full rounded-lg border border-line bg-white px-4 text-sm outline-none transition placeholder:text-faint focus:border-teal disabled:bg-well disabled:text-muted" />
    </label>
  );
}

export function SettingToggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 border-b border-line px-5 py-4 last:border-b-0 hover:bg-well/50">
      <span><span className="block text-sm font-extrabold">{label}</span><span className="mt-1 block text-xs font-semibold leading-5 text-muted">{detail}</span></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-teal" />
    </label>
  );
}

export function EditField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded border border-line bg-paper px-3 text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
      />
    </label>
  );
}
