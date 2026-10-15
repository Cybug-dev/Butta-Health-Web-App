import { AlertTriangle, ShieldCheck } from "lucide-react";
import { companionTips } from "../data";
import type { HealthRecord } from "../types";

export function CompanionPage({ records }: { records: HealthRecord[] }) {
  const latest = records[0];
  return (
    <div className="space-y-5">
      <section className="surface-card stagger-in rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded bg-rust/10 text-rust">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">Non-diagnostic support</p>
            <h2 className="mt-2 font-serif text-4xl">Health companion</h2>
            <p className="mt-2 max-w-3xl text-muted">
              This surface gives general relief practices and monitoring prompts. It does not diagnose, prescribe, or replace a clinician.
            </p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {companionTips.map((tip) => (
          <div key={tip.title} className="surface-card stagger-in rounded-lg p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald/10 text-emerald">
              <ShieldCheck size={21} />
            </span>
            <h3 className="mt-4 font-serif text-2xl">{tip.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{tip.body}</p>
          </div>
        ))}
      </section>
      <section className="surface-card stagger-in rounded-lg p-5">
        <h3 className="font-serif text-3xl">Guided self-check</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            "When did the symptom start, and has it changed since then?",
            "Is there a clear trigger such as standing, food, exertion, medication, sleep, or stress?",
            "What helped, what did not help, and how long did relief last?",
            "Are there new or worsening symptoms that should be raised with a clinician promptly?",
          ].map((question) => (
            <label key={question} className="soft-card flex items-start gap-3 rounded-lg p-3 text-sm leading-6 text-muted transition hover:border-teal/30">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-teal" />
              {question}
            </label>
          ))}
        </div>
        {latest && (
          <div className="mt-5 rounded border border-gold/30 bg-gold/10 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#725900]">Based on latest record</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Latest entry is "{latest.title}". Track change, recurrence, and response to supportive care for the next doctor review.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
