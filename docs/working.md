# Working Log

Running timeline of tasks worked on this project. New agents/sessions should read the **latest entry** first to know current state. Keep this file lean (see AGENT.md section 6).

---

## Current / latest

### 2026-10-16 — Dashboard UI refinement to match Stitch
**Source of truth:** Stitch project `15447309545437068049` ("Dashboard Check-In Grid Refinement"), screens "Refined Desktop Dashboard" and "Refined Mobile Dashboard" (use `mcp__stitch-2__list_screens` + download `htmlCode`; don't re-read unless needed).

**Scope the user set:** visuals only for quick access, quick log, today's check-in, health summary, right-side tip + quote cards, mobile bottom nav. Keep existing gaps/spacing, background colors, font family, existing color tokens, and the right rail position. Mobile quick access proportions and scrolling quick log stay as they were.

**Done (type-check + `vite build` pass; NOT visually verified in a browser):**
- `tailwind.config.js`: global `rounded-lg` = 16px, `rounded-md` = 12px (applies app-wide); Stitch shadows (`card`, `lift`, `nav`, `fab`; `paper` aligned to `card`); `amber` now a scale (DEFAULT kept, so `bg-amber/10` still works); new tokens `field`, `fieldLine`, `tealSoft`, `mist`, `mistLine`.
- `styles/components.css` + `layout.css`: `.surface-card` / `.soft-card` use Stitch card shadow; removed mobile shadow override.
- `components/dashboard/DailyCheckInCard.tsx`: Stitch styling for form/loading/responded states; Save disabled until 5+ words, with guide text under the textarea ("N of 5"); error shown under the guide.
- `components/dashboard/DashboardMetric.tsx`: Stitch card styling; all three summary cards share `min-h-[204px]` and `h-full` so heights match regardless of content; bars/progress pinned to bottom.
- `pages/DashboardPage.tsx`: quick access (hover tile, "Common actions" label on sm+), quick log (white card wrapper + rounded-xl pills on sm+, mobile scroll row kept), "See all" and headings resized, tip card (Info icon, Stitch text), quote card (gradient, Stitch text, botanical image removed).
- `components/layout/MobileNav.tsx`: rebuilt to Stitch (80px bar, raised FAB with white border, Home/Clock/User/Settings icons).

**Follow-up fixes (same day):**
- Borders unified: `line` token is now `#E4ECE6` (Stitch card border); `.surface-card`/`.soft-card` use it; all boxes share it plus the Stitch card shadow.
- Check-in card: icon tile (`rounded-2xl`, amber-50/600) and label pill (amber-100/700) are amber at every breakpoint; corner blur shown everywhere.
- Quote card: botanical image restored over the Stitch gradient.
- Mobile nav: height 80px -> 68px; FAB uses new `leaf` token (`#2D5B46`) with `shadow-fab` and `border-4 border-white`; active tab uses `text-leaf`.

**Left / next:**
- Visually check desktop + mobile in a browser; tune if anything looks off.
- Global radius change affects all pages: buttons elsewhere that use `rounded-lg` are now 16px (Stitch controls are 12px). Revisit per page if wanted.
- Other pages (history, profile, settings, auth) not yet restyled beyond the global radius/shadow tokens.

---

## Completed (archive)
- 2026-10-16: Created AGENT.md (agent rules) and seeded this log.
