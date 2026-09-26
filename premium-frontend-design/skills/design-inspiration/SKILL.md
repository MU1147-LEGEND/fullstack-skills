---
name: design-inspiration
description: >-
  Use when conducting frontend design research, analyzing real-world reference
  products, studying visual aesthetics across SaaS, ecommerce, and editorial
  sites, or extracting design principles to build original interfaces.
---

# Design Research & Inspiration

World-class interfaces are informed by proven patterns, not created in a vacuum or generated from generic AI templates. The goal of design research is to dissect what works at a structural level and synthesize an original interface tailored to the product's identity.

## 1. The Research-to-Creation Method

Never copy a template wholesale. Follow the 4-step synthesis cycle:
1. **Analyze:** Examine world-class reference sites in the target domain. Identify why their design succeeds (spatial balance, typography pairings, micro-interactions, contrast).
2. **Abstract:** Extract the underlying design principle (e.g. "Linear uses crisp 1px borders with dark elevated surfaces to give technical tools physical precision").
3. **Adapt:** Translate that principle to the specific domain and problem space at hand.
4. **Author:** Write original code and structure tailored to the actual product content and user goals.

## 2. Reference Catalogs by Archetype

- **Developer & Technical SaaS (e.g. Linear, Supabase, Vercel, Raycast):**
  - *Key Principles:* High density, crisp borders (`1px solid hsl(var(--border))`), keyboard-first navigation, subtle ambient light effects, monospace data tokens.
- **Editorial & Agency (e.g. Awwwards winners, Readymag, Siteinspire, Instrument):**
  - *Key Principles:* Expressive typography, narrative pacing, asymmetrical balance, oversized imagery, intentional whitespace.
- **Consumer, Fintech & Commerce (e.g. Apple, Stripe, Airbnb, Wise):**
  - *Key Principles:* Friendly rounded geometry, reassuring clarity, high-contrast primary CTAs, effortless progressive disclosure, tactile micro-feedback.
- **Modern Component Primitives (e.g. shadcn/ui, Radix Primitives, Base UI):**
  - *Key Principles:* Accessible foundation, unstyled structural primitives, clean semantic naming, customizable via CSS variables.

## 3. What to Extract vs. What to Ignore

| Extract (The Principles) | Ignore (The Clutter / Copies) |
|---|---|
| Information hierarchy and reading flow | Direct layout cloning or identical section structures |
| Interaction timing and feel (e.g. snappy 150ms spring) | Superficial trendy gimmicks (e.g. random floating purple orbs) |
| Typographic contrast and modular scale | Unrelated brand marks, colors, or stock assets |
| Handling of complex states (loading, empty, error) | Over-engineered animations that impede core usability |

## 4. Anti-Patterns & Red Flags

- Copying the exact layout of Linear or Stripe for an unrelated domain (e.g. a medical portal or local restaurant).
- Defaulting to "purple gradient + dark background + glassmorphic card" as the universal shorthand for modern design.
- Relying on generic placeholder content instead of designing around the actual user tasks and data shapes.
