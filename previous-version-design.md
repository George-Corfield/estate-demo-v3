# SoilArk Design System Documentation

## Overview

This document outlines the design system for the SoilArk estate management platform, including color palette, typography, and sizing conventions.

---

## Colors

### Primary Colors

- **Primary Green**: `#13ec13` – Environmental/eco action accent color
- **Primary Green Dark**: `#0fb80f` – Darker variant for hover states

### Background Colors

- **Light Background**: `#f6f8f6` – Light mode background
- **Dark Background**: `#102210` – Dark mode background
- **Neutral Light**: `#f1f5f1` – Neutral light shade
- **Neutral Dark**: `#1a2e1a` – Neutral dark shade

### Border Colors

- **Border Light**: `#e2e8f0` – Light borders, light mode
- **Border Dark**: `#2d3f2d` – Dark borders, dark mode

### Navigation & Header

- **Header Gradient**: `from-emerald-900 to-emerald-800` – Top bar background
- **Sidebar Background**: `emerald-950` – Sidebar primary background
- **Sidebar Border**: `emerald-900` – Sidebar dividers

### Category Colors (Fields)

| Category  | Background | Border    | Text      |
| --------- | ---------- | --------- | --------- |
| Arable    | `#fcd34d`  | `#f59e0b` | `#92400e` |
| Pastoral  | `#4ade80`  | `#22c55e` | `#166534` |
| Grassland | `#86efac`  | `#4ade80` | `#166534` |
| Forestry  | `#6b7280`  | `#4b5563` | `#1f2937` |

### Priority Colors (Tasks)

| Priority | Indicator | Background | Text      |
| -------- | --------- | ---------- | --------- |
| High     | `#ef4444` | `#fef2f2`  | `#991b1b` |
| Medium   | `#f97316` | `#fff7ed`  | `#9a3412` |
| Low      | `#3b82f6` | `#eff6ff`  | `#1e40af` |

### Event Type Colors

| Type        | Color     | Background | Text      |
| ----------- | --------- | ---------- | --------- |
| Task        | `#22c55e` | `#dcfce7`  | `#166534` |
| Service     | `#f59e0b` | `#fef3c7`  | `#92400e` |
| Appointment | `#3b82f6` | `#dbeafe`  | `#1e40af` |
| Event       | `#6366f1` | `#dbeafe`  | `#1e40af` |
| Reminder    | `#f59e0b` | `#dbeafe`  | `#1e40af` |

### Status Colors (Task Kanban)

| Status      | Background | Text      | Label         |
| ----------- | ---------- | --------- | ------------- |
| To Do       | `#f1f5f9`  | `#475569` | "To Do"       |
| In Progress | `#dbeafe`  | `#1e40af` | "In Progress" |
| Done        | `#dcfce7`  | `#166534` | "Done"        |

### Neutral/Text Colors (Tailwind)

- **Slate-400**: `#cbd5e1` – Secondary text, reduced prominence
- **Slate-500**: `#64748b` – Tertiary text, labels
- **Slate-600**: `#475569` – Body text
- **Slate-700**: `#334155` – Strong body text
- **Slate-800**: `#1e293b` – Headings, primary text
- **Slate-900**: `#0f172a` – Maximum contrast text
- **White**: `#ffffff` – Light backgrounds, inversed text

### Opacity Modifiers

- `white/10` – Very subtle white overlay
- `white/20` – Subtle white overlay
- `white/30` – Light white overlay
- `white/60` – Medium transparency text
- `primary/20` – Subtle primary color
- `primary/30` – Light primary overlay
- `primary/50` – Medium primary overlay

---

## Typography

### Font Family

- **Primary Font**: Inter (Google Fonts, sans-serif)
- **Display Font Variable**: `--font-display: "Inter", sans-serif`
- **Fallback**: sans-serif

### Font Sizes

#### Body & General Text

- **text-xs** / 10px – Extra small labels, badges, metadata
  - Standard usage: `uppercase tracking-wider`
  - Example: "Properties", "Equipment Details" section headers
- **text-sm** – 14px – Small body text, buttons, secondary information
  - Usage: Most form inputs, button labels, secondary content
  - Common pairings: `font-medium`, `text-slate-500`, `text-slate-700`
- **text-base** – 16px – Standard body text (Material Icons size)
  - Usage: Icon sizing, general content
  - Not heavily used as font size for text

#### Headings & Titles

- **text-lg** – 18px – Small headings, section titles
  - Example: "Add Equipment", "Landark Estate"
  - Typical pairing: `font-bold`
- **text-xl** – 20px – Medium headings
  - Less common in current design
- **text-2xl** – 24px – Large headings/titles
  - Less common in current design
- **text-3xl** – 30px – Extra large headings
  - Less common in current design

#### Custom Sizes

- **text-[10px]** – Customized 10px for very small labels
  - Example: Form field labels
  - Typical pairing: `font-bold uppercase tracking-wider`

### Font Weights

| Weight   | CSS Value       | Usage                                     |
| -------- | --------------- | ----------------------------------------- |
| Normal   | `font-normal`   | Infrequently used default                 |
| Medium   | `font-medium`   | 500 weight – body text, secondary buttons |
| Semibold | `font-semibold` | 600 weight – slightly emphasized text     |
| Bold     | `font-bold`     | 700 weight – headings, primary emphasis   |

### Text Styling Combinations

#### Page Headings

```
text-lg font-bold text-slate-900
```

- Size: 18px
- Weight: Bold (700)
- Color: Dark gray
- Example: "Add Equipment" form heading

#### Section Headers

```
text-xs font-bold text-slate-500 uppercase tracking-wider
```

- Size: 10px
- Weight: Bold
- Color: Medium gray
- Letter Spacing: Wide
- Transform: All caps
- Example: "Properties", "Equipment Details"

#### Body Text

```
text-sm text-slate-600
```

- Size: 14px
- Weight: Normal (inherited)
- Color: Medium gray
- Example: General descriptive text

#### Navigation Items

```
text-sm font-medium text-white/60
```

- Size: 14px
- Weight: Medium
- Color: White with transparency
- Example: Sidebar navigation labels

#### Logo/Branding

```
text-lg font-bold tracking-tight
```

- Size: 18px
- Weight: Bold
- Letter Spacing: Tight
- Example: "SoilArk" brand name

### Line Height

- Default Tailwind line heights applied (typically 1.5 for body text)
- Specific `leading-relaxed` used for larger body content blocks

---

## Spacing & Sizing Conventions

### Common Gaps (Tailwind spacing)

- `gap-1` – 4px – Very tight spacing
- `gap-2` – 8px – Close items
- `gap-3` – 12px – Standard component spacing
- `gap-4` – 16px – Section spacing

### Padding

- `px-2.5` / `py-1.5` – Button/control padding (10px horizontal, 6px vertical)
- `px-2.5` / `py-2` – Form elements (10px horizontal, 8px vertical)
- `px-3` / `py-2` – Larger controls (12px horizontal, 8px vertical)
- `px-4` / `py-2` – Button/badge padding (16px horizontal, 8px vertical)
- `px-6` – Horizontal page padding (24px)

### Icon Sizing

- **text-base** – 16px – Standard icons
- **text-lg** – 18px – Medium icons
- **text-[20px]** – Custom 20px for navigation icons
- **text-2xl** – 24px – Large icons (logo)

### Component Heights

- **h-8** – 32px – Small components
- **h-14** – 56px – Header bar height
- **h-16** – 64px – Larger sections

---

## Special Effects & Styling

### Backdrop & Transparency

- `backdrop-blur-md` – Medium blur effect for floating elements
- `opacity-0` / `opacity-100` – Toggle visibility
- Gradient backgrounds for hero areas

### Borders & Shadows

- **border-[color]** – Subtle borders (1px default)
- **shadow-lg** – Large drop shadow for elevated surfaces
- **rounded-lg** – 8px border radius for most elements
- **rounded-xl** – 12px border radius for larger cards
- **rounded-full** – Fully rounded (avatars, badges)

### Transitions

- `transition-colors` – Color changes on hover/active
- `transition-all` – All property changes
- `duration-150` – Fast transitions (150ms)
- `duration-200` – Standard transitions (200ms)
- `duration-300` – Slower transitions (300ms)

### Interactive States

- **hover**:bg-white/20 – Hover background overlay
- **hover**:text-white – Hover text color change
- **active** colors for selected navigation items
- **focus**:ring-2 focus\*\*:ring-primary/30 – Focus ring styling

---

## Component-Specific Styling Examples

### Buttons

- **Primary Button**: `text-sm font-bold text-emerald-950 bg-primary rounded-lg hover:bg-primary-dark`
- **Secondary Button**: `text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200`

### Forms

- **Text Input**: `px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary`
- **Label**: `text-[10px] font-bold text-slate-500 uppercase tracking-wider`

### Cards & Containers

- **Floating Card**: `bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200`
- **Panel Background**: Light slate/white with subtle borders

### Navigation

- **Active Nav Item**: `bg-primary/20 text-primary`
- **Inactive Nav Item**: `text-white/60 hover:text-white hover:bg-white/5`

---

## Design Principles

1. **Clean Hierarchy**: Clear font size progression from text-[10px] to text-3xl
2. **Consistent Spacing**: Multiples of 4px (Tailwind spacing scale) throughout
3. **Color Meaning**: Colors indicate status, priority, and categories
4. **Accessibility**: High contrast text, clear visual hierarchy
5. **Modern Aesthetics**: Glassmorphism (backdrop blur), subtle shadows, generous whitespace
6. **Responsive**: Flexible component sizing with Tailwind utilities
7. **Interactive Feedback**: Smooth transitions and hover states

---

_Last Updated: March 2026_
_Design System Version: 1.0 (Previous Version)_
