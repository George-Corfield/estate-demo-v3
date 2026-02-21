# LandArk — Design System
> Version 0.2 · February 2026

---

## 0. How to use this document

This file is the single source of truth for LandArk's visual language. It is used in two ways:

1. **When writing specs** — reference the principles and tokens to describe intent. Use component contracts as templates for describing individual components.
2. **When generating code** — include this file (or the relevant sections) as context. Tokens, component contracts, and Do/Don't rules must be followed precisely.

When a spec is ambiguous, the **Philosophy** section takes precedence. When a spec is specific, **Tokens** and **Component Contracts** take precedence. The Do/Don't rules are hard constraints and are never overridden by a spec.

---

## 1. Philosophy

Five named principles that define every design decision. When in doubt, return here.

### 1.1 The Estate Office
LandArk belongs in the hands of a land agent or farm manager — not a tech founder. The aesthetic reference is a well-equipped estate office: OS maps on the wall, a leather-bound field register, a solid oak desk. Digital, but rooted. Every screen should feel considered and purposeful, not slick or fashionable. When choosing between two valid design options, choose the one that feels more like a tool built for the land.

### 1.2 The Land Is Always the Reference Point
The map is the heart of LandArk, not a feature within it. Even when a user is viewing a task list or a field record, they are viewing it in the context of where it sits on the land. The map persists wherever possible. Spatial context is never more than one interaction away. Design decisions that obscure or de-prioritise the map are wrong by default.

### 1.3 Earn Your Colour
Colour in LandArk is not decoration — it carries meaning. The majority of the UI is parchment, ink, and earth tones. Sage green is reserved for active, healthy, and primary interactive states. Ochre is reserved for attention, overdue, and warning states. Introducing colour outside these roles dilutes the signal. A screen that uses colour sparingly communicates more than one that uses it freely.

### 1.4 Data First, Chrome Second
LandArk users are reading information between jobs. The interface exists to surface data clearly and quickly — not to express personality through UI decoration. Hierarchy must be immediately obvious. Key numbers must be readable at a glance. Avoid any element that adds visual weight without adding informational value.

### 1.5 Precision Without Coldness
LandArk is structured and consistent, but not clinical. Warm parchment backgrounds, earthy supporting tones, and weighted sans-serif headings provide the warmth. Monospace labels and tight data formatting provide the precision. The balance between these two registers — warm surfaces, precise data — is the character of the app.

---

## 2. Colour System

### 2.1 Palette

| Token | Hex | Usage |
|---|---|---|
| `parchment-50` | `#FAF7F2` | Primary page background |
| `parchment-100` | `#F2EDE3` | Secondary surfaces — cards, panels, sidebar content |
| `parchment-200` | `#E5DDD0` | Table header backgrounds, hover states on rows |
| `parchment-300` | `#D4C9B8` | Component borders, input outlines, dividers |
| `sage-300` | `#96B882` | Active nav icon colour in sidebar, tinted hover backgrounds |
| `sage-400` | `#74A45A` | Secondary interactive elements, icon fills |
| `sage-500` | `#4E8C35` | **Primary action** — buttons, active nav indicator, links, healthy status |
| `sage-600` | `#3A6E24` | Stat/data numbers, sage text on light backgrounds |
| `sage-700` | `#264A16` | Dark sage text, high-contrast sage on parchment |
| `ochre-300` | `#E8B84B` | Tinted warning backgrounds, harvest/seasonal indicators |
| `ochre-400` | `#D49A20` | **Secondary accent** — overdue tasks, attention states, warnings |
| `ochre-500` | `#B87D0A` | Ochre text on light backgrounds |
| `earth-400` | `#9C7355` | Metadata labels, secondary UI text, column headers |
| `earth-500` | `#7A5540` | Secondary body text, card meta, placeholder text |
| `earth-600` | `#543A28` | Strong supporting text |
| `ink-800` | `#1E2218` | Sidebar background, dark surfaces |
| `ink-900` | `#141810` | Primary headings, primary body text |

### 2.2 Colour Usage Rules

- **Parchment** is the default surface. Never use pure white (`#FFFFFF`) as a background.
- **Sage** is only used for: primary buttons, active nav states, healthy/established field status, positive data values, and card accent stripes on healthy items. Never used purely decoratively.
- **Ochre** is only used for: overdue states, attention-required badges, warning indicators, and card accent stripes on items requiring action. Never used for positive or neutral states.
- **Earth** tones handle all secondary text, metadata, labels, and table headers. They are the workhorse of the palette.
- **Ink** is reserved for dark surfaces (sidebar) and primary text. Never used as a background colour in content areas.
- No other colours are introduced into the UI. There is no red for errors — use ochre. There is no blue for links — use sage.

### 2.3 Semantic Colour Mapping

| State | Colour Token | Usage |
|---|---|---|
| Healthy / Established | `sage-500` | Field established, task complete, machinery serviced |
| Attention / Overdue | `ochre-400` | Task overdue, service due, spray due |
| Scheduled / Neutral | `parchment-300` + `earth-500` text | Planned but not yet active |
| Active / Selected | `sage-500` border + `sage-300` bg tint | Selected item in panel or map |
| Primary action | `sage-500` | Buttons, active nav |
| Data values | `sage-600` | Key stat numbers |
| Warning data | `ochre-400` | Stat numbers requiring attention |

---

## 3. Typography

### 3.1 Typefaces

| Role | Family | Rationale |
|---|---|---|
| **Display / Headings** | Lato | Readable at a glance, even stroke weights, warm but not ornate. Weight-based hierarchy (700/900) rather than style contrast. |
| **Body / UI text** | DM Sans | Clean, legible at 12–13px, slightly warmer than Inter. Handles all prose, labels, and interface copy below heading level. |
| **Monospace** | JetBrains Mono | Reserved for structured data, measurements, grid references, dates, and column headers. Brings OS Maps-style technical precision to data. |

Google Fonts import string:
```
https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap
```

CSS variables:
```css
--font-display: 'Lato', system-ui, sans-serif;
--font-body:    'DM Sans', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

### 3.2 Type Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display` | Lato | 36px | 900 | 1.1 | -0.02em | Page-level hero stats, estate name |
| `heading-1` | Lato | 28px | 700 | 1.15 | -0.02em | Page titles |
| `heading-2` | Lato | 22px | 700 | 1.2 | -0.01em | Section headings |
| `heading-3` | Lato | 18px | 700 | 1.3 | 0 | Sub-section headings, modal titles |
| `heading-4` | Lato | 15px | 700 | 1.4 | 0 | Card titles, panel headings |
| `body-large` | DM Sans | 15px | 400 | 1.6 | 0 | Introductory or featured body copy |
| `body` | DM Sans | 13px | 400 | 1.6 | 0 | Standard body text, descriptions |
| `body-small` | DM Sans | 12px | 300 | 1.5 | 0 | Secondary metadata, timestamps |
| `label` | JetBrains Mono | 10px | 500 | 1.4 | 0.08em | Column headers, section labels — always uppercase |
| `label-small` | JetBrains Mono | 9px | 400 | 1.4 | 0.1em | Badge text, tag text — always uppercase |
| `data` | JetBrains Mono | 13px | 400 | 1.4 | 0 | Inline data values — hectares, hours, prices, coordinates |
| `data-large` | Lato | 36px | 900 | 1.0 | -0.02em | Hero stat numbers — uses `sage-600` colour |

### 3.3 Weight & Style Rules

- Lato 900 (Black) is used only for hero stat numbers and display-level text. Never used for body or UI copy.
- Lato 700 (Bold) is the standard heading weight across all heading levels.
- Lato 300 (Light) is never used for headings. It may appear in DM Sans for secondary metadata only.
- Italics are not used in the UI except for empty state copy or editorial notes.
- Never use bold DM Sans for emphasis — use `earth-500` colour to de-emphasise surrounding text instead.
- All monospace text used as labels must be uppercase. Monospace data values are sentence case.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: **4px**. All spacing values are multiples of this unit.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon padding, tight internal gaps |
| `space-2` | 8px | Nav item padding, badge padding |
| `space-3` | 12px | Card internal gaps, nav section padding |
| `space-4` | 16px | Standard gap between related elements |
| `space-5` | 20px | Card padding (internal) |
| `space-6` | 24px | Gap between cards, section sub-spacing |
| `space-8` | 32px | Gap between major content sections |
| `space-10` | 40px | Page section separation |
| `space-12` | 48px | Page-level padding, top/bottom of content areas |

### 4.2 Layout Tokens

```css
--sidebar-collapsed:   56px;
--sidebar-expanded:    232px;
--sidebar-transition:  200ms ease;
--topbar-height:       48px;
--panel-width:         35%;
--map-width:           65%;
--content-padding:     32px;
--border-radius-sm:    4px;
--border-radius-md:    6px;
--border-radius-lg:    8px;
```

### 4.3 Page Chrome

**Sidebar** — fixed, full height, left edge. Collapsed to 56px (icon only) by default. Expands to 232px on hover, pushing the app shell right. Transition is 200ms ease. Never overlays content — always pushes.

**Top bar** — fixed, 48px height, spans the full width of the app shell (not the sidebar). Contains breadcrumb (left) and avatar + notifications (right). Background is `parchment-50` with a `parchment-300` bottom border. No page title in the top bar — page title lives in the content area or panel header.

**Content area** — everything below the top bar and to the right of the sidebar. Behaviour depends on layout mode (see 4.4).

### 4.4 Layout Modes

LandArk has three distinct layout modes. Every screen belongs to exactly one mode. The mode must be declared in every screen spec.

In all three modes, the collapsed sidebar (56px) is a permanent fixture on the left edge. It is never hidden. The content area, top bar, and any panels always sit to the right of it.

---

#### Mode 1 — Full Map (Default)
The map occupies the entire content area to the right of the sidebar. No panel. This is the home/overview state.

```
┌──────┬─────────────────────────────────────────┐
│      │ Topbar                                   │
│ NAV  ├──────────────────────────────────────────┤
│      │                                          │
│ 56px │                 MAP                      │
│      │          (full content area)             │
│      │                                          │
└──────┴──────────────────────────────────────────┘
```

Used by: Overview / home screen.

---

#### Mode 2 — Split View (Map + Panel)
A panel occupies 35% of the content area (measured from the right edge of the sidebar) from the left. The map occupies the remaining 65%. The panel slides in smoothly — the map squeezes into its remaining space rather than being covered. Transition is 200ms ease.

When an item is selected in the panel, the map responds: the relevant field or asset is highlighted and the map flies to centre it.

```
┌──────┬──────────────┬────────────────────────────┐
│      │ Topbar                                     │
│ NAV  ├──────────────┼────────────────────────────┤
│      │              │                            │
│ 56px │ PANEL (35%)  │        MAP (65%)           │
│      │ scrollable   │        interactive         │
│      │              │                            │
└──────┴──────────────┴────────────────────────────┘
```

Used by: Fields, Tasks, Machinery, Inputs, Calendar.

> **Note on Calendar:** A full-width calendar would be a more conventional layout, but the Mode 2 split view (calendar panel + map) has been validated with stakeholders and is the confirmed approach for v1. Revisit if the calendar view is substantially redesigned in a future version.

Panel behaviour:
- Panel is independently scrollable
- Panel header is sticky within the panel
- Selecting a panel item highlights the corresponding map feature and flies the map to it
- Map retains full interactivity — user can still pan, zoom, and click features independently
- The panel can be collapsed by the user, returning to Mode 1 with a 200ms ease transition

---

#### Mode 3 — Full Content (No Map)
The map is replaced entirely by a standard content view to the right of the sidebar. Used for screens with no meaningful spatial relationship to the land. Transition from map modes uses a brief fade (150ms) rather than a slide, to signal a change in context.

```
┌──────┬─────────────────────────────────────────┐
│      │ Topbar                                   │
│ NAV  ├──────────────────────────────────────────┤
│      │                                          │
│ 56px │         FULL CONTENT VIEW                │
│      │       (standard page layout)             │
│      │                                          │
└──────┴──────────────────────────────────────────┘
```

Used by: Finance, Documents, Settings.

### 4.5 Hybrid Mode Screens

Some screens transition between layout modes based on user navigation depth. This is permitted and encouraged where it serves the data — the mode should always reflect the most useful context for the current view.

**Pattern — Register → Detail:**
The list/register view uses Mode 3 (full content, no map) because the data is dense and benefits from full width. Drilling into a single record transitions to Mode 2 (split view), where the map becomes relevant to that specific item. A back navigation affordance in the panel header returns to Mode 3.

> **Example — Machinery:** The equipment list view is Mode 3 (full-width register with category tabs, filters, and stat strip). Selecting a single piece of equipment transitions to Mode 2, where the equipment detail panel sits at 35% and the map shows fields and tasks linked to that machine.

Screens using this pattern must declare both modes in their spec, e.g. `Layout: Mode 3 (list) → Mode 2 (detail)`.

LandArk uses **medium density**. Specific values:

- Card internal padding: `space-5` (20px)
- Table row padding: `space-3` top/bottom, `space-5` left/right
- Form field height: 36px
- Gap between cards: `space-3` (12px)
- Gap between page sections: `space-8` (32px)
- Content area padding: `space-8` (32px) all sides

---

## 5. Elevation & Depth

### 5.1 Principles
LandArk is predominantly flat. Depth is communicated through border definition and background tone contrast, not drop shadows. Shadows are used sparingly and only for elements that genuinely float above the content (modals, dropdowns, tooltips).

### 5.2 Shadow Scale

| Token | Value | Usage |
|---|---|---|
| `shadow-none` | none | Cards, panels, all flat surfaces |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Subtle lift — top bar, sticky elements |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Dropdowns, floating panels |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.14)` | Modals only |

### 5.3 Border Rules

- All cards and panels: `1px solid parchment-300`. No shadow.
- Cards and panels: `border-radius-md` (6px)
- Buttons and badges: `border-radius-sm` (4px)
- Modals and drawers: `border-radius-lg` (8px)
- Inputs: `border-radius-sm` (4px)
- Map container: no border radius — fills its container edge to edge

---

## 6. Component Contracts

Each contract defines the exact visual anatomy of a component. When generating code, follow these contracts precisely.

---

### 6.1 Sidebar Navigation

**Collapsed (default):** 56px wide. Icons only. Brand mark: 24×24px `sage-500` rounded square, letter "L" in Lato 900 white. Section labels hidden. Nav labels hidden.

**Expanded (hover):** 232px wide. Brand name appears in Lato 700 `parchment-100`. Section labels in JetBrains Mono 8px uppercase `rgba(255,255,255,0.2)`. Nav labels in DM Sans 13px.

**Nav item states:**
- Default: icon `rgba(255,255,255,0.4)`, label `rgba(255,255,255,0.45)`, no background
- Hover: icon `rgba(255,255,255,0.65)`, label `rgba(255,255,255,0.65)`, background `rgba(255,255,255,0.05)`
- Active: 2px left border `sage-500`, background `rgba(78,140,53,0.15)`, icon `sage-300`, label `rgba(255,255,255,0.85)`

**Icons:** Material Symbols Outlined, weight 300, 20px.

**Footer:** Settings nav item at bottom, separated by `rgba(255,255,255,0.06)` top border.

---

### 6.2 Top Bar

Height: 48px. Background: `parchment-50`. Bottom border: `1px solid parchment-300`. Horizontal padding: `space-6` (24px).

**Left:** Breadcrumb. Ancestors in DM Sans 13px `earth-400`. Current page in DM Sans 13px 500 weight `ink-900`. Separator: `/` in JetBrains Mono 11px `parchment-300`.

**Right:** Notifications icon (Material Symbols Outlined, 20px, `earth-400`) and user avatar (28px circle, `sage-600` background, Lato 700 11px white initials).

No page title, no search, no primary actions in the top bar.

---

### 6.3 Card

Background: `parchment-100`. Border: `1px solid parchment-300`. Border radius: 6px. Padding: `space-5` (20px). No shadow.

**Accent stripe:** 3px left border signals status. `sage-500` for healthy/active. `ochre-400` for attention required. No stripe for neutral/scheduled.

**Anatomy (top to bottom):**
1. Category label — JetBrains Mono 9px uppercase `earth-400`
2. Title — Lato 700 14–15px `ink-900`
3. Meta — DM Sans 12px 300 weight `earth-500`
4. Data row (optional) — JetBrains Mono values with 9px uppercase labels

Cards are never fully clickable. Individual actions within cards use explicit buttons or links.

---

### 6.4 Data Table

Container: `parchment-100` background, `1px solid parchment-300` border, 6px border radius, overflow hidden.

**Header row:** `parchment-200` background. JetBrains Mono 9px uppercase 500 weight `earth-400`. Padding: 12px vertical, 20px horizontal.

**Body rows:** DM Sans 13px 400 `ink-900`. Padding: 12px vertical, 20px horizontal. `1px solid parchment-200` bottom border. Hover: `parchment-200` background. Last row has no bottom border.

**Reference/data columns:** JetBrains Mono 11px `earth-500`.

**Alignment:** Text columns left. Numeric columns right. Status columns right.

---

### 6.5 Button

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `sage-500` | white | none | One per view, main action |
| Secondary | transparent | `earth-500` | `1px solid parchment-300` | Supporting actions |
| Ghost | transparent | `sage-500` | none | Inline links, tertiary actions |
| Destructive | transparent | `ochre-500` | `1px solid ochre-300` | Delete, remove |

All buttons: DM Sans 13px 400 weight. Padding: 9px vertical, 18px horizontal. Border radius: 4px. No uppercase. No shadow. Disabled: 40% opacity.

---

### 6.6 Badge / Status Pill

Font: JetBrains Mono 9px 500 weight uppercase. Padding: 2px vertical, 7px horizontal. Border radius: 3px. Always solid filled — never outline only.

| State | Background | Text |
|---|---|---|
| Healthy / Complete | `sage-500` | white |
| Overdue / Warning | `ochre-400` | white |
| Scheduled / Neutral | `parchment-300` | `earth-500` |

---

### 6.7 Form Fields

Height: 36px. Background: `parchment-50`. Border: `1px solid parchment-300`. Border radius: 4px. Font: DM Sans 13px `ink-900`. Horizontal padding: `space-3` (12px).

**Label:** DM Sans 12px 500 weight `ink-900`, above field, `space-2` (8px) gap.

**Placeholder:** DM Sans 13px `earth-400`.

**Focus:** `2px solid sage-500` border. No glow.

**Error:** `1px solid ochre-400` border. DM Sans 12px `ochre-500` message below field.

**Select:** Same as input. Custom chevron in `earth-400`. Never browser default.

---

### 6.8 Split View Panel

Width: 35% of content area. Height: full content area minus top bar. Background: `parchment-50`. Right border: `1px solid parchment-300`. No shadow.

**Panel header (sticky):** 48px height. Lato 700 16px `ink-900`. `1px solid parchment-300` bottom border. `parchment-100` background. `space-4` (16px) horizontal padding. Collapse chevron at right edge.

**Panel body:** Independently scrollable. `space-4` (16px) padding.

**Collapse:** Transitions layout to Mode 1 at 200ms ease.

---

### 6.9 Map Container

Fills container edge to edge. No padding, border, or border radius. Map controls positioned bottom-right, `space-4` (16px) inset. Overlay tooltips: `parchment-50` background, `parchment-300` border, 4px border radius, DM Sans 12px.

**Selected feature:** `sage-500` fill at 30% opacity, `sage-500` 2px stroke.

**Attention feature:** `ochre-400` fill at 30% opacity, `ochre-400` 2px stroke.

---

### 6.10 No-Modal Principle

**LandArk does not use modals.** The map and panel canvas must remain visible and uninterrupted at all times. Overlays that cover the canvas break the core interaction model and are prohibited.

This is a hard constraint, not a preference. Every interaction that would traditionally use a modal must be redesigned using one of the following patterns:

---

**Pattern A — Inline expansion**
The triggering element expands in place to reveal a form or detail. Used for: editing a field record, adding a note, updating a task status. The surrounding content shifts to accommodate the expansion. Closing the expansion returns the element to its original state.

---

**Pattern B — Panel content replacement**
The panel content slides to a detail or edit view within the same panel column. A back navigation affordance returns to the list. Used for: viewing field detail, editing machinery records, creating a new task. The map remains fully visible throughout.

---

**Pattern C — Inline confirmation**
Destructive actions (delete, remove, archive) use a two-step inline pattern. The action button is replaced with "Confirm delete / Cancel" inline within the same element. No overlay. No interruption. Timeout of 5 seconds returns to the default state automatically if no selection is made.

---

**Pattern D — Side drawer (exceptional use only)**
For complex creation flows that cannot fit within the panel (e.g. adding a new field with boundary drawing, creating a financial record with multiple line items), a drawer may slide in from the right edge of the screen at up to 480px width. The drawer sits over the map only — never over the panel. The drawer has its own close affordance. This pattern requires explicit justification in the screen spec.

---

**Toasts and alerts:** Feedback messages (success, error, info) are delivered as toast notifications anchored to the bottom-right of the content area. They are non-blocking, auto-dismiss after 4 seconds, and never require user interaction to proceed.



---

### 6.11 Empty States

No illustration. Structure: JetBrains Mono 10px uppercase `earth-400` label → Lato 700 18px `ink-900` heading → DM Sans 13px `earth-500` description → primary button if a direct action exists.

Copy tone: practical and direct. Never whimsical.

---

## 7. Motion & Interaction

### 7.1 Principles
Motion is purposeful and minimal. Every transition communicates a state change. No decorative animation.

### 7.2 Timing & Easing

| Token | Value | Usage |
|---|---|---|
| `duration-fast` | 120ms | Hover states, colour changes |
| `duration-base` | 200ms | Sidebar expand, panel slide, layout transitions |
| `duration-slow` | 300ms | Modal enter/exit, map fly-to |
| `duration-fade` | 150ms | Mode 3 content fade |
| `easing-standard` | `ease` | All layout transitions |
| `easing-enter` | `ease-out` | Elements entering |
| `easing-exit` | `ease-in` | Elements leaving |

### 7.3 Interaction Patterns

- **Hover:** Colour changes only. No scale or lift transforms. `duration-fast`.
- **Focus rings:** `2px solid sage-500` on all interactive elements.
- **Sidebar expand:** Width + content margin transition simultaneously at `duration-base ease`.
- **Panel slide (Mode 2):** Panel animates 0→35%, map animates 100%→65%, simultaneously at `duration-base ease`.
- **Mode 3 transition:** Map fades out `duration-fade ease-in`, content fades in `duration-fade ease-out`.
- **Map fly-to:** Pan and zoom to selected feature at `duration-slow ease-in-out`.
- **Loading:** Skeleton screens using `parchment-200` blocks with shimmer. No spinners for content — spinners only for discrete form actions.

---

## 8. Iconography

### 8.1 Icon Set
**Material Symbols Outlined** — weight 300, optical size 20px. Only icon set used in LandArk.

Import: `Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0`

Standard size: 20px. Inline with text: 16px. Maximum: 24px.

### 8.2 Icon Usage Rules

- Sidebar icons: 20px, per nav state contract
- Top bar icons: 20px, `earth-400`
- Inline icons: 16px, matching text colour
- Icons never appear without a label except in the collapsed sidebar and top bar
- Never use icons purely decoratively

---

## 9. Do / Don't Rules

Hard constraints. Non-negotiable.

### LandArk never:
- Uses pure white (`#FFFFFF`) or pure black (`#000000`)
- Uses Inter, Roboto, Arial, or system-ui as a visible typeface
- Uses purple, blue, teal, pink, or red anywhere in the UI
- Uses gradient fills on any UI chrome, card, or button
- Uses pill-shaped buttons — maximum border radius on buttons is 4px
- Uses drop shadows on cards or panels — borders only
- Uses colour outside its defined semantic role
- Uses bold DM Sans for emphasis in body text
- Uses all-caps Lato for headings
- Uses animation for decoration
- Introduces any colour not present in the defined palette
- Uses illustration in empty states
- Uses a spinner for content loading — skeleton screens only
- Uses modals or full-screen overlays — all interactions use inline expansion, panel content replacement, inline confirmation, or (exceptionally) a side drawer

### LandArk always:
- Uses `parchment-50` or `parchment-100` as surface backgrounds
- Uses Lato 700 or 900 for all headings
- Uses DM Sans for all body and UI copy
- Uses JetBrains Mono for all data values, measurements, column headers, and badges
- Uses monospace labels in uppercase
- Uses the 3px left accent stripe on cards to communicate status
- Uses solid filled badges — never outline
- Declares a layout mode (1, 2, or 3) for every screen in its spec
- Keeps the map accessible within one interaction from any Mode 2 screen
- Applies `sage-500` focus rings on all interactive elements
- Aligns all spacing to the 4px base grid

---

## 10. Changelog

| Version | Date | Notes |
|---|---|---|
| 0.1 | Feb 2026 | Skeleton created |
| 0.2 | Feb 2026 | Full document — colour, typography, spacing, layout modes, component contracts, motion, iconography |
| 0.3 | Feb 2026 | Layout mode diagrams corrected to include persistent sidebar. Modal contract removed and replaced with no-modal principle and four interaction patterns. Do/Don't updated accordingly. |
