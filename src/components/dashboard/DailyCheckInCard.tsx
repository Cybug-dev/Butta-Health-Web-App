import { ArrowRight, Check, Lightbulb, Lock, Mic, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { appendDictation, useDictation } from "../../hooks/useDictation";
import type { DailyCheckIn } from "../../types";

const MIN_WORDS = 5;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function CardShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`surface-card relative flex min-h-52 flex-col overflow-hidden rounded-3xl p-5 sm:p-6 ${className}`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-100/60 blur-2xl" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function CardHeader({ icon }: { icon: ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber/20 bg-amber/10 text-amber-700">{icon}</span>
        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-faint">Today's check-in</span>
          <span className="block text-[11px] font-semibold text-teal">Daily Bio-Pulse</span>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal/20 bg-teal/5 px-2 py-0.5 text-[10px] font-bold text-tealDark">
        <Lock size={10} strokeWidth={2.5} />
        Private
      </span>
    </div>
  );
}

export function DailyCheckInCard({
  checkIn,
  loading,
  saving,
  error,
  onSubmit,
  onViewHistory,
}: {
  checkIn: DailyCheckIn | null;
  loading: boolean;
  saving: boolean;
  error: string;
  onSubmit: (notes: string) => Promise<void>;
  onViewHistory: () => void;
}) {
  const [notes, setNotes] = useState("");
  const dictation = useDictation((text) => setNotes((current) => appendDictation(current, text)));
  const wordCount = countWords(notes);
  const ready = wordCount >= MIN_WORDS;

  if (loading || !checkIn) {
    return (
      <CardShell>
        <div className="grid flex-1 place-items-center text-sm font-medium text-muted">Preparing today's check-in...</div>
      </CardShell>
    );
  }

  if (checkIn.respondedAt) {
    return (
      <CardShell>
        <CardHeader icon={<Check size={18} />} />
        <h3 className="text-sm font-bold leading-snug text-ink sm:text-base">Your response is recorded</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">It is now part of your health timeline and can be included in visit preparation.</p>
        <button type="button" onClick={onViewHistory} className="group mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-xs font-bold text-teal transition hover:text-tealDark">
          View in history <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready || saving) return;
          dictation.stop();
          void onSubmit(notes.trim());
        }}
        className="flex flex-1 flex-col"
      >
        <CardHeader icon={<Lightbulb size={18} />} />
        <h3 className="mb-3 text-sm font-bold leading-snug text-ink sm:text-base">{checkIn.promptText}</h3>
        <div className="relative">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Write a short response..."
            aria-label="Daily check-in response"
            aria-describedby="check-in-guide"
            className={`field-input block w-full resize-none p-3.5 text-xs leading-relaxed sm:p-4 sm:text-sm ${dictation.supported ? "pr-11 sm:pr-12" : ""}`}
          />
          {dictation.supported && (
            <button
              type="button"
              onClick={dictation.toggle}
              aria-label={dictation.listening ? "Stop dictation" : "Dictate with voice"}
              aria-pressed={dictation.listening}
              title={dictation.listening ? "Stop dictation" : "Dictate with voice"}
              className={`absolute bottom-3 right-3 rounded-xl p-1.5 transition-colors ${
                dictation.listening ? "bg-rose-500/10 text-rose-500 motion-safe:animate-pulse" : "text-faint hover:bg-well hover:text-teal"
              }`}
            >
              <Mic size={16} />
            </button>
          )}
        </div>
        <p id="check-in-guide" className={`mt-2 text-[11px] font-medium sm:text-xs ${ready ? "text-teal" : "text-faint"}`}>
          {dictation.listening
            ? "Listening... speak your response."
            : ready
              ? "Looks good. You can save your check-in."
              : `Write at least ${MIN_WORDS} words to save (${wordCount} of ${MIN_WORDS}).`}
        </p>
        {error && <p role="alert" className="mt-1.5 text-xs font-semibold text-rust">{error}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
            <ShieldCheck size={14} className="text-teal" />
            Auto-encrypted
          </span>
          <button
            type="submit"
            disabled={saving || !ready}
            className="rounded-xl bg-leaf px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-leaf/20 transition-all focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 enabled:hover:bg-tealDark enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-tealSoft disabled:shadow-none sm:text-sm"
          >
            {saving ? "Saving..." : "Save check-in"}
          </button>
        </div>
      </form>
    </CardShell>
  );
}
