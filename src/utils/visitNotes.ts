// Doctor-visit notes live only in this browser. Every access is guarded: storage can be blocked (private mode).
const VISIT_NOTES_KEY = "butta.doctorVisitNotes";

export function readVisitNotes() {
  try {
    return window.localStorage.getItem(VISIT_NOTES_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeVisitNotes(notes: string) {
  try {
    if (notes) window.localStorage.setItem(VISIT_NOTES_KEY, notes);
    else window.localStorage.removeItem(VISIT_NOTES_KEY);
  } catch {
    // Notes still work for this visit without storage.
  }
}

/** Called on sign out so the next person on a shared device can't read them. */
export function clearVisitNotes() {
  writeVisitNotes("");
}
