# LandArk — Design System

> Version 0.4 · March 2026

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

Colour in LandArk is not decoration — it carries meaning. The majority of the UI is neutral surface, slate text, and emerald tones. Green is reserved for active, healthy, and primary interactive states. Amber is reserved for attention, overdue, and warning states. Blue and red are permitted only for the two additional semantic states — in-progress and critical — that cannot be expressed through the primary palette without ambiguity. Introducing colour outside these roles dilutes the signal. A screen that uses colour sparingly communicates more than one that uses it freely.

### 1.4 Data First, Chrome Second

LandArk users are reading information between jobs. The interface exists to surface data clearly and quickly — not to express personality through UI decoration. Hierarchy must be immediately obvious. Key numbers must be readable at a glance. Avoid any element that adds visual weight without adding informational value.

### 1.5 Precision Without Coldness

LandArk is structured and consistent, but not clinical. Cool green-tinted surface backgrounds, slate text hierarchy, and weighted headings provide the clarity. Uppercase tracked labels and tight data formatting provide the precision. The balance between these two registers — considered surfaces, precise data — is the character of the app.

---

## 2. Colour System

### 2.1 Palette

#### Surface — cool green-tinted greys

| Token         | Hex       | Usage                                                    |
| ------------- | --------- | -------------------------------------------------------- |
| `surface-50`  | `#f6f8f6` | Primary page background                                  |
| `surface-100` | `#f1f5f1` | Secondary surfaces — cards, panels, side panel content  |
| `surface-200` | `#e2e8f0` | Table header backgrounds, hover states on rows           |
| `surface-300` | `#cbd5e1` | Component borders, input outlines, dividers, scrollbar   |

#### Green — primary brand and positive states

| Token       | Hex       | Usage                                                                         |
| ----------- | --------- | ----------------------------------------------------------------------------- |
| `green-100` | `#dcfce7` | Tinted positive backgrounds — task complete bg, available bg                 |
| `green-300` | `#86efac` | Light green accents, grassland category background                            |
| `green-400` | `#4ade80` | Secondary interactive elements, pastoral category, icon fills                 |
| `green-500` | `#13ec13` | **Primary action** — brand green, buttons, active nav indicator, FAB         |
| `green-600` | `#0fb80f` | Primary hover/pressed state                                                   |
| `green-700` | `#22c55e` | Semantic positive — task dots, available dots, filter indicators             |
| `green-800` | `#166534` | Dark green text on light green backgrounds                                    |

#### Deep — dark emerald surfaces

| Token      | Hex       | Usage                                             |
| ---------- | --------- | ------------------------------------------------- |
| `deep-700` | `#047857` | Avatar backgrounds, mid-dark interactive surfaces |
| `deep-800` | `#065f46` | CTA buttons in panels, toast success background   |
| `deep-900` | `#064e3b` | Sidebar border, secondary dark surface            |
| `deep-950` | `#022c22` | Sidebar background, deepest dark surface          |

#### Amber — warnings, attention, and service states

| Token       | Hex       | Usage                                                              |
| ----------- | --------- | ------------------------------------------------------------------ |
| `amber-100` | `#fef3c7` | Tinted warning backgrounds — service bg, maintenance bg           |
| `amber-300` | `#fcd34d` | Light amber accents, arable category background                    |
| `amber-400` | `#f59e0b` | **Secondary accent** — overdue tasks, service indicators, warnings |
| `amber-700` | `#92400e` | Amber text on light amber backgrounds                              |

#### Blue — informational and in-progress states

| Token      | Hex       | Usage                                                       |
| ---------- | --------- | ----------------------------------------------------------- |
| `blue-100` | `#dbeafe` | Tinted info backgrounds — in-progress bg, appointment bg   |
| `blue-400` | `#3b82f6` | In-progress dots, appointment/event indicators, info accent |
| `blue-700` | `#1e40af` | Blue text on light blue backgrounds                         |

#### Red — critical and high-priority states

| Token     | Hex       | Usage                                          |
| --------- | --------- | ---------------------------------------------- |
| `red-100` | `#fef2f2` | Tinted critical backgrounds — high-priority bg |
| `red-400` | `#ef4444` | High-priority dots, sold/removed indicators    |
| `red-700` | `#991b1b` | Red text on light red backgrounds              |

#### Slate — neutral text and metadata

| Token       | Hex       | Usage                                                     |
| ----------- | --------- | --------------------------------------------------------- |
| `slate-200` | `#e2e8f0` | Subtle backgrounds — todo bg, stored/neutral bg           |
| `slate-300` | `#cbd5e1` | Disabled UI, lighter borders                              |
| `slate-400` | `#94a3b8` | Metadata labels, secondary icons, column headers          |
| `slate-500` | `#64748b` | Secondary body text, card meta, placeholder text          |
| `slate-600` | `#475569` | Strong supporting text, badge text on neutral backgrounds |
| `slate-800` | `#1e293b` | High-emphasis secondary text                              |
| `slate-900` | `#0f172a` | Primary headings, primary body text                       |

#### Supplementary

| Token        | Hex       | Usage                                |
| ------------ | --------- | ------------------------------------ |
| `indigo-500` | `#6366f1` | Event type accent (calendar events)  |
| `orange-400` | `#f97316` | Medium-priority dot                  |
| `gray-500`   | `#6b7280` | Forestry category, disabled elements |

### 2.2 Colour Usage Rules

- **Surface** is the default background. `surface-50` for page backgrounds, `surface-100` for cards and secondary panels. These have a subtle cool-green tint — never use pure white (`#FFFFFF`).
- **Green** is the primary brand family. `green-500` is the signature brand green used for primary buttons, FAB, and active nav states. `green-700` is the semantic positive indicator for task completion and availability dots. `green-100` provides tinted backgrounds for positive states.
- **Deep** emerald tones are reserved for the sidebar and dark UI surfaces. `deep-950` is the sidebar background. `deep-800` is used for high-emphasis CTA buttons within panels and toast success messages.
- **Amber** handles all warning, attention, and overdue states. `amber-400` is the primary warning accent. `amber-100` provides warning backgrounds.
- **Blue** is used for informational and in-progress states only. `blue-400` for in-progress dots and appointment/event indicators. `blue-100` for tinted info backgrounds.
- **Red** is reserved for critical and high-priority indicators only. `red-400` for high-priority dots and sold/removed states. Never used for general warnings — use amber instead.
- **Slate** handles all neutral text, metadata, labels, and secondary UI. `slate-900` for primary text, `slate-400`–`slate-500` for secondary text and labels.
- No other colours are introduced into the UI.

### 2.3 Semantic Colour Mapping

| State                 | Colour Token                             | Usage                                                 |
| --------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Healthy / Complete    | `green-700` dot + `green-100` bg        | Task complete, machinery available, field established |
| Attention / Overdue   | `amber-400` dot + `amber-100` bg        | Task overdue, service due, maintenance required       |
| In Progress           | `blue-400` dot + `blue-100` bg          | Task in progress, appointment active                  |
| Scheduled / Neutral   | `slate-400` dot + `slate-200` bg        | Planned but not yet active, stored/barn               |
| Critical / High       | `red-400` dot + `red-100` bg            | High-priority task, sold/removed equipment            |
| Active / Selected     | `green-500` border + `green-100` bg tint| Selected item in panel or map                         |
| Primary action        | `green-500` bg, `deep-950` text         | Primary buttons, FAB                                  |
| Primary action (dark) | `deep-800` bg, white text               | CTA buttons in panels                                 |
| Data values           | `slate-800` or `slate-900`              | Key stat numbers                                      |
| Warning data          | `amber-400`                             | Stat numbers requiring attention                      |

---

## 3. Typography

### 3.1 Typefaces

| Role            | Family | Rationale                                                                                                                          |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **All UI text** | Inter  | Single typeface for the entire application. Clean, highly legible at all sizes, excellent weight range. Handles headings, body, labels, and data uniformly. |

Google Fonts import string:

```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap
```

CSS variables:

```css
--font-display: 'Inter', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'Inter', sans-serif;
```

### 3.2 Type Scale

| Token         | Size | Weight       | Line Height | Letter Spacing | Usage                                                              |
| ------------- | ---- | ------------ | ----------- | -------------- | ------------------------------------------------------------------ |
| `display`     | 30px | 700 (bold)   | 1.2         | -0.02em        | Page-level hero stats, estate name (`text-3xl`)                   |
| `heading-1`   | 24px | 700 (bold)   | 1.25        | -0.02em        | Page titles (`text-2xl`)                                          |
| `heading-2`   | 20px | 700 (bold)   | 1.3         | -0.01em        | Section headings (`text-xl`)                                      |
| `heading-3`   | 18px | 700 (bold)   | 1.4         | 0              | Sub-section headings, panel headings (`text-lg`)                  |
| `body-large`  | 16px | 400–500      | 1.5         | 0              | Featured body copy, dropdown labels (`text-base`)                 |
| `body`        | 14px | 400–500      | 1.5         | 0              | Standard body text, card titles, descriptions (`text-sm`)         |
| `body-small`  | 12px | 400          | 1.5         | 0              | Secondary metadata, timestamps, form labels (`text-xs`)           |
| `label`       | 10px | 700 (bold)   | 1.4         | 0.1em          | Section labels, column headers — always uppercase (`text-[10px]`) |
| `label-small` | 8px  | 700 (bold)   | 1.4         | 0.05em         | Avatar initials, micro labels — always uppercase (`text-[8px]`)   |
| `data`        | 14px | 600 (semi)   | 1.4         | 0              | Inline data values — hectares, counts, prices (`text-sm`)        |
| `data-large`  | 30px | 700 (bold)   | 1.0         | -0.02em        | Hero stat numbers — uses `slate-900` colour (`text-3xl`)         |

### 3.3 Weight & Style Rules

- Inter 700 (Bold) is the standard heading weight across all heading levels. Also used for labels (uppercase) and card titles.
- Inter 600 (Semibold) is used for data values, form labels, and stat numbers at smaller sizes.
- Inter 500 (Medium) is used for nav labels, dropdown items, and medium-emphasis body text.
- Inter 400 (Regular) is the default body weight for descriptions, metadata, and general prose.
- Inter 300 (Light) is not currently used. Avoid introducing it unless specifically required.
- Italics are not used in the UI.
- All label-role text (section headers, column headers, badge text) must be uppercase with wide tracking (`tracking-widest` or `letter-spacing: 0.1em`).
- Never use bold for emphasis within body text — use `slate-400` or `slate-500` colour to de-emphasise surrounding text instead.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: **4px**. All spacing values are multiples of this unit.

| Token      | Value | Usage                                            |
| ---------- | ----- | ------------------------------------------------ |
| `space-1`  | 4px   | Icon padding, tight internal gaps                |
| `space-2`  | 8px   | Nav item padding, badge padding                  |
| `space-3`  | 12px  | Card internal gaps, nav section padding          |
| `space-4`  | 16px  | Standard gap between related elements            |
| `space-5`  | 20px  | Card padding (internal)                          |
| `space-6`  | 24px  | Gap between cards, section sub-spacing           |
| `space-8`  | 32px  | Gap between major content sections               |
| `space-10` | 40px  | Page section separation                          |
| `space-12` | 48px  | Page-level padding, top/bottom of content areas  |

### 4.2 Layout Tokens

```css
--sidebar-collapsed:   56px;
--sidebar-expanded:    232px;
--sidebar-transition:  200ms ease;
--topbar-height:       56px;
--panel-width:         35%;
--map-width:           65%;
--content-padding:     32px;
--border-radius-sm:    4px;
--border-radius-md:    6px;
--border-radius-lg:    8px;
```

### 4.3 Page Chrome

**Sidebar** — fixed, full height, left edge. Collapsed to 56px (icon only) by default. Expands to 232px on hover, pushing the app shell right. Background is `deep-950` with a `deep-900` right border. Transition is 300ms ease-in-out. Never overlays content — always pushes.

**Top bar** — fixed, 56px height (`h-14`), spans the full width of the app shell (not the sidebar). Background is a gradient from `deep-900` to `deep-800` (`bg-gradient-to-r from-emerald-900 to-emerald-800`), white text. Contains breadcrumb (left), date display (right of breadcrumb), and user avatar (right). No page title, no search, no primary actions.

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

### 4.6 Density

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

LandArk is predominantly flat. Depth is communicated through border definition and background tone contrast, not drop shadows. Shadows are used sparingly and only for elements that genuinely float above the content (dropdowns, tooltips, map controls).

### 5.2 Shadow Scale

| Token         | Value                                 | Usage                                                    |
| ------------- | ------------------------------------- | -------------------------------------------------------- |
| `shadow-none` | none                                  | Cards at rest, panels, all flat surfaces                 |
| `shadow-sm`   | `0 1px 2px rgba(0,0,0,0.05)`         | Cards on hover, subtle lift                              |
| `shadow-lg`   | `0 10px 15px -3px rgba(0,0,0,0.1)`   | Map controls, dropdowns, floating panels                 |
| `shadow-xl`   | `0 20px 25px -5px rgba(0,0,0,0.1)`   | FAB button, elevated containers                          |
| glow (custom) | `0 0 20px {color}40`                 | Selected map features — coloured glow matching category  |

### 5.3 Border Rules

- Cards at rest: `1px solid surface-300` (`border border-slate-200`). No shadow.
- Cards on hover: `shadow-sm` only.
- Side panels: `1px solid surface-300` left border. No shadow.
- Sidebar: `1px solid deep-900` right border.
- Empty state placeholders: `2px dashed surface-300`.
- Map controls: `1px solid surface-300` with `shadow-lg`.

### 5.4 Border Radius Scale

| Token          | Value  | Usage                                                      |
| -------------- | ------ | ---------------------------------------------------------- |
| `rounded`      | 4px    | Small badges, inline tags                                  |
| `rounded-lg`   | 8px    | Cards, buttons, inputs, nav items, primary border radius   |
| `rounded-xl`   | 12px   | Map controls, panels, form sections, KPI cards             |
| `rounded-2xl`  | 16px   | Large containers                                           |
| `rounded-full` | 9999px | Avatars, status dots, pill badges, circular buttons (FAB)  |

Map container: no border radius — fills its container edge to edge.

---

## 6. Component Contracts

Each contract defines the exact visual anatomy of a component. When generating code, follow these contracts precisely.

---

### 6.1 Sidebar Navigation

**Collapsed (default):** 64px wide. Icons only. Brand mark: Material Icons `eco` icon in `green-500` at 24px, with `ml-0.5` offset. Nav labels hidden via `opacity-0` with 200ms opacity transition.

**Expanded (hover):** 220px wide. Brand name in Inter 700 (`text-lg font-bold tracking-tight`) white. Nav labels in Inter 500 14px (`text-sm font-medium`). Transition is 300ms ease-in-out on all properties.

**Container:** `deep-950` background, `deep-900` right border, white text. Full height, fixed position, `z-50`. Internal padding: `px-2.5` for nav items, `px-4` for logo.

**Nav item states:**

- Default: icon + label `rgba(255,255,255,0.6)` (`text-white/60`), no background
- Hover: icon + label white (`hover:text-white`), background `rgba(255,255,255,0.05)` (`hover:bg-white/5`)
- Active: background `green-500` at 20% opacity (`bg-primary/20`), text `green-500` (`text-primary`)
- Disabled: `text-white/20`, `cursor-not-allowed`

All nav items: `rounded-lg`, padding `px-2.5 py-2`, `gap-3` between icon and label, `transition-all duration-150`.

**Icons:** Material Icons, 20px (`text-[20px]`), `shrink-0`.

**Divider:** `border-t border-white/10`, `mx-4 my-3`.

**Footer:** Settings button same styling as nav items. User avatar: 32px circle (`w-8 h-8 rounded-full`), `green-500` at 30% opacity background with `green-500` at 50% opacity border (`bg-primary/30 border border-primary/50`), Inter 700 10px uppercase initials. Name in Inter 500 14px, role in 11px `text-white/50`.

---

### 6.2 Top Bar

Height: 56px (`h-14`). Background: gradient from `deep-900` to `deep-800` (`bg-gradient-to-r from-emerald-900 to-emerald-800`). White text. Horizontal padding: `space-6` (24px). `z-40`. Flex layout, items centered, `justify-between`.

**Left:** Breadcrumb. Ancestors in Inter 400 14px (`text-sm`) at 90% opacity. Current page in Inter 500 14px white. Date display: Inter 500 14px (`text-sm font-medium opacity-90`), positioned adjacent to breadcrumb.

**Right:** User avatar — 32px circle (`w-8 h-8 rounded-full`), `green-500` at 30% opacity background with `green-500` at 50% opacity border (`bg-primary/30 border border-primary/50`), Inter 700 12px white initials (`text-xs font-bold`).

No page title, no search, no primary actions in the top bar.

---

### 6.3 Card

Background: white (`bg-white`). Border: `1px solid surface-300` (`border border-slate-200`). Border radius: `rounded-lg` (8px). Padding: `space-3` (12px). No shadow at rest. On hover: `hover:border-primary/30 hover:shadow-sm transition-all`.

**Accent stripe:** 4px left border signals status (`border-l-4`). `green-500` for healthy/active. `amber-400` for attention required. `blue-400` for in-progress. `red-400` for critical. No stripe for neutral/scheduled.

**Anatomy (top to bottom):**

1. Category label — Inter 700 10px uppercase `slate-500` with wide tracking (`text-[10px] font-bold uppercase tracking-wider`)
2. Title — Inter 700 14px `slate-800` or `slate-900` (`text-sm font-bold`)
3. Meta — Inter 400 12px `slate-500` (`text-xs text-slate-500`)
4. Data row (optional) — Inter 600 14px values with 10px uppercase labels

**KPI card variant:** `p-4 rounded-xl border border-slate-100 bg-white`. Alert state: `border-red-200 bg-red-50/50` with `red-700` text and `red-500` icon. Label in Inter 700 10px uppercase `slate-500`, value in Inter 700 18px `slate-900`.

**Property card variant:** `p-3 bg-slate-50 rounded-lg`. Label in Inter 700 10px uppercase `slate-500`, value in Inter 500 14px `slate-800`.

Cards are never fully clickable. Individual actions within cards use explicit buttons or links.

---

### 6.4 Data Table

Container: white background, no outer border, overflow hidden.

**Header row:** No background. Bottom border `1px solid slate-100` (`border-b border-slate-100`). Inter 700 10px uppercase `slate-400` with wide tracking (`text-[10px] font-bold uppercase tracking-wider`). Padding: `py-3 px-5`.

**Body rows:** Inter 400 14px `slate-900` (`text-sm`). Padding: `py-4 px-3` (standard), `py-4 px-5` (first cell). Bottom border `1px solid slate-50` (`border-b border-slate-50`). Hover: `slate-50` background (`hover:bg-slate-50`). Cursor pointer. Selected row: `green-500` at 5% background with 2px left border in `green-500` (`bg-primary/5 border-l-2 border-l-primary`).

**Data/reference columns:** Inter 500 14px `slate-800` (`text-sm font-medium`).

**Progress bars (inline):** Track `h-2 bg-slate-100 rounded-full`. Fill `h-full rounded-full transition-all`. Colours: `green-500` (healthy), `amber-400` (warning), `red-400` (overdue).

**Alignment:** Text columns left. Numeric columns right. Status columns right.

---

### 6.5 Button

| Variant        | Background         | Text         | Border                        | Usage                           |
| -------------- | ------------------ | ------------ | ----------------------------- | ------------------------------- |
| Primary        | `green-500`        | `deep-950`   | none                          | One per view, main action       |
| Primary Dark   | `deep-800`         | white        | none                          | CTA buttons in panels           |
| Secondary      | `slate-100`        | `slate-600`  | none                          | Supporting actions              |
| Outline        | transparent        | `slate-600`  | `1px solid surface-300`       | Bordered supporting actions     |
| Ghost          | transparent        | `slate-500`  | none                          | Inline links, tertiary actions  |
| Destructive    | `red-600`          | white        | none                          | Delete, remove                  |
| Tab Active     | `green-500` at 20% | `green-500`  | `1px solid green-500` at 30%  | Active tab/toggle               |
| Tab Inactive   | `slate-50`         | `slate-500`  | `1px solid surface-300`       | Inactive tab/toggle             |
| Filter Active  | `slate-900`        | white        | none                          | Active filter pill              |
| Filter Inactive| `slate-100`        | `slate-600`  | none                          | Inactive filter pill            |

All buttons: Inter 700 14px (`text-sm font-bold`) for primary, Inter 500 (`font-medium`) for secondary/tabs. Padding: `py-2.5` vertical, varies horizontal. Border radius: `rounded-lg` (8px). No uppercase. No shadow. Hover: darken one tone step. Transition: `transition-colors`. Disabled: 40% opacity with `cursor-not-allowed`.

---

### 6.6 Badge / Status Pill

Font: Inter 500 12px (`text-xs font-medium`). Padding: `px-2 py-0.5` (standard) or `px-2.5 py-1` (with dot). Border radius: `rounded-full` (pill shape). Always solid filled — never outline only. Inline flex with centered items.

**Status badges** (with leading dot `w-1.5 h-1.5 rounded-full`, `gap-1.5`):

| State                | Background  | Text         | Dot          |
| -------------------- | ----------- | ------------ | ------------ |
| Complete / Available | `green-100` | `green-800`  | `green-700`  |
| Overdue / Warning    | `amber-100` | `amber-700`  | `amber-400`  |
| In Progress          | `blue-100`  | `blue-700`   | `blue-400`   |
| Neutral / Stored     | `slate-200` | `slate-600`  | `slate-400`  |
| Critical / Sold      | `red-100`   | `red-700`    | `red-400`    |

**Event type badges:** Inter 700 9px uppercase (`text-[9px] font-bold uppercase`). Padding: `px-2 py-1`. Border radius: `rounded` (4px).

**Inline tags:** Inter 500 10px (`text-[10px] font-medium`). Padding: `px-1.5 py-0.5`. `bg-slate-100 text-slate-600`. Border radius: `rounded` (4px).

**Count badges:** Inter 700 12px (`text-xs font-bold`). `bg-slate-100 text-slate-500`. Padding: `px-1.5 py-0.5`. Border radius: `rounded-full`.

---

### 6.7 Form Fields

Height: 36px. Background: white (`bg-white`) or `surface-50` for read-only. Border: `1px solid surface-300` (`border border-slate-200`). Border radius: `rounded-lg` (8px). Font: Inter 400 14px `slate-900` (`text-sm`). Padding: `px-3 py-1.5` (standard) or `px-3 py-2` (larger).

**Label:** Inter 600 12px uppercase `slate-500` (`text-xs font-semibold text-slate-500 uppercase`), above field, `mb-1` gap.

**Placeholder:** Inter 400 14px `slate-400`.

**Focus:** `2px ring green-500` at 30% opacity with `green-500` border (`focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none`).

**Error:** `1px solid amber-400` border. Inter 12px `amber-700` message below field.

**Read-only:** `bg-slate-50 border-slate-100 text-slate-700 font-medium`.

**Textarea:** Same as input. `resize-none` to prevent resize.

**Select:** Same as input. Custom chevron in `slate-400`. Never browser default.

**Checkbox:** `rounded border-slate-300 text-primary focus:ring-primary/30`.

**Form section container:** Groups of related fields wrapped in `p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3`. Section heading: Inter 700 12px uppercase (`text-xs font-bold uppercase tracking-wider`).

---

### 6.8 Split View Panel

Width: 35% of content area. Height: full content area. Background: `slate-50` at 80% opacity (`bg-slate-50/80`). Left border: `1px solid surface-300` (`border-l border-slate-200`). No shadow. Flex column, `shrink-0`.

**Panel header:** Padding `p-6`. Title in Inter 700 18px `slate-900` (`text-lg font-bold`). Subtitle/label in Inter 700 10px uppercase `slate-400` with widest tracking (`text-[10px] font-bold uppercase tracking-widest`). Close button: `p-1 hover:bg-slate-200 rounded transition-colors`, icon in `slate-400` at 18px. Bottom border `1px solid slate-200` when needed.

**Panel body:** Independently scrollable. Padding `p-6`. `flex-1 overflow-y-auto`. Custom scrollbar: 6px wide, transparent track, `slate-300` thumb with `slate-400` hover, 10px border radius.

**Panel footer (CTA):** `p-6 border-t border-slate-200 bg-white`. Full-width Primary Dark button (`bg-deep-800 text-white py-3 rounded-xl font-bold text-sm`).

**Collapse:** Transitions layout to Mode 1 at 200ms ease.

---

### 6.9 Map Container

Fills container edge to edge (`relative w-full h-full overflow-hidden`). Background: `deep-900` (`bg-emerald-900`). Overlay gradient: `bg-gradient-to-br from-emerald-950/30 via-transparent to-emerald-950/30`.

**Map controls:** Positioned bottom-right, `space-6` (24px) inset (`absolute bottom-6 right-6 z-20`). Flex column with `gap-2`. Button groups: `bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden`. Individual buttons: `p-2.5 hover:bg-slate-50`. Divider between grouped buttons: `border-b border-slate-100`. Icons: Material Icons 18px `slate-600`.

**Selected feature:** `green-500` fill at 30% opacity, `green-500` 2px stroke.

**Attention feature:** `amber-400` fill at 30% opacity, `amber-400` 2px stroke.

**In-progress feature:** `blue-400` fill at 20% opacity, `blue-400` 2px stroke.

**Critical feature:** `red-400` fill at 20% opacity, `red-400` 2px stroke.

**Field overlays:** `2px solid {categoryBorderColor}`, `rounded-[6px]`. Active state: `scale(1.02)`, `z-10`, coloured glow shadow `0 0 20px {color}40`.

**Selected feature badge:** `green-500` checkmark badge (`w-5 h-5 rounded-full bg-primary`), white check icon at 14px, positioned top-right.

**Field labels:** Text shadow `0 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)` for readability over map imagery.

**Overlay tooltips:** White background, `1px solid surface-300`, 4px border radius, Inter 12px `slate-900`.

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

No illustration. Centred layout with vertical padding (`text-center py-12`).

**Standard empty state:** Material Icons icon at 30px (`text-3xl`) in `slate-400`, `mb-2`. Heading in Inter 700 18px `slate-900` (`text-lg font-bold`), `mb-1`. Description in Inter 400 14px `slate-400` (`text-sm`), `mb-4`. Primary button if a direct action exists.

**Dashed placeholder (kanban/grid):** `p-4 border-2 border-dashed border-slate-200 rounded-lg text-center`. Text in Inter 400 12px `slate-400` (`text-xs`).

Copy tone: practical and direct. Never whimsical.

---

## 7. Motion & Interaction

### 7.1 Principles

Motion is purposeful and minimal. Every transition communicates a state change. No decorative animation.

### 7.2 Timing & Easing

| Token             | Value      | Usage                                           |
| ----------------- | ---------- | ----------------------------------------------- |
| `duration-fast`   | 120ms      | Hover states, colour changes                    |
| `duration-base`   | 200ms      | Sidebar expand, panel slide, layout transitions |
| `duration-slow`   | 300ms      | Drawer enter/exit, map fly-to                   |
| `duration-fade`   | 150ms      | Mode 3 content fade                             |
| `easing-standard` | `ease`     | All layout transitions                          |
| `easing-enter`    | `ease-out` | Elements entering                               |
| `easing-exit`     | `ease-in`  | Elements leaving                                |

### 7.3 Interaction Patterns

- **Hover (general):** Colour changes via `transition-colors`. Cards also gain `shadow-sm` and border colour shift (`hover:border-primary/30 hover:shadow-sm transition-all`).
- **Hover (map features):** Subtle scale lift permitted — `scale(1.02)` with coloured glow shadow. `transition-all duration-200`.
- **Focus rings:** `2px ring green-500` at 30% opacity (`focus:ring-2 focus:ring-primary/30 focus:border-primary`) on all form elements and interactive controls.
- **Sidebar expand:** Width transition at 300ms ease-in-out. Nav labels fade via `transition-opacity duration-200`.
- **Panel slide (Mode 2):** Panel animates 0→35%, map animates 100%→65%, simultaneously at `duration-base ease`.
- **Mode 3 transition:** Map fades out `duration-fade ease-in`, content fades in `duration-fade ease-out`.
- **Map fly-to:** Pan and zoom to selected feature at `duration-slow ease-in-out`.
- **FAB open:** Icon rotates 45° (`rotate-45`). Action buttons enter with staggered `fadeInUp` animation (200ms ease-out, 50ms stagger per item).
- **Toast notifications:** Enter with `slideDown` animation (300ms ease-out). Auto-dismiss after 4 seconds.
- **Loading:** Skeleton screens using `slate-200` blocks with shimmer. No spinners for content — spinners only for discrete form actions.

---

## 8. Iconography

### 8.1 Icon Set

**Material Icons** (`material-icons` web font). Only icon set used in LandArk.

Import (via Google Fonts):
```
https://fonts.googleapis.com/icon?family=Material+Icons
```

### 8.2 Icon Size Scale

| Tailwind Class | Size | Usage                                            |
| -------------- | ---- | ------------------------------------------------ |
| `text-[10px]`  | 10px | Micro icons — avatar initials context            |
| `text-sm`      | 14px | Small inline icons, checkmarks in overlays        |
| `text-base`    | 16px | Top bar icons, inline with body text              |
| `text-lg`      | 18px | Panel close buttons, map controls, nav standard   |
| `text-[20px]`  | 20px | Sidebar nav icons (explicit sizing, `shrink-0`)   |
| `text-xl`      | 20px | Medium emphasis icons                             |
| `text-2xl`     | 24px | Sidebar brand icon, FAB icon                      |
| `text-3xl`     | 30px | Empty state icons                                 |
| `text-4xl`     | 36px | Large empty state icons                           |

### 8.3 Icon Usage Rules

- Sidebar icons: 20px (`text-[20px]`), colour per nav state contract (`text-white/60`, `text-white`, or `text-primary`)
- Top bar icons: 16px (`text-base`), white (on gradient background)
- Map control icons: 18px (`text-lg`), `slate-600`
- Panel close icons: 18px (`text-lg`), `slate-400`
- Inline icons: 14–16px, matching text colour
- Icon containers: circular (`rounded-full`) or rounded square (`rounded-lg`) with background tint
- Icons never appear without a label except in the collapsed sidebar, top bar, and map controls
- Never use icons purely decoratively

---

## 9. Do / Don't Rules

Hard constraints. Non-negotiable.

### LandArk never:

- Uses pure white (`#FFFFFF`) or pure black (`#000000`) as background surfaces — use `surface-50` or `surface-100`
- Uses Lato, DM Sans, JetBrains Mono, Roboto, Arial, or system-ui as a visible typeface — Inter only
- Uses purple, teal, or pink anywhere in the UI
- Uses blue outside of in-progress and informational states
- Uses red outside of critical and high-priority states
- Uses gradient fills on any card or button
- Uses drop shadows on cards at rest — borders only; hover shadow is permitted
- Uses colour outside its defined semantic role
- Uses animation for decoration
- Introduces any colour not present in the defined palette
- Uses illustration in empty states
- Uses a spinner for content loading — skeleton screens only
- Uses modals or full-screen overlays — all interactions use inline expansion, panel content replacement, inline confirmation, or (exceptionally) a side drawer

### LandArk always:

- Uses `surface-50` (`#f6f8f6`) as the primary background, and `surface-100` or `slate-50` for secondary surfaces and panels
- Uses Inter as the sole typeface across all UI — headings, body, labels, and data
- Uses Inter 700 (bold) for all headings and card titles
- Uses uppercase with wide tracking (`tracking-widest`) for all section labels and column headers
- Uses `deep-950` (`#022c22`) with emerald gradient for sidebar and top bar dark surfaces
- Uses `green-500` (`#13ec13`) as the primary brand colour for buttons, FAB, active nav, and focus rings
- Uses the semantic dot + tinted background pattern for all status badges (green/amber/blue/slate/red)
- Uses `rounded-lg` (8px) as the default border radius for cards, buttons, and inputs
- Uses `rounded-full` for all pill badges, avatars, and status dots
- Uses `surface-300` (`#cbd5e1`) as the standard border colour across cards, panels, and dividers
- Uses `focus:ring-2 focus:ring-primary/30 focus:border-primary` focus rings on all form elements
- Uses solid filled badges — never outline
- Declares a layout mode (1, 2, or 3) for every screen in its spec
- Keeps the map accessible within one interaction from any Mode 2 screen
- Aligns all spacing to the 4px base grid

---

## 10. Changelog

| Version | Date     | Notes                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | Feb 2026 | Skeleton created                                                                                                                                                                                                                                                                                                                                                                                                             |
| 0.2     | Feb 2026 | Full document — colour, typography, spacing, layout modes, component contracts, motion, iconography                                                                                                                                                                                                                                                                                                                         |
| 0.3     | Feb 2026 | Layout mode diagrams corrected to include persistent sidebar. Modal contract removed and replaced with no-modal principle and four interaction patterns. Do/Don't updated accordingly.                                                                                                                                                                                                                                       |
| 0.4     | Mar 2026 | Merged version. Inter typography and surface/green/deep/amber/blue/red/slate colour system applied throughout. Structural content from design.md retained in full: hybrid mode screens (§4.5), no-modal patterns A–D (§6.10), panel footer CTA (§6.8), KPI and property card variants (§6.3), full button variant table (§6.5), data table selected row and progress bars (§6.4), map overlay states for all five statuses (§6.9), FAB and toast interaction patterns (§7.3), full icon size scale (§8.2). Do/Don't updated to reflect Inter-only typeface and surface/slate colour system. |
