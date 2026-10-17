import { ArrowRight, Check, ClipboardCheck, HeartPulse, Lock, Mic, Share2, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Brand } from "../../components/public/Brand";
import type { PublicScreen } from "./PublicExperience";

const STEPPER = [
  { step: "01 · Capture", label: "Voice & text", active: true },
  { step: "02 · Review", label: "You confirm" },
  { step: "03 · Share", label: "Doctor prep" },
];

const STEPS: { step: string; tag: string; title: string; body: string; footer: string; footerIcon: LucideIcon | null; icon: LucideIcon }[] = [
  {
    step: "01",
    tag: "Speech & text",
    title: "Capture naturally",
    body: "Write or speak the way you normally would. Start with one symptom, medication, or visit note.",
    footer: "No medical jargon required",
    footerIcon: null,
    icon: Mic,
  },
  {
    step: "02",
    tag: "Editable fields",
    title: "Review the structure",
    body: "Butta extracts useful details into editable fields. You confirm the wording before it becomes part of your timeline.",
    footer: "You approve it before it's saved",
    footerIcon: Check,
    icon: ClipboardCheck,
  },
  {
    step: "03",
    tag: "You choose",
    title: "Share intentionally",
    body: "Select only the records that matter for an appointment, then create a concise summary for the conversation.",
    footer: "Nothing is shared without you",
    footerIcon: Lock,
    icon: Share2,
  },
];

export function LandingPage({
  navigate,
  enterDemo,
}: {
  navigate: (screen: PublicScreen) => void;
  enterDemo: () => void;
}) {
  return (
    <main className="public-screen bg-paper">
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-b from-mist/70 via-paper to-paper lg:h-svh lg:min-h-[640px]">
        <header className="public-header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent">
          <div className="navbar-inner mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-3 px-5 sm:px-8 lg:h-[72px] lg:px-10">
            <a
              href="/"
              aria-label="Butta Health home"
              onClick={(event) => {
                event.preventDefault();
                navigate("home");
              }}
              className="min-w-0"
            >
              <Brand />
            </a>
            <nav aria-label="Account" className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => navigate("signin")} className="inline-flex items-center rounded-full px-2.5 py-2 text-sm font-semibold text-muted transition-colors hover:text-teal sm:px-4">
                Sign in
              </button>
              <button
                type="button"
                onClick={() => navigate("signup")}
                className="inline-flex items-center justify-center rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-tealDark hover:shadow active:scale-95 sm:px-5"
              >
                Get started
              </button>
            </nav>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-[1360px] flex-1 items-center gap-8 px-5 pb-6 pt-20 sm:px-8 sm:pt-20 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10 lg:px-10 lg:pb-8 lg:pt-20">
          <div className="hero-left-section max-w-[590px] lg:self-center">
            <span className="hero-copy-item inline-flex items-center gap-2 rounded-full border border-teal/15 bg-mist px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" /> Health clarity, one moment at a time
            </span>
            <p className="hero-copy-item mt-6 text-base font-bold tracking-tight text-teal lg:mt-4">Better health today.</p>
            <h1 className="hero-copy-item mt-1 text-[clamp(2.75rem,5.4vw,5rem)] font-extrabold uppercase leading-[1] tracking-tight text-ink lg:text-[clamp(2.75rem,min(5.4vw,10svh),5rem)]">
              A brighter
              <br />
              <span className="text-teal">tomorrow.</span>
            </h1>
            <p className="hero-copy-item mt-4 max-w-lg text-[15px] leading-relaxed text-muted sm:text-lg lg:mt-3">
              Track how you feel, turn everyday details into a clear health story, and arrive at every appointment prepared.
            </p>
            <div className="hero-copy-item mt-7 flex flex-col gap-3 sm:flex-row lg:mt-5">
              <button
                type="button"
                onClick={() => navigate("signup")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-semibold text-white shadow-md shadow-teal/20 transition hover:bg-tealDark active:scale-[0.99] sm:w-auto"
              >
                Start your health story <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={enterDemo}
                className="inline-flex w-full items-center justify-center rounded-full border border-line bg-white px-6 py-3 font-semibold text-ink shadow-sm transition hover:bg-field active:scale-[0.99] sm:w-auto"
              >
                Explore demo
              </button>
            </div>
            <div className="hero-copy-item mt-6 flex flex-col gap-2 text-xs font-semibold text-muted sm:flex-row sm:gap-6 lg:mt-4">
              <span className="inline-flex items-center gap-2.5">
                <Check size={15} className="text-teal" /> Private by design
              </span>
              <span className="inline-flex items-center gap-2.5">
                <Check size={15} className="text-teal" /> Choose what your doctor sees
              </span>
            </div>
          </div>

          <div className="hero-right-section relative mx-auto h-[390px] w-full max-w-[540px] sm:h-[500px] lg:h-[min(calc(100svh-9rem),760px)] lg:min-h-[460px] lg:max-w-[600px] lg:justify-self-center">
            <div className="hero-visual-frame absolute inset-y-0 left-0 w-full overflow-hidden rounded-[32px] border border-teal/10 bg-mist p-2.5 shadow-float sm:left-[14%] sm:w-[70%]">
              <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                <img
                  src="/assets/butta-hero-wellness.png"
                  alt="Woman enjoying a calm morning with a warm drink among green plants"
                  className="h-full w-full object-cover object-[73%_center] brightness-[0.97] saturate-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              </div>
            </div>

            <div className="hero-float hero-float-a absolute left-3 top-[22%] sm:left-0 flex max-w-[190px] items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md sm:max-w-[220px]">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-teal">
                <HeartPulse size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-faint">In your words</span>
                <span className="block truncate text-xs font-semibold text-ink sm:text-sm">Describe how you feel</span>
              </span>
            </div>

            <div className="hero-float hero-float-b absolute right-3 top-[9%] sm:right-0 w-[150px] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur-md sm:w-[174px] sm:p-3.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Review first</span>
                <Sparkles size={14} className="text-gold" />
              </div>
              <p className="mb-1 text-xs font-bold leading-tight text-ink sm:text-sm">You approve every detail</p>
              <p className="text-[10px] font-medium text-teal sm:text-xs">Nothing saves automatically</p>
            </div>

            <div className="hero-float hero-float-c absolute bottom-[9%] right-3 sm:right-0 w-[190px] rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur-md sm:w-[224px] sm:p-3.5">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600">
                  <ShieldCheck size={14} />
                </span>
                <span className="flex min-w-0 items-center gap-1 rounded-full border border-teal/10 bg-mist px-2 py-0.5 text-[10px] font-semibold text-teal">
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-teal" />
                  <span className="truncate">You stay in control</span>
                </span>
              </div>
              <p className="mt-2.5 truncate text-xs font-bold text-ink sm:text-sm">Share only when you choose</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">Your notes remain private by default</p>
            </div>
          </div>
        </div>
      </section>

      {/* Below the fold on desktop: visible once the visitor scrolls past the hero. */}
      <div className="hero-support relative z-10 border-y border-line bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2.5 text-center sm:gap-4">
          {STEPPER.map(({ step, label, active }) => (
            <div
              key={step}
              className={`flex flex-col items-center justify-center rounded-2xl border px-2 py-3.5 uppercase sm:px-4 sm:py-4 ${active ? "border-teal/10 bg-mist/70" : "border-line bg-field"}`}
            >
              <span className={`mb-1 whitespace-nowrap text-[10px] font-bold tracking-wider max-[339px]:text-[9px] sm:text-xs ${active ? "text-teal" : "text-faint"}`}>{step}</span>
              <span className={`text-[11px] leading-tight tracking-wide sm:text-sm ${active ? "font-semibold text-ink" : "font-medium text-muted"}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="landing-detail bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="detail-reveal mb-8 max-w-2xl lg:mb-12">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-mist px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> How Butta works
            </span>
            <h2 className="mb-3 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-4xl lg:text-5xl">From a passing thought to useful health context.</h2>
            <p className="text-sm leading-relaxed text-muted sm:text-base">Butta helps you organize what happened without inventing a diagnosis or sharing anything automatically.</p>
          </div>

          <div className="relative">
            <div className="absolute bottom-8 left-[23px] top-6 w-0.5 bg-gradient-to-b from-teal via-teal/30 to-teal/10 lg:hidden" />
            <div className="relative space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
              {STEPS.map(({ step, tag, title, body, footer, footerIcon: FooterIcon, icon: Icon }, index) => {
                const first = index === 0;
                return (
                  <article key={step} className="detail-reveal group relative pl-14 lg:pl-0">
                    <div
                      className={`absolute left-0 top-0.5 grid h-12 w-12 place-items-center rounded-2xl border-2 lg:static lg:mb-4 ${
                        first ? "border-white bg-teal text-white shadow-md shadow-teal/20" : "border-teal/20 bg-white text-teal shadow-sm transition group-hover:border-white group-hover:bg-teal group-hover:text-white group-hover:shadow-md group-hover:shadow-teal/20"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className={`h-full rounded-2xl border p-4 shadow-sm transition group-hover:shadow-md ${first ? "border-teal/15 bg-mist/50" : "border-line bg-white group-hover:border-teal/15 group-hover:bg-mist/50"}`}>
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal">{step} · Step</span>
                        <span
                          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${first ? "border border-teal/15 bg-white text-teal" : "border border-transparent bg-well text-muted transition group-hover:border-teal/15 group-hover:bg-white group-hover:text-teal"}`}
                        >
                          {tag}
                        </span>
                      </div>
                      <h3 className="mb-1.5 text-base font-bold text-ink">{title}</h3>
                      <p className="mb-3 text-sm leading-relaxed text-muted">{body}</p>
                      <div className={`flex items-center gap-2 border-t pt-2 ${first ? "border-teal/10" : "border-line transition group-hover:border-teal/10"}`}>
                        {FooterIcon ? <FooterIcon size={14} className="shrink-0 text-teal" /> : <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald" />}
                        <span className="text-[11px] font-medium text-muted">{footer}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-10 h-px w-full bg-line" />
        </div>
      </section>
    </main>
  );
}
