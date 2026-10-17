import {
  BadgeCheck,
  Brain,
  Camera,
  ChevronRight,
  CircleCheck,
  Contact,
  Download,
  Droplet,
  IdCard,
  Info,
  Leaf,
  Lightbulb,
  Lock,
  Mail,
  Pencil,
  PhoneCall,
  Pill,
  Plus,
  ShieldCheck,
  Siren,
  Stethoscope,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import { HealthVaultModal } from "../components/account/HealthVaultModal";
import { AnimatedSelect } from "../components/ui/AnimatedSelect";
import { ComingSoonModal, type ComingSoonFeature } from "../components/ui/ComingSoonModal";
import type { AppUser, HealthProfile, HealthProfileInput } from "../services/api";
import { toProfileInput } from "../utils/profile";

type ListKey = "allergies" | "existingConditions" | "currentMedications";

const COMING_SOON = {
  avatar: { title: "Profile photo", description: "Upload a photo so your care team can recognise you at a glance.", icon: Camera },
  quickAdd: { title: "Quick add from your health log", description: "Pull allergies, conditions and medications straight from logged events, and add vaccinations, surgeries and lab results.", icon: Stethoscope },
  relationship: { title: "Contact relationship", description: "Record how your emergency contact is related to you, and add more than one care contact.", icon: Users },
  export: { title: "Export summary (PDF)", description: "Download a clean, shareable summary of your health profile for appointments.", icon: Download },
} satisfies Record<string, ComingSoonFeature>;

function cleanList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function missingDetails(user: AppUser, draft: HealthProfileInput) {
  const checks: [string, unknown][] = [
    ["First name", user.firstName],
    ["Last name", user.lastName],
    ["Email address", user.email],
    ["Date of birth", draft.dateOfBirth],
    ["Biological sex", draft.sex],
    ["Blood group", draft.bloodGroup],
    ["Allergies", cleanList(draft.allergies).length],
    ["Existing conditions", cleanList(draft.existingConditions).length],
    ["Current medications", cleanList(draft.currentMedications).length],
    ["Emergency contact", draft.emergencyContactName],
    ["Emergency phone number", draft.emergencyContactPhone],
  ];
  const missing = checks.filter(([, value]) => !value).map(([label]) => label);
  return { missing, percent: Math.round(((checks.length - missing.length) / checks.length) * 100) };
}

export function ProfilePage({
  user,
  profile,
  onSave,
}: {
  user: AppUser;
  profile: HealthProfile | null;
  onSave: (profile: HealthProfileInput) => Promise<void>;
}) {
  const [draft, setDraft] = useState<HealthProfileInput>(toProfileInput(profile));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [comingSoon, setComingSoon] = useState<ComingSoonFeature | null>(null);
  const [vaultOpen, setVaultOpen] = useState(false);
  const closeComingSoon = useCallback(() => setComingSoon(null), []);
  const closeVault = useCallback(() => setVaultOpen(false), []);

  useEffect(() => {
    setDraft(toProfileInput(profile));
  }, [profile]);

  const sanitizedDraft = {
    ...draft,
    allergies: cleanList(draft.allergies),
    existingConditions: cleanList(draft.existingConditions),
    currentMedications: cleanList(draft.currentMedications),
  };
  const isDirty = JSON.stringify(sanitizedDraft) !== JSON.stringify(toProfileInput(profile));
  const { missing, percent } = missingDetails(user, draft);
  const emergencyMissing = [draft.emergencyContactName, draft.emergencyContactPhone].filter((value) => !value).length;
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  const memberId = `#BH-${user.id.replace(/[^a-z0-9]/gi, "").slice(0, 5).toUpperCase()}`;

  function update(patch: Partial<HealthProfileInput>) {
    setDraft((current) => ({ ...current, ...patch }));
    setStatus("idle");
  }

  function setList(key: ListKey, items: string[]) {
    update({ [key]: items });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDirty) return;
    setStatus("saving");
    try {
      await onSave(sanitizedDraft);
      setDraft(sanitizedDraft);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function discard() {
    setDraft(toProfileInput(profile));
    setStatus("idle");
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2.2fr)] lg:grid-rows-[auto_1fr] lg:gap-6 lg:[grid-template-areas:'side_main''foot_main']"
    >
      {/* Identity + completion */}
      <div className="space-y-5 lg:[grid-area:side]">
        <section className="surface-card stagger-in relative flex flex-col items-center overflow-hidden rounded-3xl p-6 text-center">
          <div className="pointer-events-none absolute -top-12 left-1/2 h-20 w-48 -translate-x-1/2 rounded-full bg-glow/25 blur-2xl" />
          <div className="relative mb-3 mt-1">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-well p-1 shadow-sm">
              <span className="grid h-full w-full place-items-center rounded-full bg-leaf text-2xl font-extrabold text-white">{initials}</span>
            </div>
            <button
              type="button"
              onClick={() => setComingSoon(COMING_SOON.avatar)}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-teal text-white shadow-lift transition active:scale-90"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="relative flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink">
              {user.firstName} {user.lastName}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-bold text-leaf">
              <BadgeCheck size={13} /> {user.demo ? "Demo account" : "Account holder"}
            </span>
          </div>
          <div className="relative mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span className="font-bold tracking-wider text-teal">ID: {memberId}</span>
            {user.createdAt && (
              <>
                <span className="h-1 w-1 rounded-full bg-fieldLine" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setComingSoon(COMING_SOON.avatar)}
            className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-well px-4 py-2 text-xs font-bold text-teal transition hover:bg-mist active:scale-95"
          >
            <Pencil size={14} /> Change avatar
          </button>
        </section>

        <section className="surface-card stagger-in rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-mist text-leaf">
                <CircleCheck size={16} />
              </span>
              <span className="text-sm font-extrabold text-ink">Profile completion</span>
            </span>
            <span className="text-sm font-extrabold text-teal">{percent}%</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-track">
            <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-full rounded-full bg-teal transition-all duration-700 ease-out" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Info size={16} className="mt-0.5 shrink-0 text-teal" />
            {missing.length === 0 ? (
              <span>Your profile is complete. Keep it up to date so your records stay reliable.</span>
            ) : (
              <span>
                Keep your details up to date to provide reliable context for emergency care.{" "}
                <strong className="font-bold text-ink">
                  {missing.length} detail{missing.length > 1 ? "s" : ""} remaining:
                </strong>{" "}
                {missing.join(", ")}.
              </span>
            )}
          </p>
        </section>
      </div>

      {/* Editable sections */}
      <div className="min-w-0 space-y-5 lg:[grid-area:main]">
        <ProfileSection icon={IdCard} title="Personal information" aside={<span className="rounded-full bg-well px-2 py-0.5 text-[11px] font-bold text-teal">Core</span>}>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <IconField label="First name" icon={User} className="flex-[1_1_13rem]">
              <input value={user.firstName} disabled className="field-input h-12 w-full pl-3.5 pr-10 text-sm" />
            </IconField>
            <IconField label="Last name" icon={User} className="flex-[1_1_13rem]">
              <input value={user.lastName} disabled className="field-input h-12 w-full pl-3.5 pr-10 text-sm" />
            </IconField>
            <IconField label="Email address" icon={Mail} className="flex-[2_1_18rem]">
              <input value={user.email} disabled className="field-input h-12 w-full pl-3.5 pr-10 text-sm" />
            </IconField>
            <FieldLabel label="Date of birth" className="flex-[1_1_12rem]">
              <input type="date" value={draft.dateOfBirth || ""} onChange={(event) => update({ dateOfBirth: event.target.value || null })} className="field-input h-12 w-full px-3.5 text-sm" />
            </FieldLabel>
            <FieldLabel label="Biological sex" className="flex-[1_1_12rem]">
              <AnimatedSelect value={draft.sex || ""} onChange={(value) => update({ sex: value || null })} options={["Female", "Male"]} className="[&>button]:mt-0 [&>button]:rounded-2xl" />
            </FieldLabel>
            <FieldLabel label="Blood group" className="flex-[1_1_14rem]">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-rose-50 text-rose-500">
                  <Droplet size={13} fill="currentColor" />
                </span>
                <AnimatedSelect
                  value={draft.bloodGroup || ""}
                  onChange={(value) => update({ bloodGroup: (value || null) as HealthProfileInput["bloodGroup"] })}
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  className="[&>button]:mt-0 [&>button]:rounded-2xl [&>button]:pl-12"
                />
              </div>
            </FieldLabel>
          </div>
        </ProfileSection>

        <ProfileSection
          icon={Stethoscope}
          title="Clinical context"
          tag="Health log"
          subtitle="Keep your allergies, medical conditions and medications updated for tailored care and emergency readiness."
          aside={
            <button
              type="button"
              onClick={() => setComingSoon(COMING_SOON.quickAdd)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-tealDark active:scale-95"
            >
              <Plus size={14} /> Quick add
            </button>
          }
        >
          <div className="grid gap-3 xl:grid-cols-2">
            <ClinicalCategory icon={Leaf} title="Documented allergies" count={`${cleanList(draft.allergies).length} active`}>
              <ChipList addLabel="Add allergy" dot="bg-teal" items={draft.allergies} onChange={(items) => setList("allergies", items)} />
            </ClinicalCategory>
            <ClinicalCategory icon={Brain} title="Existing conditions" count={`${cleanList(draft.existingConditions).length} diagnosed`}>
              <ChipList addLabel="Add condition" dot="bg-leaf" items={draft.existingConditions} onChange={(items) => setList("existingConditions", items)} />
            </ClinicalCategory>
            <ClinicalCategory icon={Pill} title="Current medications" count={`${cleanList(draft.currentMedications).length} active Rx`} className="xl:col-span-2">
              <MedicationList items={draft.currentMedications} onChange={(items) => setList("currentMedications", items)} />
            </ClinicalCategory>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <Lightbulb size={16} className="shrink-0 text-teal" />
            Missing something? Add newly prescribed medications or seasonal allergies to any category above.
          </p>
        </ProfileSection>

        <ProfileSection
          icon={Siren}
          title="Emergency & care contacts"
          subtitle="Who should be reached first if something happens."
          aside={
            emergencyMissing > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal/30 bg-mist px-2.5 py-1 text-[11px] font-bold text-teal">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Action needed
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-leaf">Complete</span>
            )
          }
        >
          <div className="flex flex-wrap gap-3.5">
            <IconField label="Emergency contact" icon={Contact} className="flex-[1_1_15rem]">
              <input value={draft.emergencyContactName || ""} onChange={(event) => update({ emergencyContactName: event.target.value || null })} placeholder="Full name" className="field-input h-12 w-full pl-3.5 pr-10 text-sm" />
            </IconField>
            <FieldLabel label="Relationship" className="flex-[1_1_15rem]">
              <button
                type="button"
                onClick={() => setComingSoon(COMING_SOON.relationship)}
                className="field-input flex h-12 w-full items-center justify-between px-3.5 text-left text-sm text-faint"
              >
                Add relationship
                <span className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Soon</span>
                  <Users size={18} className="text-teal" />
                </span>
              </button>
            </FieldLabel>
            <FieldLabel
              label="Emergency phone number"
              className="flex-[1_1_18rem]"
              aside={
                !draft.emergencyContactPhone && (
                  <span className="flex items-center gap-1.5 rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-teal">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Required for 100% completion
                  </span>
                )
              }
            >
              <div className="relative">
                <input
                  type="tel"
                  value={draft.emergencyContactPhone || ""}
                  onChange={(event) => update({ emergencyContactPhone: event.target.value || null })}
                  placeholder="Add phone number"
                  className={`field-input h-12 w-full pl-3.5 pr-10 text-sm ${draft.emergencyContactPhone ? "" : "border-teal/30"}`}
                />
                <PhoneCall size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-teal" />
              </div>
            </FieldLabel>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={16} className="shrink-0 text-teal" />
            Stored privately in your profile and only used as emergency context.
          </p>
        </ProfileSection>
      </div>

      {/* Vault notice + actions */}
      <div className="space-y-5 lg:[grid-area:foot] lg:self-start">
        <button
          type="button"
          onClick={() => setVaultOpen(true)}
          className="group flex w-full items-start gap-3 rounded-2xl bg-well p-4 text-left transition hover:bg-mist active:scale-[0.99]"
        >
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-leaf transition group-hover:bg-white">
            <Lock size={17} />
          </span>
          <span className="min-w-0 flex-1 space-y-1">
            <span className="block text-sm font-bold text-ink">Private health vault</span>
            <span className="block text-xs leading-relaxed text-muted">Only you can access these profile details. Everything is stored encrypted and tied to your account.</span>
            <span className="inline-flex items-center gap-1 pt-0.5 text-xs font-bold text-teal">
              How we protect it <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
            </span>
          </span>
        </button>

        <div className="space-y-3">
          <button
            disabled={status === "saving" || !isDirty}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal text-sm font-extrabold text-white shadow-lift transition enabled:hover:bg-tealDark enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CircleCheck size={18} />
            {status === "saving" ? "Saving..." : status === "saved" && !isDirty ? "Profile updated" : "Save profile changes"}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setComingSoon(COMING_SOON.export)} className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-well px-2 text-xs font-bold text-teal transition hover:bg-mist active:scale-95">
              <Download size={16} /> Export (PDF)
            </button>
            <button type="button" onClick={discard} disabled={!isDirty} className="flex h-11 items-center justify-center rounded-2xl border border-line bg-white px-2 text-xs font-bold text-muted shadow-sm transition enabled:hover:text-ink enabled:active:scale-95 disabled:opacity-50">
              Discard changes
            </button>
          </div>
          {status === "error" && (
            <p role="alert" className="text-center text-xs font-semibold text-rust">
              Profile could not be updated.
            </p>
          )}
        </div>
      </div>

      <ComingSoonModal feature={comingSoon} onClose={closeComingSoon} />
      {vaultOpen && <HealthVaultModal onClose={closeVault} />}
    </form>
  );
}

function ProfileSection({
  icon: Icon,
  title,
  tag,
  subtitle,
  aside,
  className = "",
  children,
}: {
  icon: LucideIcon;
  title: string;
  tag?: string;
  subtitle?: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`surface-card stagger-in space-y-4 rounded-3xl p-5 sm:p-6 ${className}`}>
      <div className={subtitle ? "space-y-2 border-b border-line pb-4" : undefined}>
        {/* Title row wraps the aside below once the title needs the room. */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="flex min-w-[12rem] flex-1 items-center gap-3">
            <span className={`grid shrink-0 place-items-center rounded-full ${subtitle ? "h-9 w-9 bg-mist text-teal" : "h-8 w-8 bg-well text-leaf"}`}>
              <Icon size={17} />
            </span>
            <span className="flex min-w-0 flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold leading-tight text-ink">{title}</h2>
              {tag && <span className="rounded-full bg-well px-2 py-0.5 text-[11px] font-bold text-teal">{tag}</span>}
            </span>
          </span>
          {aside}
        </div>
        {subtitle && <p className="text-xs leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ label, aside, className = "", children }: { label: string; aside?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted">{label}</span>
        {aside}
      </span>
      {children}
    </div>
  );
}

function IconField({ label, icon: Icon, className = "", children }: { label: string; icon: LucideIcon; className?: string; children: ReactNode }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-bold text-muted">{label}</span>
      <span className="relative">
        {children}
        <Icon size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-faint" />
      </span>
    </label>
  );
}

function ClinicalCategory({ icon: Icon, title, count, className = "", children }: { icon: LucideIcon; title: string; count: string; className?: string; children: ReactNode }) {
  return (
    <div className={`space-y-2.5 rounded-2xl bg-field p-3.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-teal">
            <Icon size={13} />
          </span>
          <span className="text-sm font-bold text-ink">{title}</span>
        </span>
        <span className="shrink-0 rounded-full bg-well px-2 py-0.5 text-[11px] font-semibold text-teal">{count}</span>
      </div>
      {children}
    </div>
  );
}

/** "Type then Enter" add control shared by chips and medications. */
function InlineAdd({ label, onAdd, full = false }: { label: string; onAdd: (value: string) => void; full?: boolean }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  function commit() {
    if (value.trim()) onAdd(value.trim());
    setValue("");
    setAdding(false);
  }

  if (adding) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          } else if (event.key === "Escape") {
            setValue("");
            setAdding(false);
          }
        }}
        placeholder={label}
        aria-label={label}
        className={`field-input h-9 rounded-xl px-3 text-xs ${full ? "w-full" : "w-44"}`}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setAdding(true)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-teal/40 px-3 text-xs font-bold text-teal transition hover:bg-mist active:scale-95 ${full ? "w-full py-2" : "py-1.5"}`}
    >
      <Plus size={14} /> {label}
    </button>
  );
}

function ChipList({ addLabel, dot, items, onChange }: { addLabel: string; dot: string; items: string[]; onChange: (items: string[]) => void }) {
  const chips = cleanList(items);

  function add(next: string) {
    if (!chips.some((item) => item.toLowerCase() === next.toLowerCase())) onChange([...chips, next]);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((item) => (
        <span key={item} className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-ink shadow-sm">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="font-semibold">{item}</span>
          <button type="button" onClick={() => onChange(chips.filter((chip) => chip !== item))} aria-label={`Remove ${item}`} className="grid h-5 w-5 place-items-center rounded-full text-faint transition hover:text-rose-500">
            <X size={12} />
          </button>
        </span>
      ))}
      <InlineAdd label={addLabel} onAdd={add} />
    </div>
  );
}

function MedicationList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const medications = cleanList(items);
  const [editing, setEditing] = useState<number | null>(null);
  const [value, setValue] = useState("");

  function startEdit(index: number) {
    setEditing(index);
    setValue(medications[index] ?? "");
  }

  function saveEdit() {
    if (editing === null) return;
    const next = value.trim();
    onChange(next ? medications.map((item, index) => (index === editing ? next : item)) : medications.filter((_, index) => index !== editing));
    setEditing(null);
  }

  return (
    <div className="space-y-2.5">
      {medications.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
          {medications.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-white p-3 shadow-sm">
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-teal">
                  <Pill size={15} />
                </span>
                {editing === index ? (
                  <input
                    autoFocus
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        saveEdit();
                      } else if (event.key === "Escape") setEditing(null);
                    }}
                    aria-label="Edit medication"
                    className="field-input h-9 w-full min-w-0 rounded-xl px-3 text-sm"
                  />
                ) : (
                  <span className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-bold text-ink">{item}</span>
                    <span className="rounded bg-mist px-1.5 py-0.5 text-[11px] font-semibold text-leaf">Active</span>
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center">
                <button type="button" onClick={() => startEdit(index)} aria-label={`Edit ${item}`} className="grid h-8 w-8 place-items-center rounded-full text-faint transition hover:text-teal">
                  <Pencil size={15} />
                </button>
                <button type="button" onClick={() => onChange(medications.filter((_, i) => i !== index))} aria-label={`Remove ${item}`} className="grid h-8 w-8 place-items-center rounded-full text-faint transition hover:text-rose-500">
                  <X size={15} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      <InlineAdd label="Add new medication" full onAdd={(next) => onChange([...medications, next])} />
    </div>
  );
}
