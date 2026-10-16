import { useState } from "react";
import { ClinicalPanel } from "../components/capture/ClinicalPanel";
import { ExtractionPreview } from "../components/capture/ExtractionPreview";
import { ObservationComposer, type VoiceControls } from "../components/capture/ObservationComposer";
import { HeaderBand } from "../components/layout/HeaderBand";
import { presets } from "../data";
import { useAttachments } from "../hooks/useAttachments";
import type { AiConsent, ExtractedRecord, HealthRecord } from "../types";

export function LogEventPage({
  observation,
  setObservation,
  openConfirm,
  extracting,
  aiConsent,
  onEnableAiCapture,
  records,
  metrics,
  isDemo,
  voice,
  source,
}: {
  observation: string;
  setObservation: (value: string) => void;
  openConfirm: (source?: ExtractedRecord["source"], attachmentIds?: string[], symptomTags?: string[]) => void;
  extracting: boolean;
  aiConsent: AiConsent | null;
  onEnableAiCapture: () => void;
  records: HealthRecord[];
  metrics: { monitoring: number; symptoms: number; records: number };
  isDemo: boolean;
  voice: VoiceControls;
  source: ExtractedRecord["source"];
}) {
  const [dismissed, setDismissed] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const attachments = useAttachments();
  const showAiBanner = aiConsent !== null && !aiConsent.granted && !dismissed;
  const canReview = !extracting && (observation.trim().length > 0 || tags.length > 0 || attachments.attachments.length > 0);

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function review() {
    if (canReview) openConfirm(source, attachments.ids, tags);
  }

  return (
    <div className="space-y-5">
      {showAiBanner && (
        <section className="stagger-in rounded-2xl border border-teal/25 bg-mist p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-5">
          <p className="mb-3 text-xs font-medium leading-relaxed text-tealDark sm:mb-0">
            Turn on AI-assisted capture in Settings for smarter, more accurate extraction from what you type. You will always review and confirm before anything is saved.
          </p>
          <div className="flex shrink-0 items-center gap-2.5">
            <button type="button" onClick={onEnableAiCapture} className="rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white shadow-md shadow-teal/30 transition hover:bg-tealDark active:scale-95">
              Turn on
            </button>
            <button type="button" onClick={() => setDismissed(true)} className="rounded-xl border border-teal/25 bg-white px-4 py-2 text-xs font-bold text-teal transition hover:bg-white/80 active:scale-95">
              Not now
            </button>
          </div>
        </section>
      )}

      <section
        className="stagger-in relative overflow-hidden rounded-3xl bg-cover bg-center p-5 text-white shadow-xl shadow-leaf/20 sm:p-7"
        style={{ backgroundImage: "url('/assets/wellness-workspace.png')" }}
        role="img"
        aria-label="Warm desk with health journal, water, medication organizer, tablet, and smartwatch"
      >
        <div className="absolute inset-0 bg-[#173f35]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173f35]/90 via-[#173f35]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173f35]/80 via-transparent to-transparent" />
        <div className="relative z-10 lg:max-w-3xl">
          <h2 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">How are you feeling right now?</h2>
          <p className="mb-5 max-w-[95%] text-xs leading-relaxed text-mist/90 sm:text-sm">
            Type in plain language. Butta organizes the details into editable medical fields before anything is saved.
          </p>
          <ObservationComposer
            observation={observation}
            setObservation={setObservation}
            tags={tags}
            onToggleTag={toggleTag}
            symptomTagOptions={presets}
            attachments={attachments}
            allowAttachments={!isDemo}
            voice={voice}
            extracting={extracting}
            onSubmit={review}
          />
        </div>
      </section>

      <HeaderBand metrics={metrics} className="" />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
        <ClinicalPanel records={records} />
        <ExtractionPreview observation={observation} tags={tags} disabled={!canReview} onEdit={review} onConfirm={review} />
      </div>
    </div>
  );
}
