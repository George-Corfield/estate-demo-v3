# SoilArk — Machinery & Equipment Module Specification

Combined specification derived from both prototype versions (Plant-specific and index_fresh).

---

## 1. Overview

The Machinery & Equipment module provides a centralised register of all estate machinery, vehicles, and equipment. It enables users to track assets, monitor service schedules, record maintenance history, manage costs, and link equipment to tasks and financial transactions.

---

## 2. Module Summary Dashboard

The machinery landing page displays summary statistics at the top:

| Metric | Description |
|---|---|
| **Total Equipment** | Count of all registered items |
| **Total Value** | Aggregate estimated current value of all equipment (index_fresh only) |
| **Services Due** | Count of items where current hours ≥ next service due hours (or time-based equivalent) |
| **In Maintenance** | Count of items with status "Maintenance" |
| **Monthly Equipment Costs** | Aggregate running cost for the current month (index_fresh only) |

---

## 3. Equipment List View

### 3.1 Filtering & Search

- **Text search** — filter by name, make, or model (free-text input)
- **Category/Type filter** — dropdown to filter by equipment type
- **Status filter** — dropdown to filter by current status

### 3.2 Category Tabs

Equipment is grouped into categories. Both versions support category-based tab filtering:

| Category | Examples |
|---|---|
| Tractors | John Deere 6155R, Massey Ferguson 5713, New Holland T6.180, Case IH Puma 185, Fendt 516 Vario, Claas Arion 660 |
| Mowers | Kuhn GMD 3150, JF FCT 900, Vicon Extra 432 |
| Seeders / Drills | Vaderstad Rapid 400S, Amazone Cirrus 6003 |
| Vehicles | Ford Ranger, Toyota Hilux, Land Rover Defender, Isuzu D-Max |
| Combine Harvesters | Case IH Axial-Flow 7150 |
| Fertilizer Spreaders | Amazone Centaur 6001 Super |
| Forage Harvesters | Krone BiG X 1180 |
| Other | Ploughs, balers, wrappers, hedge cutters, toppers, sprayers, trailers, telehandlers |

### 3.3 Equipment Card (List Item)

Each item in the grid view displays:

- Equipment icon (by category)
- Equipment name
- Make & model
- Year of manufacture
- Current status badge (see §4.1)
- Operating hours (where applicable)
- Next service due indicator (hours or date-based)
- Service due warning if overdue

### 3.4 Actions

- **+ Add Equipment** — opens the add/edit form (see §6)
- **Service Schedule** — view upcoming service events
- **Export Inventory** — download equipment list as CSV/Excel

---

## 4. Equipment Statuses

### 4.1 Status Values

| Status | Description |
|---|---|
| **Active / Available** | Equipment operational and ready for use |
| **In Use** | Currently deployed on a task or in the field |
| **In Barn / Stored** | Operational but not currently in active use (seasonal storage) |
| **Maintenance** | Currently undergoing repair or servicing — unavailable |
| **Sold** | No longer part of the fleet (historical record retained) |

---

## 5. Equipment Detail View

Clicking an equipment card opens a detail modal/page with tabbed sections.

### 5.1 Basic Info / Equipment Details

| Field | Description |
|---|---|
| Equipment Name | Auto-generated from Make + Model, or user-defined |
| Category / Type | Equipment category (Tractor, Combine Harvester, etc.) |
| Make | Manufacturer name |
| Model | Model designation |
| Year | Year of manufacture |
| Serial Number | Manufacturer serial number |
| Current Status | Active / In Use / Barn / Maintenance / Sold |
| Fuel Type | Diesel, Petrol, N/A (for tractor-mounted implements) |
| Location | Current physical location on the estate (e.g. Main Barn, Workshop, West Field) |
| Assigned Operator | Staff member primarily responsible for operating this equipment |
| Notes | Free-text notes field |

### 5.2 Purchase & Financial Information

| Field | Description |
|---|---|
| Date Purchased | Date of acquisition |
| Purchase Price | Original cost |
| Purchased From | Dealer / supplier name |
| Warranty Expiry | Warranty end date |
| Estimated Current Value | Manually entered or calculated depreciation estimate |

### 5.3 Specifications

Dynamic key-value pairs that vary by equipment type. Examples include:

- **Tractors**: Horsepower, weight, max speed, fuel capacity, tyre sizes (front/rear), GPS enabled, front loader fitted
- **Combine Harvesters**: Horsepower, grain tank capacity, cutting width, weight
- **Spreaders**: Capacity, spread width, weight
- **Forage Harvesters**: Horsepower, theoretical chop length, weight, fuel capacity
- **Vehicles**: Number plate, mileage (rather than hours)

### 5.4 Associated Tasks

- List of tasks currently linked to this equipment
- Each task shows name and status
- Clicking a task navigates to the task detail view

---

## 6. Service & Maintenance

### 6.1 Service Schedule Settings

Users can configure service intervals per piece of equipment. Options include:

| Interval Type | Description |
|---|---|
| **Hour-based** | Service every N operating hours (e.g. every 250, 500, or 600 hours) — user-configurable threshold |
| **Annual** | Service every 12 months |
| **Monthly** | Service every month |
| **Day-based** | Service every N days (used for vehicles — e.g. every 90 days) |

The system displays:

- Current operating hours
- Next service due (hours or date)
- Warning/alert when service is overdue
- Estimated time until next service (e.g. "In 150 hours — approximately 3 weeks")

### 6.2 Service History Table

Each service record contains:

| Field | Description |
|---|---|
| Date | Date service was performed |
| Hours at Service | Operating hours at time of service |
| Service Type | Regular Service, Repair, Major Repair, Pre-Season Service, Post-Season Service, Emergency Repair |
| Cost | Total cost of the service |
| Technician | Who performed the work (internal staff member or external contractor) |
| Next Due | When the next service is due (hours or date) |
| Notes | Description of work performed |

Users can add new service records via a "Record Service" form.

### 6.3 Auto-Book Service Reminders

Planned feature to automatically create calendar events when equipment approaches its service interval threshold. Configurable per machine.

---

## 7. Costs & Financials

### 7.1 Cost Summary (per equipment item)

| Metric | Description |
|---|---|
| Total Lifetime Cost | Cumulative cost since acquisition |
| Monthly Average | Average monthly running cost |
| Annual Cost | Running cost for the current/last year |
| Cost per Hour | Total cost ÷ total operating hours |

### 7.2 Cost Breakdown Categories

- Service & Maintenance (parts and labour)
- Fuel (estimated from usage hours or linked fuel transactions)
- Insurance (annual premium)

### 7.3 Market Value Tracking

- Purchase price
- Current age
- Total hours
- Estimated current value (depreciation tracking)

---

## 8. Documents

Each equipment item supports a document repository:

- **Serial Plate Photo** — image capture with planned OCR scanning to auto-populate fields (serial number, model, weight, manufacturing date)
- **Stored Documents** — upload and view files such as:
  - Purchase invoice
  - Owner's manual
  - Service manual
  - Insurance certificate
  - MOT certificate (for road-legal vehicles)

---

## 9. Add / Edit Equipment Form

### 9.1 Required Fields

- Make
- Model
- Type (dropdown: Tractor, Combine Harvester, Fertilizer Spreader, Forage Harvester, Plough, Trailer, Other)
- Year of manufacture
- Status (Available, In Use, Maintenance)

### 9.2 Optional Fields

- Serial Number
- Purchase Date
- Purchase Cost
- Estimated Current Value
- Operating Hours
- Fuel Type
- Location (on estate)
- Assigned Operator
- Notes

### 9.3 Behaviour

- When adding new equipment, a unique ID is generated
- Next service due defaults to current hours + 250 (configurable)
- Service history and associated tasks initialise as empty
- The same form is reused for editing, pre-populated with existing data

---

## 10. Calendar Integration

Machinery events appear on the estate-wide calendar with dedicated event types:

| Calendar Event Type | Description |
|---|---|
| **Machinery Service** | Scheduled or upcoming service dates |
| **MOT Dates** | MOT renewal dates for road-legal vehicles |

Calendar supports filtering by:

- Event type (machinery service, MOT, tasks, staff holidays, etc.)
- Specific machine (dropdown filter)
- Specific person
- High priority only toggle

---

## 11. Cross-Module Integration

### 11.1 Tasks ↔ Machinery

- Tasks can have machinery assigned to them (multi-select)
- Equipment detail view shows associated active tasks
- Clicking a linked task navigates to the task detail

### 11.2 Financial Transactions ↔ Machinery

- Individual financial transactions (fuel, parts, service costs) can be linked to specific machinery via a `linkedMachinery` field
- Transactions appear in the operations/financial module with machinery attribution
- Clicking a linked machinery name from a transaction navigates to the equipment detail
- Financial categories with machinery linkage include: Fuel (diesel, petrol, lubricants), Tractor Parts, Harvester Parts

### 11.3 Task Types Referencing Machinery

The task system includes a "Maintenance" task type with subtypes relevant to equipment:

| Subtype | Additional Fields |
|---|---|
| Repair | Equipment (text) |
| Servicing | Equipment, Service Type (Oil Change / Filter Change / Full Service / Greasing), Last Service Date |
| Inspection | Equipment |

---

## 12. Data Model Summary

### Equipment Record

```
id                  : unique identifier
name                : string (auto-generated or user-defined)
type / category     : enum (Tractor, Combine Harvester, Fertilizer Spreader, etc.)
make                : string
model               : string
year                : integer
serialNumber        : string
status              : enum (Available, In Use, Maintenance, Barn/Stored, Sold)
hours               : number (operating hours)
purchaseDate        : date
purchasePrice       : currency
currentValue        : currency
fuelType            : string
location            : string (on-estate location)
assignedOperator    : string (staff member reference)
lastServiceDate     : date
nextServiceDue      : number (hours) or number (days)
specifications      : key-value object (varies by type)
serviceHistory      : array of service records
associatedTasks     : array of task references
notes               : string
```

### Service Record

```
date                : date
type                : enum (Regular Service, Repair, Major Repair, Pre-Season, Post-Season, Emergency Repair)
cost                : currency
technician          : string
notes               : string
hoursAtService      : number (optional)
```

### Financial Transaction (machinery-related fields)

```
linkedMachinery     : string (equipment name reference, nullable)
```
