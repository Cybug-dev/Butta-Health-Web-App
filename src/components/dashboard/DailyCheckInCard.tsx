import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { DailyCheckIn } from "../../types";

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

  if (loading || !checkIn) {
    return <div className="surface-card grid min-h-52 place-items-center rounded-lg p-5 text-sm font-semibold text-muted">Preparing today's check-in...</div>;
  }

  if (checkIn.respondedAt) {
    return (
      <div className="surface-card flex min-h-52 flex-col justify-between rounded-lg p-5">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-teal/10 text-teal"><Check size={20} /></span>
          <p className="mt-4 text-xs font-extrabold uppercase text-muted">Today's check-in</p>
          <h2 className="mt-2 text-base font-extrabold">Your response is recorded</h2>
          <p className="mt-2 text-sm leading-6 text-muted">It is now part of your health timeline and can be included in visit preparation.</p>
        </div>
        <button type="button" onClick={onViewHistory} className="mt-4 inline-flex items-center gap-2 self-start text-sm font-extrabold text-teal">View in history <ArrowRight size={16} /></button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (notes.trim()) void onSubmit(notes.trim());
      }}
      className="surface-card flex min-h-52 flex-col rounded-lg p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-[#8a6800]"><Lightbulb size={19} /></span>
        <div>
          <p className="text-xs font-extrabold uppercase text-muted">Today's check-in</p>
          <p className="mt-1 text-sm font-extrabold leading-5">{checkIn.promptText}</p>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        maxLength={2000}
        rows={2}
        placeholder="Write a short response"
        aria-label="Daily check-in response"
        className="mt-4 min-h-16 w-full resize-none rounded-lg border border-line bg-well px-3 py-2 text-sm outline-none transition placeholder:text-faint focus:border-teal focus:bg-white"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p role={error ? "alert" : undefined} className="min-w-0 text-xs font-semibold text-rust">{error}</p>
        <button type="submit" disabled={saving || !notes.trim()} className="ml-auto min-h-10 shrink-0 rounded-lg bg-teal px-4 text-sm font-extrabold text-white transition hover:bg-tealDark disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Saving..." : "Save check-in"}
        </button>
      </div>
    </form>
  );
}
