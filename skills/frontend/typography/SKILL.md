---
name: typography
description: >-
  Use when selecting typefaces, defining modular type scales, pairing fonts,
  setting line-height and line lengths, tuning responsive typography, or
  refining hierarchy and readability in web interfaces.
---

# Typography System & Hierarchy

Typography is the backbone of interface clarity and perceived quality. Intentional typography creates clear hierarchy, effortless readability, and a distinctive aesthetic without oversized or generic AI tropes.

## 1. Type Scale & Modular System

Adopt a mathematically disciplined scale rather than arbitrary pixel sizes.
- **Ratio Recommendations:** Minor Third (`1.2`) or Major Third (`1.25`) for web apps/SaaS; Augmented Fourth (`1.414`) for high-impact editorial landing pages.
- **Standard Scale:**
  - `Display / Hero`: `clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)` (36px–60px)
  - `H1 / Section`: `clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)` (28px–40px)
  - `H2 / Subsection`: `1.5rem` (24px)
  - `H3 / Card Titles`: `1.125rem`–`1.25rem` (18px–20px)
  - `Body / Base`: `1rem` (16px)
  - `Small / Captions / Badges`: `0.75rem`–`0.875rem` (12px–14px)

## 2. Font Pairing & Brand Personality

Limit to **maximum 2 font families** per project:
- **Productivity & Modern SaaS:** High-grade grotesque/geometric sans (Geist, Inter, Plus Jakarta Sans) used consistently across all headings and body copy.
- **Editorial & Premium Lifestyle:** High-contrast serif for display/H1 (Newsreader, Instrument Serif, Playfair) paired with a clean neutral sans for body/UI.
- **Developer / Technical:** Clean sans with monospace accent (JetBrains Mono, Geist Mono) for metrics, timestamps, tokens, and data tables.

## 3. Readability & Line Dynamics (Leading & Measure)

- **Optimal Measure (Text Width):** Keep body paragraphs between **45 to 75 characters per line** (`max-w-prose` or `max-width: 65ch`). Never span body paragraphs full-width across desktop viewports.
- **Line-Height (Leading):**
  - Tight headings: `1.1` to `1.25` (prevents multi-line headings from drifting apart).
  - Body text: `1.5` to `1.65` (ensures comfortable eye tracking between lines).
  - Captions/Compact UI: `1.3` to `1.4`.
- **Text Wrap Rules:**
  - Apply `text-wrap: balance;` to headings and titles.
  - Apply `text-wrap: pretty;` to body copy to prevent orphan words.

## 4. Micro-Typography & Weights

- **Letter-Spacing (Tracking):**
  - Large headings (> 24px): Tighten letter-spacing slightly (`-0.02em` to `-0.03em`).
  - Small uppercase badges/labels: Open letter-spacing (`0.05em` to `0.08em`).
  - Body text: Neutral (`normal` / `0`).
- **Weight Contrast:** Differentiate hierarchy through weight (e.g. `font-semibold` vs `font-normal`) and color tone (`text-foreground` vs `text-muted-foreground`), not just size jumps.

## 5. Anti-Patterns & Red Flags

- Defaulting to massive, bloated hero text that causes awkward line breaks on laptops.
- Using 3 or more disparate font families on a single page.
- Centering body copy longer than 2–3 lines.
- Unconstrained body paragraphs stretching across 1200px+ monitors.
- Low-contrast text failing WCAG AA (e.g., light gray text on white cards).
