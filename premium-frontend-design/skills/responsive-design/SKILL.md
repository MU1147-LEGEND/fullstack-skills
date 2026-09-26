---
name: responsive-design
description: >-
  Use when planning or implementing responsive layouts across mobile, tablet,
  and desktop, managing layout transformations, touch targets, responsive
  navigation, fluid typography, or content hierarchy.
---

# Intentional Responsive Design

Responsive design is architectural, not a post-implementation chore. A responsive interface transforms its layout, navigation, and density specifically for each device class rather than blindly stacking desktop columns.

## 1. Device-Specific Intent

- **Mobile (320px – 640px):**
  - Prioritize thumb-friendly bottom navigation, drawers/sheets, or collapsible menus.
  - Simplify secondary copy and emphasize primary action buttons.
  - Full-width touch targets with minimum dimensions of **44x44px** (ideally 48px).
  - Form inputs must have minimum `16px` font size to prevent iOS Safari auto-zoom.
- **Tablet (768px – 1024px):**
  - Transition from drawer to split views or condensed side rails.
  - 2-column or 3-column modular bento layouts.
  - Avoid awkward stretched full-width rows; wrap items in constrained grids.
- **Desktop (1024px – 1536px+):**
  - Full navigation headers or persistent sidebars.
  - Richer data displays (full tables, multi-column filters, keyboard shortcuts).
  - Constrain content using `max-w-7xl` or similar container bounds to prevent unreadable horizontal spreads.

## 2. Intentional Layout Transformations (Beyond Just Stacking)

Avoid the lazy habit of simply turning every desktop grid into a 1-column stack on mobile:
- **Tables:** Convert wide tables into structured cards or enable horizontal swipe with explicit edge shadows/fade cues.
- **Side-by-side Comparisons:** Transform into tabs or horizontal carousels on small screens.
- **Filters/Toolbars:** Collapse desktop horizontal filter bars into an accessible "Filter" bottom sheet on mobile.
- **Metrics/KPIs:** Turn 4-column metrics into a compact 2x2 grid or horizontal scroll track on mobile.

## 3. Fluidity & Units

- **Fluid Spacing:** Use CSS `clamp()` or Tailwind clamp utilities for section paddings:
  ```css
  padding-block: clamp(2rem, 1rem + 4vw, 5rem);
  ```
- **Dynamic Viewports:** Use `100dvh` (dynamic viewport height) instead of `100vh` to prevent mobile address bar overlap bugs.
- **Container Queries:** Favor `@container` queries for card and widget components so they adapt based on their parent container's width, not the global viewport.

## 4. Media & Layout Stability (CLS)

- Always set explicit `aspect-ratio` or width/height attributes on images and video embeds to eliminate Cumulative Layout Shift (CLS).
- Serve responsive images via `srcset` or modern picture elements (`<picture>`) to avoid loading desktop assets on mobile networks.

## 5. Anti-Patterns & Red Flags

- Horizontal overflow causing unwanted sideways page wobble on mobile (`overflow-x: hidden` on body is a symptom mask, not a fix; find the culprit element).
- Touch targets smaller than 40px or stacked so tightly that users mis-tap.
- Hiding critical user actions on mobile without a clear, accessible entry point.
- Leaving desktop-sized margins/paddings on mobile screens (e.g. 80px side padding on a phone).
