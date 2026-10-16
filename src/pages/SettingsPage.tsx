import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { SettingToggle } from "../components/ui/FormFields";
import { type AppUser, buttaApi } from "../services/api";
import { DEMO_PREFERENCES_KEY } from "../services/demoStorage";
import type { AiConsent, NotificationPreferences } from "../types";
import { browserTimezone } from "../utils/format";

export function SettingsPage({
  user,
  onSignOut,
  onResetDemo,
  aiConsent,
  onSaveAiConsent,
}: {
  user: AppUser;
  onSignOut: () => void;
  onResetDemo: () => void;
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

  return (
    <div className="space-y-5">
      <div className="stagger-in">
        <span className="badge border border-line bg-white text-muted"><span>Account preferences</span></span>
        <h1 className="mt-3 text-3xl font-extrabold">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-muted">Manage reminders, summaries, and account access.</p>
      </div>
      <section className="surface-card stagger-in overflow-hidden rounded-lg">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-base font-extrabold">Notifications</h2>
          <span className={`text-xs font-bold ${preferenceStatus === "error" ? "text-rust" : "text-muted"}`}>
            {preferenceStatus === "loading" ? "Loading..." : preferenceStatus === "saving" ? "Saving..." : preferenceStatus === "saved" ? "Saved" : preferenceStatus === "error" ? "Could not save" : ""}
          </span>
        </div>
        <SettingToggle label="Event reminders" detail="Receive a reminder when an event needs follow-up context." checked={preferences.eventReminders} onChange={(checked) => void savePreferences({ ...preferences, eventReminders: checked })} />
        <SettingToggle label="Daily check-in reminder" detail="Schedule a reminder for your short daily reflection." checked={preferences.dailyCheckIn} onChange={(checked) => void savePreferences({ ...preferences, dailyCheckIn: checked })} />
        <SettingToggle label="Weekly health summary" detail="Receive a concise weekly recap of your recorded events." checked={preferences.weeklySummary} onChange={(checked) => void savePreferences({ ...preferences, weeklySummary: checked })} />
        <label className="flex items-center justify-between gap-5 px-5 py-4">
          <span>
            <span className="block text-sm font-extrabold">Check-in time</span>
            <span className="mt-1 block text-xs font-semibold leading-5 text-muted">Uses {preferences.timezone}.</span>
          </span>
          <input
            type="time"
            value={preferences.checkInTime}
            disabled={!preferences.dailyCheckIn || preferenceStatus === "loading"}
            onChange={(event) => setPreferences({ ...preferences, checkInTime: event.target.value })}
            onBlur={() => void savePreferences(preferences)}
            className="field-input h-10 px-3 text-sm"
          />
        </label>
      </section>
      <section className="surface-card stagger-in overflow-hidden rounded-lg">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-base font-extrabold">AI-assisted capture</h2>
          <span className={`text-xs font-bold ${aiConsentStatus === "error" ? "text-rust" : "text-muted"}`}>
            {aiConsentStatus === "saving" ? "Saving..." : aiConsentStatus === "error" ? "Could not save" : ""}
          </span>
        </div>
        <SettingToggle
          label="Use AI to organize observations"
          detail="Sends what you type to a locally hosted model to draft structured fields. You always review and confirm before anything is saved. Off by default; you can turn this off anytime."
          checked={aiConsent?.granted ?? false}
          onChange={async (checked) => {
            setAiConsentStatus("saving");
            try {
              await onSaveAiConsent(checked);
              setAiConsentStatus("idle");
            } catch {
              setAiConsentStatus("error");
            }
          }}
        />
      </section>
      {user.demo && (
        <section className="surface-card stagger-in overflow-hidden rounded-lg">
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-extrabold">Reset demo workspace</p>
              <p className="mt-1 text-xs font-semibold text-muted">Remove only the synthetic demo profile and health events stored in this browser.</p>
            </div>
            <button type="button" onClick={onResetDemo} className="min-h-11 rounded-lg border border-line px-4 text-sm font-extrabold text-muted transition hover:bg-well hover:text-ink">Reset demo</button>
          </div>
        </section>
      )}
      <section className="surface-card stagger-in overflow-hidden rounded-lg">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{user.email}</p>
            <p className="mt-1 text-xs font-semibold text-muted">Signed in as {user.firstName} {user.lastName}</p>
          </div>
          <button type="button" onClick={onSignOut} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rust/25 px-4 text-sm font-extrabold text-rust transition hover:bg-rust/5"><LogOut size={17} />Sign out</button>
        </div>
      </section>
    </div>
  );
}
