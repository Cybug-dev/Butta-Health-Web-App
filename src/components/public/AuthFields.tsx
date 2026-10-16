import { Mail } from "lucide-react";
import { AnimatedSelect } from "../ui/AnimatedSelect";

export function TextField({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: typeof Mail;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <span className="relative mt-2 block">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={18} />
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required={required} className="field-input h-12 w-full min-w-0 pl-11 pr-3 text-sm" placeholder={label} />
      </span>
    </label>
  );
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <AnimatedSelect label={label} value={value} onChange={onChange} options={options} placeholder={`Select ${label.toLowerCase()}`} />;
}

export function ListField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block"><span className="text-sm font-extrabold">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="field-input mt-2 w-full resize-none px-3 py-3 text-sm leading-6" placeholder={`${placeholder} (comma separated)`} /></label>
  );
}
