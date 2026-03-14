Here is the specification turned into a clean, structured Markdown file.

# ---

**LandArk – Overview Page Specification (Prototype Update)**

## **1\. Core Purpose**

The **Overview Page** is the operational control centre of the farm. It is designed to allow a user to understand the farm's status within seconds of opening the system.

The overview prioritizes **live operational information** over analytics. To maintain this focus:

* **Visual Layer:** A central farm map.  
* **Operational Summary:** High-level status panels.  
* **Personalization:** Role-based visibility and enterprise-specific modules.  
* **Constraint:** Avoid graphs or complex charts; focus on status and numbers.

## ---

**2\. Layout Structure**

### **Base Layout**

1. **Top:** Operational Panels (Summary Data)  
2. **Middle:** Farm Map (Visual Centerpiece)  
3. **Bottom / Floating:** "Ask LandArk" AI Button

### **Design Guidelines**

* **Map Centricity:** The map remains the focal point. Panels sit above it to summarize activity.  
* **Panel Consistency:** Panels must match the design language of the Machinery page (compact, clear, numeric, and clickable).  
* **Interaction:** Clicking a panel expands it or reveals a slide-out; it should not immediately redirect the user away from the Overview.

## ---

**3\. Operational Panels**

The system supports multiple panel types, but only displays **5–6 panels** at a time based on relevance.

### **Standard Panel Definitions**

| Panel | Content Examples | Action on Click |
| :---- | :---- | :---- |
| **Weather** | 8°C, Wind 12mph SW, Rain at 15:00 | Opens detailed forecast. |
| **Tasks** | 4 Today, 2 Overdue | Lists specific tasks and highlights fields on map. |
| **Staff** | 3 Available, 1 On Task, 1 Sick | Lists names and current activity/status. |
| **Machinery** | 3 Active, 1 Service Due, 1 Maintenance | Shows specific machine status/telemetry. |
| **Activity/Log** | 08:12: Dave started fertilising | Shows time-stamped operational history. |
| **Alerts** | 2 Warnings (e.g., "North Field overdue") | Highlights the specific issue on the map. |

## ---

**4\. Adaptive & Role-Based Systems**

### **Enterprise Awareness (Modular Logic)**

Panels appear dynamically based on the specific operations of the estate:

* **Small holding:** Weather, Tasks, Livestock.  
* **Mixed farm:** Weather, Tasks, Staff, Machinery, Livestock, Crops.  
* **Large estate:** Full suite including Environmental and Contractors.

### **Role-Based Visibility**

Users only see information pertinent to their permissions:

* **Worker View:** Focused on "My Tasks," "My Routines," and "My Team." No financial or management-level staff data.  
* **Team Manager View:** Focused on team-specific tasks, staff, and machinery.  
* **Estate Manager/Admin:** Full operational overview across all enterprises.

### **Team-Based Filtering**

Visibility is filtered by functional teams (e.g., Arable, Cattle, Forestry). A worker in the "Cattle" team will not see "Sheep" panels unless cross-assigned.

## ---

**5\. Map Interaction**

The map is a dynamic visual representation of the panels:

* **Active Tasks:** Fields are highlighted when work is in progress.  
* **Warnings:** Fields with overdue tasks are highlighted in a warning color.  
* **Machinery:** Icons represent machine locations (simulated for prototype).  
* **Contextual Filtering:** Clicking "Active Machinery" in a panel filters the map to show only machine icons.

## ---

**6\. Daily Worker Routines**

Separate from one-off tasks, the overview supports **Routines**:

* **Examples:** Morning feed, water checks, fence walks, bedding.  
* **Worker Display:** The "Today" view splits into "My Tasks" and "My Routines" to ensure recurring maintenance is not missed.

## ---

**7\. Design Principles**

1. **Simplicity:** Information must be digestible in seconds.  
2. **Operational Focus:** Answer *What, Where,* and *Who* immediately.  
3. **Role & Enterprise Awareness:** Content must be relevant to the user’s job and the farm's assets.  
4. **Map-Centric:** All activity is linked back to the physical land.

## ---

**8\. Strategic Vision**

This page embodies the **LandArk Philosophy**:

**Operations → Evidence → Economics → History**

By combining Land, Operations, Staff, and Machinery into one interface, the Overview functions as the **Farm Operations Mission Control**.

---

**Would you like me to create a mock-up data table representing how these panels might look for a specific user role (e.g., an Arable Team Manager)?**