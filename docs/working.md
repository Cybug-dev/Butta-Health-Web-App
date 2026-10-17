# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

**Stitch reference:** project `15447309545437068049`. User's naming: **v1** = "Fluid Glass & Tactile Depth" screens (red badge), **v2** = "Dimensional Bento & Neo-Biotech" screens (green badge). Stitch regenerates screens: always re-fetch `htmlCode` (list_screens) before using one.

---

## Current / latest

### 2026-10-17 — Health Profile rebuilt from Stitch "Health Profile (Mobile)"
**Stitch access:** `stitch` MCP has no permission on the project; use `stitch-2`. New screens' files are behind `stitch.googleapis.com/.../files/{id}:download` → need header `X-Goog-Api-Key: $STITCH_API_KEY` (user env var). Response is JSON `{dataString}`: HTML raw, PNG base64. Screens: Health Profile `2a7df68b9cfa40f3a63f2ebcf892a9ca`, Clinical Timeline (History) `58b0713ec8144612aa104808976ee698`.

**User decisions:** don't touch the logo/topbar. Rebuild pages. Unbuilt features → shared Coming Soon modal in the existing visual style. Desktop must be responsive. History: stat cards already exist as a 3–4 card horizontal-scroll band (`HeaderBand`) — reuse it, don't rebuild Stitch's 2-card version.

**Done (tsc -b pass; NOT visually verified):**
- `components/ui/ComingSoonModal.tsx`: shared modal (same backdrop/panel/gsap as ConfirmModal); takes `{title, description, icon}`.
- `pages/ProfilePage.tsx` rebuilt: identity card (initials avatar, member ID, camera/Change avatar → coming soon), live completion % + missing list, Personal info (name/email read-only), Clinical context (allergy/condition chips with inline add/remove, medications input), Emergency contacts (action-needed badge; Relationship → coming soon), vault notice, Save / Export PDF (coming soon) / Discard. Desktop lg: left column identity+completion+actions, right column sections (xl: clinical + emergency side by side).

- Round 2 (Stitch v2 of the screen; newer html is on a public contribution.usercontent URL): Clinical context = header w/ "Health log" tag + subtitle + Quick add (coming soon), three tinted category boxes (allergy/condition chips w/ dashed inline add, medication cards w/ edit/remove + "Add new medication"), tip line. Emergency = subtitle header, calm teal "Action needed"/"Required" pills, footer note. Desktop fluid: grid `minmax(280px,1fr) / 2.2fr`, profile container `max-w-[1600px]` in HealthWorkspace (others still max-w-5xl); fields go 4-col / 3-col at xl.
- Round 3: section headers wrap (aside drops below title on narrow widths, subtitle full width); field rows are `flex-wrap` with `flex-[grow_shrink_basis]` (names 13rem, email 18rem, etc.) instead of fixed grids. Vault card restyled (Stitch tinted card) and clickable → `components/account/HealthVaultModal.tsx`; copy limited to what the backend really does (owner-scoped data, Argon2id, signed HTTP-only JWT cookie, HTTPS + Neon at-rest, auth rate limit) — no E2E/HIPAA claims. Shared `components/ui/ModalShell.tsx` (+ `ModalClose`) now backs ComingSoonModal and the vault modal.

**Next:** visually check Profile (mobile + desktop); then rebuild History from the Clinical Timeline screen (search, filter, Doctor Visit Prep → coming soon if not built). Uncommitted.

---

## Completed (archive)
- 2026-10-16: Log Event rebuilt from v1/v2 (composer console, waveform, shared `HeaderBand` 4-card scroll band, v2 history/entities, v2 review modal, `.view-panel .scroll-row` edge fix). Committed 6c6b060; still not visually verified.
- 2026-10-16: Created AGENT.md (agent rules) and seeded this log.
- 2026-10-16: First Stitch restyle (Refined Desktop/Mobile Dashboard): global radius 16/12px, `line` = #E4ECE6, amber scale, 5-word check-in minimum, Stitch mobile bottom nav.
- 2026-10-16: Home screen from v1/v2: collapsible sidebar rail (`useSidebarCollapsed`), header (Vault pill, shared `NotificationBell` with rose badge, `AccountMenu` variants), greeting period icon, v2 banner + Voice note, v2 check-in, v1-mobile health summary + `LatestEventCard`, v2 recent events list, shared `.field-input`, v1 shadows, `useDictation`. Stale dev servers once caused white elements (restart fixes).
