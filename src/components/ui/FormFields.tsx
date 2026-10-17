export function ProfileField({ label, value, onChange, placeholder, disabled = false, type = "text", className = "" }: { label: string; value: string; onChange?: (value: string) => void; placeholder?: string; disabled?: boolean; type?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-extrabold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} disabled={disabled} className="field-input mt-2 h-12 w-full px-4 text-sm" />
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
        className="field-input mt-1 h-10 w-full px-3 text-sm"
      />
    </label>
  );
}
