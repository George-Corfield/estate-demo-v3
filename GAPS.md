# SoilArk / LandArk — Developer Gap Document

> Generated from: codebase audit + "The Full Picture: LandArk Architecture vs. Field Reality" review document
> Date: 2026-03-28

This document is a developer-facing list of what is missing, incomplete, or misaligned in the current SoilArk prototype relative to the architecture vision and user research. Items are ordered by strategic priority, not build complexity.

---

## 1. CONTEXTUAL ACTIVITY THREADS — MISSING ON MOST ENTITIES

**What the doc says:** Every field, task, machinery record, and animal record needs embedded comments, photos, and observations attached directly to the entity — not in a chat thread somewhere else. "Comments are attached to the specific work item they concern" (GitHub Issues model). This replaces the WhatsApp-replacement need more elegantly than a messaging system.

**Current state:**
- `tasks` have a `comments: []` array with author/date/text — partially there
- `fields` have `activities[]` but these are structured, form-based entries — not a lightweight observation thread
- `machinery` and `staff` records have no comment/note thread at all
- No photo attachment to comments anywhere

**What needs building:**
- A generic `<ActivityThread>` shared component — lightweight, append-only, supports text + optional photo
- Wire it to: Field detail, Machinery detail, Staff detail, Task detail (supplement existing comments)
- Add `observations: []` to the data model for machinery and staff in AppContext
- Reducer actions: `ADD_OBSERVATION` (generic, entity-type + entity-id approach)
- This is the cornerstone of the "data exists but has no memory" value proposition

---

## 2. OPERATIONS / FINANCE MODULE — IN SPEC, NOT BUILT

**What the doc says:** Tracking field gross margins, input costs, transaction history, and expenses is central to the event ledger value. Tom wants to understand field-level gross margins and compare stewardship sections vs arable sections. David runs double-entry across Gatekeeper and Landmark Key Accounts.

**Current state:**
- Disabled in navigation (`enabled: false` in `constants/navigation.js`)
- No route in `App.jsx`
- No module directory under `src/modules/`
- AppContext has no financial state
- FAB "Add Expense" button is disabled

**What needs building:**
- New route: `/operations`
- New module: `src/modules/operations/` with:
  - `OperationsPage.jsx`
  - `TransactionList.jsx` — income + expense ledger
  - `TransactionCreateForm.jsx`
  - `CostCategoryView.jsx` — breakdown by category (inputs, labour, machinery, compliance)
- AppContext additions:
  - `transactions: []` to initial state
  - Actions: `ADD_TRANSACTION`, `UPDATE_TRANSACTION`, `DELETE_TRANSACTION`
- `Transaction` shape: `{ id, date, type ('income'|'expense'), category, amount, currency, fieldIds, machineryId, taskId, description, evidenceFiles, source }`
- Link transactions to: fields, tasks, machinery service records
- Enable the FAB "Add Expense" action
- Field detail view: add a "Financials" tab showing linked transactions + running cost per hectare

---

## 3. MACHINERY INTEGRATION — FILE IMPORT, NO API YET

**What the doc says:** David's #1 concern about switching is machinery compatibility (CLAAS, Case, John Deere). The MVP answer is structured CSV/ISO-XML file import from major telematics systems. Native API connections (John Deere Operations Center, CLAAS telematics) are post-MVP but the event schema must accommodate machine-generated events from day one.

**Current state:**
- No import mechanism anywhere in the codebase
- Machinery module accepts manual entry only
- No mention of ISO-XML, ISOBUS, or telematics in any file

**What needs building:**
- File import UI on the Machinery detail view — "Import data from tractor system" button
- Parser module: `src/utils/machineryImport.js`
  - Accept: CSV and ISO-XML (ISOBUS standard)
  - Map imported fields → internal `serviceHistory` or `history` event format
  - Handle: John Deere Operations Center export, CLAAS telematics CSV, Case Field Ops export
- AppContext: add `source` field to machinery history events (`'manual'|'import'|'telematics_api'`)
- Display imported events differently in history (show source badge)
- Document which fields each manufacturer exports — add a `/docs/machinery-integration.md` for devs

**Data model change needed now (pre-API):**
```js
// Every machinery history event needs:
{
  id, date, type, title, notes,
  source: 'manual' | 'csv_import' | 'jd_ops_center' | 'claas_telematics',
  externalRef: null | 'JD-OP-12345',  // for deduplication when API comes
  hoursLogged: null | 142.3,
  operatorId: null | 'staff-id'
}
```

---

## 4. COMPLIANCE MODULE — DESIGN PRINCIPLE ONLY, NO FEATURE

**What the doc says:** Tom's Countryside Stewardship and two SFI agreements pay £20-40k/year. The event ledger auto-generating compliance evidence as a byproduct of normal recording is "genuine financial protection" and the most compelling go-to-market narrative. Needs to be a specified feature: which SFI actions are supported, how do events map to scheme evidence requirements, what does the compliance report look like.

**Current state:**
- Fields have a `scheme` property (e.g., "CSS", "SFI") but it's just a string label
- `UsageManager.jsx` exists but only manages crop usage, not scheme obligations
- No compliance report, evidence export, or scheme-requirement mapping anywhere
- No concept of "this activity satisfies this scheme obligation"

**What needs building:**
- `src/data/schemes.js` — define SFI options and Countryside Stewardship actions with:
  - Scheme name + code (e.g., `SAM1`, `AB8`, `GS4`)
  - Required evidence types per action
  - Frequency/timing requirements
  - Eligible field types
- `src/modules/compliance/` new module:
  - `CompliancePage.jsx` — scheme overview per field
  - `SchemeObligationList.jsx` — what each field needs to do + status
  - `ComplianceEvidenceView.jsx` — auto-collected evidence from field activities
  - `ComplianceReportExport.jsx` — PDF/CSV export for RPA inspections
- Extend `FieldActivity` model with `schemeActionCode` field to tag activities to scheme obligations
- Field detail: add "Compliance" tab showing obligation status and evidence trail
- AppContext: new action `TAG_ACTIVITY_TO_SCHEME`

---

## 5. EXTERNAL PARTY ACCESS — AGRONOMISTS, VETS, CONTRACTORS

**What the doc says:** The platform needs a variable access model where an estate gives controlled access to external parties (agronomists, vets, contractors). This is key product differentiation. Agronomists in particular are the primary go-to-market channel — one converted agronomist covers 50-150 farms.

**Current state:**
- `roles.js` has `farm_manager` and `farm_worker` only
- No concept of external party, no permission scoping beyond these two roles
- `currentUser` in AppContext is basic; `switchUser()` just swaps between hardcoded staff
- No invite/access flow

**What needs building:**
- Extend `roles.js` with new roles: `agronomist`, `vet`, `contractor`, `estate_owner`, `viewer`
- Permission model for each role — what modules/fields they can see, what actions they can take:
  - Agronomist: read field history, write spray recommendations & NMP uploads, assign tasks
  - Contractor: read assigned tasks + field maps, write work completion + field activities
  - Vet: read livestock/animal records, write health events
  - Viewer: read only, no writes
- `src/data/externalParties.js` — external users with role, scope (`allFields | fieldIds[]`), and linked entity type
- In AppContext: `externalParties: []` + actions `ADD_EXTERNAL_PARTY`, `UPDATE_PARTY_ACCESS`, `REMOVE_PARTY_ACCESS`
- Staff module: add "External Access" section to estate settings (or a new Settings module)
- In field detail + task detail: show who has access + what they can see
- UI indicator when viewing as/acting as an external party scope

---

## 6. PRE-USE MACHINERY SAFETY CHECKS — MISSING

**What the doc says:** David raised this unprompted — operators are legally required to verify equipment is safe before use. No farm currently logs this ("we just get on with it") but it's a compliance/liability need across virtually every UK farm operation. A pre-use checklist per machine, completed and signed off before starting.

**Current state:** Not implemented anywhere.

**What needs building:**
- Data model: add `preUseChecklist: { items: [], lastCompleted: null, completedBy: null }` to machinery records
- `src/data/machineryChecklists.js` — default checklists per equipment type:
  - Tractor: tyres, lights, fluids, hitches, PTO guard, cab safety
  - Combine: header, concave, sieves, grain tank, engine
  - Sprayer: nozzles, filters, boom, pressure, tank clean
- New component: `MachineryChecklistForm.jsx` in machinery module
  - Worker-facing: simple checklist with pass/fail/note per item, sign-off button
  - Creates a `checklistRecord` event in machinery history
- Machinery detail: "Pre-Use Check" tab showing last check + history of checks
- FAB: add "Pre-Use Check" as an option (accessible without opening full machinery module)
- AppContext: `COMPLETE_PRE_USE_CHECK` action
- Visual indicator on machinery card: green/amber/red based on last check date + result

---

## 7. ASK LANDARK — PLACEHOLDER ONLY

**What the doc says:** The interviews gave a concrete shortlist of queries users actually want: "when did we last make haylage?", "what was rainfall in March?", "what happened to this field over the last six months?", "field-level gross margins." Rather than a vague AI placeholder, build the first 5-6 most valuable queries.

**Current state:**
- `AITaskInput.jsx` exists but only generates task suggestions
- `fakeAI.js` is hardcoded mock output
- `aiEnabled` toggle in AppContext controls visibility
- FAB "Ask LandArk" button is disabled
- No query interface, no natural language parsing, no history query layer

**What needs building (MVP — deterministic queries first, LLM later):**
- Enable the FAB "Ask LandArk" button
- New component: `AskLandArk.jsx` — slide-in panel from right
- Phase 1: structured query picker (not NL yet) with pre-defined query templates:
  1. "What happened to [Field] in the last [period]?"
  2. "When did we last do [activity type]?"
  3. "What machinery was used on [Field] this year?"
  4. "Show all tasks completed by [person] this month"
  5. "What are the costs on [Field] to date?"
  6. "Which fields are overdue for [activity]?"
- Query engine: `src/utils/queryEngine.js` — pure functions over the AppContext state
- Results: rendered as a timeline/list inside the panel, not a new page
- Phase 2: text input that maps natural language to the above structured queries (client-side NLP or Claude API call)

---

## 8. CONTRACTOR SUBSCRIPTION MODEL — ARCHITECTURE DECISION NEEDED NOW

**What the doc says:** A contractor working across 20 farms needs their own multi-site control panel, fleet management, work records, roll-up dashboard, and integrated invoicing. This is a second product line that turns LandArk into a two-sided platform. The data model needs to support it from day one even if the UI is post-MVP.

**Current state:** No multi-tenancy. Single estate, single context. No concept of "site" or "account" above the current estate level.

**Architecture decisions to make now (before building more features):**

- Introduce `estateId` / `siteId` on all entities — currently everything is global, needs to be scoped
- `currentUser` needs `accountType: 'land_operator' | 'contractor' | 'agronomist'`
- A contractor's account has: `clientSites: [{ siteId, accessLevel, activeTasks, pendingInvoices }]`
- AppContext needs to support switching active site context without losing contractor-level state
- `src/context/ContractorContext.jsx` or extend AppContext with `activeSite` + `allSites`
- Work records created by a contractor on a client farm: stored against that farm but also visible in the contractor's cross-site dashboard

**Minimum data model change needed now:**
```js
// Add to every entity that lives in a site:
{
  ...existingFields,
  siteId: 'estate-001',        // which estate this belongs to
  createdByAccountId: 'acc-x', // supports contractor attribution
}
```

---

## 9. DESIGN SYSTEM DEVIATIONS — TYPOGRAPHY & SPACING

**What the spec says (design.md):** Lato 700/900 for headings, DM Sans for body, JetBrains Mono for data values. Topbar height 48px.

**Current state:**
- All fonts aliased to Inter (`--font-display`, `--font-body`, `--font-mono` all point to Inter)
- Topbar implemented at 56px, spec says 48px
- No monospace applied to data values (prices, measurements, dates)

**What needs fixing:**
- Add Google Fonts imports to `index.html`: Lato (700, 900), DM Sans (400, 500), JetBrains Mono (400)
- Update CSS variables in `index.css`:
  ```css
  --font-display: 'Lato', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  ```
- Apply `font-mono` to: measurements (hectares, acres), costs/prices, coordinates, machinery hours, dates in data tables
- Topbar: reduce from 56px to 48px in `TopBar.jsx` and update layout tokens in CSS

---

## 10. ANIMAL / LIVESTOCK MODULE — ENTIRELY MISSING

**What the doc says:** Charles's equestrian operation confirmed that livestock management is its own UX domain, not a modified field module. Horse profiles, microchip scanning on arrival, persistent records that survive when an animal leaves, seasonal client management (25+ horses per client), vaccine schedules.

**Current state:**
- Fields have `livestock` property (just a string)
- Staff module has livestock team designation
- No animal records, no health events, no animal-specific module

**What needs building (post-MVP, but data model decisions now):**
- `src/data/animals.js` seed data
- Animal entity shape: `{ id, name, species, breed, dob, sex, microchipId, status, ownerId, locationFieldId, arrivalDate, departureDate, vaccineSchedule[], healthEvents[], documents[] }`
- Key distinction from fields: animal records must persist after the animal leaves (set `status: 'departed'`, never delete)
- New route: `/livestock`
- New module: `src/modules/livestock/`
- Species-appropriate checklists (horses ≠ cattle ≠ sheep)
- Client management: link animals to external owners (ties into external party access model from item 5)

---

## 11. INCOMPLETE FEATURES WITHIN EXISTING MODULES

### 11.1 Field Evidence / Photo Viewer
- Field activities reference `evidence: [{ name, type }]` but no viewer exists
- Task pause/cancel photos are stored in state but never rendered
- Need: `<EvidenceViewer>` shared component — lightbox-style, handles image types

### 11.2 Machinery Costs & Financial Transactions
- `machinery.js` seed data includes `purchasePrice`, `currentValue`, `financialTransactions[]`
- `MachineryDetailView.jsx` does not render any of this
- Need: "Financials" tab in machinery detail showing: purchase cost, estimated current value, lifetime service costs, linked transactions

### 11.3 Staff Document Expiry
- `staff.js` has `documents[].expiryDate`
- No visual alert anywhere for expiring documents
- Need: amber badge on staff card when any document expires within 60 days; red when expired

### 11.4 Task Comments — No Edit/Delete
- Comments exist on tasks but are append-only with no edit or delete
- Reducer has no `EDIT_COMMENT` or `DELETE_COMMENT` action
- Low priority but worth adding

### 11.5 FAB Disabled Actions
These are currently shown but permanently disabled — they create a confusing UX:
- "Draw" — field boundary drawing on map
- "Book Holiday" — leave request (partially wired via `addAbsence`)
- Need: either implement or remove from FAB entirely

---

## 12. PERSISTENCE — NO BACKEND, DATA RESETS ON REFRESH

**Current state:** All state is initialised from seed files on each page load. There is no persistence layer.

**Not a MVP blocker for prototype demos, but needed before any real user testing.** Options:
- `localStorage` serialization of AppContext state (simplest — add `useEffect` to save/load)
- IndexedDB for larger datasets
- Supabase or Firebase for real cloud persistence with auth

**Minimum for extended user testing:**
```js
// In AppContext.jsx — persist to localStorage on every state change:
useEffect(() => {
  localStorage.setItem('soilark-state', JSON.stringify(state));
}, [state]);

// On init, load from localStorage if available:
const savedState = localStorage.getItem('soilark-state');
const initialState = savedState ? JSON.parse(savedState) : defaultState;
```

---

## Summary Priority Table

| # | Gap | Priority | Effort | Strategic Importance |
|---|-----|----------|--------|----------------------|
| 1 | Contextual activity threads on all entities | High | Medium | Core value prop (event ledger) |
| 2 | Operations / Finance module | High | High | Required for gross margin queries + go-to-market |
| 3 | Machinery file import (CSV/ISO-XML) | High | Medium | Removes primary switching blocker |
| 4 | Compliance module (SFI/CS scheme evidence) | High | High | #1 go-to-market narrative |
| 5 | External party access (agronomist/contractor) | High | High | Distribution channel + product moat |
| 6 | Pre-use machinery safety checks | Medium | Low | Legal compliance, easy win |
| 7 | Ask LandArk (deterministic query engine) | Medium | Medium | Differentiation, user-requested |
| 8 | Contractor multi-site architecture | Medium | High | Data model must be right now |
| 9 | Design system typography fix | Low | Low | Brand polish |
| 10 | Animal / livestock module | Low | High | Post-MVP, data model decisions now |
| 11 | Incomplete features (evidence viewer, machinery costs, staff doc expiry) | Medium | Low | Quality / completeness |
| 12 | State persistence (localStorage) | Medium | Low | Required for real user testing |
