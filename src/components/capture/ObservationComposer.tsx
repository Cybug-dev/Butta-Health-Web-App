import { ArrowRight, ImagePlus, Mic, Plus, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { AttachmentsState } from "../../hooks/useAttachments";
import { AttachmentGalleryModal, AttachmentThumb, type LocalAttachment } from "./AttachmentGallery";
import { TagPickerPortal } from "./TagPicker";

export type VoiceControls = {
  supported: boolean;
  listening: boolean;
  capturing: boolean;
  toggle: () => void;
};

const WAVE_DURATIONS = ["0.9s", "1.3s", "0.7s", "1.1s", "0.8s"];

export function ObservationComposer({
  observation,
  setObservation,
  tags,
  onToggleTag,
  symptomTagOptions,
  attachments,
  allowAttachments,
  voice,
  extracting,
  onSubmit,
}: {
  observation: string;
  setObservation: (value: string) => void;
  tags: string[];
  onToggleTag: (tag: string) => void;
  symptomTagOptions: string[];
  attachments: AttachmentsState;
  allowAttachments: boolean;
  voice: VoiceControls;
  extracting: boolean;
  onSubmit: () => void;
}) {
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<{ attachment: LocalAttachment; rect: DOMRect } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tagsButtonRef = useRef<HTMLButtonElement | null>(null);

  const hasText = observation.trim().length > 0;
  const hasContent = hasText || attachments.attachments.length > 0 || tags.length > 0;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(72, Math.min(el.scrollHeight, 220))}px`;
  }, [observation]);

  const status = extracting ? "Analyzing" : hasText ? "Ready to parse" : "Waiting for input";

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        onChange={(event) => {
          void attachments.addFiles(event.target.files);
          event.target.value = "";
        }}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="space-y-3 rounded-2xl border border-white/20 bg-black/30 p-4 shadow-inner backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-mist/90">Natural language transcript</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-mist">
            <span className={`h-1.5 w-1.5 rounded-full ${extracting ? "bg-gold motion-safe:animate-pulse" : hasText ? "bg-glow" : "bg-white/40"}`} />
            {status}
          </span>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            rows={3}
            aria-label="Describe how you feel"
            placeholder="Describe sensations, onset, severity, timing, medications, or context."
            className={`block w-full resize-none border-0 bg-transparent p-0 text-sm font-medium leading-relaxed tracking-tight text-white outline-none placeholder:font-normal placeholder:text-white/50 focus:outline-none focus:ring-0 sm:text-base ${voice.supported ? "pr-10" : ""}`}
          />
          {voice.supported && (
            <button
              type="button"
              onClick={voice.toggle}
              aria-label={voice.listening ? "Stop voice input" : "Speak your observation"}
              aria-pressed={voice.listening}
              title={voice.listening ? "Stop voice input" : "Speak your observation"}
              className={`absolute bottom-0 right-0 rounded-xl p-1.5 transition-colors ${
                voice.listening ? "bg-rose-500/20 text-rose-200" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Mic size={16} />
            </button>
          )}
        </div>

        {(attachments.attachments.length > 0 || tags.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 py-1 pl-3 pr-1.5 text-xs font-semibold text-white">
                {tag}
                <button
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className="grid h-4 w-4 place-items-center rounded-full text-white/70 hover:bg-white/20 hover:text-white"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {attachments.attachments.map((attachment) => (
              <AttachmentThumb
                key={attachment.id}
                attachment={attachment}
                onRemove={() => attachments.remove(attachment.id)}
                onOpen={(rect) => setActivePreview({ attachment, rect })}
                registerRef={() => undefined}
              />
            ))}
          </div>
        )}

        {attachments.uploadError && <p role="alert" className="text-xs font-semibold text-rose-200">{attachments.uploadError}</p>}

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
          <div className="flex min-w-0 items-center gap-1.5" aria-live="polite">
            {voice.listening && (
              <>
                <span className="flex h-5 items-center gap-1 px-1" aria-hidden="true">
                  {WAVE_DURATIONS.map((duration, index) => (
                    <span
                      key={duration + index}
                      className={`h-1 w-1 rounded-full ${index % 2 ? "bg-glow" : "bg-glow/80"} ${voice.capturing ? "waveform-bar" : ""}`}
                      style={voice.capturing ? { animationDuration: duration } : undefined}
                    />
                  ))}
                </span>
                <span className="truncate text-[11px] font-semibold tracking-wide text-mist">
                  {voice.capturing ? "Listening..." : "Waiting for microphone..."}
                </span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {allowAttachments && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.uploading || attachments.full}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white/80 transition hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImagePlus size={13} />
                {attachments.uploading ? "Uploading" : "Photo"}
              </button>
            )}
            {symptomTagOptions.length > 0 && (
              <button
                ref={tagsButtonRef}
                type="button"
                onClick={() => setTagPickerOpen((open) => !open)}
                className={`inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] font-semibold transition active:scale-95 ${
                  tagPickerOpen ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white"
                }`}
              >
                <Plus size={13} />
                Tags
              </button>
            )}
            {tagPickerOpen && (
              <TagPickerPortal
                anchorRef={tagsButtonRef}
                options={symptomTagOptions}
                selected={tags}
                onToggle={onToggleTag}
                onClose={() => setTagPickerOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={extracting || !hasContent}
          className="group inline-flex items-center gap-2 rounded-2xl border border-glow/30 bg-tealDark px-5 py-3 text-xs font-bold tracking-tight text-white shadow-lg shadow-black/20 transition-all enabled:hover:bg-leaf enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {extracting ? "Analyzing" : "Log Observation"}
          <ArrowRight size={16} strokeWidth={2.5} className="text-mist transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {activePreview && (
        <AttachmentGalleryModal attachment={activePreview.attachment} originRect={activePreview.rect} onClose={() => setActivePreview(null)} />
      )}
    </div>
  );
}
