import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { ListField, SelectField, TextField } from "../../components/public/AuthFields";
import { Brand } from "../../components/public/Brand";
import { type AppUser, buttaApi, type HealthProfileInput } from "../../services/api";
import { DEMO_PROFILE_KEY } from "../../services/demoStorage";
import { splitList } from "../../utils/text";

export function OnboardingPage({
  user,
  onBack,
  onComplete,
}: {
  user: AppUser;
  onBack: () => void;
  onComplete: (user: AppUser) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<HealthProfileInput>({
    dateOfBirth: null,
    sex: null,
    bloodGroup: null,
    allergies: [],
    existingConditions: [],
    currentMedications: [],
    emergencyContactName: null,
    emergencyContactPhone: null,
  });
  const [lists, setLists] = useState({ allergies: "", existingConditions: "", currentMedications: "" });

  async function finish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextProfile: HealthProfileInput = {
      ...profile,
      allergies: splitList(lists.allergies),
      existingConditions: splitList(lists.existingConditions),
      currentMedications: splitList(lists.currentMedications),
    };
    if (user.demo) {
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(nextProfile));
      onComplete(user);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await buttaApi.saveProfile(nextProfile);
      onComplete(user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Your profile could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="public-screen grid min-h-screen overflow-x-hidden bg-white lg:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)]">
      <section className="auth-left-section relative hidden h-screen overflow-hidden bg-teal lg:sticky lg:top-0 lg:block">
        <div className="auth-image-reveal absolute inset-0">
          <img src="/assets/butta-auth-wellness.png" alt="Calm wellness portrait" className="h-full w-full object-cover object-center" />
        </div>
        <div className="auth-overlay-nav absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[rgba(31,73,62,0.48)] p-8 backdrop-blur-[2px] xl:p-10">
          <Brand inverse />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[rgba(20,46,39,0.92)] via-[rgba(20,46,39,0.55)] to-transparent p-8 pt-24 text-white xl:p-10 xl:pt-28">
          <Sparkles size={24} />
          <p className="mt-4 text-2xl font-extrabold leading-tight">Your profile helps each record carry the right context.</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/70">You stay in control. Every field can be updated later.</p>
        </div>
      </section>

      <section className="flex min-h-screen justify-center overflow-y-auto px-5 py-6 sm:px-8 lg:items-center lg:py-10">
        <div className="public-reveal w-full max-w-3xl">
          <div className="flex items-center justify-between lg:hidden"><Brand /><span className="badge border border-teal/15 bg-teal/10 text-teal">Step {step} of 2</span></div>
          <div className="mt-8 flex items-center gap-4 lg:mt-0">
            <button onClick={step === 1 ? onBack : () => setStep(1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white text-muted" aria-label="Go back"><ArrowLeft size={18} /></button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4 text-xs font-extrabold text-muted"><span>Complete your profile</span><span>Step {step} of 2</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full bg-teal transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`} /></div>
            </div>
          </div>

          <form onSubmit={finish} className="surface-card mt-6 rounded-lg p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal/10 text-teal"><HeartPulse size={22} /></span>
              <div><h1 className="text-3xl font-extrabold leading-tight">{step === 1 ? "Tell us about you" : "Add your health context"}</h1><p className="mt-2 text-sm font-semibold leading-6 text-muted">{step === 1 ? "These basics help organize your personal health record." : "Leave anything blank that you would rather add later."}</p></div>
            </div>

            {step === 1 ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="text-sm font-extrabold">Date of birth</span><input type="date" max={new Date().toISOString().slice(0, 10)} value={profile.dateOfBirth || ""} onChange={(event) => setProfile({ ...profile, dateOfBirth: event.target.value || null })} className="field-input mt-2 h-12 w-full px-3" /></label>
                <SelectField label="Sex" value={profile.sex || ""} onChange={(value) => setProfile({ ...profile, sex: value || null })} options={["Female", "Male"]} />
                <SelectField label="Blood group" value={profile.bloodGroup || ""} onChange={(value) => setProfile({ ...profile, bloodGroup: (value || null) as HealthProfileInput["bloodGroup"] })} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
                <div className="rounded-lg border border-teal/15 bg-teal/5 p-4"><ShieldCheck className="text-teal" size={20} /><p className="mt-3 text-sm font-extrabold">Private and editable</p><p className="mt-1 text-xs font-semibold leading-5 text-muted">Only information you choose is included in your summaries.</p></div>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <ListField label="Allergies" placeholder="Peanuts, penicillin" value={lists.allergies} onChange={(value) => setLists({ ...lists, allergies: value })} />
                <ListField label="Existing conditions" placeholder="Asthma, migraine" value={lists.existingConditions} onChange={(value) => setLists({ ...lists, existingConditions: value })} />
                <ListField label="Current medications" placeholder="Medication name, dose" value={lists.currentMedications} onChange={(value) => setLists({ ...lists, currentMedications: value })} />
                <div className="grid gap-4">
                  <TextField label="Emergency contact" value={profile.emergencyContactName || ""} onChange={(value) => setProfile({ ...profile, emergencyContactName: value || null })} icon={UserRound} />
                  <TextField label="Contact phone" type="tel" value={profile.emergencyContactPhone || ""} onChange={(value) => setProfile({ ...profile, emergencyContactPhone: value || null })} icon={HeartPulse} />
                </div>
              </div>
            )}

            {error && <p role="alert" className="mt-5 rounded-lg border border-rust/20 bg-rust/10 px-4 py-3 text-sm font-bold text-rust">{error}</p>}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => onComplete(user)} className="min-h-11 px-3 text-sm font-extrabold text-muted hover:text-ink">Skip for now</button>
              {step === 1 ? (
                <button type="button" onClick={() => setStep(2)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 font-extrabold text-white shadow-lift hover:bg-tealDark">Continue <ArrowRight size={18} /></button>
              ) : (
                <button disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 font-extrabold text-white shadow-lift hover:bg-tealDark disabled:opacity-65">{loading ? "Saving profile" : "Finish setup"}<Check size={18} /></button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
