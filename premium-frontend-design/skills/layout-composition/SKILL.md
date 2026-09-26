---
name: layout-composition
description: >-
  Use when structuring page composition, establishing spatial grids,
  balancing whitespace, varying section rhythm, setting focal points,
  or designing distinctive layouts beyond repetitive card grids.
---

# Layout & Composition

A premium interface does not feel like a collection of interchangeable template sections. Intentional composition guides attention, varies pacing, and uses whitespace as an active structural element.

## 1. Section Rhythm & Pacing

Avoid repeating the same structural pattern section after section (e.g. Hero -> 3-Card Grid -> 3-Card Grid -> 3-Card Grid).
- **Vary Density & Scale:** Alternate between expansive, airy sections (e.g. statement quote or single focal demonstration) and structured, high-density sections (e.g. feature matrix or interactive tool).
- **Vary Background Tones:** Shift section background levels subtly (e.g. from `bg-background` to `bg-muted/30` or `bg-card`) to create natural visual chapters.
- **Break Symmetry:** Avoid strict 50/50 splits on every block. Use 60/40, 70/30, or asymmetrical alignments to create visual energy and direction.

## 2. Spatial Grid & Whitespace Discipline

- **8pt Base System:** Derive all layout dimensions, gaps, and section paddings from multiples of 8 (8, 16, 24, 32, 48, 64, 96, 128px).
- **Macro vs. Micro Whitespace:**
  - Macro space (between sections): 64px to 128px on desktop creates calm, premium breathing room.
  - Micro space (inside cards, between label and input): 8px to 16px keeps related items tightly bound.
- **Law of Proximity:** Space *between* separate logical groups must always be noticeably larger than space *within* an individual group.

## 3. Creating Clear Focal Points

- **One Hero per Viewport:** Every viewport height must have a clear visual hierarchy anchor (e.g. a dominant graphic, interactive widget, or bold statement).
- **Visual Weight Management:** Don't make everything scream for attention. Use muted borders (`border-border/40`), subtle surfaces, and low-contrast secondary copy so key actions pop naturally.

## 4. Distinctive Composition Archetypes

- **The Asymmetrical Feature:** Headline and primary narrative anchored to the left; an oversized, slightly bleeding interactive demo anchored to the right.
- **The Staggered Timeline / Story:** Chronological or step-based flow where alternating steps shift alignment slightly, creating a natural vertical scroll line.
- **The Focused Spotlight:** A single high-fidelity interactive component centered with generous empty margins, letting the product speak for itself.
- **Functional Bento (When Appropriate):** Use bento grids ONLY when features genuinely differ in size and priority (e.g., 1 large anchor tile for the core workflow + 2 small complementary stats tiles). Never force unrelated content into identical rounded boxes.

## 5. Anti-Patterns & Red Flags

- Consecutive sections of identical 3-column or 4-column card grids.
- Forcing trendy bento boxes when a simple table, list, or walkthrough explains the concept far better.
- Trapped white space: awkward leftover holes resulting from rigid grid columns.
- Cluttered layouts where every element has equal visual weight, causing visual exhaustion.
