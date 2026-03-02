# LandArk — Staffing Module

## Design-Annotated Specification v0.1

> This document is the staff module spec with design decisions, layout mode declarations, interactin pattern assignments, and component references applied. It should be read alongside `design.md`. Where the two conflict, `design.md` takes precedence

## Layout Declaration

```
Mode: Mode 3 (list/register view) -> Mode 4 (single staff member detail)
Transition: Mode 4 detail panel slides across and compresses list view in space on left
Back navigation: Panel header back chevron returns from Mode 4 -> Mode 3
```

## 1. Module Landing - Mode 3 (Full content)

The staff landing view is full width. This is a data desnse register that needs the full content area

### 1.1 Stat strip

3 stat cards across the top of the content area using the `stat-card` compontent

```
[Total Staff] [On Site] [Off Site]
```

* **Total Staff** - Neutral, `sage-600` value
* **On Site** - Neutral, `sage-600` value
* **Off Site** - Neutral, `sage-600` value

Stat cards use `data-large` type token. Labels use `label` token

### 1.2 Category Tabs

Horizontal tab row immediately below the stat strip. Tabs filter staff list

```
[All] [On Site] [Off Site]
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
- **Export Staff** — ghost button, right-aligned at far end of the row. Label: "Export inventory". On click: downloads CSV. No confirmation required — non-destructive.

### 1.4 Staff list

Below the filter row. Full-width card list. Cards are not grouped visually - tabs handle category separation.

**Staff card anatomy** ( using `card` component contract):

```
┌─ [accent stripe] ──────────────────────────────────────────┐
	│  [profile pic]  Employee name                 [status badge]│
	│                   Job Title • Team                          │
	│                   Permission Level                          │
	└────────────────────────────────────────────────────────────┘
```

- Accent stripe: `sage-500` for On Site, `ochre-400` for Off Site, none for Archived
- Profile Pic: Either a picture of the given person or if not available their initials in white on `sage-600` background. Both Circular
- Employee name: `heading-4` token (Lato 700 15px `ink-900`)
- Job Title · Team: `body-small` token (DM Sans 12px 300 `earth-500`) - Team may not be available so if blank leave blank
- Permission Level: JetBrains Mono 13px `ink-900` value + JetBrains Mono 9px uppercase `earth-400` label
- Status badge: `badge` component — On Site → `sage-500`, Off Site → `ochre-400`, Archived → neutral

**Interaction:**
Clicking a card transitions the view from Mode 3 → Mode 4. The card does not expand inline — it triggers a full layout mode transition. The selected employee becomes the subject of the Mode 4 detail panel.

### 1.5 Add Staff Member

`+ Add Equipment` primary button sits in the top-right of the content area header, inline with the page title.

**Interaction — Pattern A (inline expansion):**
Clicking `+ Add Equipment` expands an inline form at the top of the employee list, above the first card. The form pushes cards down. It does not open a modal or navigate away. A cancel affordance collapses the form. See §6 for form field detail.

## 2. Employee Detail — Mode 4 (List + Detail)

Selecting an Employee card transitions to Mode 4. The detail panel occupies 35% right. The list occupies 65% left, showing a compressed version of mode 3.

### 2.1 Panel Header (sticky)

```
┌─────────────────────────────────────────────────┐
│ ← [back chevron]                                │
│ ┌────────┐    Employee Name [status badge]      |  
| Profile Pic   Job Title • Team • Permission Level|
| |        |    Email • Phone Number              |  
│ |        |    [Edit Profile]                    |
| └────────┘                                      │
└─────────────────────────────────────────────────┘
```

- Back chevron: Material Symbols `arrow_back` 20px `earth-400`. On click: returns to Mode 3 list.
- Profile Pic: Either a picture of the given person or if not available their initials in white on `sage-600` background. Square. With accent stripe `sage-500` for On Site, `ochre-400` for Off Site, none for Archived
- Employee name: `heading-3` token (Lato 700 18px `ink-900`)
- Job Title • Team • Permission Level: `body-small` token (DM Sans 12px 300 `earth-500`)
- Email • Phone Number: `body-small` token (DM Sans 12px 300 `earth-500`)
- Status badge: `badge` component per status mapping
- Edit Profile: Button to Edit profile
- Panel header background: `parchment-100`. Bottom border: `1px solid parchment-300`.

### 2.2 Detail Tabs

Below the sticky panel header, within the scrollable panel body. Tabs navigate between detail sections.

[ Details ]  [ Work ]  [ Documents ]

Same tab component as the category tabs in Mode 3 (DM Sans 13px, `sage-500` active border).

### 2.3 Tab - Details

Displayes employee information in labelled field rows. No edit mode by default - fields are read-only. Edit Profile ghost button in panel header triggers Pattern A (inline form expansion witin the panel where fields become editable in pace).

**Field rows:**

- Label: JetBrains Mono 9px uppercase `earth-400`
- Value: DM Sans 13px `ink-900`
- Row separator: `1px solid parchment-200`
- Row padding: `space-3` vertical, `space-4` horizontal

Sections within the tab (no heading — separated by a `parchment-300` divider line):

**Employee Information**

* Full Name, Email, Mobile, Address, Emergency contact (name and number)

**Contract Information**

* Start Date, Contract type (full-time, part-time, contractor), Contracted Hours Per Week, Per Hour Salary

### 2.4 Tab - Work

Displays the employees current role description as well as their current work and history. No edit mode by default. Edit ghost button in header triggers Pattern A. Only the description is editable everything else is read-only.

**Current Work**

* Role & Team: card showing primary function
* Active tasks: Show all tasks with status of in progress and to do which are assigned to employee. Show these as a list of cards

**Activity History**

* Recent tasks: Show last 5 "done" tasks with their date of completion.

Clicking a task row navigates to Tasks module detail for that task

### 2.5 Tab - Documents

Displays 2 sets of documents as simple lists. Upload document button.

**Employee Records (Internal)**

- Signed Contract, Right to Work, P45,

**Qualifications & Certificates (Operational**

- Licenses, Safety Certificates
- Anything with an expiry should have an expiry date field with a status badge

## 3. Add Employee/ Edit Employee Form

**Triggered by**: `+ Add New Employee` button (Mode 3, Pattern A inline) or `Edit Profile` ghost button in detail panel (Mode 4, Pattern A inline with panel)

### 3.1 Required fields

Full Name, Email, Mobile, Address, Emergency Contact (name and number), start date, Contract type, Hours per week, per hour salary

### 3.2 Form Behaviour

- All fields use the `form-field` component contract (36px height, `parchment-50` bg, `sage-500` focus ring)
- Email needs to match a real email pattern
- Mobile needs to match a real mobile phone number pattern
- Contract Type field is a select — determines which Specifications fields appear below
- Hours per week field: JetBrains Mono input (numeric data)
- per hour salary field: JetBrains Mono input (numeric data)
- On save: form collapses (Pattern A), new card appears at top of list (Mode 3) or panel updates in place (Mode 2 edit)
- On cancel: form collapses with no changes
- Validation errors appear inline below each field using `ochre-400` border + `ochre-500` message text

## 4. Status colour mapping


| Status        | Badge Colour | Card Accent Stripe |
| --------------- | -------------- | -------------------- |
| On Site       | `sage-500`   | `sage-500`         |
| Off Site      | `ochre-400`  | `ochre-400`        |
| Archived      | neutral      | neutral            |
| Valid         | `sage-500`   |                    |
| Expiring Soon | `ochre-400`  | `ochre-400`        |
| Expired       | `ochre-500`  | `ochre-500`        |

## 5. Interaction Summary



| Action               | Pattern                              | Notes                                                      |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------ |
| Add employee         | Pattern A — inline form expansion   | Expands at top of list in Mode 3                           |
| Edit employee        | Pattern A — inline within panel     | Fields become editable in place in Mode 4                  |
| View employee detail | Mode transition 3→4                 | Full layout mode change, not a modal                       |
|                      |                                      |                                                            |
|                      |                                      |                                                            |
| Delete equipment     | Pattern C — inline two-step confirm | "Delete · Are you sure? Confirm / Cancel" inline in panel |
| Export employees     | Direct action                        | Downloads CSV immediately, no confirmation                 |
| Upload document      | Native file picker                   | No inline expansion                                        |
| Back to list         | Mode transition 2→3                 | Back chevron in panel header                               |
