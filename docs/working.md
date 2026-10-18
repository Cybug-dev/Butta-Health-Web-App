# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

**Stitch reference:** project `15447309545437068049`. User's naming: **v1** = "Fluid Glass & Tactile Depth" screens (red badge), **v2** = "Dimensional Bento & Neo-Biotech" screens (green badge). Stitch regenerates screens: always re-fetch `htmlCode` (list_screens) before using one.

---

## Current / latest

### 2026-10-18 — History card polish + sign-in card width
- History: list header now "LOGGED EVENTS (n)" (or "(m of n)" when filtering), same leaf colour, no pill; Newest-first toggle unchanged. `TimelineCard`: chips use new `Chip compact` (9px on mobile, 10px sm+); notes preview is borderless `bg-field rounded-lg`, italic and quoted with "Details →" at right; date 10px (11px sm+) in faint; source tag ("Typed entry") 9px/10px with 10px icon at ALL sizes. Details panel untouched.
- Sign in (`AuthPage.tsx`): wider card on mobile — outer padding px-3, `max-w-md sm:max-w-lg`, card padding p-4 / min-[400px]:p-5 / sm:p-8 (UNCOMMITTED, pending visual check).

**Git rule (2026-10-17):** do NOT commit or push unless the user explicitly asks. No Co-Authored-By trailers ever.

### 2026-10-17 — Landing, Sign in, Patient Insights from Stitch (UNCOMMITTED; tsc + eslint pass, not visually verified)
Screens: Landing `fcf43c2b04da463e8b63cf5c68bb6865`, Sign In `e13102d854f34b0d821ff31cb00fad54`, Insights drawer `da9536c64e514048b56afa7f1fadc3d5`.
- `pages/public/LandingPage.tsx`: Stitch layout, OUR image (`/assets/butta-hero-wellness.png`) in a 4:5 framed card with the three floating cards inside it (left pill, top-right review card, full-width bottom card); stepper as 3 tiles; How it works = vertical timeline on mobile, 3 columns on lg. GSAP hook classes kept (hero-left/right-section, hero-copy-item, hero-visual-frame, hero-float-a/b/c, hero-support, detail-reveal, public-header/navbar-inner). Dropped "On-device parsing"/"Encrypted"/"zero third-party" claims.
- Landing headline: now `capitalize` ("A Brighter Tomorrow.") instead of uppercase, `leading-[1.18]` (looser). Header Sign in / Get started are small again (text-xs).
- Landing header (final): uses the shared `components/public/Brand.tsx`, now identical to the dashboard header brand (36px leaf tile + 14px "Butta Health" + 10px tagline on mobile; sidebar-style 44px tile / 18px text from lg), header h-16 / lg:72px, transparent until scrolled. Brand is also used by AuthPage/Onboarding, so the whole public side matches the dashboard. Earlier "tiny header" sizes dropped per user.
- Landing follow-up 4: heading back to original size (`clamp(2.75rem, min(5.4vw,10svh), 5rem)`, uppercase); image: full width on MOBILE only (<sm: frame `left-0 w-full`, floats inset 12px); sm+ keeps the earlier narrower portrait frame (`left-[14%] w-[70%]`, floats at edges, section `lg:max-w-[600px]`) — floats stay siblings so GSAP still works; header = Stitch (fixed, TRANSPARENT at top and solid white + line + faint shadow once scrolled >28px via `.is-scrolled`, stacked "Butta/Health" with leaf, text Sign in + pill Get started, NO blur — `.public-header.is-scrolled` in motion.css now only adds a faint shadow, no backdrop-filter / height change); How-it-works cards use `group` so hovering cards 2–3 gives them card 1's look (mist bg, teal border, solid teal icon tile, white tag chip).
- Landing follow-up 3: hero image section restored to the ORIGINAL structure (deployed screenshot): `hero-right-section` (relative, `lg:h-[min(calc(100svh-9rem),760px)]`) holds a centered portrait frame (`left-[12%] w-[72%]`, `sm:left-[14%] sm:w-[70%]`) and the three `hero-float` cards as SIBLINGS overlapping its edges (a left-0 top-[22%], b right-0 top-[9%], c right-0 bottom-[9%]). Floats were previously nested in the frame, so the frame's clip-path/scale reveal clipped them and broke their GSAP entrance/bobbing — keep floats outside `hero-visual-frame`. Visuals (rounded-2xl glass cards, framed image) kept; card c copy back to "Share only when you choose / Your notes remain private by default".
- Landing follow-up 2: hero is exactly `lg:h-svh` (min 640px) holding header + text + a large image frame (`lg:h-[min(calc(100svh-8.5rem),820px)]`, no fixed aspect, fills its column); the stepper tiles are OUTSIDE the hero so they only show after scrolling. Headline "A BRIGHTER TOMORROW." is `uppercase` with a slightly smaller clamp.
- Landing follow-up (superseded in part): on lg the hero is `min-h-svh` (content left centered vertically, image right sized `h-[min(60svh,540px)]`, stepper tiles at the bottom) so everything fits one screen; heading uses an svh-capped clamp; stepper tiles wider (`max-w-5xl`), taller, and UPPERCASE. Mobile still stacks and scrolls.
- `pages/public/AuthPage.tsx` + `AuthFields.tsx`: restyled to Stitch (rounded-3xl card, pill segmented control, semibold labels, py-3.5 inputs, rounded-2xl buttons); Forgot password → ComingSoon. Desktop image column unchanged.
- `layout/InsightRail.tsx`: Stitch insights sheet (bar + PATIENT INSIGHTS header, close, context card with stat tiles, activity card, Open doctor snapshot). Mobile drawer = top sheet (slides down), sm+ = right panel; Esc closes. Desktop rail wraps content in the same card.

### 2026-10-17 — Profile clinical context shrunk (committed f590596)
Section headers: 28px icon/14px glyph, 14px semibold title, 10px tag, 12px subtitle, 10px Quick add. Categories: p-3, 20px icon/11px glyph, 13px title, 10px count. Chips 12px py-1, add buttons 10px, medication name 13px, 28px action buttons, tip 11px. Titles `whitespace-nowrap max-[359px]:whitespace-normal`; title blocks have no `min-w-0` so badges/buttons wrap below instead of overlapping. Applies to all ProfileSection headers.

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
