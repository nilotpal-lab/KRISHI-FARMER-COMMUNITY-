# Krishi — P1 Frontend Blueprint (EGM Hay)

> **Contract Type**: Parent Repository Blueprint (Elephant-and-Goldfish Model)  
> **System Scope**: Frontend-Only Prototype 1 (P1) for Indian Farmer Advisory  
> **Verification Command**: `npm run build && node scripts/verify-all.js && node scripts/test-locales.js`

---

## 1. Architectural Invariants & Scope Boundaries

1. **Zero Database Dependency**: All data mutations run against an in-memory / `localStorage`-backed mock service layer (`src/lib/services/krishiService.ts`). No live Supabase connection is permitted in P1.
2. **Trilingual Purity**: Every UI affordance, metadata item, and error message must resolve through `src/lib/i18n/` across `en` (English), `kn` (Kannada), and `hi` (Hindi). Zero unlocalized English fallbacks in non-English modes.
3. **Shell Segregation**:
   - **Browse Shell** (`BrowseShell.tsx`): Pinned bottom navigation (`Home`, `Groups`, `Account`), `100dvh` viewport handling, full-width section bands.
   - **Task Shell** (`TaskShell.tsx`): Single-tier 72px header (Back link + title + demo bar + language switcher), in-flow document scroll with `padding-top: calc(var(--nav, 72px) + 28px)` to prevent mobile keyboards or fixed bars from occluding inputs. Quiet task footer.
4. **Mobile-Native Standards**:
   - Touch targets $\ge 44\text{px} \times 44\text{px}$.
   - Input font sizes $\ge 16\text{px}$ to prevent iOS Safari auto-zoom.
   - `touch-action: manipulation` on all pressable controls.
   - System font stacks with native Unicode script rendering.
5. **Anti-Slop Craft Gate**:
   - Zero floating glassmorphic pills, purple glow gradients, or AI tropes.
   - Solid, accessible contrast ratios ($\ge 4.5:1$ for body, $\ge 7:1$ for headings).
   - Strict 4px spacing rhythm.

---

## 2. Directory Index & Component Contracts (Peanuts)

```
Krishi/
├── src/
│   ├── app/                 # Next.js 15 App Router (10 P1 Routes)
│   │   ├── page.tsx         # Home feed & discovery
│   │   ├── about/           # Rules, privacy, 5 Later explanation dialogs
│   │   ├── admin/           # Moderation queue for open reports
│   │   ├── communities/     # Community directory (All / By state / By topic)
│   │   │   ├── [slug]/      # Group detail, membership toggle, group feed
│   │   │   └── new/         # Community creation form (State vs Topic)
│   │   ├── login/           # Prepared demo account switcher / sign in
│   │   ├── posts/
│   │   │   ├── [id]/        # Post detail, flat comments, report modal
│   │   │   └── new/         # Post composer for joined communities
│   │   └── profile/         # Account view, role display, language modal
│   ├── components/
│   │   ├── common/          # Shared domain components (DemoBar, PostCard, LanguageModal)
│   │   ├── shells/          # Layout shells (BrowseShell, TaskShell)
│   │   └── ui/              # Design system primitives (Button, Badge, Dialog, Select, Textarea)
│   ├── lib/
│   │   ├── i18n/            # Trilingual context, dictionaries, date formatting
│   │   └── services/        # Mock service layer, demo fixtures, places dataset
│   └── styles/              # Global CSS, tokens, mobile-native resets
├── public/assets/           # TasteSkill CSS bundles, high-resolution crop/farmer imagery
└── scripts/                 # Verification test suites (test-locales.js, verify-all.js)
```

---

## 3. Subtree Contract Summaries

### `src/lib/services/` (Service Layer Contract)
- **Primary Interface**: `krishiService` (`MockKrishiService`).
- **Invariants**: 
  - All writes mutate `localStorage` and notify registered listeners via Pub/Sub.
  - Initial seed records (`fixtures.json`, `places.json`, `ui-starter.json`) remain immutable defaults.
  - Method signatures match future Supabase Postgres RPCs (`krishi_create_community`, `krishi_set_membership`, `krishi_publish_post`, `krishi_add_comment`, `krishi_report_post`, `krishi_resolve_report`).
- **Verification**: `node scripts/verify-all.js`

### `src/lib/i18n/` (Localization Contract)
- **Primary Interface**: `useI18n()` hook (`locale`, `setLocale`, `t`, `formatDate`).
- **Invariants**:
  - Dictionaries across `en`, `kn`, and `hi` must maintain 100% key parity.
  - Active locale is persisted in `krishi_locale` cookie (365 days) and synchronizes with `document.documentElement.lang`.
  - Date formatting adheres to regional `Intl.DateTimeFormat` (`kn-IN`, `hi-IN`, `en-IN`) with `Asia/Kolkata` time zone.
- **Verification**: `node scripts/test-locales.js`

### `src/components/shells/` (Shell Layout Contract)
- **Invariants**:
  - `BrowseShell`: `<main>` must receive `padding-top: calc(var(--nav, 72px) + 32px)` on all subpages. `footer.closing` must have `height: auto !important; min-height: 100svh !important;` to decouple CTA from link columns.
  - `TaskShell`: `<main>` must receive `padding-top: calc(var(--nav, 72px) + 28px)`. Header must remain single-tier 72px.
- **Verification**: `npm run build && node "C:\Users\nilot\.gemini\config\skills\design-taste-frontend\scripts\gate.mjs" --quick`

---

## 4. Verification Workflow

```bash
# 1. Type check and build
npm run build

# 2. Verify image assets, trilingual parity, and fixture integrity
node scripts/verify-all.js

# 3. Verify strict language isolation (no cross-locale leakage)
node scripts/test-locales.js

# 4. Check TasteSkill anti-slop gate
node "C:\Users\nilot\.gemini\config\skills\design-taste-frontend\scripts\gate.mjs" --quick
```
