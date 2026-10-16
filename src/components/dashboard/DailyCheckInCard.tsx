import { ArrowRight, Check, CheckCircle2, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { DailyCheckIn } from "../../types";

const MIN_WORDS = 5;

const cardClass = "surface-card relative flex min-h-52 flex-col overflow-hidden rounded-3xl p-5 sm:p-6";
const iconTileClass = "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-amber-200/60 bg-amber-50 text-amber-600 shadow-sm";
const labelClass = "inline-block rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700";

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
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
  const wordCount = countWords(notes);
  const ready = wordCount >= MIN_WORDS;

  if (loading || !checkIn) {
    return <div className={`${cardClass} items-center justify-center text-sm font-medium text-muted`}>Preparing today's check-in...</div>;
  }

  if (checkIn.respondedAt) {
    return (
      <div className={`${cardClass} justify-between`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-50 blur-2xl" />
        <div className="relative">
          <span className={iconTileClass}><Check size={19} /></span>
          <p className={`${labelClass} mt-4`}>Today's check-in</p>
          <h2 className="mt-1 text-sm font-bold leading-snug text-ink sm:text-base">Your response is recorded</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">It is now part of your health timeline and can be included in visit preparation.</p>
        </div>
        <button type="button" onClick={onViewHistory} className="relative mt-4 inline-flex items-center gap-1.5 self-start text-xs font-bold text-teal transition hover:text-tealDark">
          View in history <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ready && !saving) void onSubmit(notes.trim());
      }}
      className={`${cardClass} justify-between`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-50 blur-2xl" />
      <div className="relative">
        <div className="flex items-start gap-3 sm:items-center sm:gap-3.5">
          <span className={iconTileClass}><Lightbulb size={19} /></span>
          <div>
            <p className={labelClass}>Today's check-in</p>
            <p className="mt-0.5 text-sm font-bold leading-snug text-ink sm:mt-1 sm:text-lg">{checkIn.promptText}</p>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Write a short response... (e.g. headache eased after lunch, mild fatigue persisted)"
          aria-label="Daily check-in response"
          aria-describedby="check-in-guide"
          className="mt-4 w-full resize-none rounded-2xl border border-fieldLine bg-field p-3.5 text-xs font-medium leading-relaxed text-ink outline-none transition placeholder:font-normal placeholder:text-faint focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/25 sm:p-4 sm:text-sm"
        />
        <p id="check-in-guide" className={`mt-2 text-xs font-medium ${ready ? "text-teal" : "text-faint"}`}>
          {ready ? "Looks good. You can save your check-in." : `Write at least ${MIN_WORDS} words to save (${wordCount} of ${MIN_WORDS}).`}
        </p>
        {error && <p role="alert" className="mt-1.5 text-xs font-semibold text-rust">{error}</p>}
      </div>
      <div className="relative mt-3 flex items-center justify-between gap-3 sm:mt-5 sm:border-t sm:border-line sm:pt-3">
        <span className="hidden items-center gap-1.5 text-xs font-medium text-faint sm:flex">
          <CheckCircle2 size={14} className="text-teal" />
          Encrypted &amp; private
        </span>
        <button
          type="submit"
          disabled={saving || !ready}
          className="ml-auto inline-flex items-center justify-center rounded-xl bg-teal px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-tealDark/20 transition enabled:hover:bg-tealDark enabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-tealSoft disabled:shadow-none sm:px-6 sm:text-sm sm:font-semibold"
        >
          {saving ? "Saving..." : "Save check-in"}
        </button>
      </div>
    </form>
  );
}
