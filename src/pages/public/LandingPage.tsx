import {
  ArrowRight,
  Check,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Brand } from "../../components/public/Brand";
import type { PublicScreen } from "./PublicExperience";

export function LandingPage({
  navigate,
  enterDemo,
}: {
  navigate: (screen: PublicScreen) => void;
  enterDemo: () => void;
}) {
  return (
    <main className="public-screen bg-[#f4f7f6]">
      <section className="relative min-h-screen overflow-hidden">
        <header className="public-header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent">
          <div className="navbar-inner mx-auto flex h-20 max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <Brand />
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => navigate("signin")} className="rounded-lg px-3 py-2.5 text-sm font-extrabold text-teal transition hover:bg-well sm:px-4">
                Sign in
              </button>
              <button onClick={() => navigate("signup")} className="rounded-lg bg-teal px-4 py-2.5 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-tealDark sm:px-5">
                Get started
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-[1360px] items-center gap-10 px-5 pb-10 pt-28 sm:px-8 md:pt-32 lg:min-h-[730px] lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,1.05fr)] lg:px-10 lg:pb-16 lg:pt-28">
          <div className="hero-left-section max-w-[590px] lg:pb-8">
            <span className="hero-copy-item badge border border-teal/15 bg-white/70 text-teal shadow-sm">
              <span className="badge-dot" />
              <span>Health clarity, one moment at a time</span>
            </span>
            <p className="hero-copy-item mt-7 text-sm font-extrabold text-teal">Better health today.</p>
            <h1 className="hero-copy-item mt-2 text-[clamp(2.75rem,5.4vw,5rem)] font-extrabold leading-[1] text-ink">
              A brighter<br /><span className="text-teal">tomorrow.</span>
            </h1>
            <p className="hero-copy-item mt-6 max-w-lg text-lg font-medium leading-8 text-muted sm:text-xl">
              Track how you feel, turn everyday details into a clear health story, and arrive at every appointment prepared.
            </p>
            <div className="hero-copy-item mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate("signup")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 font-extrabold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-tealDark">
                Start your health story <ArrowRight size={18} />
              </button>
              <button onClick={enterDemo} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-teal/20 bg-white/75 px-6 font-extrabold text-teal shadow-sm transition hover:bg-white">
                Explore demo
              </button>
            </div>
            <div className="hero-copy-item mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-muted">
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-teal" /> Private by design</span>
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-teal" /> Choose what your doctor sees</span>
            </div>
          </div>

          <div className="hero-right-section relative mx-auto h-[390px] w-full max-w-[540px] sm:h-[500px] lg:h-[540px]">
            <div className="hero-visual-frame absolute bottom-5 left-[12%] top-5 w-[72%] overflow-hidden rounded-lg bg-[#dcebe4] shadow-float sm:left-[14%] sm:w-[70%]">
              <img
                src="/assets/butta-hero-wellness.png"
                alt="Woman enjoying a calm morning with a warm drink among green plants"
                className="h-full w-full object-cover object-[73%_center]"
              />
            </div>

            <div className="hero-float hero-float-a surface-card absolute left-0 top-[22%] flex max-w-[190px] items-center gap-3 rounded-lg px-3 py-2.5 sm:max-w-[220px] sm:px-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal/10 text-teal"><HeartPulse size={18} /></span>
              <span className="min-w-0"><span className="block text-[10px] font-extrabold text-faint">IN YOUR WORDS</span><span className="block truncate text-sm font-extrabold text-ink">Describe how you feel</span></span>
            </div>

            <div className="hero-float hero-float-b surface-card absolute right-0 top-[9%] w-[150px] rounded-lg p-3.5 sm:w-[174px] sm:p-4">
              <div className="flex items-center justify-between"><span className="text-[10px] font-extrabold text-faint">REVIEW FIRST</span><Sparkles size={16} className="text-gold" /></div>
              <p className="mt-3 text-base font-extrabold leading-5 text-ink">You approve every detail</p>
              <p className="mt-2 text-xs font-bold leading-4 text-teal">Nothing saves automatically</p>
            </div>

            <div className="hero-float hero-float-c surface-card absolute bottom-[9%] right-0 w-[190px] rounded-lg p-3.5 sm:w-[224px] sm:p-4">
              <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-amber/10 text-amber"><ShieldCheck size={16} /></span><span className="badge border border-emerald/15 bg-emerald/10 text-emerald"><span className="badge-dot" /><span>You stay in control</span></span></div>
              <p className="mt-3 truncate text-sm font-extrabold text-ink">Share only when you choose</p>
              <p className="mt-1 text-xs font-semibold text-muted">Your notes remain private by default</p>
            </div>
          </div>
        </div>

        <div className="hero-support relative z-10 border-y border-line bg-white/85 backdrop-blur">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-line px-4 sm:px-8 lg:px-0">
            {[
              ["01", "Capture naturally"],
              ["02", "See the pattern"],
              ["03", "Choose what to share"],
            ].map(([step, label]) => (
              <div key={step} className="min-w-0 px-3 py-4 text-center sm:px-6 sm:py-5">
                <span className="block text-[10px] font-extrabold text-teal">{step}</span>
                <span className="mt-1 block truncate text-xs font-bold text-ink sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="landing-detail min-h-[72vh] bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1160px]">
          <div className="detail-reveal max-w-2xl">
            <p className="text-sm font-extrabold text-teal">How Butta works</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-5xl">From a passing thought to useful health context.</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-muted">Butta helps you organize what happened without inventing a diagnosis or sharing anything automatically.</p>
          </div>
          <div className="mt-14 grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
            {[
              ["01", "Capture naturally", "Write or speak the way you normally would. Start with one symptom, medication, or visit note."],
              ["02", "Review the structure", "Butta extracts useful details into editable fields. You confirm the wording before it becomes part of your timeline."],
              ["03", "Share intentionally", "Select only the records that matter for an appointment, then create a concise summary for the conversation."],
            ].map(([step, title, body]) => (
              <article key={step} className="detail-reveal px-1 py-8 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0">
                <span className="text-xs font-extrabold text-teal">{step}</span>
                <h3 className="mt-4 text-xl font-extrabold text-ink">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
