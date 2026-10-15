import { type FormEvent, useEffect, useState } from "react";
import { AnimatedSelect } from "../components/ui/AnimatedSelect";
import { ProfileField } from "../components/ui/FormFields";
import type { AppUser, HealthProfile, HealthProfileInput } from "../services/api";
import { profileCompletion, toProfileInput } from "../utils/profile";

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

  useEffect(() => {
    setDraft(toProfileInput(profile));
  }, [profile]);

  function updateList(key: "allergies" | "existingConditions" | "currentMedications", value: string) {
    setDraft((current) => ({ ...current, [key]: value.split(",").map((item) => item.trimStart()) }));
  }

  const sanitizedDraft = {
    ...draft,
    allergies: draft.allergies.map((item) => item.trim()).filter(Boolean),
    existingConditions: draft.existingConditions.map((item) => item.trim()).filter(Boolean),
    currentMedications: draft.currentMedications.map((item) => item.trim()).filter(Boolean),
  };
  const isDirty = JSON.stringify(sanitizedDraft) !== JSON.stringify(toProfileInput(profile));

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

  return (
    <div className="space-y-5">
      <div className="stagger-in flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold">Health profile</h1>
          <p className="mt-1 text-sm font-semibold text-muted">Keep the details that add context to your health events up to date.</p>
        </div>
        <span className="text-sm font-extrabold text-teal">{profileCompletion(user, profile)}% complete</span>
      </div>

      <form onSubmit={submit} className="surface-card stagger-in overflow-hidden rounded-lg">
        <div className="grid gap-5 border-b border-line p-5 sm:grid-cols-2 sm:p-6">
          <ProfileField label="First name" value={user.firstName} disabled />
          <ProfileField label="Last name" value={user.lastName} disabled />
          <ProfileField label="Email address" value={user.email} disabled className="sm:col-span-2" />
        </div>
        <div className="grid gap-5 border-b border-line p-5 sm:grid-cols-3 sm:p-6">
          <ProfileField label="Date of birth" type="date" value={draft.dateOfBirth || ""} onChange={(value) => setDraft({ ...draft, dateOfBirth: value || null })} />
          <AnimatedSelect
            label="Sex"
            value={draft.sex || ""}
            onChange={(value) => setDraft({ ...draft, sex: value || null })}
            options={["Female", "Male"]}
          />
          <AnimatedSelect
            label="Blood group"
            value={draft.bloodGroup || ""}
            onChange={(value) => setDraft({ ...draft, bloodGroup: (value || null) as HealthProfileInput["bloodGroup"] })}
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />
        </div>
        <div className="grid gap-5 border-b border-line p-5 sm:grid-cols-2 sm:p-6">
          <ProfileField label="Allergies" value={draft.allergies.join(", ")} placeholder="Pollen, penicillin" onChange={(value) => updateList("allergies", value)} />
          <ProfileField label="Existing conditions" value={draft.existingConditions.join(", ")} placeholder="Migraine" onChange={(value) => updateList("existingConditions", value)} />
          <ProfileField label="Current medications" value={draft.currentMedications.join(", ")} placeholder="Medication and dose" onChange={(value) => updateList("currentMedications", value)} className="sm:col-span-2" />
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <ProfileField label="Emergency contact" value={draft.emergencyContactName || ""} placeholder="Full name" onChange={(value) => setDraft({ ...draft, emergencyContactName: value || null })} />
          <ProfileField label="Emergency phone" value={draft.emergencyContactPhone || ""} placeholder="Phone number" onChange={(value) => setDraft({ ...draft, emergencyContactPhone: value || null })} />
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-line bg-well/50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <p className={`text-sm font-bold ${status === "error" ? "text-rust" : "text-muted"}`}>
            {status === "saved" ? "Profile updated." : status === "error" ? "Profile could not be updated." : "Only you can access these details."}
          </p>
          <button disabled={status === "saving" || !isDirty} className="min-h-11 rounded-lg bg-teal px-5 text-sm font-extrabold text-white shadow-lift transition hover:bg-tealDark disabled:cursor-not-allowed disabled:opacity-60">
            {status === "saving" ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
