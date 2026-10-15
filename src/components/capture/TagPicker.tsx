import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export function TagPickerPortal({
  anchorRef,
  options,
  selected,
  onToggle,
  onClose,
}: {
  anchorRef: RefObject<HTMLButtonElement | null>;
  options: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClose: () => void;
}) {
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const panelWidth = 224;
    const left = Math.min(rect.left, window.innerWidth - panelWidth - 12);
    setPosition({ left: Math.max(12, left), bottom: window.innerHeight - rect.top + 8 });
  }, [anchorRef]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, onClose]);

  if (!position) return null;

  return createPortal(
    <div
      ref={panelRef}
      onMouseDown={(event) => event.preventDefault()}
      style={{ position: "fixed", left: position.left, bottom: position.bottom, width: 224, maxHeight: 260 }}
      className="z-50 overflow-y-auto rounded-2xl border border-line bg-white p-1.5 shadow-2xl"
    >
      {options.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors duration-150 ${
              isSelected ? "bg-teal/10 text-tealDark" : "text-ink hover:bg-well"
            }`}
          >
            {tag}
            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-teal" />}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}
