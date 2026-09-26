---
name: bangla-typography
description: >-
  Use whenever building or styling UI that contains Bangla/Bengali text —
  Bangla-only interfaces, bilingual Bangla+English products, government
  service forms, or Bangla marketing banners. Covers font selection,
  line-height, weight rendering, and script-specific rules that Latin-script
  typography guidance gets wrong for Bangla.
---

# Bangla Typography for UI

Bangla script has different physical properties than Latin script. Rules
tuned for Inter/Geist-style Latin typography (tight leading, aggressive
letter-spacing, thin weights) actively break Bangla readability if copied
over unchanged.

## 1. Font Selection
- **Digits and Numbers:** Don't use Hind Siliguri for Bangla digits and number. use any other font instead.
- **UI/Product Bangla:** Noto Sans Bengali, Hind Siliguri, Anek Bangla,
  Baloo Da 2 (rounder, friendly tone) — pick ONE as the primary Bangla face.
- **Editorial/Display Bangla:** Tiro Bangla, Atma, Baloo Da 2 (larger sizes)
  for headings/banners where personality matters more than density.
- **Never rely on system font fallback for Bangla.** If a Bangla font isn't
  explicitly loaded, browsers fall back to a default serif-like glyph that
  looks broken/unstyled next to a deliberately chosen Latin heading font.
- **Bilingual stacks:** always declare the Bangla font BEFORE the Latin
  fallback in `font-family`, e.g. `'Hind Siliguri', 'Inter', sans-serif` —
  not the reverse, or Bangla glyphs render in the wrong face.

## 2. Line-Height (Leading)

Bangla glyphs carry matras (top strokes) and below-baseline conjuncts that
need more vertical room than Latin x-height characters.

- Body text: **1.65–1.8** (vs. 1.5–1.65 for Latin body text).
- Headings: **1.3–1.4** (vs. 1.1–1.25 for Latin headings) — tight Latin
  heading leading clips Bangla matras and conjuncts.
- Never reuse a Latin type scale's line-height values as-is for Bangla text
  in the same component.

## 3. Letter-Spacing (Tracking)

- **Never apply negative letter-spacing to Bangla headings.** Latin
  typography guidance often tightens large headings (`-0.02em` to `-0.03em`)
  — on Bangla this breaks conjunct ligatures and makes text harder to read.
- Bangla tracking should stay at `normal` / `0` at all sizes, including
  display/hero text.

## 4. Font Weight & Size Compensation

- Many Bangla webfonts ship with a limited weight range (often just
  Regular + Bold). Don't design a scale assuming 5–6 weights are available —
  verify the loaded font's actual weight axis first.
- Avoid browser-synthesized bold/italic for Bangla (`font-weight: 700` on a
  font with no real bold cut) — it distorts conjuncts. Use a font family
  that ships a real bold weight, or don't fake it.
- Bangla glyphs are visually denser than Latin at the same font-size; a
  size that feels balanced for Latin body text can feel small/cramped for
  Bangla. Bump Bangla body text 1–2px over the Latin equivalent when the two
  share a component.

## 5. Numerals

- Decide explicitly whether to use Bangla numerals (০১২৩৪৫৬৭৮৯) or Western
  numerals (0123456789) — don't let it default inconsistently per component.
- Government/formal Bangla contexts conventionally expect Bangla numerals;
  tech/dashboard contexts often keep Western numerals for scannability
  (prices, dates, IDs). Confirm which convention the product needs, and
  apply it consistently across the whole interface — never mix within the
  same data type (e.g. one date in Bangla digits, another in Western).

## 6. Anti-Patterns & Red Flags

- Applying a Latin-tuned type scale (line-height, tracking, weight) directly
  to Bangla text without adjustment.
- Bangla font declared only on headings, body text silently falling back to
  an unstyled system font.
- Negative letter-spacing on Bangla display/heading text.
- Inconsistent numeral system (Bangla vs Western digits) across the same
  interface.
- Synthesized bold/italic on a Bangla font with no real bold cut.