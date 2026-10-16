# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

**Stitch reference:** project `15447309545437068049`. User's naming: **v1** = "Fluid Glass & Tactile Depth" screens (red badge), **v2** = "Dimensional Bento & Neo-Biotech" screens (green badge). Stitch regenerates screens: always re-fetch `htmlCode` (list_screens) before using one.

---

## Current / latest

### 2026-10-16 — Log Event screen from Stitch ("Log Event" v1/v2 mobile)
**User decisions:** order = AI banner (v1, no icon) → log card (v2) → stat cards (v1) → Your history (v2) → Detected entities (v2). Stat band = existing 3 metrics + Stitch "Timeline status" (4 cards, shared `HeaderBand`; on Log Event it sits below the log card). Log Observation / Confirm & save / Edit fields all open the review modal; review modal restyled to v2 clinical-extraction UI. Mobile scroll rows must reach the screen edge.

**Done (tsc pass; NOT visually verified in a browser):**
- `LogEventPage.tsx` rebuilt in that order; desktop puts history + entities side by side (lg).
- `ObservationComposer.tsx` rewritten as v2 always-open glass console: status badge, transcript textarea with mic inside, waveform (`animate-wave`) only while audio is actually captured (`useDictation` `capturing` via onaudiostart/onaudioend), Photo + Tags buttons, Log Observation CTA. Tags + attachments lifted to the page (`hooks/useAttachments.ts`).
- `HeaderBand.tsx`: v1 card style, 4 cards, edge-to-edge horizontal scroll on mobile.
- `ClinicalPanel.tsx`: v2 "Your history" card; chevron expands the 48h list.
- `ExtractionPreview.tsx`: v2 Detected entities (type, severity meter, title, fields grid, Edit fields / Confirm & save) + shared pieces (`ExtractionHeader`, `DraftBadge`, `EntityTile`, `SeverityMeter`, `FieldGrid`) reused by `ConfirmModal.tsx` (v2 restyle, severity as segmented buttons, same save flow).
- `layout.css`: `.view-panel .scroll-row { max-width: none }` — the mobile `max-width:100%` rule was clipping negative-margin scroll rows (stat band + dashboard quick log) short of the screen edge.
- `HealthWorkspace.tsx`: Log Event gets metrics + shared voice controls; source "Voice" when dictation was used.
- Follow-up: banner keeps its ORIGINAL background (wellness-workspace.png + #173f35 overlays) — only content is v2. Waveform uses plain CSS `.waveform-bar` in motion.css (no config dependency, exempt from the reduced-motion kill rule); `capturing` turns on at recognition `onstart`/`onaudiostart`. Review modal is centered (flex) on sm+, bottom sheet on mobile.

**Left / next:**
- Visually check Log Event (mobile + desktop), mic permission flow and waveform, review modal; restart dev server (tailwind config changed).
- Uncommitted.

---

## Completed (archive)
- 2026-10-16: Created AGENT.md (agent rules) and seeded this log.
- 2026-10-16: First Stitch restyle (Refined Desktop/Mobile Dashboard): global radius 16/12px, `line` = #E4ECE6, amber scale, 5-word check-in minimum, Stitch mobile bottom nav.
- 2026-10-16: Home screen from v1/v2: collapsible sidebar rail (`useSidebarCollapsed`), header (Vault pill, shared `NotificationBell` with rose badge, `AccountMenu` variants), greeting period icon, v2 banner + Voice note, v2 check-in, v1-mobile health summary + `LatestEventCard`, v2 recent events list, shared `.field-input`, v1 shadows, `useDictation`. Stale dev servers once caused white elements (restart fixes).
