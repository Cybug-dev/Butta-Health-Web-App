# Butta Health UI/UX Design Guidelines

Audience: any AI agent or engineer who creates or changes UI in this repo.
Read this before writing a component, page, or style. The values here were taken
from the real code (`tailwind.config.js`, `src/index.css`, `src/App.tsx`,
`src/components/*`), so they describe what the app already is.

Last updated: October 15, 2026 (dashboard redesign, mobile nav with center action, account menu)

---

## 0. Quick Reference (read this if nothing else)

1. **The app's design system is the source of truth, not the reference image.**
   Reference images, templates, and screenshots inform layout, hierarchy, density,
   and interaction. They never override colors, type, radii, shadows, or iconography.
2. **Precedence when rules conflict:**
   explicit instruction from the user > this document > existing app code > a
   reference image/template.
3. **Use existing tokens and recipes.** Colors, fonts, and shadows come from
   `tailwind.config.js`. Shared looks come from the classes in `src/index.css`
   (`surface-card`, `soft-card`, `badge`, `badge-dot`, `scroll-row`).
4. **No hard-coded hex values and no new arbitrary values** unless Section 4.9 allows it.
5. **Radius is `rounded-lg`** for almost everything, `rounded-full` for avatars, icon
   chips, pills, and progress bars. Nothing else.
6. **Primary action = `bg-teal` + white text + `hover:bg-tealDark`.** One per view area.
7. **Icons: `lucide-react` only.** Animation: GSAP for entrances/overlays, CSS
   transitions for hover/state. No other UI or animation libraries.
8. **Mobile first, 320px minimum, no horizontal page scroll.** Touch targets are at
   least 40px, and 44-48px for primary controls.
9. **Health product rules apply to copy and UI:** no diagnosis, no treatment advice,
   urgent states are explicit and calm (Section 7).
10. **Finish with the checklist in Section 13.**

---

## 1. How To Use A Reference Image Or Template

The goal is to **adopt the quality and structure of a reference, not its skin.**
A reference tells you *what a good screen is made of*. This app decides *how it looks*.

### 1.1 Take from the reference (adopt)

| Aspect | Example |
| --- | --- |
| Information hierarchy | What is primary, secondary, tertiary on the screen |
| Layout structure | Column count, rail/sidebar placement, card grouping, section order |
| Density and rhythm | How much breathing room, how many items per row, vertical cadence |
| Component anatomy | What a card contains (icon, label, value, trend, action) and in what order |
| Interaction patterns | Expand/collapse, inline edit, drawers vs modals, filter bars, steppers |
| State handling | Empty, loading, error, success treatments |
| Motion intent | Staggered reveals, panel slide-ins, hover lift (re-timed to our motion tokens) |
| Responsive behavior | What collapses, stacks, or becomes a drawer on mobile |

### 1.2 Do not take from the reference (translate or ignore)

| Aspect | Rule |
| --- | --- |
| Colors | Map every color to the nearest Butta token by *role* (Section 4.1). Never sample hex values from the image. |
| Fonts | Always Nunito Sans. |
| Border radius, borders, shadows | Use our radius scale and the `shadow-paper / lift / float` set. |
| Icons and illustrations | Lucide icons and the existing `public/assets/*` wellness imagery. |
| Logos, brand names, product names | Never copy. Use Butta Health branding. |
| Copy and data | Never copy. Write Butta-appropriate, non-diagnostic copy (Section 7). |
| Dark mode, gradients, glassmorphism, 3D | Not part of this app unless the user asks. |
| Pixel measurements | Snap to the Tailwind spacing scale and the shell dimensions in Section 5. |

### 1.3 Process for every reference-driven task

1. **Describe the reference structurally** in a few lines: regions, hierarchy,
   repeating units, interactions. Do not describe its colors.
2. **Map each region to something that already exists** (a recipe in Section 6 or a
   component in `src/`). Reuse and extend first. Only create a new component when
   nothing fits.
3. **Translate every visual value to a token.** Reference blue becomes `teal`.
   Reference warning orange becomes `amber`. Reference large radius becomes
   `rounded-lg`. Reference heavy shadow becomes `shadow-lift` or `shadow-float`.
4. **List deviations** from the reference in your reply (for example, "the reference
   shows a gradient banner; I used a flat `bg-teal` panel per our system").
5. **Build, then run the checklist** in Section 13.
6. **If the reference needs something the system does not have** (new color role,
   new component type), do not improvise. Propose a token or recipe addition,
   state why, and wait for approval, or add it in one place per Section 10.

### 1.4 When the user explicitly asks for something that differs

The user's instruction wins. "Make it match the image's blue" or "add a dark
sidebar" is a valid override. When that happens:

- Apply it narrowly, to what was named.
- Prefer changing the token or shared class once so the app stays consistent,
  not a one-off override on a single screen.
- Update this document (Section 10) so the next agent does not "fix" it back.

---

## 2. Product Personality

Butta Health is a **private health journal** for ordinary people recording how
they feel. The UI should feel:

- **Calm and trustworthy:** quiet green-tinted neutrals, generous whitespace, no alarming color unless something is genuinely urgent.
- **Warm, not clinical-cold:** soft surfaces, friendly rounded geometry, plain language.
- **Quick:** daily logging should take seconds; the primary path is always obvious.
- **Honest:** it organizes what the person said. It does not diagnose or advise (Section 7).

Avoid: dense dashboards with many competing accents, neon colors, aggressive
red/orange outside real warnings, playful gimmicks, medical-jargon-heavy UI,
stock-photo clinical imagery.

---

## 3. Stack Constraints

- React 18 + TypeScript, Vite 6, Tailwind CSS 3 (config in `tailwind.config.js`)
- GSAP 3 for entrance/overlay motion, `lucide-react` for icons
- No component library (no shadcn, MUI, Radix, etc.) and no CSS-in-JS. Do not add one without approval.
- Styling is Tailwind utility classes in JSX plus a small set of shared classes in `src/index.css`.
- Fonts load from Google Fonts in `src/index.css`. Do not add other font families.

---

## 4. Design Tokens

### 4.1 Color

Defined in `tailwind.config.js` under `theme.extend.colors`. Always use the
token class (`bg-teal`, `text-muted`, `border-line`), never the hex.

| Token | Hex | Role | Typical use |
| --- | --- | --- | --- |
| `paper` | `#F4F7F6` | App canvas | Page background, side rails |
| `paper2` / `white` | `#FFFFFF` | Raised surface | Cards, sidebar, topbar, inputs |
| `well` | `#EEF4F2` | Recessed / hover surface | Hover rows, selected nav, search field, secondary chips, progress track |
| `ink` | `#17211F` | Primary text | Headings, values, input text |
| `muted` | `#61706C` | Secondary text | Descriptions, labels, inactive nav |
| `faint` | `#899590` | Tertiary text | Placeholders, metadata, eyebrow labels, chevrons |
| `line` | `#DCE6E2` | Borders and dividers | Card borders, input borders, row separators |
| `teal` | `#2F7D69` | **Brand / primary** | Primary buttons, active states, links, focus border, avatars |
| `tealDark` | `#235F50` | Primary hover / pressed | `hover:bg-tealDark`, info text on tinted panels |
| `emerald` | `#2F7D69` | Success / mild | Mild severity, confirmed status, symptom type |
| `amber` | `#B97823` | Caution / moderate | "Needs monitoring", moderate severity |
| `rust` | `#B85C5C` | Error / severe / urgent | Errors, severe severity, urgent alerts, notification dot |
| `gold` | `#E7B94B` | Accent highlight | Active mobile-nav item, check-in lightbulb chip, digestive tint. Use sparingly. |

**Tint scale for status surfaces.** Soft status chips use `{color}/10` background,
`{color}/20`-`/25` border, and full `{color}` text. Also seen: `/5` for large alert
panels, `/15` for gold, `/30` for stronger alert borders. Do not invent other steps.

**Semantic mapping (do not reshuffle, these are meaning, not decoration):**

| Concept | Style |
| --- | --- |
| Symptom | `border-emerald/25 bg-emerald/10 text-emerald` |
| Medication | `border-teal/25 bg-teal/10 text-teal` |
| Digestive | `border-gold/40 bg-gold/15` with dark gold text (see 4.9) |
| Doctor visit | `border-rust/25 bg-rust/10 text-rust` |
| Check-in | `border-teal/25 bg-teal/10 text-teal` |
| Status: Confirmed / Prepared / Needs monitoring | emerald / teal / amber chips |
| Severity: Mild / Moderate / Severe / Not specified | emerald / amber / rust / `border-line bg-well text-muted` |

These live in `typeStyles`, `statusStyles`, and `severityStyles` in `src/App.tsx`.
Reuse those maps. When adding a new event type or status, add it there.

**Rules**

- Text on `paper`/`white`/`well`: `ink`, `muted`, `faint` only. `faint` is for
  non-essential text. Never use it for content a user must read to act.
- Color is never the only signal. Pair status color with a label, icon, or dot.
- Only one saturated brand surface per screen region (for example, the teal
  hero card on the dashboard). Do not stack multiple solid teal blocks.
- A reference's brand color is **never** adopted wholesale. Map by role.

### 4.2 Typography

- **Family:** Nunito Sans only (`font-sans`). `font-serif` and `font-mono` are aliases
  to the same family and exist for *style hooks*, not different typefaces:
  - `font-serif`: weight 750, no tracking. Use for page/card **headings**.
  - `font-mono`: weight 700, `0.045em` tracking. Use for **eyebrow labels**
    (uppercase tiny captions above a heading or field).
- **Weights in use:** `font-extrabold` (labels, buttons, values, nav emphasis),
  `font-semibold` (body emphasis, menu items), `font-bold`. Regular weight for long text.

**Scale (as used today):**

| Role | Classes |
| --- | --- |
| Hero display | `text-[clamp(2.75rem,5.4vw,5rem)] font-serif` (landing hero only) |
| Page title | `font-serif text-3xl` to `text-4xl` |
| Card title | `font-serif text-xl` to `text-2xl` |
| Metric value | `text-2xl font-extrabold` (`text-base` compact) |
| Field label / button text | `text-sm font-extrabold` |
| Body | `text-sm` (`leading-6` for paragraphs) |
| Helper / meta | `text-xs font-semibold text-faint` or `text-muted` |
| Eyebrow label | `font-mono text-[11px]` (or `text-[10px]` on dense cards) `uppercase tracking-[0.16em]` to `tracking-[0.2em]` `text-faint` |
| Badge | `.badge` class (11px, 800 weight) |

**Rules**

- Body text is `text-sm`. Do not go below `text-xs` for readable content; the
  `10px`/`11px` sizes are reserved for eyebrow labels and mobile nav captions.
- Sentence case everywhere. Uppercase only for eyebrow labels and tiny captions.
- Truncate with `truncate` / `min-w-0` and provide a `title` attribute with the full text.
- Do not set `letter-spacing` on headings. `font-serif` already neutralizes it.

### 4.3 Spacing and sizing

Use the Tailwind scale. Common values here:

- Card padding: `p-4` (compact / metric), `p-5` (standard), `p-6` (large panel / modal on `sm:`).
- Gaps: `gap-2` (chips), `gap-3` (icon + text), `gap-4` (cards in a grid), `gap-5` to `gap-6` (sections).
- Vertical rhythm between stacked blocks: `space-y-4` / `mt-4`, and `mb-6` below a page header.
- Control heights: **`h-10`** (icon buttons, compact), **`h-11`** (search, secondary buttons), **`h-12`** (form inputs/selects). Use `min-h-10` / `min-h-11` for text buttons.
- Icon chips: `h-9 w-9`, `h-10 w-10`, or `h-11 w-11`, centered with `grid place-items-center`.

### 4.4 Radius

| Class | Use |
| --- | --- |
| `rounded-lg` | **Default** for cards, inputs, buttons, modals, dropdown panels, nav items, alerts, icon chips that are square-ish |
| `rounded-full` | Avatars, circular icon chips, badges/pills, progress bars, status dots |
| `rounded-t-lg` | Bottom-sheet top edge on mobile |

Do **not** use bare `rounded`, `rounded-md`, `rounded-xl`, or `rounded-2xl`. They
appear in older code (see Section 11) and are drift.

### 4.5 Elevation

Defined in `tailwind.config.js` (`boxShadow`):

| Token | Use |
| --- | --- |
| `shadow-paper` (via `.surface-card`) | Resting card |
| `shadow-lift` | Hover-raised cards, primary buttons that float, avatar, brand mark |
| `shadow-float` | Popovers, dropdown panels, hover on large list cards |
| (none) | Flat rows, soft cards, tables |

Cards rest at `surface-card`. Hover lifts with `hover:-translate-y-0.5 hover:shadow-lift`
(interactive cards only). Do not stack custom shadows or use `shadow-2xl` / `shadow-sm` / `shadow-md` (Section 11).

### 4.6 Borders

Default border is `border border-line`. On hover or focus, interactive surfaces
move to `border-teal/30`-`border-teal/40` (hover) and `border-teal` (focus/open).
Row dividers use `border-b border-line last:border-b-0`.

### 4.7 Z-index

`z-10` local overlays, `z-20` fixed side rail, `z-30` topbar and dropdown panels,
`z-40` sidebar and mobile nav, `z-50` modals and drawers. Do not exceed `z-50`.

### 4.8 Breakpoints

Tailwind defaults. Behavior is defined in Section 5. Usage to date:
`sm:` is the dominant step (phone to tablet), `lg:` switches to the desktop shell,
`xl:`/`2xl:` reveal the insight rail.

### 4.9 Arbitrary values policy

Allowed: layout dimensions that are part of the shell (`h-[72px]`, `w-[320px]`,
`max-w-[1360px]`, `min-h-[72px]`), the hero `clamp()`, tiny `text-[10px]/[11px]`
eyebrows, and `tracking-[0.16em]` eyebrow tracking.

Not allowed: new hex colors, new font sizes for content, new shadow strings,
one-off radii. If you need one, add a token (Section 10).

Known legacy hex literals exist (`#173f35`, `#8a6800`, `#725900`, `#b88712`,
`#dcebe4`); they are listed in Section 11 and should be migrated to tokens, not
copied into new code.

---

## 5. Layout And Responsive Architecture

### 5.1 App shell (workspace routes `/app/*`)

| Region | Spec |
| --- | --- |
| Desktop sidebar | Fixed left, `w-64`, `bg-paper2`, `border-r border-line`, shown at `lg:` and up. Brand block on top, nav below. |
| Top bar | Sticky, `h-[72px]`, `bg-white/95 backdrop-blur`, `border-b border-line`, shown at `lg:`. Search left, notifications and profile right. |
| Content area | Centered, `max-w-5xl` (standard views) or `max-w-[1240px]` (dashboard). Padding scales with breakpoint. |
| Insight rail | Right, `w-[320px]`, `bg-paper`, `border-l border-line`, fixed below the topbar. Appears at `xl:` (dashboard) or `2xl:` (other views). Below that it becomes a drawer. |
| Mobile top bar | Compact bar with brand on the left; right side holds the optional insight trigger and the **account menu** (avatar), shown below `lg:`. |
| Mobile bottom nav | Fixed, `bg-white/95 backdrop-blur`, `border-t border-line`, 5 equal columns: Home, History, **raised center "+" button (logs a health event)**, Profile, Settings. Active item `text-teal`, inactive `text-muted`. Center button is `h-14 w-14 rounded-full bg-teal shadow-lift ring-4 ring-white -mt-8`. Content must reserve bottom padding for it. |

Public routes (`/`, `/signin`, `/signup`, `/onboarding`) use the image-led layout
in `PublicExperience.tsx` with a fixed scroll-reactive header (`.public-header.is-scrolled`).

### 5.2 Responsive rules

1. **Design at 320px first**, then enhance upward. `html`/`body` enforce `min-width: 320px` and `overflow-x: clip`.
2. **Never cause horizontal page scroll.** Use `min-w-0` on flex/grid children that contain text, `max-w-full`, and `truncate`. Horizontal scrolling is allowed only in intentional rows using `.scroll-row`.
3. **Collapse order on narrow screens:** multi-column grids stack to one column,
   side rails become drawers/bottom sheets, filter bars wrap or scroll.
4. **Modals become bottom sheets on mobile** (full width, `rounded-t-lg`, `max-h-[92vh]`)
   and right-anchored panels from `sm:` up (`sm:max-w-2xl`).
5. Keep one primary content column. Do not add a third persistent column outside the sidebar + rail pattern.
6. Test at 320, 375, 768, 1024, 1280, and 1536 widths.

---

## 6. Component Recipes (canonical)

Reuse these exact patterns. If you build a new component, derive it from these.
Source locations are given so you can copy the real code.

### Surfaces

```tsx
// Standard card: .surface-card (white, 1px line border, shadow-paper)
<section className="surface-card rounded-lg p-5">…</section>

// Interactive card (metric tiles, clickable summaries)
<button className="surface-card min-w-0 rounded-lg p-4 text-left transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-lift">…</button>

// Quiet card: .soft-card (off-white, lighter shadow) for nested or secondary groups
<div className="soft-card rounded-lg p-4">…</div>
```

### Buttons

```tsx
// Primary (one per area)
className="min-h-11 rounded-lg bg-teal px-5 text-sm font-extrabold text-white transition hover:bg-tealDark disabled:cursor-not-allowed disabled:opacity-50"
//   Add shadow-lift for a hero/primary submit. Compact variant: min-h-10 px-4.

// Secondary (outlined)
className="min-h-11 rounded-lg border border-line bg-white px-4 text-sm font-extrabold text-muted transition hover:border-teal/30 hover:text-teal"

// Icon button (square)
className="grid h-10 w-10 place-items-center rounded-lg text-muted transition hover:bg-well hover:text-ink"
//   Bordered variant: add "border border-line bg-white". Always include aria-label.
```

Rules: label in sentence case with a verb ("Save check-in"). Show a pending
label while saving ("Saving..."). Disable while saving or when invalid. Never
two filled-teal buttons side by side; make the secondary one outlined.

### Form controls

```tsx
// Text input (label above, 8px gap)
<label className="block min-w-0">
  <span className="text-sm font-extrabold text-ink">Label</span>
  <input className="mt-2 h-12 w-full rounded-lg border border-line bg-white px-4 text-sm outline-none transition placeholder:text-faint focus:border-teal focus:ring-2 focus:ring-teal/10 disabled:bg-well disabled:text-muted" />
</label>

// Input with leading icon: wrap in "relative", icon "absolute left-3.5 top-1/2 -translate-y-1/2 text-faint", input "pl-11"

// Search field (recessed until focused)
className="h-11 w-full rounded-lg border border-transparent bg-well pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-faint focus:border-teal/30 focus:bg-white focus:ring-2 focus:ring-teal/10"

// Textarea: same as input but "min-h-16 resize-none px-3 py-2" and bg-well → focus:bg-white

// Checkbox/toggle row: whole row is the label, "accent-teal" 20px checkbox, helper text beneath
```

- **Dropdowns use `AnimatedSelect`** (`src/components/AnimatedSelect.tsx`). Do not use a native `<select>` for visible UI.
- Every control has a visible label or `aria-label`. Placeholders are never the only label.
- Errors: `text-xs font-semibold text-rust` under the field with `role="alert"`.

### Badges and chips

Use `.badge` plus the status maps. Pattern:
`<span className="badge border border-emerald/20 bg-emerald/10 text-emerald"><span className="badge-dot" /><span>Label</span></span>`.
Neutral chip: `badge border border-line bg-well text-muted`. Always keep the
inner `<span>` last so truncation works, and set `title`.

### Metric / stat tile

Round icon chip (`h-10 w-10 rounded-full bg-teal/10 text-teal`) top-left, a
neutral badge top-right, label (`text-xs font-bold text-muted`), value
(`text-2xl font-extrabold`), detail (`text-xs font-semibold text-faint`),
optional progress bar. See `DashboardMetric` in `src/App.tsx`.

### Progress bar

`<div className="h-1.5 overflow-hidden rounded-full bg-well"><div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} /></div>`

### List rows / quick actions

Rows share a card with `border-b border-line last:border-b-0`, `px-4 py-3.5`,
`hover:bg-well/60`: leading round icon chip (`h-9 w-9 bg-teal/10 text-teal`), a
`flex-1 truncate` label, and a trailing `ChevronRight` that nudges on hover.
See `QuickAction`.

### Navigation

- **Desktop item:** `rounded-lg px-3 py-3 text-sm font-semibold`. Active: `bg-well text-teal shadow-[inset_3px_0_0_#2F7D69]`. Inactive: `text-muted hover:bg-well/70 hover:text-ink`. Icon size 19.
- **Mobile item:** icon 21 over an 11px label, active `text-teal`, inactive `text-muted`. The center "+" is the primary log action and always routes to Log Event.
- Navigation labels are one or two words. Keep five slots on mobile (four items plus the center action).
- **Account menu** (`src/components/AccountMenu.tsx`): avatar button opening a `shadow-float` panel with Health profile, Settings, and Sign out. Use it instead of a bare sign-out icon in any header.

### Overlays

- **Modal / drawer:** `fixed inset-0 z-50`; backdrop `bg-ink/45 backdrop-blur-sm` (click closes); panel `bg-paper`, `rounded-t-lg` on mobile and `sm:rounded-lg`, `border border-line`, `shadow-float` (existing modals use `shadow-2xl`, which is legacy), scrollable inside with `overscroll-contain`. Header: eyebrow (`font-mono`) + `font-serif` title + a close icon button.
- **Dropdown panel:** `absolute z-30 mt-2 rounded-lg border border-line bg-white shadow-float`, options `px-4 py-2.5 text-sm font-semibold`, hover/active `bg-well`, selected shows `text-teal` plus a 6px dot.
- Overlays trap interaction, close on Escape and backdrop click, and restore focus.

### Alerts and callouts

```tsx
// Urgent / error
<div role="alert" className="flex items-start gap-3 rounded-lg border border-rust/30 bg-rust/5 p-4">
  <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rust" />
  <p className="text-sm font-semibold leading-6 text-rust">…</p>
</div>

// Informational / educational
<div className="rounded-lg border border-teal/25 bg-teal/5 p-4"> <Info className="text-tealDark" /> … </div>
```

### Eyebrow + heading block

```tsx
<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Section label</p>
<h2 className="mt-2 font-serif text-3xl">Plain-language title</h2>
```

### States (every data view needs all four)

| State | Treatment |
| --- | --- |
| Loading | Centered `text-sm font-semibold text-muted` message in a stable-height container (`min-h-[284px]` style) so layout does not jump; the app boot uses a pulsing leaf. Do not show a blank panel. |
| Empty | Friendly one-line explanation and a single clear next action. Never a bare "No data". |
| Error | `text-rust` message, `role="alert"`, plus a retry or path forward. Never lose the user's typed input. |
| Success | Inline confirmation text ("Saved") or a changed control state. Avoid blocking toasts. |

---

## 7. Content, Tone, And Health-Safety UI Rules

Applies to every label, empty state, tooltip, and generated string.

1. **Never diagnose, prescribe, or recommend treatment** in UI copy. Use "you
   logged", "you mentioned", "consider discussing with your clinician".
2. **Urgent symptoms** are shown with `rust` styling, an `AlertTriangle` icon, and
   `role="alert"`. The content is fixed/curated text, calm and direct. Never
   generated by a model alone and never alarmist.
3. **AI/auto-extracted content is a draft.** It is always shown in an editable
   confirmation step before saving ("Review before saving"). Never imply it
   was verified by a clinician.
4. **The visit brief is "patient-generated".** Never label it doctor-authored, approved, or attested.
5. **Educational context** carries the "General education, not a diagnosis"
   framing (see `ConfirmModal`).
6. Voice: second person, plain, warm, short. Avoid jargon; if a medical term is
   needed, explain it in the same sentence.
7. Keep health content out of page `<title>`, URLs, and query strings. `title`
   tooltips may repeat only text already visible on screen.
8. Demo mode must be visibly distinguishable (synthetic data); do not change
   that labeling when restyling.
9. Never alter flows listed under "Do Not Regress These Decisions" in
   `docs/MASTER_PROJECT_CONTEXT.md` while restyling.

---

## 8. Motion And Interaction

- **CSS transitions** for hover/focus/state: `transition` (default) or
  `transition-[property]`, with `duration-150` to `duration-300`. `duration-500`
  only for data visuals like bar heights.
- **GSAP** for entrances, route/panel transitions, and overlays. House style:

| Intent | Settings |
| --- | --- |
| Backdrop in | `autoAlpha 0→1`, `0.22s` |
| Side panel / drawer in | `autoAlpha 0→1`, `x: 42→0`, `0.4s`, `power3.out` |
| Dropdown open | `y: -8→0`, `scale .98→1`, `0.32s`, `power3.out`; options stagger `0.035` |
| Dropdown close / exit | `0.16s`, `power2.in` |
| Content reveal | `y` small offset, `0.35-0.58s`, `power2.out` / `power3.out`; `.stagger-in` for lists |
| Ambient float (landing only) | `±5-7px`, 2.8-3.5s, `sine.inOut`, yoyo |

- Wrap GSAP in `gsap.context(...)` and `return () => context.revert()`. Use
  `clearProps` for transform/opacity/visibility/willChange when the animation
  is a one-shot so layout and stacking are not left modified.
- Animate `transform` and `opacity` only. Never animate width/height/top/left (except the existing progress/bar heights).
- **Respect `prefers-reduced-motion`.** `src/index.css` already collapses CSS
  durations globally. New GSAP code must skip or shorten animation when the
  media query matches.
- Add `will-change` only to the named entrance classes in `index.css`; remove under reduced motion.
- Motion explains change (something appeared, moved, was confirmed). It is never decoration that blocks input.
- Hover lift is `-translate-y-0.5`, nothing larger.

---

## 9. Accessibility

1. **Focus:** `index.css` gives every button/input/textarea/select a global
   `outline: 2px solid #c9a227; outline-offset: 2px` on `:focus-visible`. Text
   inputs additionally use `focus:border-teal focus:ring-2 focus:ring-teal/10`.
   Never remove focus indication (`outline-none` is allowed only when you supply the ring/border replacement).
2. **Contrast:** `ink` on `paper/white` and white on `teal` meet AA. `muted` is
   for secondary text. `faint` and `gold` on white do **not** reliably meet AA for
   small text; do not use them for essential content. Use `tealDark` for small teal text on tinted backgrounds.
3. **Targets:** 40px minimum, 44-48px for primary and form controls.
4. **Semantics:** real `<button>` for actions, `<a>`/router link for navigation,
   `<label>` for fields, `<nav>`, `<aside>`, `<header>`, `<main>`, `<section>`, `<article>`.
   Icon-only buttons need `aria-label`. Toggles use `aria-expanded`/`aria-pressed`.
   Custom listbox/menu patterns must support arrow keys, Enter, and Escape (see `AnimatedSelect`).
5. **Announcements:** errors and urgent notices use `role="alert"`.
6. **Never rely on color alone** (Section 4.1).
7. **Images:** meaningful images have `alt`; decorative ones use `alt=""`.
8. **Zoom/reflow:** layout must survive 200% zoom and 320px width without clipping.

---

## 10. Changing The System (Token Discipline)

The single biggest consistency risk is local one-offs. Therefore:

1. **New color / shadow / font / spacing needs** go into `tailwind.config.js`
   (`theme.extend`) as a named token with a role-based name, then are used by
   class. They do not go inline as hex or arbitrary values.
2. **New reusable look** (used in 2+ places) goes into `src/index.css` as a named
   class in the existing style (for example `surface-card`), or into a shared
   component in `src/components/`. Do not copy-paste 150-character class strings into a third location. Extract.
3. **Reuse before creating.** Check `src/components/` and the helper components in
   `src/App.tsx` (`DashboardMetric`, `QuickAction`, `ProfileField`,
   `SettingToggle`, `TypeBadge`, `StatusBadge`, `SeverityBadge`, `AnimatedSelect`, `ConfirmModal`) first.
4. **No new dependencies** for UI (component kits, icon packs, animation libs,
   chart libs) without explicit approval. Charts today are hand-built CSS bars.
5. **When the user changes the design on purpose** (new color, removed
   component, different radius), change the token/class once, update this
   document in the same change, and bump "Last updated". The doc must never lag the code.
6. Large page components are already big (`src/App.tsx` is ~2,400 lines).
   Put new views and reusable pieces in new files under `src/components/` rather than growing it further.

---

## 11. Legacy Drift: Do Not Copy These

These exist in the code today. They are inconsistencies, not precedents.
Do not replicate them. Fix them opportunistically when you touch the line.

| Where | Issue | Use instead |
| --- | --- | --- |
| `App.tsx` modal close buttons, `rounded border-line bg-paper2` | Bare `rounded` | `rounded-lg border border-line bg-white` |
| `App.tsx` ~line 1988 doc-prep button `rounded bg-teal … font-semibold` | Bare `rounded`, non-standard weight and padding | Primary recipe (Section 6) |
| `App.tsx` ~line 2348 `ConfirmModal` cancel button `rounded … px-5 py-3` | Bare `rounded` | Secondary recipe |
| `ConfirmModal` `font-serif text-4xl` plus other 4xl headings | Heavy heading size inside a compact modal | `text-2xl`-`text-3xl` for modal titles |
| `shadow-2xl` on modal panel and mobile nav, plus `shadow-sm`/`shadow-md` | Off-scale shadows | `shadow-float` / `shadow-lift` |
| `#173f35`, `#dcebe4`, `#f4f7f6` in classes, `#2F7D69` in `shadow-[inset_3px_0_0_#2F7D69]` | Hard-coded hex | Add/use a token (for example a `tealDeep` token or `bg-paper`) |
| `text-[#8a6800]`, `text-[#725900]`, `text-[#b88712]` | One-off dark-gold text colors | Add one `goldInk` token and use it everywhere |
| Global `:focus-visible` outline is gold `#c9a227` while inputs use teal | Two focus colors | Keep the global gold outline for buttons; use teal ring on text fields as today. Do not introduce a third. |
| `emerald` and `teal` are the same hex (`#2F7D69`) | Two names for one color | Keep both names: `emerald` = positive/symptom *meaning*, `teal` = brand *meaning*. Don't merge in code. |
| `font-serif` / `font-mono` naming | Names imply different families, but both are Nunito Sans | Treat as style hooks (4.2). Do not add real serif/mono fonts |

---

## 12. Reference Registry

Use this table to record each reference image/template the user supplies and,
importantly, **what was adopted from it**. An agent working from the same
reference reads this to stay consistent with earlier decisions.

| ID | Source (file / link) | Used for | Adopt (structure/pattern) | Explicitly not adopted |
| --- | --- | --- | --- | --- |
| REF-001 | `docs/ui-references/REF-001-ai-healthcare-home.jpeg` | Dashboard (home) | Greeting + subtitle header; hero banner with a prompt ("Not feeling well?"), short copy, one CTA and an illustration; row of icon quick-access tiles; "Popular checks" chips as quick-log shortcuts; "Health summary" with "See all" and mini-visual tiles; recent items list; tips card | Its green palette and gradients (kept Butta teal/paper tokens), AI-assistant branding and brain art, fitness metrics (steps, sleep, heart rate), doctor-finding features, stock photography |
| REF-002 | `docs/ui-references/REF-002-home-and-booking-flow.jpeg` | Mobile navigation, home header | Bottom nav with a **raised center "+" action**; avatar/bell cluster top right; search field on home; section headers with "See all"; step/segmented flows for later forms | Appointment-booking content, doctor profiles, its white-and-green skin, pill shapes beyond chips/FAB |

**Dashboard composition derived from these (keep when extending):** greeting and
"How are you feeling today?" → search (mobile only) → "Not feeling well?" banner
→ quick access (4 tiles) + quick log chips beside today's check-in → health
summary (3 tiles with mini bars/progress) → recent events → tip and botanical
cards in the right rail. The banner image fades into flat `bg-teal` via the
`.image-fade-left` class; do not reintroduce a gradient overlay.

Rules for the registry:

- Store images in `docs/ui-references/` (create it) and name them `REF-001-short-name.png`.
- Add a row *before* building from a new reference. Update it if the decisions change.
- If two references conflict, this document and the existing app win, then the more recent explicit user decision.

---

## 13. Pre-Merge UI Checklist

Run through this for every UI change. State in your reply anything you could not verify.

**System fit**
- [ ] Only existing color tokens used; no new hex values or arbitrary colors
- [ ] Radius is `rounded-lg` / `rounded-full` only; shadows are `shadow-paper|lift|float`
- [ ] Nunito Sans only; sizes from the Section 4.2 scale
- [ ] Reused existing components/recipes; no duplicated long class strings
- [ ] Icons from `lucide-react` at the established sizes (17-22; 18-19 typical)
- [ ] No new UI dependency

**Reference fidelity (when a reference was used)**
- [ ] Adopted structure, hierarchy, density, and interaction, not its skin
- [ ] Listed deviations from the reference in the reply
- [ ] Registry row added/updated (Section 12)

**Responsive**
- [ ] Checked at 320 / 375 / 768 / 1024 / 1280 / 1536
- [ ] No horizontal page scroll; long text truncates with `title`
- [ ] Mobile bottom nav does not cover content; overlays work as bottom sheets

**States and UX**
- [ ] Loading, empty, error, and success states exist and have stable layout
- [ ] One clear primary action per area; destructive actions confirm
- [ ] Forms: labels, validation message with `role="alert"`, disabled/pending states, no lost input
- [ ] AI/extracted data is editable and requires confirmation before saving

**Accessibility and motion**
- [ ] Keyboard path works; visible focus; targets 40px+
- [ ] Icon-only buttons have `aria-label`; color is never the only signal
- [ ] Animation uses transform/opacity, cleans up (`context.revert`), and honors reduced motion

**Product safety**
- [ ] Copy is non-diagnostic, plain, and sentence case
- [ ] Urgent states use curated copy with `role="alert"`
- [ ] `npm run lint` and `npm run build` pass
