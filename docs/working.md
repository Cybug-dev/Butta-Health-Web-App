# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

---

## Current / latest

### 2026-10-16 — Home screen refinement from Stitch variants (v1/v2)
**Source:** Stitch project `15447309545437068049`. Naming the user uses:
- Desktop **v1** = "Collapsed Rail (Fluid Glass & Tactile Depth)"; desktop **v2** = "Collapsed Rail (Dimensional Bento & Neo-Biotech)" (has expand button, glowing logo, "Vault Encrypted").
- Mobile **v1** = "Fluid Glass & Tactile Depth (Mobile)" (red badge); mobile **v2** = "Dimensional Bento & Neo-Biotech (Mobile)" (green badge).

**User decisions:** desktop health summary = 3 columns, 3rd is the Latest event card (mobile: 2 cards + latest row beneath). Sidebar collapsed by default, choice remembered. Mic/Voice note = browser speech-to-text, hidden where unsupported. Right rail cards: only radius/border/shadow changed.

**Done (tsc + eslint + vite build pass; NOT visually verified in a browser):**
- Global: v1 desktop card/hover shadows (`card`, `paper`, `lift`), v1 chip shadows, new tokens `glow`, `alert`, `track`, `barIdle`, `ping-slow` and `fade-in` animations. `.surface-card`/`.soft-card` use v1 shadow.
- Shared `.field-input` (styles/components.css) = v2/v1 mobile input look; applied to all form inputs, selects and searches (FormFields, AuthFields, AuthPage, Onboarding date, Settings time, History search, ConfirmModal select, topbar + dashboard search, check-in textarea). Not applied to the Log Event composer bubble.
- Sidebar (`Sidebar.tsx`, `useSidebarCollapsed.ts`, `HealthWorkspace.tsx`): v1 collapsed rail (80px); hovering blank rail space swaps logo for an expand icon; clicking blank space/icon expands to the existing sidebar (width + margin transition, content fades in); collapse button in expanded header.
- Desktop topbar: v1-mobile-style search with long placeholder, v2 "Vault Encrypted" pill, v2 bell (rose badge), divider, v2 profile chip (`AccountMenu` `variant="desktop"`). New shared `NotificationBell.tsx`.
- Mobile topbar: v2 structure (leaf tile, name/tagline, round bell with v1 red `alert` badge, avatar pill `variant="mobile"`), no Vault pill.
- Dashboard (`DashboardPage.tsx`): greeting has morning/afternoon/night icon (`getDayPeriod` in utils/format.ts); v2 date chip, short date on mobile, wraps under greeting when narrow. Banner content = v2 (blinking "Quick log" dot, longer copy, Log how I feel + Voice note, icon-only on mobile); image kept. Quick access/log: v1 radius/shadows, "Common actions" on mobile, compact mobile text, v1 chips. Right rail cards rounded-3xl.
- Check-in (`DailyCheckInCard.tsx`): v2 desktop warm corner glow, v2 mobile content (Daily Bio-Pulse, Private badge, Auto-encrypted), shared input with v1 mic (dictation), 5-word rule kept.
- Health summary: `DashboardMetric.tsx` rewritten to v1 mobile style (7-day activity bar chart + profile progress from real dashboard data); new `LatestEventCard.tsx` (row on mobile, card on sm+; routes to history, or Log Event when empty).
- Voice: `useDictation.ts` (Web Speech API). Voice note opens Log Event and dictates into it (listening pill in `LogEventPage.tsx`; composer auto-expands on text).

**Follow-up fixes:**
- White logo/avatar/"Log how I feel"/quick-access hover were caused by stale dev servers (ports 5173/5174 served CSS without `leaf` classes); code was correct. Fresh `npm run dev` fixes it.
- `NotificationBell` unified: one bell style + one `bg-rose-500` badge for desktop and mobile (no variants). Removed `alert` token; check-in mic listening state uses rose.
- Mobile avatar pill and bell made smaller; mobile insights button matches bell style.

**Left / next:**
- Visually check desktop (sidebar collapse/expand, header) and mobile; restart dev server first (tailwind config changed).
- "Recent health events" section intentionally untouched; user will redesign it later.
- Uncommitted: this work plus the previous Stitch restyle.

---

## Completed (archive)
- 2026-10-16: Created AGENT.md (agent rules) and seeded this log.
- 2026-10-16: First Stitch restyle (Refined Desktop/Mobile Dashboard): global radius 16/12px, `line` = #E4ECE6, amber scale, check-in 5-word minimum, Stitch mobile bottom nav with `#2D5B46` FAB at 68px height.
