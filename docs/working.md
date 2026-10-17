# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

**Stitch reference:** project `15447309545437068049`. User's naming: **v1** = "Fluid Glass & Tactile Depth" screens (red badge), **v2** = "Dimensional Bento & Neo-Biotech" screens (green badge). Stitch regenerates screens: always re-fetch `htmlCode` (list_screens) before using one.

---

## Current / latest

### 2026-10-17 — Scrollbars hidden, clickable stat cards, saved visit notes
- `styles/base.css`: scrollbars hidden app-wide (`* { scrollbar-width: none }` + webkit), scrolling unchanged.
- Stat cards (`HeaderBand`) are buttons via `StatNavigationContext` (`components/layout/statNavigation.ts`, provided in HealthWorkspace `openStat`): Structured records / Timeline status → History (all), Symptom events → History filtered to Symptom, Watch items → History "Needs attention only" (new `watchOnly` in `useRecordFilters`, dismissible amber chip on HistoryPage). Search is cleared on open.
- Doctor Summary visit notes persist in localStorage via `utils/visitNotes.ts` (`butta.doctorVisitNotes`), cleared on sign out in `App.tsx`.

---

### 2026-10-17 — Doctor Summary rebuilt from Stitch "Clinical Snapshot" `d49957cc2dd8407d8e927bea7355fedb`
**Done (tsc -b + eslint pass; NOT visually verified):** `pages/DoctorSummaryPage.tsx` — hero (For your doctor kicker, Print = real `window.print`, Export + Share/Copy link → coming soon), existing `HeaderBand` under the hero (hidden in print), Main concern card (chief complaint, frequency, real profile facts from `healthProfile`: blood group/allergies/conditions/meds, amber "Please note"), Selected timeline (count, newest/oldest, newest item teal left edge, note box italic+quoted for voice, type chip + Needs attention + source), Visit notes textarea (local only, prints). lg: concern + timeline side by side. New props `profile`, `metrics`; summary excluded from global HeaderBand, `max-w-[1600px]`. Dropped FHIR/256-bit/SHA/ID claims; old `ReportBlock` export removed (unused).
**Next:** visually check Doctor Summary + print preview.

---

### 2026-10-17 — Doctor Visit Prep rebuilt from Stitch `de9e915c5c704dc7be34335537b91c96`
**User rule:** follow Stitch *structure* only; use the app's existing tokens/colours (no new tokens), the home-screen search bar markup (`field-input w-full py-3 pl-10 pr-4 text-xs`, Search 16 text-muted), and leave `HeaderBand` untouched. Fully responsive, no squashed text.
**Done (tsc -b + eslint pass; NOT visually verified):** `pages/DoctorPrepPage.tsx` — hero (Visit planner kicker, Select recent five / symptoms / Clear, Generate summary disabled until something is selected), `HeaderBand` under hero, local search + filter chips with counts (All / Selected / types), selectable cards (checkbox, title wraps, level chip = severity or status, date, note, type + source chips; selected = teal border + mist), Questions for your doctor (coming soon), Summary format (PDF = real via summary print; clinic file / private link → coming soon), sticky bottom "N entries ready" bar → summary. `Chip` extracted to `components/ui/Chip.tsx` (TimelineCard uses it). Doctor-prep excluded from global HeaderBand, uses `max-w-[1600px]`.
**Next:** visually check Doctor Prep (sticky bar sits above mobile nav at `bottom-[5.5rem]`).

---

### 2026-10-17 — Settings rebuilt from Stitch "Settings (Mobile)" `9ae186ddd1df4757b07534fbccde39a3`
("Settings (Web Mobile)" `9e9dfa0a…` is just a capture of the old app — ignore.)
**Done (tsc -b + eslint pass; NOT visually verified):** `pages/SettingsPage.tsx` — header kicker, account card → profile (`onOpenProfile`), sections in a 2-col grid at lg: Smart note help (AI consent switch = real; term matching + strictness segmented → coming soon), Privacy & security (vault explainer → `HealthVaultModal`; face lock / clinics / access history → coming soon), Reminders (daily check-in w/ time, follow-ups, weekly summary = real; medication reminders → coming soon), Your data (export → coming soon; Reset demo for demo users), Sign out + Delete account (coming soon). Local `Switch`, `SettingRow`, `SettingsSection`. Dropped Stitch's AES/HIPAA/FHIR/version claims. Removed unused `SettingToggle`. Settings uses `max-w-[1600px]`.
**Next:** visually check Settings.

---

### 2026-10-17 — History (Clinical timeline) rebuilt from Stitch
**Stitch access:** `stitch` MCP has no permission on the project; use `stitch-2`. Some screens' files are behind `stitch.googleapis.com/.../files/{id}:download` → header `X-Goog-Api-Key: $STITCH_API_KEY` (user env var; read it from the Windows user env if the session predates it). Response is JSON `{dataString}`: HTML raw, PNG base64. Others use public contribution.usercontent URLs. Screens: Health Profile `2a7df68b9cfa40f3a63f2ebcf892a9ca`, Clinical Timeline `58b0713ec8144612aa104808976ee698`.

**User decisions (apply to all screens):** don't touch the logo/topbar. Rebuild pages. Unbuilt features → shared `ComingSoonModal`. Desktop must fill available width fluidly (no fixed widths; adapts to sidebar open/collapsed), and field rows wrap on small screens. User-facing copy must be plain language, not technical. History stat cards = existing `HeaderBand` (4-card scroll band), not Stitch's 2-card version.

**Done (tsc -b + eslint pass; NOT visually verified):**
- `pages/HistoryPage.tsx`: hero card (kicker, title, search with clear, Filter entries toggle → type chips, Doctor visit prep → existing doctor-prep view), `HeaderBand` below the hero, Events & observations header with count + newest/oldest sort, cards in 1 col / 2 cols at xl.
- `components/history/TimelineCard.tsx`: Stitch card — type icon tile, amber/rose left border for Moderate/Severe, type/severity/status badges, notes preview (Details →), date + source tag; expands to symptoms / notes / what helped.
- `HealthWorkspace.tsx`: timeline excluded from the global HeaderBand; timeline + profile use `max-w-[1600px]`.
- Round 2: left edge colour = level for Mild (emerald) / Moderate (amber) / Severe (rust), none for "Not specified"; icon tile neutral. Small wrapping Stitch chips (local `Chip`) for type/severity/status and expanded symptoms. List header shrunk to 11px and inline, count reads "N recent" (or "N of M" while filtering). `HeaderBand` gets `scroll-px-4` so snap doesn't pull the first card to the screen edge. `useWorkspaceNavigation` scrolls to top on every view change.
- Round 3: level edge needed `!` modifiers — `.surface-card` border in components.css (imported after Tailwind) overrides `border-l-*` utilities; watch for this anywhere surface-card needs a coloured border. Chips shrunk (10px, px-1.5, py-px, gap-1) and card padding tightened on mobile so 3 chips fit inline.
- Never add Co-Authored-By trailers to commits (profile commit amended → 74fcae0).

**Next:** visually check History + Profile (mobile, desktop with sidebar open/collapsed). Uncommitted.

---

## Completed (archive)
- 2026-10-17: Health Profile rebuilt from Stitch (46089d5): identity, completion %, wrapping personal info, clinical chips + medication cards, emergency contacts, vault card → `HealthVaultModal` (plain-language, only real protections), shared `ModalShell` + `ComingSoonModal`.
- 2026-10-16: Log Event rebuilt from v1/v2 (composer console, waveform, shared `HeaderBand` 4-card scroll band, v2 history/entities, v2 review modal, `.view-panel .scroll-row` edge fix). Committed 6c6b060; still not visually verified.
- 2026-10-16: Created AGENT.md (agent rules) and seeded this log.
- 2026-10-16: First Stitch restyle (Refined Desktop/Mobile Dashboard): global radius 16/12px, `line` = #E4ECE6, amber scale, 5-word check-in minimum, Stitch mobile bottom nav.
- 2026-10-16: Home screen from v1/v2: collapsible sidebar rail (`useSidebarCollapsed`), header (Vault pill, shared `NotificationBell` with rose badge, `AccountMenu` variants), greeting period icon, v2 banner + Voice note, v2 check-in, v1-mobile health summary + `LatestEventCard`, v2 recent events list, shared `.field-input`, v1 shadows, `useDictation`. Stale dev servers once caused white elements (restart fixes).
