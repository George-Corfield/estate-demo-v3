# LandArk — Mobile Design System

> Version 0.1 · March 2026

---

## 0. How to use this document

This file extends the desktop design system (`design.md` v0.2) for mobile. It does **not** replace it — the philosophy, colour system, typography, spacing scale, and component contracts in the desktop document remain canonical. This document records every divergence, adaptation, and mobile-specific addition.

When a rule appears in both documents, this document takes precedence for mobile contexts. When this document is silent on a topic, fall back to the desktop document.

Mobile context is defined as: viewport width < 768px, or a native mobile shell (PWA or future native wrapper).

---

## 1. Philosophy Carried Forward

All five principles from the desktop design system apply unchanged on mobile. They are restated here in brief with their mobile implications.

**1.1 The Estate Office** — The tool-for-the-land aesthetic applies equally on a phone. If anything, mobile surfaces are used in the field by workers with gloves and limited attention. Simplicity and legibility are non-negotiable.

**1.2 The Land Is Always the Reference Point** — The map must remain accessible within one tap from any screen. On mobile the map is fullscreen by default. Panels slide over it rather than beside it.

**1.3 Earn Your Colour** — The same colour discipline applies. Sage for healthy/active/primary. Ochre for attention/overdue/warning. Parchment for surfaces. Ink for text. No additions.

**1.4 Data First, Chrome Second** — Screen real estate is tighter on mobile. Chrome must be even more minimal. Every pixel of navigation or decoration is a pixel stolen from operational data.

**1.5 Precision Without Coldness** — Warm surfaces, precise data. The balance is the same. Type sizes must be generous enough to read in daylight with a dirty thumb.

---

## 2. Colour System

Identical to the desktop document. No mobile-specific colour additions or overrides. All token names and hex values carry over unchanged.

The one mobile implication: `ink-800` is used as the bottom tab bar background (equivalent to the desktop sidebar). This preserves the dark-on-parchment visual split that orients the user spatially.

---

## 3. Typography

### 3.1 Typefaces

Same three typefaces. Same Google Fonts import string. Same CSS variables.

### 3.2 Mobile Type Scale

Mobile uses a condensed scale. Several desktop sizes are reduced by 1–2px to prevent overflow in constrained widths. The `data-large` token is the primary exception — it retains its 36px size in dashboard stat tiles because it must be readable at arm's length.

| Token         | Family         | Desktop Size | Mobile Size | Change                                            |
| ------------- | -------------- | ------------ | ----------- | ------------------------------------------------- |
| `display`     | Lato           | 36px         | 28px        | Reduced — page-level display moved to `heading-1` |
| `heading-1`   | Lato           | 28px         | 22px        | Reduced                                           |
| `heading-2`   | Lato           | 22px         | 18px        | Reduced                                           |
| `heading-3`   | Lato           | 18px         | 16px        | Reduced                                           |
| `heading-4`   | Lato           | 15px         | 14px        | Minimal reduction                                 |
| `body-large`  | DM Sans        | 15px         | 15px        | Unchanged — minimum comfortable body size         |
| `body`        | DM Sans        | 13px         | 14px        | Increased — legibility in field conditions        |
| `body-small`  | DM Sans        | 12px         | 12px        | Unchanged — minimum permissible size              |
| `label`       | JetBrains Mono | 10px         | 10px        | Unchanged                                         |
| `label-small` | JetBrains Mono | 9px          | 9px         | Unchanged — used sparingly                        |
| `data`        | JetBrains Mono | 13px         | 14px        | Increased — field readability                     |
| `data-large`  | Lato           | 36px         | 36px        | Unchanged — hero stat must be readable at arm's length |

### 3.3 Minimum Touch Type Size

No interactive label may render below 12px. No data value shown in context requiring action (tap, expand) may render below 13px.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

The 4px base unit is unchanged. The same token names apply. Mobile makes heavier use of the lower end of the scale and avoids `space-12` (48px) except where a safe zone demands it (see 4.3).

### 4.2 Layout Tokens (Mobile Overrides)

```css
/* Navigation */
--bottom-tab-height: 56px;
--top-bar-height: 52px;       /* taller than desktop for touch targets */

/* Panels */
--sheet-peek-height: 160px;   /* bottom sheet resting height above the map */
--sheet-expanded-height: 65vh;/* bottom sheet expanded height */
--sheet-full-height: 92vh;    /* bottom sheet full-screen height */

/* Content */
--content-padding-x: 16px;    /* standard horizontal page padding */
--content-padding-x-tight: 12px; /* list items, cards in tight contexts */

/* Safe zones */
--safe-bottom: env(safe-area-inset-bottom, 0px); /* iOS home bar */
--bottom-chrome-total: calc(var(--bottom-tab-height) + var(--safe-bottom));
```

### 4.3 Safe Area Rules

All fixed bottom chrome (tab bar, FAB, bottom sheet drag handle) must sit above the iOS home indicator safe zone. Use `padding-bottom: env(safe-area-inset-bottom, 0px)` on all bottom-anchored elements. Content scroll containers must have `padding-bottom` equal to `--bottom-chrome-total` to prevent content being hidden beneath the tab bar.

### 4.4 Touch Target Rules

- Minimum tappable area: **44×44px** for all interactive elements.
- Tab bar items: full tab bar height (56px) × equal column width.
- FAB: **52×52px**.
- Card tap targets: full card area is tappable (unlike desktop where cards are not fully clickable — see §6.3 override).
- List row tap targets: full row width, minimum 52px height.
- Icon buttons in headers: 44×44px tap area, centred on the visible icon.

### 4.5 Mobile Layout Modes

The desktop's sidebar-based layout modes (1, 2, 3, 4) do not translate directly to mobile. Mobile uses four equivalent modes centred on the bottom sheet and full-screen map.

Every mobile screen spec must declare one of the following modes.

---

#### Mobile Mode A — Full Map (Default)

The map fills the entire screen beneath the top bar. No bottom sheet. The floating nav sits at the bottom of the screen. A FAB in the bottom-right quadrant triggers the primary action for the current section.

When used as the **Overview / home screen**, a two-row widget strip sits between the map content and the floating nav, giving at-a-glance operational status across all six data domains without obscuring the map. See §6.15 for the widget strip contract.

```
┌──────────────────────────────┐
│ Top Bar (52px)               │
├──────────────────────────────┤
│                              │
│          MAP                 │
│       (full screen)          │
│                              │
│  ┌────────┬────────┬───────┐ │  ← Widget strip row 1
│  │ Tasks  │Weather │ Staff │ │
│  ├────────┼────────┼───────┤ │  ← Widget strip row 2
│  │Machry  │Inputs  │Activty│ │
│  └────────┴────────┴───────┘ │
│  ╔══════════════════════════╗ │  ← Floating nav
│  ║  Map  Tasks Fields Machr ║ │
│  ╚══════════════════════════╝ │
└──────────────────────────────┘
```

Used by: Overview / home screen.

---

#### Mobile Mode B — Map + Bottom Sheet (Peek)

The map remains full-screen beneath the top bar. A bottom sheet peeks at `--sheet-peek-height` (160px) above the bottom tab bar, showing a summary of the list (count, key stats). The user can drag the sheet up to Expanded (65vh) or Full (92vh). The map remains visible and interactive in Peek and Expanded states. In Full state the map is hidden — the sheet becomes a standard scrollable list.

```
┌──────────────────────────────┐
│ Top Bar                      │
├──────────────────────────────┤
│                              │
│          MAP                 │
│       (remains visible)      │
│                         [FAB]│
├──────────────────────────────┤  ← drag handle
│ SHEET PEEK (160px)           │  Summary: count + key stats
│                              │
├──────────────────────────────┤
│ Bottom Tab Bar               │
└──────────────────────────────┘
```

Dragged to Expanded:

```
┌──────────────────────────────┐
│ Top Bar                      │
├──────────────────────────────┤
│   MAP (visible, 35% height)  │
├──────────────────────────────┤  ← drag handle
│                              │
│  SHEET EXPANDED (65vh)       │
│  Scrollable list             │
│                              │
├──────────────────────────────┤
│ Bottom Tab Bar               │
└──────────────────────────────┘
```

Dragged to Full:

```
┌──────────────────────────────┐
│ Top Bar                      │
├──────────────────────────────┤
│                              │
│  SHEET FULL (92vh)           │
│  Scrollable list (map hidden)│
│                              │
│                              │
├──────────────────────────────┤
│ Bottom Tab Bar               │
└──────────────────────────────┘
```

Used by: Fields, Tasks, Machinery (list view).

Map interaction: selecting a map feature snaps the sheet to Peek and flies the map to that feature, highlighting it. Selecting a list item in the sheet flies the map to that item and highlights it on the map.

---

#### Mobile Mode C — Detail View (Full Screen)

A selected item opens a full-screen detail view, pushing the map and sheet off-screen to the right (standard iOS/Android push navigation). The top bar shows a back affordance (chevron-left icon + section name in DM Sans 13px `earth-400`). The FAB is absent unless the detail view has a primary action.

```
┌──────────────────────────────┐
│ ← Fields   [Item Title]      │  Top Bar with back
├──────────────────────────────┤
│                              │
│  DETAIL CONTENT              │
│  (full scroll)               │
│                              │
│                              │
├──────────────────────────────┤
│ Bottom Tab Bar               │
└──────────────────────────────┘
```

Used by: Field detail, Task detail, Machinery detail, Staff member detail.

A **Map Chip** (see §6.12) is embedded in the detail view wherever the item has a spatial location. Tapping it opens a fullscreen map overlay (Mode A) focused on that item, with a close button to return to the detail view.

---

#### Mobile Mode D — Full Content (No Map)

The full screen below the top bar is content. No map. No bottom sheet. Standard scrollable page layout. Used for sections with no meaningful spatial relationship to the land.

```
┌──────────────────────────────┐
│ Top Bar                      │
├──────────────────────────────┤
│                              │
│  FULL CONTENT VIEW           │
│  (standard scroll)           │
│                              │
│                              │
├──────────────────────────────┤
│ Bottom Tab Bar               │
└──────────────────────────────┘
```

Used by: Finance, Documents, Settings.

---

### 4.6 Density

Mobile uses **low density** to optimise for gloved, outdoor use. Specific values:

- Card internal padding: `space-4` (16px) — reduced from desktop's 20px
- List row padding: 14px vertical, 16px horizontal
- Section gap: `space-6` (24px)
- Page horizontal padding: `--content-padding-x` (16px)

---

## 5. Elevation & Borders

### 5.1 Principles

Same flat-first approach as desktop. Shadows remain reserved for floating elements. The bottom sheet is the primary floating element on mobile and uses `shadow-lg`.

### 5.2 Mobile-Specific Shadow Usage

| Element               | Shadow Token | Notes                                                    |
| --------------------- | ------------ | -------------------------------------------------------- |
| Bottom sheet          | `shadow-lg`  | Floats above map, always                                 |
| FAB                   | `shadow-md`  | Floats above map and sheet peek                          |
| Top bar (scrolled)    | `shadow-sm`  | Applied only when content has scrolled beneath it        |
| Bottom tab bar        | `shadow-sm`  | Persistent — always separates from content below         |
| Toast notifications   | `shadow-md`  | See §6.10                                                |

### 5.3 Border Rules

Unchanged from desktop for cards, inputs, and badges. The bottom sheet container has no border — its shadow defines the edge. The bottom tab bar has a `1px solid parchment-300` top border in addition to its shadow.

---

## 6. Component Contracts

Only mobile-specific components and desktop components requiring override are documented here. Components not mentioned carry their desktop contract unchanged.

---

### 6.1 Bottom Tab Bar (replaces Sidebar Navigation)

The persistent navigation surface on mobile. `ink-800` background, full device width, `--bottom-tab-height` (56px) height, with `--safe-bottom` padding below.

**Structure:** Four primary tabs. Each tab occupies equal width. A fifth overflow tab ("More") is used if a section requires secondary navigation not worthy of a primary tab slot.

**Default tab set:**

| Position | Label    | Icon (Material Symbols Outlined) |
| -------- | -------- | -------------------------------- |
| 1        | Overview | `map`                            |
| 2        | Fields   | `grass`                          |
| 3        | Tasks    | `checklist`                      |
| 4        | More     | `menu`                           |

> The tab set is defined per role. Worker view may expose Tasks and Fields prominently; Manager view may add Machinery or Finance. The exact tab set is declared in role-specific screen specs.

**Tab item anatomy:**

- Icon: Material Symbols Outlined, 22px (slightly larger than desktop for touch)
- Label: DM Sans 11px 400 weight, below icon, `space-1` (4px) gap
- Total icon + label block centred vertically within the 56px tab bar

**Tab item states:**

- Default: icon `rgba(255,255,255,0.4)`, label `rgba(255,255,255,0.4)`
- Pressed (active feedback): icon `rgba(255,255,255,0.65)`, label `rgba(255,255,255,0.65)`, background `rgba(255,255,255,0.05)` — 120ms ease
- Active: icon `sage-300`, label `sage-300`. A 2px `sage-500` top border spans the full tab width.

No badge count on tabs. Role-specific notification surfaces handle alerting (see §6.11).

---

### 6.2 Top Bar (Mobile)

Height: 52px. Background: `parchment-50`. Bottom border: `1px solid parchment-300`. Horizontal padding: 16px.

**Default state (no navigation):**

- Centre: Page title in Lato 700 16px `ink-900`.
- Right: Notifications icon (22px `earth-400`) and user avatar (30px circle).
- Left: Empty, or contextual action icon if applicable (e.g. filter).

**Navigation state (detail view):**

- Left: Chevron-left icon (22px `earth-400`) + ancestor label in DM Sans 13px `earth-400`. Full left area is tappable (44px minimum height, full remaining width).
- Centre: Current item title in Lato 700 15px `ink-900`, truncated with ellipsis if needed. Never wraps.
- Right: Contextual action icon (e.g. edit, share) or empty.

No breadcrumb path on mobile — only one level of back navigation is shown at a time.

---

### 6.3 Card (Mobile Override)

The desktop card contract applies with the following changes:

- Internal padding reduced to `space-4` (16px)
- **The full card is tappable on mobile** — unlike desktop where individual actions are required. Tap navigates to the detail view (Mode C).
- Hover state is absent. Active/pressed state: `parchment-200` background, 120ms ease.
- The accent stripe remains: 3px left border, same semantic mapping.
- Cards in list/panel contexts stack vertically with `space-3` (12px) gap between them.

---

### 6.4 Data Table (Mobile)

Full-width data tables are not used on mobile — column overflow is unacceptable. Instead:

- **Short tables (2–3 columns):** Standard table layout, full width, with `content-padding-x-tight` (12px) horizontal cell padding. Columns never exceed their data.
- **Wide tables (4+ columns):** Replaced by **Row Cards** — each table row becomes a card with label–value pairs arranged vertically. JetBrains Mono 9px uppercase `earth-400` label above DM Sans 14px `ink-900` value. Row Cards use the standard mobile card contract.
- **Financial tables:** Horizontally scrollable within a scroll container that is clearly indicated (fade gradient on right edge, `earth-400` scroll hint icon). Use only when tabular alignment is essential to comprehension.

---

### 6.5 Button (Mobile)

Desktop contract applies. Mobile additions:

- Minimum button height: 44px (padding adjusted to meet this — 11px vertical minimum).
- Full-width buttons (`width: 100%`) are permitted in detail views and empty states. Never in lists or map overlays.
- Buttons in a bottom sheet footer area stack vertically (primary above secondary) with `space-3` (12px) gap. Never side by side.

---

### 6.6 Badge / Status Pill

Unchanged from desktop contract. Same sizes, same colours, same JetBrains Mono 9px uppercase. Used in list rows and cards to communicate status at a glance.

---

### 6.7 Form Fields (Mobile)

Desktop contract applies. Mobile additions:

- Height increased to 44px (from 36px) for reliable tap target.
- Font size increased to `body` (14px on mobile) within the input.
- Form sections use `space-5` (20px) vertical gap between fields.
- Forms are always rendered in Mode D (full content) or within a full-height bottom sheet. Never on top of the map.
- The keyboard safe area must be respected: the active input scrolls into view above the keyboard. Ensure `scrollIntoView` or equivalent is implemented.

---

### 6.8 Bottom Sheet

The primary overlay mechanism on mobile. Replaces the desktop split-view panel.

**Container:** Full device width. Background `parchment-50`. Top-left and top-right border radius `border-radius-lg` (8px). Shadow: `shadow-lg`. No side borders.

**Drag handle:** Centred at the top of the sheet. 36px wide, 4px tall, `parchment-300` background, 2px border radius. `space-3` (12px) above, `space-3` below.

**Sheet header (sticky within sheet):** 48px height. Lato 700 15px `ink-900` title. Optional JetBrains Mono 9px uppercase `earth-400` sub-label (e.g. item count). `1px solid parchment-300` bottom border. `parchment-100` background. 16px horizontal padding.

**Sheet body:** Independently scrollable. 16px horizontal padding. `space-4` (16px) top padding below header.

**Sheet states:**

| State    | Height              | Map visible | Scroll |
| -------- | ------------------- | ----------- | ------ |
| Peek     | 160px above tab bar | Yes, fully  | No     |
| Expanded | 65vh                | Yes, ~35%   | Yes    |
| Full     | 92vh                | No          | Yes    |
| Closed   | 0 (off-screen)      | Yes, fully  | —      |

Snapping: the sheet snaps to Peek, Expanded, or Full on release. Intermediate positions are not resting states. Snap velocity threshold: 200px/s or half-state boundary, whichever comes first.

**Dismissal:** Dragging below Peek dismisses to Closed (map full screen). No swipe-to-dismiss in Full state — user must drag down past Expanded first.

---

### 6.9 FAB (Floating Action Button)

The primary action surface on map screens (Modes A and B).

**Anatomy:** 52×52px. `sage-500` background. `border-radius-md` (6px) — not circular. Material Symbols Outlined icon, 24px, white. `shadow-md`. Positioned `space-4` (16px) from the right edge, `space-4` above the bottom sheet drag handle or bottom tab bar (whichever is higher).

**Pressed state:** `sage-600` background, 120ms ease.

**Context-sensitive:** The FAB icon and action change per section:

| Section  | Icon              | Action                |
| -------- | ----------------- | --------------------- |
| Overview | `add_task`        | Quick-create task     |
| Fields   | `add_location_alt`| Add field note        |
| Tasks    | `add`             | Create task           |
| Machinery| `build`           | Log service event     |

The FAB is absent in Mode C (detail view) unless the detail view has a primary creation action (e.g. "Log spray" on a field detail). It is absent in Mode D (full content).

**FAB + sheet coexistence:** When the sheet is in Expanded state, the FAB repositions to sit above the sheet top edge. When the sheet is Full, the FAB is hidden (scale 0, 150ms ease-out).

---

### 6.10 Toast Notifications (Mobile)

Same semantics and timing as desktop (non-blocking, 4-second auto-dismiss). Mobile placement: anchored to the **top** of the screen, below the top bar, rather than bottom-right. This avoids conflict with the bottom sheet and FAB. Full-width minus 32px horizontal margin. `shadow-md`.

---

### 6.11 Alert Banner (Mobile-Only)

A persistent, non-dismissible attention strip used for role-level alerts that require action before the session ends (e.g. "3 tasks overdue", "Spray window closes in 2h"). Sits immediately below the top bar, above map or content.

**Anatomy:** 40px height. `ochre-300` background. JetBrains Mono 9px uppercase `ochre-500` label on left. DM Sans 13px `ink-900` message in centre. Ghost button (DM Sans 13px `ochre-500`) on right. `1px solid ochre-300` bottom border. 16px horizontal padding.

Used sparingly. At most one alert banner is shown at a time.

---

### 6.12 Map Chip (Mobile-Only)

A compact, tappable map preview embedded within a detail view (Mode C). Used to preserve the principle that spatial context is never more than one interaction away.

**Anatomy:** Full card width, 120px height. Map rendered at current field/asset location, centred and zoomed to feature, with the feature highlighted per `§6.9` of the desktop document. Non-interactive (no pan/zoom). Overlaid with a `parchment-50` pill button at bottom-right: Material Symbols `open_in_full` icon (16px `earth-400`) + DM Sans 12px `earth-500` label "View on map". `border-radius-md` (6px) on the container.

Tapping the chip or the pill opens a fullscreen map overlay (Mode A) centred on the item. A close button (`close` icon, 22px `earth-400`) in the top-right of the map overlay returns the user to the detail view.

---

### 6.13 No-Modal Principle (Mobile)

The desktop no-modal principle is carried forward. Modals and full-screen overlays that interrupt the spatial canvas are not used. The mobile equivalents of the four desktop interaction patterns:

**Pattern A — Inline expansion:** Applies unchanged. An item in a list or card expands in place within the bottom sheet. Surrounding items shift to accommodate.

**Pattern B — Sheet content replacement:** Within the bottom sheet, content slides to a detail or sub-list view horizontally. A back affordance (`chevron-left` + section label) in the sheet header returns to the list. The map and sheet height remain unchanged.

**Pattern C — Inline confirmation:** Identical to desktop. Destructive actions replace the triggering element with "Confirm / Cancel" inline. 5-second timeout returns to default. Never a full-screen prompt.

**Pattern D — Full-height bottom sheet (exceptional use only):** For complex creation flows (e.g. adding a new field with boundary drawing), the sheet expands to Full height. This is the mobile equivalent of the desktop side drawer. Requires explicit justification in the screen spec.

**Pattern E — Sheet collapse for map interaction:** Used whenever a form or flow requires the user to select a spatial feature (field, boundary, asset location) from the map mid-flow. This is the mobile equivalent of clicking a field on the desktop map while a panel is open — the capability is identical, only the gesture differs.

Three-step sequence:

1. **Trigger** — A tappable field row within the bottom sheet (e.g. "Field assigned" in a task creation form) contains a ghost button labelled "Select on map" with a `map` icon. Tapping it initiates the collapse.
2. **Collapse** — The sheet animates down to a slim confirmation bar (48px) anchored above the floating nav. This bar contains a single line of instruction text in DM Sans 13px `earth-400` (e.g. "Tap a field on the map") and a ghost "Cancel" button. The map is now fully visible and fully interactive. Duration: `duration-sheet-snap` (280ms) `easing-sheet`. The map flies to the estate extent so all fields are visible.
3. **Selection** — Tapping any field polygon highlights it (`sage-500` fill at 30% opacity, `sage-500` 2px stroke — same as desktop). A floating confirmation popup appears above the confirmation bar: field name in Lato 700 13px `ink-900`, field metadata in JetBrains Mono 9px `earth-400`, and a primary "Assign ✓" button. Tapping "Assign ✓" adds a Field Tag (see §6.16) to the form and animates the sheet back up to its previous height at `duration-sheet-snap`. Tapping "Add another" keeps the map open for a second selection. Tapping "Cancel" dismisses the popup and returns the sheet to its original height with no change.

The confirmation bar is always visible during step 2 and 3. It is never obscured by the map popup. Its background is `rgba(parchment-50, 0.85)` with `backdrop-filter: blur(16px)` and a `parchment-300` top border.

This pattern applies to any field in any form that references a spatial entity: assigning fields to a task, logging machinery location, pinning a field note, drawing an input application zone.

---

### 6.15 Overview Widget Strip (Mobile-Only)

The widget strip is the mobile equivalent of the desktop's Overview panel widgets. It surfaces all six operational data domains simultaneously on the home map screen without obscuring the map.

**Placement:** Floating above the floating nav, anchored to the bottom of the screen. The strip sits between the map content and the nav pill, with `space-3` (12px) gap above and below.

**Layout:** Two rows of three chips. Fixed 3-column grid, full width minus `space-4` (16px) horizontal margin each side. Each row is `space-3` (12px) tall gap.

**Widget chip anatomy:**
- Background: `rgba(ink-800, 0.62)` with `backdrop-filter: blur(20px)` — dark glass on the map. Adapts to `rgba(parchment-100, 0.82)` with `backdrop-filter: blur(20px)` if the map is hidden.
- Border: `1px solid rgba(255,255,255,0.09)`. Attention state: `1px solid rgba(ochre-400, 0.3)`.
- Border radius: `border-radius-lg` (8px).
- Padding: 10px vertical, 12px horizontal.
- Content (top to bottom): JetBrains Mono 8px uppercase `sage-300` label (or `ochre-300` if attention state) → Lato 900 20px white value → DM Sans 10px `rgba(255,255,255,0.45)` sub-label (or `rgba(ochre-300,0.7)` if attention state).
- The full chip is tappable. Tap navigates to the relevant section (same behaviour as tapping the nav tab, but scoped to that domain).

**Six chip domains and their attention triggers:**

| Position | Domain    | Label      | Value        | Sub-label example     | Attention trigger                  |
| -------- | --------- | ---------- | ------------ | --------------------- | ---------------------------------- |
| Row 1, 1 | Tasks     | TASKS      | Overdue count or total | "3 overdue"     | Any overdue tasks → ochre tint     |
| Row 1, 2 | Weather   | WEATHER    | Temperature  | Wind direction/speed  | Frost risk or spray warning → ochre|
| Row 1, 3 | Staff     | STAFF      | Total count  | "N on-site"           | Never attention state              |
| Row 2, 1 | Machinery | MACHINERY  | Active count | "in use now"          | Service due → ochre tint           |
| Row 2, 2 | Inputs    | INPUTS     | Low stock count | "low stock"        | Any low stock → ochre tint         |
| Row 2, 3 | Activity  | ACTIVITY   | Event count  | "today"               | Never attention state              |

**Colour discipline:** Ochre tint on a chip is a semantic signal — it means action is required, not that the number is large. A chip with 12 tasks and none overdue shows no tint. A chip with 1 task overdue shows the full ochre treatment. This mirrors the desktop's Earn Your Colour principle exactly.

---

### 6.16 Field Tag (Mobile-Only)

The field tag is a compact inline component used within forms to represent an assigned spatial entity (field, zone, boundary). It is added to a form field via Pattern E (sheet collapse for map interaction).

**Anatomy:** Inline flex element. `rgba(sage-500, 0.12)` background. `1px solid rgba(sage-500, 0.25)` border. `border-radius-sm` (4px). Padding: 3px vertical, 8px horizontal. Contents: 5px `sage-500` filled circle → DM Sans 11px `sage-600` field name → `×` dismiss button in DM Sans 11px `earth-400`.

**Multiple fields:** Tags wrap onto a second line if more than one field is assigned. A "Add another" ghost button follows the last tag: `map` icon (10px `sage-500`) + DM Sans 11px `sage-600` label. Tapping it re-enters Pattern E from step 1.

**Dismissal:** Tapping `×` removes the tag inline with no confirmation (it is not a destructive action — the field can be re-added immediately).

---

### 6.14 Empty States (Mobile)

Same structure as desktop: JetBrains Mono 10px uppercase `earth-400` label → Lato 700 18px `ink-900` heading → DM Sans 14px `earth-500` description → primary button if a direct action exists.

Full-width primary button on mobile. Max-width 280px, centred.

Copy tone: unchanged — practical and direct. Never whimsical.

---

## 7. Motion & Interaction

### 7.1 Principles

Unchanged from desktop. Motion is purposeful and minimal. Every transition communicates a state change. No decorative animation.

### 7.2 Timing & Easing

Desktop tokens carry over unchanged. Mobile additions:

| Token                 | Value         | Usage                                      |
| --------------------- | ------------- | ------------------------------------------ |
| `duration-sheet-snap` | 280ms         | Bottom sheet snap to resting state         |
| `easing-sheet`        | `spring`      | Sheet snap — use CSS spring or JS physics  |
| `duration-push`       | 300ms         | Mode C push navigation enter/exit          |
| `easing-push`         | `ease-in-out` | Push navigation                            |
| `duration-fab-hide`   | 150ms         | FAB hide when sheet reaches Full           |

### 7.3 Interaction Patterns (Mobile)

- **Tap:** Standard active feedback — `parchment-200` background at 120ms ease for list rows and cards.
- **Long press:** Not used. No hold-to-reveal patterns.
- **Swipe to dismiss toast:** Swipe gesture on toast notification dismisses it immediately.
- **Sheet drag:** Drag gesture on sheet handle or sheet body (when at top of scroll). Momentum respected. Snap on release.
- **Back navigation:** System back gesture (Android swipe from edge, iOS swipe from left edge) is the primary back affordance. The top bar back button is the secondary affordance. Both must work.
- **Focus rings:** Retained for accessibility on keyboard-capable devices. `2px solid sage-500`.
- **Skeleton loading:** Same as desktop — `parchment-200` shimmer blocks. No spinners for content.

---

## 8. Iconography

### 8.1 Icon Set

Material Symbols Outlined, weight 300. Unchanged.

### 8.2 Mobile Icon Sizes

| Context                 | Desktop Size | Mobile Size | Notes                              |
| ----------------------- | ------------ | ----------- | ---------------------------------- |
| Tab bar icons           | —            | 22px        | Mobile-only surface                |
| Top bar icons           | 20px         | 22px        | Larger tap target                  |
| FAB icon                | —            | 24px        | Mobile-only surface                |
| Inline with body text   | 16px         | 16px        | Unchanged                          |
| List row leading icon   | 20px         | 20px        | Unchanged                          |
| Card context            | 20px         | 20px        | Unchanged                          |

Icons on the tab bar and top bar never appear without an associated label (tab bar label or accessible title). The FAB icon operates without a visible label — a tooltip on long press is acceptable but not required.

---

## 9. Do / Don't Rules (Mobile)

All desktop Do/Don't rules apply. Mobile additions and overrides:

### LandArk mobile never:

- Uses horizontally scrolling main navigation (carousel tabs, swipeable nav)
- Uses a hamburger menu as the primary navigation — bottom tab bar is the navigation surface
- Uses bottom sheets that cannot be closed — all sheets must be dismissible to Mode A
- Uses pinch-to-zoom on content areas other than the map
- Places primary actions only in the top bar — primary actions belong to the FAB or the bottom sheet
- Shows more than one alert banner at a time
- Requires two-handed interaction for any primary task flow
- Uses full-width cards with no visual separation between them — always use `space-3` gap
- Uses pure horizontal button rows in sheet footers — stack vertically
- Uses ochre tint on a widget chip for any reason other than a genuine attention/action-required state
- Opens a separate screen to select a spatial entity in a form — Pattern E (sheet collapse) is always used instead
- Leaves a user stranded on the map during Pattern E with no visible way to cancel

### LandArk mobile always:

- Respects `env(safe-area-inset-bottom)` on all bottom-anchored chrome
- Ensures all tap targets are at minimum 44×44px
- Keeps the map accessible within one tap from any Mode B or C screen
- Applies `sage-500` focus rings for keyboard accessibility
- Uses the bottom tab bar as the sole top-level navigation surface
- Includes a visible back affordance in the top bar for all Mode C screens
- Declares a layout mode (A, B, C, or D) for every screen in its spec
- Aligns all spacing to the 4px base grid
- Shows the confirmation bar throughout Pattern E so the user always has a path back
- Displays the widget strip on the Overview (Mode A) home screen for all manager-role users

---

## 10. Role-Aware Navigation

Mobile surfaces two primary role experiences. The design system tokens and component contracts are identical — only the tab set and default mode differ.

### 10.1 Manager View

Full access to all sections. Default tab set: Overview / Fields / Tasks / More (containing: Machinery, Finance, Staff, Documents, Settings).

Default landing screen: Overview (Mode A — full map with estate summary overlay).

### 10.2 Worker View

Simplified navigation. Default tab set: Tasks / Fields / More (containing: Machinery, Settings).

Default landing screen: Tasks (Mode B — map with task list sheet at Peek).

Workers do not see: Finance, Staff management, Documents archive, or estate-level configuration settings.

The tab set is declared in role-specific screen specs. This document defines the maximum possible tab items — individual specs may further reduce the set.

---

## 11. Changelog

| Version | Date       | Notes                                                                                                 |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| 0.1     | Mar 2026   | Initial mobile design system — layout modes, navigation, spacing, component contracts, motion, rules  |
| 0.2     | Mar 2026   | Added §6.15 Overview Widget Strip, §6.16 Field Tag, Pattern E (sheet collapse for map interaction). Updated Mode A diagram to include widget strip. Updated Do/Don't rules accordingly. |
