# LandArk — Operations Module

## Design-Annotated Specification v0.1

> This document is the operations module spec with design decisions, layout mode declarations, interactin pattern assignments, and component references applied. It should be read alongside `design.md`. Where the two conflict, `design.md` takes precedence

## Layout Declaration

```
Mode: Mode 3 (list view) -> Mode 3 (sub group list view) -> Mode3 (transactions for a sub group) -> Mode 4 (single transaction view)
Transition: Mode 3 content fades out (150ms ease-in), Mode 4 split view slides in (200ms ease)
Back navigation: Panel header back chevron returns from Mode 4 -> Mode 3 (200ms ease)
```

## 1. Module Landing - Mode 3 (Full Content)

The operatiosn landing view is full-width. The map is not visible. This is a data-dense list that needs the full content area.

### 1.1 Stat Strip

Five stat cards across the top of the content area using the `stat-card` component.

```
[ Revenue ] [ Expenses ] [ Net Cash Flow ] [ Outstanding Recievables ] [ Pending Transactions ]
```

- **Revenue** - neutral
- **Expenses** - neutral
- **Net Cash Flow** - `sage-600` if > 0, `ochre-400` if  <= 0
- **Outstanding Recievables** - neutral
- **Pending Transactions** - neutral if 0, `ochre-400` if > 0

Stat cards to use `data-large` type token. Labels use `label` token.

### 1.2 Date-selector

Drop down menu to alter the selected time period. 5 options: Last 7 days, This Calendar Month, Last 30 days, This Calendar Year, Year to Date. Default to Last 30 days.

This drop down alters data loaded into both stat cards, as well as data shown on the screen. The selected time period should persist between the first mode 3 screen, and the second mode 3 screen.

### 1.3 Search Row

Below stat cards. Three elements in a horizontal row:

- **Text search input** - DM Sans 13px, 36px height, `parchment-300` border, placeholder "Search by group..." — left-aligned, max-width 280px
- **Sort by** - sort by highest/lowest revenue, expenses, net-cash flow, pending transactions
- **Export Expenses** - ghost button, right-aligned at far end of row. Label: "Export Groups". On click: downloads CSV. No Confirmation Required - non-destructive.

### 1.4 Group List

Below Search row. Full-width card list. Cards are not grouped visually - tabs handle category separation.

**Category card anatomy** (using `card` component contract):

```
┌─────────────────────────────────────────────────────────────┐
│  [category colour]  Category Name                           │
│                   [revenue data] [expenses data] [net cash flow]                       │                        [outstanding recievables] [pending transactions]
│                                                             │
└────────────────────────────────────────────────────────────┘
```

- **Category Colour** - random colour assigned to category - just a simple dot of colour
- **Category Name** - Category name - see below for initial categories
- **Revenue data** , **Expenses data**, **Net Cash Flow**, **Outstanding Receivables**, **Pending Transactions** - value + label. Value is based on the date-selector and changes when that value changes.

**Interaction**:

Clicking on a card transitions from Mode 3 -> Mode 3 with more narrowed down sub categories of that category. The card does not expand inline - it triggers a re-display of different data. The selected category becomes the subject of the new data.

### 1.5 Add Category

`+ Category` primary button sits in teh top of the content area header, inline with the page titel

**Interaction - Pattern A (inline expansion):**

clicking the button expands an inline form at the top of the Categories list, above the first card. The form pushes cards down. It does not open a modal or navigate away. A cancel affodance collapses the form.


## 2. Sub-Categories - Mode 3 (full list view)

Selecting a sub-category card transitions into Mode 3 where the category selected is the subject. The Mode 3 list is of sub categories within the selected category. It functions very similar to **1** .

### 2.1 Stat Strip

Five stat cards across the top of the content area using the `stat-card` component.

```
[ Revenue ] [ Expenses ] [ Net Cash Flow ] [ Outstanding Recievables ] [ Pending Transactions ]
```

- **Revenue** - neutral
- **Expenses** - neutral
- **Net Cash Flow** - `sage-600` if > 0, `ochre-400` if  <= 0
- **Outstanding Recievables** - neutral
- **Pending Transactions** - neutral if 0, `ochre-400` if > 0

Stat cards to use `data-large` type token. Labels use `label` token. Same as **1.1** except they are just on data of that category

### 2.2 Date-selector

Same as **1.2**

### 2.3 Search Row

Below stat cards. Three elements in a horizontal row:

- **Text search input** - DM Sans 13px, 36px height, `parchment-300` border, placeholder "Search by sub-cateogory..." — left-aligned, max-width 280px
- **Sort by** - sort by highest/lowest revenue, expenses, net-cash flow, pending transactions
- **Export Expenses** - ghost button, right-aligned at far end of row. Label: "Export Group". On click: downloads CSV. No Confirmation Required - non-destructive.

### 2.4 Sub-category List

Below Search row. Full-width card list. Cards are not grouped visually - tabs handle category separation.

**Sub-Category card anatomy** (using `card` component contract):

```
┌─────────────────────────────────────────────────────────────┐
│  [sub-category colour]  Sub-Category Name                           │
│                   [revenue data] [expenses data] [net cash flow]                       │                        [outstanding recievables] [pending transactions]
│                                                             │
└────────────────────────────────────────────────────────────┘
```

- **Sub-Category Colour** - random colour assigned to category - just a simple dot of colour
- **Sub-Category Name** - Category name - see below for initial sub-categories
- **Revenue data** , **Expenses data**, **Net Cash Flow**, **Outstanding Receivables**, **Pending Transactions** - value + label. Value is based on the date-selector and changes when that value changes.

**Interaction**:

Clicking on a card transitions from Mode 3 -> Mode 3 of same view but for that particular category.

### 2.5 Add Sub Category

`+ Sub Category` primary button sits in the top of the content area header, inline with the page title

**Interaction - Pattern A (inline expansion):**

clicking the button expands an inline form at the top of the Sub-Categories list, above the first card. The form pushes cards down. It does not open a modal or navigate away. A cancel affodance collapses the form.

## 3. Transactions View - Mode 3 (full list view)

Selecting a sub-category transistions to Mode 3. The transactions are full view, but clicking on a transaction transitions to mode 4.

### 3.1 Stat Strip

Five stat cards across the top of the content area using the `stat-card` component.

```
[ Revenue ] [ Expenses ] [ Net Cash Flow ] [ Outstanding Recievables ] [ Pending Transactions ]
```

- **Revenue** - neutral
- **Expenses** - neutral
- **Net Cash Flow** - `sage-600` if > 0, `ochre-400` if  <= 0
- **Outstanding Recievables** - neutral
- **Pending Transactions** - neutral if 0, `ochre-400` if > 0

Stat cards to use `data-large` type token. Labels use `label` token. Same as **2.1** except they are just on data of that sub-category

### 3.2 Date-selector

Same as **2.2** - controls only the initial stat cards

### 3.3 Search & Filter Row

Below stat cards. Three elements in a horizontal row:

- **Text search input** - DM Sans 13px, 36px height, `parchment-300` border, placeholder "Search by Name, Author, Date ..." — left-aligned, max-width 280px
- **Filter By** - Filters for Author, Payment Method, Date Range
- When no filters are applied, only 20 most recent transactions should be shown. When filters are applied, if transactions is > 20, it should be paginated. Filters can remain applied when using the search input. Should be a clear all filters button to return to normal.

### 3.4 Sub-category List

Below Search row. Full-width card list. Cards are not grouped visually - tabs handle category separation.

**Sub-Category card anatomy** (using `card` component contract):

```
┌─────────────────────────────────────────────────────────────┐
│   Transaction Title                                         │
│                       [date] [author] [transaction data]    │  
└─────────────────────────────────────────────────────────────┘
```

- **Sub-Category Name** - Transaction title - title of the transaction entry
- **Date** - date in which the transaction was logged
- **Author** - staff in which the transaction was authored by
- **Transaction Data** - Money which was exchanged either in or out. If outwards should be `ochre-400`, if inwards should be `sage-600`

**Interaction**:

Clicking on a card transitions from Mode 3 -> Mode 4. The card does not expand inline - it triggers a full layout mode transition. Selected transaction becomes subject of the Mode 4 panel

### 3.5 Log Transaction

`+ Log Transaction` primary button sits in the top of the content area header, inline with the page title.

**Interaction** - pattern A (inline expansion):

Clicking `+ Log Transaction` expands an inline form at the top of the transaction list, above the first card. The form pushes cards down. It does not open a modal or navigate away. A cancel avoidance collapses the form.

## 4. Transaction Detail - Mode 4 (List + Detail)

Selecting a transaction card transitions to Mode 4. The detail panel occupies 35% right. The list occupies 65% left, showing compressed version of mode 3.

### 4.1 Panel Header (sticky)

```
┌─────────────────────────────────────────────────┐
│ ← [back chevron]     Transaction Title          │
│                      [Edit Transaction]         │
└─────────────────────────────────────────────────┘
```

- Back chevron: Material Symbols `arrow_back` 20px `earth-400`. On click: returns to Mode 3 list.
- Transaction Title: `heading-3` token (Lato 700 18px `ink-900`)
- Edit Profile: Button to Edit profile
- Panel header background: `parchment-100`. Bottom border: `1px solid parchment-300`.

### 4.2 Detail Tabs

Below sticky panel header, within the scrollable panel body. Tabs navigate vetween detail sections.

[ Details ] [ Documents ]

DM Sans 13px, `sage-500` active border

### 4.3 Tab - Details

Displays transaction details in a mixture of labelled field rows and linked work items as card lists. No edit mode by default - fields are read only. Edit Transaction ghost button in panel header triggers Pattern A (inline form expansion with the panel where fields become editable in place).

**Field rows:**

- Label: JetBrains Mono 9px uppercase `earth-400`
- Value: DM Sans 13px `ink-900`
- Row separator: `1px solid parchment-200`
- Row padding: `space-3` vertical, `space-4` horizontal

Sections within the tab (no heading — separated by a `parchment-300` divider line):

**Transaction Information**

- Author, Date, Value, Description, Notes

**Linked Tasks**

- A list of clickable (clicking takes you to the task module and task detail for that task) tasks with the task title

**Linked Vehicles**

- A list of clickable (clicking takes you to the machinery module and machinery detail for that machine) machines with the machine name


### 4.4 Tab - Documents

Displays documents as a simple lists. Upload document button. This could be reciept pictures, invoices etc


## 5. Add Category form

**Triggered By**: `+ Add Category` button (Mode 3, Pattern A inline).

### 5.1 Required Fields

Category Name, and description.

### 5.2 Form Behaviour

- All fields use the `form-field` component contract (36px height, `parchment-50` bg, `sage-500` focus ring)
- On save: form collapses (Pattern A), new card appears at top of list (Mode 3) or panel updates in place (Mode 2 edit)
- On cancel: form collapses with no changes

## 6. Add Sub - Category form

**Triggered By**: `+ Add Sub-Category` button (Mode 3, Pattern A inline).

### 6.1 Required Fields

Sub - Category Name, and description.

### 6.2 Form Behaviour

- All fields use the `form-field` component contract (36px height, `parchment-50` bg, `sage-500` focus ring)
- On save: form collapses (Pattern A), new card appears at top of list (Mode 3) or panel updates in place (Mode 2 edit)
- On cancel: form collapses with no changes

## 7. Add Transaction form

**Triggered By**: `+ Add Category` button (Mode 3, Pattern A inline), or `edit transaction` ghost button in detail panel (Mode 4, Pattern A inline with panel).

### 7.1 Required Fields

Transaction Name, Author (filled in auto by whoever is logging it, but can be changed, Value (negative for outgoing, positive for incoming), Date (filled in auto to date today, but can be changed), Payment method

### 5.2 Form Behaviour

- All fields use the `form-field` component contract (36px height, `parchment-50` bg, `sage-500` focus ring)
- On save: form collapses (Pattern A), new card appears at top of list (Mode 3) or panel updates in place (Mode 2 edit)
- On cancel: form collapses with no changes
