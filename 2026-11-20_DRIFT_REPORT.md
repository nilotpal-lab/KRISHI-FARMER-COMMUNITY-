# EGM Drift Detection Report

**Date**: 2026-11-20  
**Scope**: Verification of implementation source code against design documents and architectural plans.

---

## Krishi_P1_Frontend_Implementation_Plan.md

* **Error Message Localization in Service Layer**: In `src/lib/services/krishiService.ts`, method rejection strings (e.g., `'Name must be between 3 and 60 characters.'` in `createCommunity`, `'Title must be between 5 and 100 characters.'` in `publishPost`, `'You cannot report your own post.'` in `reportPost`) are returned as hardcoded English string literals rather than translation keys. While the UI layer catches several via form helper text, raw service failures display in English regardless of active locale.
* **Image Attribution in Dynamic Communities**: The design doc specifies that dynamically created communities should adhere to crop or location classification. However, newly created groups default to `paddy_mandya.jpg` without dynamic tag mapping.
* **Pagination Control Consistency**: On `/communities/[slug]`, pagination for group posts defaults to `hasOlder`/`hasNewer` text links, whereas the Home feed (`/`) renders page numbers with offset queries.
* **Hydration State Divergence**: Local storage mutations (e.g. joined communities) do not synchronize during initial server-side rendering (SSR), producing a minor client-only hydration update on first mount.

---

## src/lib/services/README.md

* **UUID Format Divergence**: The README specifies stable UUIDv5 generation (`a879c9d0-54aa-49dd-9521-e63af72756ba + ...`), but dynamically created mock entities in `src/lib/services/krishiService.ts` generate timestamp strings (e.g. `comm_${Date.now()}`, `post_${Date.now()}`) instead of UUIDv5 hashes.
* **Seed Group Display Translations**: While all 6 seed communities have trilingual labels, newly created mock communities currently store their authored title and description across all three locale buckets (`en`, `kn`, `hi`) identically rather than flagging them as single-language user submissions.

---

## mobile-native/SKILL.md

* **No drift detected.** `globals.css` and layout meta tags fully satisfy touch action manipulation, font minimum 16px, overscroll suppression, and safe area insets.

---

## design-taste-frontend/SKILL.md

* **No drift detected.** Gate quick check passes with `0 FAIL`. SR-3 air and ground separation, quiet borders, and photo bands adhere to specification.
