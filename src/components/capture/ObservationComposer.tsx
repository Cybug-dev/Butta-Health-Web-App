import gsap from "gsap";
import { ArrowRight, ImagePlus, Plus, X } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ApiError, buttaApi } from "../../services/api";
import { AttachmentGalleryModal, AttachmentThumb, type LocalAttachment } from "./AttachmentGallery";
import { TagPickerPortal } from "./TagPicker";

export function ObservationComposer({
  observation,
  setObservation,
  onSubmit,
  extracting,
  allowAttachments,
  symptomTagOptions,
}: {
  observation: string;
  setObservation: (value: string) => void;
  onSubmit: (attachmentIds: string[], symptomTags: string[]) => void;
  extracting: boolean;
  allowAttachments: boolean;
  symptomTagOptions: string[];
}) {
  const [expanded, setExpanded] = useState(observation.trim().length > 0);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [activePreview, setActivePreview] = useState<{ attachment: LocalAttachment; rect: DOMRect } | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const fileChooserOpenRef = useRef(false);
  const tagsButtonRef = useRef<HTMLButtonElement | null>(null);

  const hasContent = observation.trim().length > 0 || attachments.length > 0 || selectedTags.length > 0;

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const context = gsap.context(() => {
      gsap.to(cardRef.current, {
        maxHeight: expanded ? 320 : 56,
        duration: 0.45,
        ease: "back.out(1.1)",
      });
    }, cardRef);
    return () => context.revert();
  }, [expanded]);

  useEffect(() => {
    if (expanded && textareaRef.current) {
      const timer = setTimeout(() => textareaRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(28, Math.min(el.scrollHeight, 160))}px`;
  }, [observation, expanded]);

  useEffect(() => {
    function onWindowFocus() {
      // The file chooser dialog is a native OS window; the page only regains
      // focus once it's dismissed (file picked or cancelled either way), so
      // this is the reliable signal to stop treating the composer as "mid
      // interaction" for the textarea's blur-based collapse below.
      fileChooserOpenRef.current = false;
    }
    window.addEventListener("focus", onWindowFocus);
    return () => window.removeEventListener("focus", onWindowFocus);
  }, []);

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function collapseIfEmpty() {
    if (!hasContent && !fileChooserOpenRef.current) setExpanded(false);
  }

  function openFileChooser() {
    fileChooserOpenRef.current = true;
    fileInputRef.current?.click();
  }

  async function handleFilesChosen(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    event.target.value = "";
    if (files.length === 0) return;

    const room = Math.max(0, 6 - attachments.length);
    const accepted = files.slice(0, room);
    if (accepted.length === 0) return;

    setUploading(true);
    setUploadError("");
    try {
      const { attachments: uploaded } = await buttaApi.uploadAttachments(accepted);
      const withPreviews: LocalAttachment[] = uploaded.map((attachment, index) => ({
        ...attachment,
        previewUrl: URL.createObjectURL(accepted[index]!),
        file: accepted[index]!,
      }));
      setAttachments((current) => [...current, ...withPreviews]);
    } catch (error) {
      setUploadError(error instanceof ApiError ? error.message : "Your images could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.id !== id);
    });
    thumbRefs.current.delete(id);
  }

  function handleSubmit() {
    if (!hasContent || extracting) return;
    onSubmit(attachments.map((attachment) => attachment.id), selectedTags);
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function onTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape" && !hasContent) {
      setExpanded(false);
      textareaRef.current?.blur();
    }
  }

  return (
    <div ref={rootRef} className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        onChange={(event) => void handleFilesChosen(event)}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        onMouseDown={(event) => {
          if (event.target !== textareaRef.current && expanded) {
            textareaRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (rootRef.current?.contains(event.relatedTarget as Node)) return;
          collapseIfEmpty();
        }}
        style={{ maxHeight: expanded ? 420 : 56, overflow: "hidden" }}
        className={`group min-w-0 rounded-[28px] border border-white/30 bg-white/20 p-4 shadow-float backdrop-blur-xl transition-colors duration-200 ${
          expanded ? "cursor-text" : "cursor-pointer"
        } focus-within:border-white/50 focus-within:bg-white/25 focus-within:ring-4 focus-within:ring-white/10`}
      >
        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex h-6 w-full items-center text-left text-sm font-medium text-white/70 outline-none"
          >
            Describe sensations, onset, severity, timing, medications, or context.
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Natural language transcript</span>
              <span
                className={`badge border backdrop-blur-sm transition-colors duration-200 ${
                  extracting
                    ? "border-gold/40 bg-gold/20 text-gold"
                    : "border-white/30 bg-white/10 text-white/80"
                }`}
              >
                <span className={`badge-dot ${extracting ? "animate-pulse" : ""}`} />
                <span>{extracting ? "Analyzing" : "Ready to parse"}</span>
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              onKeyDown={onTextareaKeyDown}
              rows={1}
              style={{ outline: "none", boxShadow: "none" }}
              className="w-full resize-none overflow-hidden border-0 bg-transparent text-base leading-7 text-white outline-none ring-0 placeholder:text-white/50 focus:outline-none focus:ring-0"
              placeholder="Describe sensations, onset, severity, timing, medications, or context."
            />

            {(attachments.length > 0 || selectedTags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 py-1.5 pl-3 pr-2 text-xs font-semibold text-white"
                  >
                    {tag}
                    <span
                      role="button"
                      tabIndex={0}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => toggleTag(tag)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleTag(tag);
                        }
                      }}
                      className="grid h-4 w-4 cursor-pointer place-items-center rounded-full text-white/70 hover:bg-white/20 hover:text-white"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X size={10} />
                    </span>
                  </span>
                ))}
                {attachments.map((attachment) => (
                  <AttachmentThumb
                    key={attachment.id}
                    attachment={attachment}
                    onRemove={() => removeAttachment(attachment.id)}
                    onOpen={(rect) => setActivePreview({ attachment, rect })}
                    registerRef={(el) => thumbRefs.current.set(attachment.id, el)}
                  />
                ))}
              </div>
            )}

            {uploadError && (
              <p role="alert" className="text-xs font-semibold text-rust">{uploadError}</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {symptomTagOptions.length > 0 && (
                  <button
                    ref={tagsButtonRef}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setTagPickerOpen((open) => !open)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 hover:bg-white/15 hover:text-white ${
                      tagPickerOpen ? "bg-white/15 text-white" : "text-white/70"
                    }`}
                  >
                    <Plus size={15} />
                    Tags
                  </button>
                )}
                {allowAttachments && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={openFileChooser}
                    disabled={uploading || attachments.length >= 6}
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ImagePlus size={15} />
                    {uploading ? "Uploading" : "Add photo"}
                  </button>
                )}

                {tagPickerOpen && (
                  <TagPickerPortal
                    anchorRef={tagsButtonRef}
                    options={symptomTagOptions}
                    selected={selectedTags}
                    onToggle={toggleTag}
                    onClose={() => setTagPickerOpen(false)}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={extracting || !hasContent}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-teal px-6 py-2.5 font-semibold text-paper transition-all duration-200 hover:bg-tealDark hover:shadow-lift disabled:cursor-wait disabled:opacity-70"
              >
                {extracting ? "Analyzing" : "Log Observation"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {activePreview && (
        <AttachmentGalleryModal
          attachment={activePreview.attachment}
          originRect={activePreview.rect}
          onClose={() => setActivePreview(null)}
        />
      )}
    </div>
  );
}
