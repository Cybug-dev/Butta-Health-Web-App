import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { TextField } from "../../components/public/AuthFields";
import { Brand } from "../../components/public/Brand";
import { ApiError, type AppUser, buttaApi } from "../../services/api";
import type { AuthMode, PublicScreen } from "./PublicExperience";

export function AuthPage({
  mode,
  navigate,
  enterDemo,
  notice,
  onAuthenticated,
}: {
  mode: AuthMode;
  navigate: (screen: PublicScreen) => void;
  enterDemo: () => void;
  notice?: string;
  onAuthenticated: (user: AppUser, isNew: boolean) => void;
}) {
  const isSignUp = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isSignUp && form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (isSignUp && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = isSignUp
        ? await buttaApi.register({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          })
        : await buttaApi.login({ email: form.email, password: form.password });
      onAuthenticated(result.user, isSignUp);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "We could not complete that request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="public-screen grid min-h-screen overflow-x-hidden bg-white lg:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)]">
        <section className="auth-left-section relative hidden h-screen overflow-hidden bg-teal lg:sticky lg:top-0 lg:block">
          <div className="auth-image-reveal absolute inset-0">
            <img src="/assets/butta-auth-wellness.png" alt="Woman pausing for a calm moment among green plants" className="h-full w-full object-cover object-center" />
          </div>
          <div className="auth-overlay-nav absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[rgba(31,73,62,0.48)] p-8 backdrop-blur-[2px] xl:p-10">
            <Brand inverse />
            <button onClick={() => navigate("home")} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25" aria-label="Back to home">
              <ArrowLeft size={20} />
            </button>
          </div>
        </section>

        <section className="auth-right-section flex min-h-screen min-w-0 items-center justify-center bg-paper px-5 py-8 sm:px-8 lg:px-10 xl:px-16">
          <div className="w-full max-w-[480px]">
          <div className="auth-header mb-8 flex items-center justify-between lg:hidden">
            <Brand />
            <button onClick={() => navigate("home")} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-muted" aria-label="Back to home"><ArrowLeft size={18} /></button>
          </div>
          <div className="surface-card rounded-lg p-5 sm:p-8">
            <div className="auth-form-content grid grid-cols-2 rounded-lg bg-well p-1">
              <button onClick={() => navigate("signin")} className={`min-h-10 rounded-md text-sm font-extrabold transition ${!isSignUp ? "bg-white text-teal shadow-sm" : "text-muted"}`}>Sign in</button>
              <button onClick={() => navigate("signup")} className={`min-h-10 rounded-md text-sm font-extrabold transition ${isSignUp ? "bg-white text-teal shadow-sm" : "text-muted"}`}>Create account</button>
            </div>

            <div className="auth-form-content mt-7">
              <span className="badge border border-teal/15 bg-teal/10 text-teal"><span className="badge-dot" /><span>{isSignUp ? "Begin your health story" : "Welcome back"}</span></span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight">{isSignUp ? "Create your account" : "Sign in to Butta Health"}</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">{isSignUp ? "A few details, then we will personalize your profile." : "Continue building a clear record of how you feel."}</p>
            </div>

            {notice && (
              <div role="status" className="auth-form-content mt-5 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-bold leading-5 text-[#8a6800]">
                {notice}
              </div>
            )}

            <form onSubmit={submit} className="auth-form-content mt-7 space-y-4">
              {isSignUp && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="First name" value={form.firstName} onChange={(value) => setForm({ ...form, firstName: value })} icon={UserRound} autoComplete="given-name" required />
                  <TextField label="Last name" value={form.lastName} onChange={(value) => setForm({ ...form, lastName: value })} icon={UserRound} autoComplete="family-name" required />
                </div>
              )}
              <TextField label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} icon={Mail} autoComplete="email" required />
              <div className="block">
                <label htmlFor="auth-password" className="text-sm font-extrabold text-ink">Password</label>
                <span className="relative mt-2 block">
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={18} />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    className="field-input h-12 w-full pl-11 pr-12 text-sm"
                    placeholder={isSignUp ? "8 characters minimum" : "Enter your password"}
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-muted transition hover:bg-well hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </div>

              {isSignUp && (
                <div className="block">
                  <label htmlFor="auth-confirm-password" className="text-sm font-extrabold text-ink">Confirm password</label>
                  <span className="relative mt-2 block">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" size={18} />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                      autoComplete="new-password"
                      required
                      className="field-input h-12 w-full pl-11 pr-4 text-sm"
                      placeholder="Re-enter your password"
                    />
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="inline-flex cursor-pointer items-center gap-2 font-bold text-muted">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-teal" />
                  Remember me
                </label>
                {!isSignUp && <button type="button" className="font-extrabold text-teal hover:text-tealDark">Forgot password?</button>}
              </div>

              {error && (
                <div role="alert" className="rounded-lg border border-rust/20 bg-rust/10 px-4 py-3 text-sm font-bold leading-5 text-rust">
                  {error}
                  {error.includes("not available") && <button type="button" onClick={enterDemo} className="mt-2 block font-extrabold underline underline-offset-2">Continue with the demo profile</button>}
                </div>
              )}

              <button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal px-5 font-extrabold text-white shadow-lift transition hover:bg-tealDark disabled:cursor-wait disabled:opacity-65">
                {loading ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-form-content my-6 flex items-center gap-3 text-xs font-bold text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
            <button onClick={enterDemo} className="auth-form-content min-h-11 w-full rounded-lg border border-line bg-white text-sm font-extrabold text-muted transition hover:border-teal/30 hover:text-teal">Explore the prototype without an account</button>
          </div>

          <p className="auth-form-content mt-5 text-center text-xs font-semibold leading-5 text-faint">By continuing, you agree to Butta Health's terms and privacy notice.</p>
          </div>
      </section>
    </main>
  );
}
