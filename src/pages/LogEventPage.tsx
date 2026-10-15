import { useState } from "react";
import { ClinicalPanel } from "../components/capture/ClinicalPanel";
import { ExtractionPreview } from "../components/capture/ExtractionPreview";
import { ObservationComposer } from "../components/capture/ObservationComposer";
import { presets } from "../data";
import type { AiConsent, ExtractedRecord, HealthRecord } from "../types";

export function LogEventPage({
  observation,
  setObservation,
  openConfirm,
  extracting,
  aiConsent,
  onEnableAiCapture,
  records,
  isDemo,
}: {
  observation: string;
  setObservation: (value: string) => void;
  openConfirm: (source?: ExtractedRecord["source"], attachmentIds?: string[], symptomTags?: string[]) => void;
  extracting: boolean;
  aiConsent: AiConsent | null;
  onEnableAiCapture: () => void;
  records: HealthRecord[];
  isDemo: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const showAiBanner = aiConsent !== null && !aiConsent.granted && !dismissed;

  return (
    <div className="space-y-5">
      {showAiBanner && (
        <div className="stagger-in flex flex-col items-start justify-between gap-3 rounded-lg border border-teal/25 bg-teal/5 p-4 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold leading-6 text-tealDark">
            Turn on AI-assisted capture in Settings for smarter, more accurate extraction from what you type. You will always review and confirm before anything is saved.
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={onEnableAiCapture} className="min-h-10 rounded-lg bg-teal px-4 text-sm font-extrabold text-white transition hover:bg-tealDark">
              Turn on
            </button>
            <button type="button" onClick={() => setDismissed(true)} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-extrabold text-muted transition hover:bg-well">
              Not now
            </button>
          </div>
        </div>
      )}
      <section
        className="stagger-in relative flex min-h-[420px] w-full flex-col overflow-hidden rounded-lg bg-cover bg-center p-5 sm:p-7"
        style={{ backgroundImage: "url('/assets/wellness-workspace.png')" }}
        role="img"
        aria-label="Warm desk with health journal, water, medication organizer, tablet, and smartwatch"
      >
        <div className="absolute inset-0 bg-[#173f35]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173f35]/90 via-[#173f35]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173f35]/80 via-transparent to-transparent" />
        <div className="relative min-w-0 max-w-2xl">
          <h2 className="max-w-full break-words font-serif text-3xl leading-[1.12] text-white sm:text-4xl">
            How are you feeling right now?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
            Type in plain language. Butta organizes the details into editable medical fields before anything is saved.
          </p>
        </div>

        <div className="relative mt-auto flex w-full justify-center pt-8">
          <div className="w-full max-w-xl">
            <ObservationComposer
              observation={observation}
              setObservation={setObservation}
              extracting={extracting}
              onSubmit={(attachmentIds, symptomTags) => void openConfirm("Typed", attachmentIds, symptomTags)}
              allowAttachments={!isDemo}
              symptomTagOptions={presets}
            />
          </div>
        </div>
      </section>

      <section className="stagger-in grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <ClinicalPanel records={records} />
        <ExtractionPreview observation={observation} />
      </section>
    </div>
  );
}
