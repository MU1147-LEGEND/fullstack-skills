---
name: accessibility
description: >-
  Use when implementing or auditing frontend UI accessibility, ensuring
  WCAG 2.1 AA compliance, keyboard navigation, visible focus indicators,
  form labels, color contrast, touch targets, or screen reader support.
---

# Accessibility & Inclusive Frontend Engineering

Accessibility (a11y) is a foundational engineering requirement, not an optional compliance audit. Accessible interfaces are robust, keyboard-operable, screen-reader friendly, and resilient under diverse conditions.

## 1. Semantic HTML First

- **Buttons vs. Links:** Use `<button type="button">` for internal actions and modals. Use `<a href="...">` for URL navigation. Never `<div onClick={...}>`.
- **Heading Order:** Maintain strict hierarchical heading structure (`h1` -> `h2` -> `h3`). Never skip levels for visual sizing (use CSS classes to style size independently of heading level).
- **Landmarks:** Structure templates using `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` so assistive technologies can navigate page sections.

## 2. Keyboard Navigation & Focus Management

- **Operability:** Every interactive element must be reachable and triggerable using `Tab`, `Shift+Tab`, `Enter`, and `Space`.
- **Visible Focus Rings:** Never write `outline: none` without providing an explicit, high-contrast replacement:
  ```css
  /* Tailwind standard focus ring */
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  ```
- **Modal & Drawer Focus Traps:** Dialogs must trap focus inside while open and return focus to the triggering element upon dismissal with `Escape`.

## 3. Forms, Labels & Inputs

- **Explicit Labeling:** Every input must be associated with a `<label htmlFor="id">` or have an `aria-label` attribute. Placeholder text is NOT a label replacement.
- **Error Feedback:** Link input validation errors via `aria-describedby` and indicate invalid states with `aria-invalid="true"`.
- **Touch Target Sizing:** Minimum clickable/tappable area must be **44x44px** (especially for mobile icons and checkboxes).

```tsx
// Accessible Input Pattern
<div className="space-y-1.5">
  <label htmlFor="user-email" className="text-sm font-medium text-foreground">
    Email Address
  </label>
  <input
    id="user-email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
    className="h-10 w-full rounded-md border border-input px-3 text-sm focus-visible:ring-2"
  />
  {error && (
    <p id="email-error" role="alert" className="text-xs text-destructive">
      {error}
    </p>
  )}
</div>
```

## 4. Contrast & Motion Standards (WCAG 2.1 AA)

- **Color Contrast Ratios:**
  - Body text (< 18pt / 24px): Minimum **4.5:1** against the background.
  - Large headings (>= 18pt / 24px): Minimum **3:1**.
  - Form borders and icons: Minimum **3:1**.
- **Reduced Motion:** Honor user OS preferences for reduced motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

## 5. Anti-Patterns & Red Flags

- Hiding focus indicators (`outline: none` or `outline-0`) without an accessible fallback.
- Icon buttons with no text and no `aria-label` (screen reader announces "button" with no context).
- Relying solely on color to convey meaning (e.g. green/red text without icons or helper labels).
- Using `tabindex > 0` (this disrupts natural DOM reading order).
