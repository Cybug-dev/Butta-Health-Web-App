import {
  BellRing,
  Building2,
  CalendarCheck,
  ChevronRight,
  Clock,
  Download,
  Fingerprint,
  History,
  Languages,
  Lock,
  LogOut,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { HealthVaultModal } from "../components/account/HealthVaultModal";
import { ComingSoonModal, type ComingSoonFeature } from "../components/ui/ComingSoonModal";
import { type AppUser, buttaApi } from "../services/api";
import { DEMO_PREFERENCES_KEY } from "../services/demoStorage";
import type { AiConsent, NotificationPreferences } from "../types";
import { browserTimezone } from "../utils/format";

const COMING_SOON = {
  termMatching: { title: "Medical term matching", description: "Match the words you use to the terms doctors use, so your summaries read clearly to any clinic.", icon: Languages },
  suggestionLevel: { title: "Suggestion strictness", description: "Choose how sure Butta Health should be before it suggests details from your notes.", icon: SlidersHorizontal },
  appLock: { title: "Fingerprint or face lock", description: "Ask for your fingerprint or face before your health records open on this device.", icon: Fingerprint },
  careTeam: { title: "Clinics & doctors", description: "Choose which clinics and doctors can see the summaries you share with them.", icon: Building2 },
  accessHistory: { title: "Access history", description: "See when your account was signed in to and from which device.", icon: History },
  medicationReminders: { title: "Medication reminders", description: "Get a gentle nudge when it's time to take a medication from your profile.", icon: BellRing },
  export: { title: "Download your health record", description: "Download everything you've logged as one file you can keep or share with a doctor.", icon: Download },
  deleteAccount: { title: "Delete account", description: "Permanently remove your account and every record in it. We're adding a safe, confirmed way to do this.", icon: Trash2 },
} satisfies Record<string, ComingSoonFeature>;

const SUGGESTION_LEVELS = ["Relaxed", "Balanced", "Strict"] as const;

export function SettingsPage({
  user,
  onSignOut,
  onResetDemo,
  onOpenProfile,
  aiConsent,
  onSaveAiConsent,
}: {
  user: AppUser;
  onSignOut: () => void;
  onResetDemo: () => void;
  onOpenProfile: () => void;
  aiConsent: AiConsent | null;
  onSaveAiConsent: (granted: boolean) => Promise<void>;
}) {
  const [aiConsentStatus, setAiConsentStatus] = useState<"idle" | "saving" | "error">("idle");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    eventReminders: true,
    weeklySummary: true,
    dailyCheckIn: true,
    checkInTime: "09:00",
    timezone: browserTimezone,
  });
  const [preferenceStatus, setPreferenceStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [comingSoon, setComingSoon] = useState<ComingSoonFeature | null>(null);
  const [vaultOpen, setVaultOpen] = useState(false);
  const closeComingSoon = useCallback(() => setComingSoon(null), []);
  const closeVault = useCallback(() => setVaultOpen(false), []);

  useEffect(() => {
    let cancelled = false;
    if (user.demo) {
      const stored = window.localStorage.getItem(DEMO_PREFERENCES_KEY);
      if (stored) {
        try {
          setPreferences(JSON.parse(stored) as NotificationPreferences);
        } catch {
          window.localStorage.removeItem(DEMO_PREFERENCES_KEY);
        }
      }
      setPreferenceStatus("idle");
      return;
    }

    buttaApi.getNotificationPreferences()
      .then(({ preferences: saved }) => {
        if (!cancelled) {
          setPreferences(saved);
          setPreferenceStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) setPreferenceStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function savePreferences(next: NotificationPreferences) {
    setPreferences(next);
    setPreferenceStatus("saving");
    try {
      if (user.demo) {
        window.localStorage.setItem(DEMO_PREFERENCES_KEY, JSON.stringify(next));
      } else {
        const { preferences: saved } = await buttaApi.saveNotificationPreferences(next);
        setPreferences(saved);
      }
      setPreferenceStatus("saved");
    } catch {
      setPreferenceStatus("error");
    }
  }

  async function toggleAi(checked: boolean) {
    setAiConsentStatus("saving");
    try {
      await onSaveAiConsent(checked);
      setAiConsentStatus("idle");
    } catch {
      setAiConsentStatus("error");
    }
  }

  const aiOn = aiConsent?.granted ?? false;
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  const preferenceNote =
    preferenceStatus === "loading" ? "Loading..." : preferenceStatus === "saving" ? "Saving..." : preferenceStatus === "saved" ? "Saved" : preferenceStatus === "error" ? "Couldn't save" : undefined;

  return (
    <div className="space-y-5">
      <div className="stagger-in">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-leaf">
          <ShieldCheck size={12} /> Preferences &amp; vault
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">Manage your privacy, smart note help, reminders and your account.</p>
      </div>

      <button type="button" onClick={onOpenProfile} className="surface-card stagger-in flex w-full items-center gap-3 rounded-3xl p-4 text-left transition hover:shadow-float sm:p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-leaf text-lg font-extrabold text-white ring-4 ring-mist">{initials}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate text-base font-extrabold text-ink">
              {user.firstName} {user.lastName}
            </span>
            {user.demo && <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf">Demo</span>}
          </span>
          <span className="block truncate text-sm text-muted">{user.email}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> View and edit your health profile
          </span>
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-well text-muted">
          <ChevronRight size={18} />
        </span>
      </button>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <SettingsSection
          icon={Sparkles}
          title="Smart note help"
          subtitle="Turns what you write or say into tidy health entries"
          aside={<StatusPill on={aiOn} note={aiConsentStatus === "saving" ? "Saving..." : aiConsentStatus === "error" ? "Couldn't save" : undefined} />}
        >
          <SettingRow
            icon={Wand2}
            title="Organize my notes automatically"
            detail="When on, what you write is sent to our note helper to pick out symptoms, how bad they were and when. You always check it before anything is saved. Off unless you turn it on."
            control={<Switch checked={aiOn} onChange={(checked) => void toggleAi(checked)} label="Organize my notes automatically" disabled={aiConsentStatus === "saving"} />}
          />
          <SettingRow icon={Languages} title="Medical term matching" detail="Match your everyday words to the terms doctors use." soon onClick={() => setComingSoon(COMING_SOON.termMatching)} />
          <div className="rounded-2xl bg-field p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-ink">How sure before suggesting</span>
              <SoonTag />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">Only suggest details from your notes when Butta Health is confident about them.</p>
            <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-white p-1 ring-1 ring-line">
              {SUGGESTION_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setComingSoon(COMING_SOON.suggestionLevel)}
                  className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${level === "Balanced" ? "bg-mist text-leaf" : "text-muted hover:text-ink"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={Lock} title="Privacy & security" subtitle="Who can see your health records">
          <SettingRow icon={ShieldCheck} title="How your data is protected" detail="See the ways we keep your records private and safe." onClick={() => setVaultOpen(true)} />
          <SettingRow icon={Fingerprint} title="Fingerprint or face lock" detail="Ask for your fingerprint or face before records open." soon onClick={() => setComingSoon(COMING_SOON.appLock)} />
          <SettingRow icon={Building2} title="Clinics & doctors" detail="Choose who can see the summaries you share." soon onClick={() => setComingSoon(COMING_SOON.careTeam)} />
          <SettingRow icon={History} title="Access history" detail="See when and where your account was used." soon onClick={() => setComingSoon(COMING_SOON.accessHistory)} />
        </SettingsSection>

        <SettingsSection icon={BellRing} title="Reminders" subtitle="Gentle nudges, never noisy" aside={preferenceNote && <span className={`text-xs font-bold ${preferenceStatus === "error" ? "text-rust" : "text-muted"}`}>{preferenceNote}</span>}>
          <SettingRow
            icon={CalendarCheck}
            title="Daily check-in"
            detail="A short morning reminder to note how you're feeling."
            control={
              <span className="flex items-center gap-2">
                <input
                  type="time"
                  aria-label="Check-in time"
                  value={preferences.checkInTime}
                  disabled={!preferences.dailyCheckIn || preferenceStatus === "loading"}
                  onChange={(event) => setPreferences({ ...preferences, checkInTime: event.target.value })}
                  onBlur={() => void savePreferences(preferences)}
                  className="field-input h-8 w-[6.5rem] rounded-xl px-2 text-xs font-bold text-teal disabled:opacity-60"
                />
                <Switch checked={preferences.dailyCheckIn} onChange={(checked) => void savePreferences({ ...preferences, dailyCheckIn: checked })} label="Daily check-in" />
              </span>
            }
          />
          <SettingRow
            icon={Clock}
            title="Follow-up reminders"
            detail="A reminder when a logged event could use more detail."
            control={<Switch checked={preferences.eventReminders} onChange={(checked) => void savePreferences({ ...preferences, eventReminders: checked })} label="Follow-up reminders" />}
          />
          <SettingRow
            icon={Sparkles}
            title="Weekly summary"
            detail="A short recap of your week's health notes."
            control={<Switch checked={preferences.weeklySummary} onChange={(checked) => void savePreferences({ ...preferences, weeklySummary: checked })} label="Weekly summary" />}
          />
          <SettingRow icon={BellRing} title="Medication reminders" detail="A nudge when it's time to take a medication." soon onClick={() => setComingSoon(COMING_SOON.medicationReminders)} />
          <p className="px-1 text-xs text-faint">Times use your timezone: {preferences.timezone}.</p>
        </SettingsSection>

        <SettingsSection icon={Download} title="Your data" subtitle="Take your records with you">
          <SettingRow icon={Download} title="Download your health record" detail="Everything you've logged, in one file." soon onClick={() => setComingSoon(COMING_SOON.export)} />
          {user.demo && (
            <SettingRow
              icon={RotateCcw}
              title="Reset demo"
              detail="Remove the sample profile and events stored in this browser, then sign out."
              control={
                <button type="button" onClick={onResetDemo} className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-muted transition hover:text-ink">
                  Reset
                </button>
              }
            />
          )}
        </SettingsSection>
      </div>

      <div className="stagger-in mx-auto flex max-w-md flex-col items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onSignOut}
          className="surface-card flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-teal transition hover:shadow-float"
        >
          <LogOut size={17} /> Sign out
        </button>
        <button type="button" onClick={() => setComingSoon(COMING_SOON.deleteAccount)} className="text-xs font-semibold text-rust hover:underline">
          Delete account
        </button>
      </div>

      <ComingSoonModal feature={comingSoon} onClose={closeComingSoon} />
      {vaultOpen && <HealthVaultModal onClose={closeVault} />}
    </div>
  );
}

function SettingsSection({ icon: Icon, title, subtitle, aside, children }: { icon: LucideIcon; title: string; subtitle: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="surface-card stagger-in space-y-3 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pb-1">
        <span className="flex min-w-[12rem] flex-1 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-teal">
            <Icon size={18} />
          </span>
          <span className="min-w-0">
            <h2 className="text-base font-extrabold leading-tight text-ink">{title}</h2>
            <p className="text-xs text-muted">{subtitle}</p>
          </span>
        </span>
        {aside}
      </div>
      {children}
    </section>
  );
}

function SettingRow({
  icon: Icon,
  title,
  detail,
  control,
  soon = false,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  control?: ReactNode;
  soon?: boolean;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-teal shadow-sm">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-bold text-ink">{title}</span>
          {soon && <SoonTag />}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{detail}</span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl bg-field p-3.5 text-left transition hover:bg-mist">
        {body}
        <ChevronRight size={18} className="shrink-0 text-faint" />
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-field p-3.5">
      <span className="flex min-w-[12rem] flex-1 items-center gap-3">{body}</span>
      <span className="ml-auto shrink-0">{control}</span>
    </div>
  );
}

function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${checked ? "bg-leaf" : "bg-barIdle"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function StatusPill({ on, note }: { on: boolean; note?: string }) {
  if (note) return <span className="text-xs font-bold text-muted">{note}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${on ? "bg-mist text-leaf" : "bg-well text-muted"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-teal" : "bg-faint"}`} /> {on ? "On" : "Off"}
    </span>
  );
}

function SoonTag() {
  return <span className="rounded-full bg-amber-50 px-1.5 py-px text-[9px] font-extrabold uppercase tracking-wider text-amber-700">Soon</span>;
}
