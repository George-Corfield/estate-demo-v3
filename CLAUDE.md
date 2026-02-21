# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoilArk is an estate/farm management web app for tracking fields, tasks, machinery, and events. The main application lives in `soilark/`.

## Commands

All commands run from the `soilark/` directory:

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint (flat config, JS/JSX)
npm run preview  # Preview production build locally
```

No test framework is configured.

## Architecture

**Stack:** React 19 + Vite 7 + Tailwind CSS v4 + React Router v7, deployed on Vercel.

**State management:** Single `AppContext` using `useReducer` in `src/context/AppContext.jsx`. All mutations go through dispatched actions (ADD_TASK, UPDATE_FIELD, ADD_MACHINERY, etc.). No external state library.

**Routing:** Flat route structure in `src/App.jsx` — `/` (overview), `/fields`, `/tasks`, `/machinery`. All routes render inside `<Shell>` which provides Sidebar + TopBar layout.

**Module pattern:** Each feature is a directory under `src/modules/` containing a page component and its sub-components (list views, detail views, create forms). Modules use shared components from `src/components/shared/` and layout from `src/components/layout/`.

**Data:** Mock/seed data in `src/data/` (fields, tasks, machinery, events, staff). No backend — all state is client-side.

**Icons:** Google Material Icons via CDN (use icon name strings, not imports).

**Tailwind v4:** No tailwind.config.js — configured via `@import` in `src/index.css` which also defines CSS custom properties for the color system.

## Design System

Defined in `design.md` at the repo root. Key points:
- Estate office aesthetic — maps, precision, earthy tones
- Primary green: `--color-primary: #13ec13`
- Color carries meaning (green = healthy, ochre = warning)
- Typography: Inter font family
- Data-first, minimal chrome

## Specifications

- `soilark-prototype-spec.md` — overall project spec
- `machinery-spec.md` — machinery module spec
- `design.md` — design system and component contracts
