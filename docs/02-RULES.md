# KRISHI — Working Rules for the Agent

## A. STRICT RULES (never break)
1. Read 01-SPEC.md and this file before every phase. New requirements override old specs.
2. ONE phase / task at a time. Do only what the prompt asks. No bonus features, no "improvements".
3. Do NOT rewrite or restyle working code unless the task names it. Minimal, additive edits.
4. Do NOT add npm packages, Tailwind, or a database. If you think one is needed, STOP and ask me.
5. API keys live only in .env.local and server routes. Never in client code, never committed, never printed in logs.
6. Every new UI string goes into dictionaries.ts in en, kn AND hi in the same change. Never leave a key in one language only. Never use machine-sounding literal translations of farming terms: use words a farmer actually says.
7. Never invent facts presented as real: no fake YouTube IDs, no fake news sources, no fake scheme amounts or dates, no fake user counts. If data is sample, label it "Sample" in the UI.
8. Chatbot safety: no specific pesticide/chemical doses, ever. Refer to KVK / agriculture officer.
9. Never crash on failure. API down, storage full, mic denied, camera denied, no internet: show a friendly translated message.
10. Mobile first: test at 375px. Tap targets at least 44px (48px for primary actions). Inputs at least 16px font.
11. No self-praise. Do not write "production-grade", "polished", "complete", "100%" in reports.
12. Before starting a phase, make a backup: git commit if git exists, otherwise copy the project folder.

## B. DONE MEANS VERIFIED
After each task run, in this order, and paste the real output:
1. `npm run build`
2. `node scripts/verify-all.js`
3. `node scripts/test-locales.js`
4. Run the app and exercise the feature in a browser at 375px width. If you can capture screenshots, do. If you cannot, say "UI not visually verified".

## C. REPORT FORMAT (end of every task, exactly this)
- CHANGED: files created/edited
- VERIFIED (with evidence): what you actually ran and saw
- NOT VERIFIED: what you could not test (be specific)
- BROKEN / RISKS: anything half-working, any shortcut taken
- NEXT: the single next step
Do not claim something works if you did not run it.

## D. DESIGN RULES (farmer-first)
- Icon + short label on every key action. Never icon-only for important actions.
- Prefer big cards and chips over dropdowns and small links.
- Colors: keep existing tokens (forest green, paper). Add at most 2-3 warm accent tints for language cards and categories. No purple gradients, no glow effects, no emoji spam.
- Motion: minimal. Only transform/opacity. Respect prefers-reduced-motion. No animation on repeated actions.
- Kannada and Hindi need extra line-height. Test every new screen in kn and hi, with the longest label.
- Never let long text overflow: wrap, never truncate important words.
- Contrast must be readable outdoors. If unsure, go darker text, bigger size.

## E. DATA AND STORAGE RULES
- All reads/writes go through MockKrishiService. No scattered localStorage calls in components.
- Wrap localStorage writes in try/catch for QuotaExceededError.
- Compress images (max 900px wide, JPEG 0.7; profile photo 400px). Audio max 60s (comments 30s).
- Passwords: SHA-256 via SubtleCrypto. This is demo-grade only. Add a code comment saying real auth replaces it later.

## F. WHEN STUCK
Stop, state the problem, propose 2 options, wait for me. Do not silently work around a rule.
