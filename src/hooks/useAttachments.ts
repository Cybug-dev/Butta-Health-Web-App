import { useEffect, useRef, useState } from "react";
import type { LocalAttachment } from "../components/capture/AttachmentGallery";
import { ApiError, buttaApi } from "../services/api";

const MAX_ATTACHMENTS = 6;

export function useAttachments() {
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const attachmentsRef = useRef(attachments);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => () => attachmentsRef.current.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl)), []);

  async function addFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    const accepted = files.slice(0, Math.max(0, MAX_ATTACHMENTS - attachments.length));
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

  function remove(id: string) {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.id !== id);
    });
  }

  return {
    attachments,
    uploading,
    uploadError,
    full: attachments.length >= MAX_ATTACHMENTS,
    ids: attachments.map((attachment) => attachment.id),
    addFiles,
    remove,
  };
}

export type AttachmentsState = ReturnType<typeof useAttachments>;
