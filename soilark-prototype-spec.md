  
**SoilArk**

Estate Management Platform

**Prototype Functional Specification**

*"Landark Estate" Demonstration Build*

Document Version: 1.0

Date: 11 February 2026

Status: Prototype / Demonstration

# **1\. Introduction**

This document provides a comprehensive, page-by-page description of every feature present in the current SoilArk prototype. The prototype is a single-page HTML application demonstrating the estate management platform using a fictional estate called “Landark Estate” (545 hectares). It is built as a fully interactive front-end with in-memory data to illustrate the intended user experience, navigation patterns, and data structures before back-end integration begins.

The prototype is designed to be used by estate or farm managers who need a centralised system to manage fields, tasks, staff, machinery, and finances across a working agricultural estate.

## **1.1 Global Layout**

The application follows a persistent shell layout that is consistent across every page:

* **Collapsible Sidebar (left):** A narrow icon-only rail (70px wide) that expands to 240px on hover, revealing full navigation labels. It contains navigation items for all six modules, a divider, and a user profile section showing the logged-in user’s avatar, name, and role.

* **Top Bar (horizontal):** A green gradient header bar displaying the current date and time (live-updating every 10 seconds with ordinal suffixes, e.g. “Wednesday 11th February 2026, 14:32”), an estate selector dropdown (currently only “Landark Estate”), an “Estate Stats” dropdown button, and the logged-in user’s avatar and name.

* **Content Area:** The main workspace below the top bar, which changes entirely depending on the active module. Some modules use a split-panel layout (side panel \+ map/calendar), while others use a full-page scrollable layout.

* **Floating Action Button (FAB):** A persistent green “+” button in the bottom-right corner that fans out four quick-action buttons when clicked: Add Task, Add Field Note, Add Expense, and Add Calendar Event. This is accessible from any page.

* **Toast Notifications:** A non-blocking notification bar that slides in at the top-centre of the screen to confirm successful actions (e.g. “Event created”, “Note saved”).

## **1.2 Estate Stats Dropdown**

Clicking “Estate Stats” in the top bar opens a floating panel showing a hierarchical breakdown of the estate:

* **Top-level summary:** Total Estate — 545 ha.

* **Category rows:** Grassland (360 ha), Crops (120 ha), Forestry (65 ha), and Buildings (8 structures). Each category is clickable.

* **Drill-down view:** Clicking a category (e.g. “Crops”) replaces the panel content with a back button and the subcategories within that group (e.g. Winter Wheat — 62 ha across 3 fields, Spring Barley — 38 ha across 2 fields, Oilseed Rape — 25 ha across 2 fields). Each subcategory row shows the name, number of fields, and hectares.

* **Deep linking:** Clicking a subcategory row navigates the user to the Fields module and opens that field category in the side panel.

# **2\. Overview Module (Home)**

The Overview module is the default landing page when the application loads. It provides a high-level estate-wide view with two interchangeable display modes: Map View and Calendar View.

## **2.1 Map View (Default)**

The map view displays a full-bleed satellite/aerial image of the estate as its background, with coloured, semi-transparent rectangular overlays positioned over it representing individual fields. Each field overlay shows the field name as a white text label with a dark text shadow for legibility.

* **Field overlays:** 25 fields are positioned across the map using absolute CSS coordinates (top, left, width, height percentages). Each overlay has a coloured border matching its category (amber for Arable, green for Pastoral, light green for Grassland, grey for Forestry). Hovering scales the overlay up slightly and increases its background opacity.

* **Interactivity:** Clicking a field overlay navigates the user to the Fields module and opens that specific field’s detail panel.

* **Toggle button:** A “Switch to Calendar” button in the top-right corner of the content area switches to the calendar view.

## **2.2 Calendar View**

The calendar view replaces the map with a full-featured monthly calendar grid.

* **Calendar grid:** A 7-column grid (Sun–Sat) showing all days of the current month. Each cell displays the day number and coloured event indicator badges. These badges are categorised by type: blue for Tasks, green for Fields, and purple for Services, each showing a count of events for that day.

* **Navigation:** Previous/Next month buttons and a “Month Year” label (e.g. “February 2026”). A “Today” button jumps back to the current month. An “+ Add Event” button opens the new event form.

* **Legend:** A colour key in the calendar header shows what the blue, green, and purple indicators represent (Tasks, Fields, Services respectively).

* **Today highlighting:** The current date’s cell has a teal/mint background colour.

* **Event aggregation:** The calendar aggregates events from three data sources: task due dates (from the Tasks module), field activity history entries (from each field’s history array), and machinery service dates (from each machine’s service history).

### **2.2.1 Day Events Side Panel**

Clicking any day cell opens a side panel to the right of the calendar grid (approximately 40% width) showing all events for the selected date.

* **Panel header:** Displays the full formatted date (e.g. “Thu 26 February 2026”) and a close button.

* **Event cards:** Each event is rendered as a card with a coloured left border (blue for tasks, green for field activities, purple for services), the event title, category label, and relevant metadata (e.g. assigned staff, linked fields, or machinery).

* **Empty state:** If no events exist for the selected day, a “No events” message with an “+ Add Event” button is shown.

* **Inline event creation:** An “+ Add Event” button at the top of the panel injects an inline form directly into the panel. The form includes fields for Event Type (Task, Field Activity, Appointment, Reminder, Other), Title, Description, Time, Related Field (dropdown of all 25 fields), and Related Task (dropdown of all existing tasks). Submitting the form creates the event, adds it to the appropriate data store, refreshes the calendar indicators, and re-opens the panel for that day with the new event visible.

# **3\. Fields & Buildings Module**

The Fields module uses a split-panel layout: a side panel on the left (40% width, 400–600px) and a map or calendar view on the right.

## **3.1 Side Panel — Category List View**

The initial view in the side panel displays an accordion-style list of field categories, each as a collapsible section:

| Category | Colour | Fields | Total Acreage |
| :---- | :---- | :---- | :---- |
| Arable | Amber (\#fcd34d) | 9 | 352.5 acres |
| Pastoral | Green (\#4ade80) | 6 | 260.0 acres |
| Grassland | Light green (\#86efac) | 7 | 306.3 acres |
| Forestry | Grey (\#6b7280) | 3 | 160.1 acres |

Clicking a category header expands it to reveal individual field cards. Each card shows the field name and its metadata (e.g. “North Field — 45.2 acres, Winter Wheat”). Clicking a field card opens the field detail view.

## **3.2 Side Panel — Field Detail View**

When a specific field is selected (either from the category list or by clicking a map overlay), the side panel replaces its content with a comprehensive detail view for that field. The panel header shows the field name as the title, with a back button to return to the category list.

The detail view is organised into tabbed sections:

### **3.2.1 Overview Tab**

* **Key properties:** A metadata grid showing Category (e.g. Arable), Size (in acres), Soil Type (e.g. Clay Loam, Sandy Loam), Drainage (Excellent/Good/Fair/Poor), Current Crop or Livestock, Last Worked (relative time), and Description.

* **Linked tasks:** A list of any tasks currently associated with this field, showing task name, type, priority, due date, and assigned staff.

* **Edit button:** Opens an inline edit form (replacing the panel content) allowing all field properties to be modified: Field Name, Category (dropdown), Size (numeric), Soil Type (dropdown with 8 options), Drainage (dropdown), Current Crop (text), Livestock (text), and Description (textarea). Save and Cancel buttons are provided.

### **3.2.2 Activity History Tab**

* **History timeline:** A chronological list of past activities recorded against the field. Each entry shows Date, Activity name, Details, and the User who performed it.

* **Add Note button:** Opens an inline form to add a new field note with fields for Activity Title, Details (textarea), and Date (defaults to today). Saving adds the note to the field’s history array.

* **View on Calendar:** Each history entry has a link that switches the right-hand panel to the calendar view and navigates to the relevant date, opening the day events panel for that date.

## **3.3 Map View**

The right side of the Fields module displays the same estate map as the Overview module, with the same 25 coloured field overlays. The key difference is that field overlays here respond to the side panel context:

* Clicking a field overlay on the map opens that field’s detail view in the side panel.

* When a field is selected in the side panel, its map overlay is visually highlighted (increased opacity/scale).

## **3.4 Calendar View**

A toggle button in the top-right corner of the right panel switches between Map and Calendar views. The calendar functions identically to the Overview calendar (monthly grid with event indicators, day click opens events panel, same legend and navigation) but is contextualised within the Fields module. It shares the same unified event data source.

# **4\. Tasks Module**

The Tasks module also uses a split-panel layout, with a task management panel on the left and a map or calendar on the right.

## **4.1 Side Panel — Task List / Kanban View**

The default task list view displays tasks in a Kanban-style board with three vertical columns:

### **4.1.1 Kanban Columns**

* **To Do:** Tasks that have not yet been started. Column header shows a count.

* **In Progress:** Tasks currently being worked on.

* **Done:** Completed tasks, including the completion date.

Tasks can be dragged between columns using SortableJS, which updates their status in the data model. Each task card in the kanban shows:

* A coloured priority dot (red for High, orange for Medium, blue for Low) and a priority badge.

* The task name, task type label, and associated fields.

* Due date, shown in relative terms (e.g. “Due in 4 days” or “Overdue by 3 days” in red).

### **4.1.2 Filter Bar**

Above the kanban board, a filter bar provides three dropdown filters:

* **Priority filter:** All Priorities / High / Medium / Low.

* **Type filter:** All Types / Planting / Harvesting / Fertilizing / Maintenance.

* **Field filter:** All Fields / individual field names. Filters are applied dynamically and the kanban re-renders in real time.

An “+ Add Task” button sits alongside the filters.

## **4.2 Task Detail View**

Clicking a task card in the kanban opens a detailed task view that replaces the side panel content. The detail view is tabbed:

### **4.2.1 Details Tab**

Displays all core task information: task name, type, status, priority, due date, description, assigned staff members, assigned machinery, and associated fields. An Edit button opens a modal with the full task editing form.

### **4.2.2 Type-Specific Fields**

Each task type has its own set of additional fields that are displayed and editable. The prototype supports six task types with progressive disclosure:

| Task Type | Type-Specific Fields |
| :---- | :---- |
| Planting | Purpose (Production / Stewardship / Amenity / Restoration / Trial), Planting Type (Seed-Crop / Tree / Hedge), then sub-fields depending on type: for Seed-Crop — crop mix name, area, seed rate, rate unit, total seeds, source (Bought/Farm Saved/Gift), price, total cost, establishment method (Direct Drill / Min-till / Conventional / Broadcast) |
| Fertilizing | Product name, area (ha), application rate (kg/ha), application method (Broadcast Spreader / Liquid Sprayer / Foliar Spray / Injection / Manual), source, price per unit, auto-calculated total fertilizer applied and total cost |
| Harvesting | Expected yield, storage location, quality grade, Harvest Type (Grain / Forage / Root Crop) with sub-fields: Grain — crop, moisture content, drying required; Forage — crop, bale type, cut number; Root Crop — crop, cleaning method, grading |
| Maintenance | Estimated hours, urgency (Routine/Urgent/Emergency), Maintenance Type (Repair/Servicing/Inspection) with sub-fields: Repair — equipment, fault description, parts needed; Servicing — equipment, service type, last service date; Inspection — equipment, inspection type, checklist required |
| Feeding | Livestock type, amount, feeding time, Feed Category (Forage/Concentrate/Supplement) with sub-fields for each |
| Irrigation | Duration, water source, flow rate, Irrigation Type (Drip/Sprinkler/Flood) with sub-fields for each |

### **4.2.3 Comments Tab**

A threaded comments section where staff can leave timestamped notes against a task. Each comment shows the date, author name, and message text. A text input allows adding new comments.

## **4.3 Add Task Form**

The “+ Add Task” button replaces the side panel content with a comprehensive task creation form. The form includes:

* Task Name (required text input).

* Task Type (required dropdown — selecting a type dynamically reveals the type-specific fields described above, using progressive disclosure).

* Field Selection (required — presented as a scrollable checkbox list of all 25 fields, with a summary display showing selected fields; fields can also be selected by clicking on the map).

* Type-specific fields (rendered dynamically based on selected task type, including sub-type dropdowns that reveal further nested fields).

* Description (optional textarea).

* Due Date (required date picker — focusing the field switches the right panel to the calendar view, and clicking a calendar day sets the date).

* Priority (Low / Medium / High dropdown).

* Staff Assignment (scrollable checkbox list of all active staff members showing name and role).

## **4.4 Map View**

The right-hand panel displays the estate map, identical to the Fields module’s map. When in “Add Task” mode, clicking a field overlay on the map toggles that field’s selection in the task form’s field checklist. Selected fields are highlighted on the map.

## **4.5 Calendar View**

Toggling to calendar view shows the same unified monthly calendar. When in “Add Task” mode, clicking a day on the calendar sets the task’s due date in the form. Otherwise, clicking a day opens the day events side panel as in the Overview calendar.

# **5\. Staff Management Module**

The Staff module uses a full-page layout (no split panel). It provides a complete human resources management interface.

## **5.1 Summary Statistics**

Three stat cards at the top of the page display:

* **Total Staff:** Count of all team members (currently 6).

* **On Holiday:** Number of staff currently away (currently 0).

* **Working Today:** Number of active on-site staff (currently 5).

## **5.2 Search and Filters**

A search bar allows searching by name, role, or email. Two filter dropdowns provide filtering by Role (Farm Manager, Livestock Manager, Farm Worker, Tractor Driver, Maintenance Technician) and Status (Active / Inactive). An “+ Add Staff Member” button is also present.

## **5.3 Staff Cards Grid**

Staff members are displayed as cards in a responsive grid (auto-filling columns of minimum 300px). Each card shows:

* Staff avatar (coloured circle with initials), name, and role.

* Status badge (green “Active” or grey “Inactive”).

* Email address and phone number.

* Hours worked this week.

* A clickable card that opens the full staff detail view.

## **5.4 Staff Detail View**

Clicking a staff card opens an expanded detail view (rendered inline, replacing the cards grid) with the following sections:

### **5.4.1 Personal Information**

Full address, date of birth, NI number, emergency contact details, mobile number, contract type (e.g. Full-time Permanent), and start date.

### **5.4.2 Role and Responsibilities**

Salary, a list of qualifications (e.g. “Level 4 Agriculture”, “Pesticide Application License”), and a numbered list of key responsibilities.

### **5.4.3 Current Tasks**

A list of tasks currently assigned to this staff member, showing task name and due date.

### **5.4.4 Documents**

A tabbed section with two sub-tabs:

* **Certifications:** A table of the staff member’s certificates and licences, showing document name, issue date, expiry date, file type, and file size. Placeholder download buttons are provided.

* **Invoices/Payslips:** A table of salary invoices showing date, amount, period, payment status, file type, and size.

### **5.4.5 Notes**

A free-text notes field for management observations (e.g. “Excellent performance. Due for annual review in March.”).

# **6\. Machinery & Equipment Module**

The Machinery module uses a full-page layout, similar to Staff. It provides a comprehensive equipment fleet management interface.

## **6.1 Summary Statistics**

Three stat cards display:

* **Total Machinery:** Count of all equipment (currently 6 items).

* **Services Due:** Number of machines approaching their next service interval (currently 2).

* **In Maintenance:** Number of machines currently unavailable due to servicing or repair (currently 1).

## **6.2 Search and Filters**

A search bar for name, make, or model. Filter dropdowns for Type (Tractors, Combine Harvesters, Spreaders, Forage Harvesters) and Status (Available, In Use, Maintenance). An “+ Add Equipment” button is also present.

## **6.3 Equipment Cards Grid**

Equipment is displayed as cards in a responsive grid. Each card shows:

* Equipment name (e.g. “John Deere 6155R”), type, and a status badge.

* Key specifications vary by equipment type (e.g. power, hours, fuel type for tractors; grain tank capacity and cutting width for combine harvesters).

* Assigned operator name, location (e.g. “Main Barn”, “West Field”), and last service date.

## **6.4 Equipment Detail View**

Clicking an equipment card opens a detailed view with the following sections:

### **6.4.1 General Information**

Make, model, year, serial number, hours/usage, purchase date and cost, current estimated value, fuel type, location, and assigned operator.

### **6.4.2 Specifications**

A specifications table whose contents vary by equipment type. For example, a tractor shows Power, Weight, Max Speed, and Fuel Capacity, while a combine harvester shows Power, Grain Tank Capacity, Cutting Width, and Weight.

### **6.4.3 Service History**

A chronological table of all recorded service events, each showing Date, Service Type (e.g. Regular Service, Pre-Season Service, Major Repair, Post-Harvest Service), Cost, Technician (internal staff name or external contractor), and Notes describing the work performed.

### **6.4.4 Service Scheduling**

Displays the next service due (by hours), with a visual progress bar showing proximity to the next service threshold. The current hours and target hours are displayed.

### **6.4.5 Associated Tasks**

A list of tasks that reference this piece of equipment, showing task name and status.

### **6.4.6 Notes**

A free-text notes field for general observations about the equipment’s condition or usage.

The prototype includes 6 pieces of equipment in its demonstration data:

| Equipment | Type | Status | Operator |
| :---- | :---- | :---- | :---- |
| John Deere 6155R | Tractor | Available | David Jones |
| Case IH Axial-Flow 7150 | Combine Harvester | Available | John Smith |
| New Holland T7.270 | Tractor | In Use | Mike Williams |
| Amazone Centaur 6001 | Fertilizer Spreader | Available | John Smith |
| Krone BiG X 1180 | Forage Harvester | Maintenance | Mike Williams |
| Claas Arion 660 | Tractor | Available | David Jones |

# **7\. Financial Operations Module**

The Operations module uses a full-page layout and provides a complete financial tracking interface for the estate, covering both income and expenses.

## **7.1 Summary Statistics**

Three stat cards at the top display:

* **Total Expenses (YTD):** The sum of all expense categories for the current year, dynamically calculated.

* **Total Income (YTD):** The sum of all income categories for the current year.

* **Net (YTD):** Income minus expenses, colour-coded green if positive or red if negative.

## **7.2 Category Cards Grid**

Below the summary, financial categories are displayed as clickable cards in a responsive grid. Each card shows:

* Category name (e.g. “Fuel”, “Parts”, “Sales”) with a coloured icon dot.

* Total amount for that category (formatted in GBP).

* Transaction count (e.g. “28 transactions”).

* Category type indicator (expense in red, income in green).

The prototype includes 7 financial categories:

| Category | Type | Subcategories |
| :---- | :---- | :---- |
| Fuel | Expense | Diesel, Petrol, Oil & Lubricants, AdBlue |
| Parts | Expense | Tractor Parts, Harvester Parts, General Parts |
| Staff Costs | Expense | Salaries, Overtime, Training |
| Fertiliser | Expense | NPK Compound, Urea, Lime |
| Feed | Expense | Cattle Feed, Sheep Feed, Mineral Supplements |
| Seeds | Expense | Wheat Seed, Barley Seed, Grass Seed |
| Sales | Income | Crop Sales, Livestock Sales, Contract Work |

## **7.3 Subcategory View**

Clicking a category card drills down to show its subcategories. This view includes a back button, the category name as a title, and cards for each subcategory showing the subcategory name, total amount, and transaction count.

## **7.4 Transaction List View**

Clicking a subcategory card drills down further to show individual transactions in a table format. Each transaction row displays:

* Date, description, and amount (formatted in GBP).

* Payment method (Card, Bank Transfer, Direct Debit, Invoice).

* Card used (if applicable, e.g. “Business Visa” or “Business Mastercard”).

* Linked Task (clickable reference to an associated task, if any).

* Linked Machinery (reference to an associated machine, if any).

* Notes.

An “+ Add Transaction” button allows creating new transaction entries.

# **8\. Floating Action Button (FAB) Quick Actions**

The FAB is a persistent UI element accessible from every page. It is a circular green button with a “+” icon in the bottom-right corner. Clicking it fans out four action buttons in a vertical stack with staggered animation:

## **8.1 Add Task**

Opens the task creation form in the Tasks module side panel (identical to the “+ Add Task” flow described in Section 4.3). The module is automatically switched to Tasks.

## **8.2 Add Field Note**

Opens a field selector modal — a centered overlay with a search input and a scrollable list of all 25 fields, grouped by category. The search filters in real time as the user types. Keyboard navigation (arrow keys \+ Enter) is supported. Selecting a field navigates to the Fields module, opens that field’s detail panel, and presents the inline note-adding form.

## **8.3 Add Expense**

Opens an expense selector modal, similar to the field selector, showing a list of all expense categories and their subcategories. Selecting a subcategory navigates to the Operations module and opens the transaction list for that subcategory, ready for a new entry.

## **8.4 Add Calendar Event**

Opens a date picker modal that allows the user to select a date. Selecting a date navigates to the Overview calendar, jumps to the relevant month, opens the day events panel for that date, and injects the inline event creation form into the panel.

# **9\. Cross-Cutting Features**

## **9.1 Unified Calendar System**

All three calendar instances (Overview, Fields, Tasks) share a common event aggregation function that collects events from three data sources: task due dates, field activity history entries, and machinery service history entries. This means any event created or modified in one module is immediately reflected in all calendars. Each calendar instance maintains its own independent month/year navigation state.

## **9.2 Map Highlighting**

When the Fields or Tasks module is active and a field is selected or being interacted with, the corresponding map overlay is highlighted with increased opacity and a subtle scale transform. This provides visual feedback connecting the side panel selection to the spatial representation on the map.

## **9.3 Data Relationships**

The prototype maintains several cross-referencing relationships between data entities:

* **Tasks ↔ Fields:** Tasks reference fields by ID and name. Fields display their linked tasks.

* **Tasks ↔ Staff:** Tasks have an assignedTo array of staff names. Staff profiles display their current tasks.

* **Tasks ↔ Machinery:** Tasks reference machinery by name. Machinery profiles display associated tasks.

* **Transactions ↔ Tasks:** Financial transactions can be linked to specific tasks via a linkedTask field.

* **Transactions ↔ Machinery:** Transactions can be linked to specific machines via a linkedMachinery field.

* **Estate Stats ↔ Fields:** The estate stats dropdown drill-down links directly into the Fields module’s category views.

## **9.4 In-Memory Data Model**

All data in the prototype is held in JavaScript variables and arrays. There is no persistence — refreshing the page resets all data to the demonstration defaults. The data model includes:

* 25 fields across 4 categories with full property sets and activity histories.

* 4 demonstration tasks across the three kanban states, with type-specific metadata.

* 6 staff members with complete HR information and document records.

* 6 machinery items with specifications, service histories, and task associations.

* 7 financial categories with subcategories and individual transaction records.

* Estate-level statistics with hierarchical breakdowns.

## **9.5 Responsive Behaviour**

The prototype is designed primarily for desktop use. The sidebar collapses to icons at narrow widths. Full-page modules (Staff, Machinery, Operations) use CSS grid with auto-fill for responsive card layouts. Split-panel modules (Fields, Tasks) have minimum panel widths of 400px.

# **10\. Demonstration Data Summary**

The following table summarises the sample data loaded into the prototype for demonstration purposes:

| Data Type | Summary |
| :---- | :---- |
| Estate | Landark Estate — 545 ha total (360 ha Grassland, 120 ha Crops, 65 ha Forestry, 8 Buildings) |
| Fields | 25 fields: 9 Arable (wheat, barley, oilseed rape), 6 Pastoral (cattle and sheep), 7 Grassland (temporary leys, hay meadows), 3 Forestry (ancient woodland, new planting) |
| Tasks | 4 tasks: Apply Spring Fertilizer (To Do, High), Repair Fence Line (To Do, Medium), Plant Winter Wheat (In Progress, High), Harvest Hay (Done, Medium) |
| Staff | 6 members: Farm Manager, Livestock Manager, 2 Farm Workers, Tractor Driver, Maintenance Technician — all Full-time Permanent, based in Dunstable area |
| Machinery | 6 items: 3 Tractors (John Deere, New Holland, Claas), 1 Combine Harvester (Case IH), 1 Fertilizer Spreader (Amazone), 1 Forage Harvester (Krone) — total fleet value approx. £802,000 |
| Finances | 6 expense categories (Fuel, Parts, Staff Costs, Fertiliser, Feed, Seeds) and 1 income category (Sales with Crop Sales, Livestock Sales, Contract Work) |

