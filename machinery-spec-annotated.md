# LandArk — Machinery & Equipment Module
## Design-Annotated Specification v0.1

> This document is the machinery module spec with design decisions, layout mode declarations, interaction pattern assignments, and component references applied. It should be read alongside `design.md`. Where the two conflict, `design.md` takes precedence.

---

## Layout Declaration

```
Mode: Mode 3 (list/register view) → Mode 2 (single equipment detail)
Transition: Mode 3 panel fades out (150ms ease-in), Mode 2 split view slides in (200ms ease)
Back navigation: Panel header back chevron returns from Mode 2 → Mode 3
```

---

## 1. Module Landing — Mode 3 (Full Content)

The machinery landing view is full-width. The map is not visible. This is a data-dense register that needs the full content area.

### 1.1 Stat Strip

Four stat cards across the top of the content area using the `stat-card` component.

```
[ Total Equipment ]  [ Services Due ]  [ In Maintenance ]  [ Active ]
```

- **Total Equipment** — neutral, `sage-600` value
- **Services Due** — `ochre-400` value if > 0, `sage-600` if 0
- **In Maintenance** — `ochre-400` value if > 0, `sage-600` if 0
- **Active** — `sage-600` value

Stat cards use `data-large` type token (Lato 900 36px). Labels use `label` token (JetBrains Mono 10px uppercase `earth-400`).

### 1.2 Category Tabs

Horizontal tab row immediately below the stat strip. Tabs filter the equipment list.

```
[ All ]  [ Tractors ]  [ Mowers ]  [ Seeders/Drills ]  [ Vehicles ]  [ Combines ]  [ Spreaders ]  [ Other ]
```

**Tab component:**
- Font: DM Sans 13px 400 weight
- Default state: `earth-500` text, no background, `parchment-300` bottom border
- Active state: `ink-900` text, `sage-500` 2px bottom border
- Tab bar bottom border: `1px solid parchment-300` full width
- No background fill on active tab — border only

### 1.3 Filter & Search Row

Below the category tabs. Three elements in a horizontal row:

- **Text search input** — DM Sans 13px, 36px height, `parchment-300` border, placeholder "Search by name, make or model…" — left-aligned, max-width 280px
- **Status filter** — select component, same height, label "Status", right of search
- **Export Inventory** — ghost button, right-aligned at far end of the row. Label: "Export inventory". On click: downloads CSV. No confirmation required — non-destructive.

### 1.4 Equipment List

Below the filter row. Full-width card list. Cards are not grouped visually — tabs handle category separation.

**Equipment card anatomy** (using `card` component contract):

```
┌─ [accent stripe] ──────────────────────────────────────────┐
│  [category icon]  Equipment Name              [status badge]│
│                   Make · Model · Year                       │
│                   [hours data]    [next service data]       │
└────────────────────────────────────────────────────────────┘
```

- Accent stripe: `sage-500` for Active, `ochre-400` for Maintenance, none for Stored/Sold
- Category icon: Material Symbols Outlined 20px `earth-400` — use `agriculture` for tractors, `directions_car` for vehicles, `precision_manufacturing` for machinery
- Equipment name: `heading-4` token (Lato 700 15px `ink-900`)
- Make · Model · Year: `body-small` token (DM Sans 12px 300 `earth-500`)
- Hours: JetBrains Mono 13px `ink-900` value + JetBrains Mono 9px uppercase `earth-400` label
- Next service: JetBrains Mono 13px — `ochre-400` if overdue, `ink-900` if not
- Status badge: `badge` component — Active → `sage-500`, Maintenance → `ochre-400`, Stored/Sold → neutral

**Interaction:**
Clicking a card transitions the view from Mode 3 → Mode 2. The card does not expand inline — it triggers a full layout mode transition. The selected machine becomes the subject of the Mode 2 detail panel.

### 1.5 Add Equipment

`+ Add Equipment` primary button sits in the top-right of the content area header, inline with the page title.

**Interaction — Pattern A (inline expansion):**
Clicking `+ Add Equipment` expands an inline form at the top of the equipment list, above the first card. The form pushes cards down. It does not open a modal or navigate away. A cancel affordance collapses the form. See §6 for form field detail.

---

## 2. Equipment Detail — Mode 2 (Split View + Map)

Selecting an equipment card transitions to Mode 2. The detail panel occupies 35% left. The map occupies 65% right, showing fields and tasks linked to this machine.

### 2.1 Panel Header (sticky)

```
┌────────────────────────────────────┐
│ ← [back chevron]  Equipment Name  │
│    Make · Model · Year            │
│    [status badge]                  │
└────────────────────────────────────┘
```

- Back chevron: Material Symbols `arrow_back` 20px `earth-400`. On click: returns to Mode 3 list.
- Equipment name: `heading-3` token (Lato 700 18px `ink-900`)
- Make · Model · Year: `body-small` token (DM Sans 12px 300 `earth-500`)
- Status badge: `badge` component per status mapping
- Panel header background: `parchment-100`. Bottom border: `1px solid parchment-300`.

### 2.2 Detail Tabs

Below the sticky panel header, within the scrollable panel body. Tabs navigate between detail sections.

```
[ Details ]  [ Service ]  [ Costs ]  [ Documents ]
```

Same tab component as the category tabs in Mode 3 (DM Sans 13px, `sage-500` active border).

### 2.3 Tab — Details

Displays equipment information in labelled field rows. No edit mode by default — fields are read-only. An `Edit` ghost button in the tab header triggers Pattern A (inline form expansion within the panel, fields become editable in place).

**Field rows:**
- Label: JetBrains Mono 9px uppercase `earth-400`
- Value: DM Sans 13px `ink-900`
- Row separator: `1px solid parchment-200`
- Row padding: `space-3` vertical, `space-4` horizontal

Sections within the tab (no heading — separated by a `parchment-300` divider line):

**Equipment**
- Category, Make, Model, Year, Number Plate, Serial Number, Fuel Type, Status, Notes

**Purchase & Financial**
- Date Purchased, Purchase Price, Purchased From, Warranty Expiry, Estimated Current Value

**Specifications**
- Dynamic key-value pairs rendered as the same field row pattern. Keys are JetBrains Mono 9px uppercase `earth-400`. Values are JetBrains Mono 13px `ink-900` (monospace for all spec values — these are measurements).

### 2.4 Tab — Service

**Service summary strip** (3 stat cards in a row within the panel):
```
[ Current Hours ]  [ Next Service Due ]  [ Last Service ]
```

Next Service Due stat card: value in `ochre-400` if overdue, `sage-600` if not.

**Service interval configuration:**
Collapsed by default. A `Configure interval` ghost button expands an inline configuration form (Pattern A) showing interval type and threshold. Collapses on save.

**Service history table:**
Uses the `data-table` component contract, constrained to panel width.

Columns: Date · Type · Hours · Cost · Notes

- Date: JetBrains Mono 11px `earth-500`
- Type: DM Sans 13px `ink-900`
- Hours: JetBrains Mono 11px `earth-500`
- Cost: JetBrains Mono 11px `earth-500`
- Notes: DM Sans 12px 300 `earth-500`, truncated to 1 line

**Record Service:**
`+ Record service` ghost button below the table. Triggers Pattern A — an inline form row expands below the button with fields: Date, Type, Hours at Service, Cost, Notes. Save collapses the form and appends the record to the table top.

### 2.5 Tab — Costs

**Cost summary strip** (4 stat cards):
```
[ Lifetime Cost ]  [ Monthly Average ]  [ Annual Cost ]  [ Cost per Hour ]
```

All values in `sage-600`. Currency values use JetBrains Mono for the number portion.

**Cost breakdown:**
Three category rows (Service & Maintenance, Fuel, Insurance) showing spend per category. Displayed as simple labelled rows with a JetBrains Mono value — not a chart. Charts are not part of the LandArk design system in v1.

### 2.6 Tab — Documents

List of uploaded documents. Each document row:
- Material Symbols `description` icon 20px `earth-400`
- Document name: DM Sans 13px `ink-900`
- Document type label: JetBrains Mono 9px uppercase `earth-400`
- Download icon: `download` 16px `earth-400`, right-aligned

`+ Upload document` ghost button at bottom of list. Triggers native file picker — no inline expansion needed.

### 2.7 Map Behaviour (Mode 2)

When an equipment detail is open:
- Map highlights all fields with tasks linked to this machine (`sage-500` fill 30% opacity, `sage-500` 2px stroke)
- If any linked task is overdue, that field highlights in `ochre-400` instead
- Map flies to the centroid of the estate on load (not to a specific field — the machine may operate across many)
- Clicking a highlighted field on the map scrolls the Tasks tab (if active) to that field's linked task, or switches to the Tasks context

### 2.8 Associated Tasks

Tasks linked to this equipment are shown as a compact list at the bottom of the Details tab (below the Specifications section), not as a separate tab. This keeps the tab count manageable.

Each task row:
- Task name: DM Sans 13px `ink-900`
- Status badge: `badge` component
- Clicking a task row navigates to the Tasks module detail for that task (Mode 3 → Mode 2 transition within Tasks)

---

## 3. Add / Edit Equipment Form

**Triggered by:** `+ Add Equipment` button (Mode 3, Pattern A inline) or `Edit` ghost button in detail panel (Mode 2, Pattern A inline within panel).

### 3.1 Required Fields
Make · Model · Type · Year · Status

### 3.2 Optional Fields
Serial Number · Number Plate · Purchase Date · Purchase Cost · Operating Hours · Fuel Type · Notes

### 3.3 Form Behaviour
- All fields use the `form-field` component contract (36px height, `parchment-50` bg, `sage-500` focus ring)
- Type field is a select — determines which Specifications fields appear below
- Operating hours field: JetBrains Mono input (numeric data)
- On save: form collapses (Pattern A), new card appears at top of list (Mode 3) or panel updates in place (Mode 2 edit)
- On cancel: form collapses with no changes
- Validation errors appear inline below each field using `ochre-400` border + `ochre-500` message text

---

## 4. Status Colour Mapping

| Status | Badge colour | Card accent stripe | Map highlight |
|---|---|---|---|
| Active | `sage-500` | `sage-500` | `sage-500` |
| Maintenance | `ochre-400` | `ochre-400` | `ochre-400` |
| Stored | neutral | none | none |
| Sold | neutral | none | not shown on map |

---

## 5. Interaction Summary

| Action | Pattern | Notes |
|---|---|---|
| Add equipment | Pattern A — inline form expansion | Expands at top of list in Mode 3 |
| Edit equipment | Pattern A — inline within panel | Fields become editable in place in Mode 2 |
| View equipment detail | Mode transition 3→2 | Full layout mode change, not a modal |
| Record service | Pattern A — inline form row | Expands below "Record service" button |
| Configure interval | Pattern A — inline config form | Expands below "Configure interval" button |
| Delete equipment | Pattern C — inline two-step confirm | "Delete · Are you sure? Confirm / Cancel" inline in panel |
| Export inventory | Direct action | Downloads CSV immediately, no confirmation |
| Upload document | Native file picker | No inline expansion |
| Back to list | Mode transition 2→3 | Back chevron in panel header |
