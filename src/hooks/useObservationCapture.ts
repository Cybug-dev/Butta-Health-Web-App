import { useState } from "react";
import { buttaApi, type AppUser } from "../services/api";
import { mockBackend, parseObservation } from "../services/mockApi";
import type { AiSafetyMetadata, ExtractedRecord, HealthRecord } from "../types";

type UseObservationCaptureOptions = {
  user: AppUser;
  addRecord: (record: HealthRecord) => void;
  reload: () => void;
  onSaved: () => void;
};

/** Owns the log-event flow: draft text, extraction (AI or deterministic), the confirmation gate, and saving. */
export function useObservationCapture({ user, addRecord, reload, onSaved }: UseObservationCaptureOptions) {
  const [observation, setObservation] = useState(
    "I've had a slight headache since yesterday evening, and I felt a bit dizzy when standing up this morning.",
  );
  const [inputMode, setInputMode] = useState<"Typed" | "Voice" | "Preset">("Typed");
  const [extracted, setExtracted] = useState<ExtractedRecord | null>(null);
  const [extractionSafety, setExtractionSafety] = useState<AiSafetyMetadata | null>(null);
  const [educationalContext, setEducationalContext] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pendingAttachmentIds, setPendingAttachmentIds] = useState<string[]>([]);

  async function openConfirm(
    source: ExtractedRecord["source"] = inputMode,
    attachmentIds: string[] = [],
    symptomTags: string[] = [],
  ) {
    if (!observation.trim()) return;
    setInputMode(source);
    setExtractionSafety(null);
    setEducationalContext([]);
    setPendingAttachmentIds(attachmentIds);

    if (user.demo) {
      setExtracted(parseObservation(observation, source, symptomTags));
      return;
    }

    setExtracting(true);
    try {
      const { draft, safety, educationalContext: context } = await buttaApi.extractHealthEvent({
        observation, source, symptomTags,
      });
      setExtracted(draft);
      setExtractionSafety(safety);
      setEducationalContext(context);
    } catch {
      // AI extraction is unavailable, refused, or timed out; the deterministic
      // parser keeps capture working and never loses the user's original text.
      setExtracted(parseObservation(observation, source, symptomTags));
    } finally {
      setExtracting(false);
    }
  }

  function closeConfirm() {
    setExtracted(null);
    setExtractionSafety(null);
    setEducationalContext([]);
  }

  /** Pre-fills the composer from a quick-log shortcut. */
  function startQuickLog(preset: string) {
    setObservation(preset);
    setInputMode("Preset");
  }

  async function saveRecord() {
    if (!extracted) return;
    setSaving(true);
    setSaveError("");
    try {
      const record = user.demo
        ? await mockBackend.createRecord(extracted)
        : (await buttaApi.createHealthEvent(extracted)).healthEvent;
      if (!user.demo && pendingAttachmentIds.length) {
        await buttaApi.attachToHealthEvent(record.id, pendingAttachmentIds);
      }
      addRecord(record);
      setObservation("");
      setExtracted(null);
      setPendingAttachmentIds([]);
      if (!user.demo) reload();
      onSaved();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Your health event could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return {
    observation,
    setObservation,
    extracted,
    setExtracted,
    extractionSafety,
    educationalContext,
    extracting,
    saving,
    saveError,
    openConfirm,
    closeConfirm,
    startQuickLog,
    saveRecord,
  };
}
