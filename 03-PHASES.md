# KRISHI — Phases (one day)

Rule for every phase: read 01-SPEC.md and 02-RULES.md first. Finish with the report format from 02-RULES.md section C.
Do not start the next phase until I say "go". Time estimates assume nothing goes wrong, so keep buffer.

---
## PHASE 0 — Know what we have (30 min, mostly me)
Skills: graphify (optional, only if the codebase feels unclear), credentials
- I open the app on my phone / DevTools 375px, in en, kn, hi. I send screenshots to Claude for an honest design review.
- I get the Gemini API key from Google AI Studio.
Prompt to Antigravity:
```
Use the credentials skill to create .env.local with GEMINI_API_KEY (ask me for the value, never print it), and make sure .env.local is in .gitignore. Do not change anything else.
```
Done when: .env.local exists, is git-ignored, app still builds.

---
## PHASE 1 — Language screen + signup + login (90 min)
Skills: mobile-native, break-ui (at the end)
Prompt 1A (language screen):
```
Read 01-SPEC.md and 02-RULES.md. Task: first-visit /welcome language picker.
If no krishi_locale cookie, redirect any page to /welcome. Mascot (mascot_kisan.svg) on top, a short greeting, three large cards: English, ಕನ್ನಡ, हिन्दी, each in its own script with a distinct tint. Tapping saves locale via existing cookie logic then goes to /login. Add a speaker button per card using SpeechSynthesis (en-IN, kn-IN, hi-IN) saying "Welcome", hidden if unsupported. Use the mobile-native skill for viewport/safe-area details. Do nothing else.
```
Prompt 1B (auth + wizard):
```
Read 01-SPEC.md and 02-RULES.md. Task: signup and login.
1) /login: keep demo accounts; add real login against stored accounts (SHA-256 via SubtleCrypto); add "Create account" and "Continue as guest" (goes to /).
2) /signup: one question per screen with progress bar and Back/Next. Steps: Name, Username+password, Age, Experience years, Photo (file input, compress to 400px data URL), State (Indian states dropdown) + District, Languages I can READ, Languages I can WRITE, Crops grown (image chips + Other). Required: name, username, password, state. Everything else skippable.
3) Extend UserProfile per spec section 8 and show the new fields on /profile.
4) After signup: log in automatically, role=member, go to /.
Add all strings in en/kn/hi. Do nothing else.
```
Prompt 1C (stress test):
```
Use the break-ui skill on the /welcome, /login and /signup screens only. Feed them long Kannada and Hindi strings, very long names, empty states. Report layout breaks and fix only those. Do not restyle anything.
```
Done when: acceptance criteria 1 and 2 pass on my phone.

---
## PHASE 2 — Image and audio posts (75 min)
Skills: mobile-native, animation-performance (only if recording UI feels janky)
Prompt:
```
Read 01-SPEC.md and 02-RULES.md. Task: real media in posts and comments.
1) Replace the stock-photo dropdown in /posts/new and InlineComposer with a real file input (camera or gallery), compress to max 900px wide JPEG 0.7, store as data URL.
2) Audio recorder with MediaRecorder: big mic button, timer, 60s max, preview player before posting, store as audioUrl. Friendly translated message if mic permission is denied.
3) Render image and <audio controls> in PostCard and /posts/[id].
4) Catch QuotaExceededError everywhere and show a translated message.
5) Same recorder for voice comments, 30s max.
Add strings in en/kn/hi. Do nothing else.
```
Done when: acceptance criterion 3 passes on a real phone (mic permission needs https or localhost).

---
## PHASE 3 — Auto-translate (60 min)
Skills: credentials, break-ui
Prompt:
```
Read 01-SPEC.md and 02-RULES.md. Task: auto-translate user content.
1) Create /api/translate (Next route handler): input {text, from, to}, calls Gemini (latest flash model) using process.env.GEMINI_API_KEY. Prompt: translate faithfully, keep agricultural terms natural for farmers, return only the translation. If key missing or call fails, return 503 and the UI shows the original.
2) In PostCard, /posts/[id] and comments: if item.lang !== current locale and there is no seeded label for the current locale, translate and show a small badge "Auto-translated from {language} · See original" with a toggle.
3) Cache in localStorage by contentId:locale so each text is translated once.
4) Skeleton while loading. Never block rendering.
Add strings in en/kn/hi. Do nothing else.
```
Done when: acceptance criterion 4 passes. Test with the key removed too, the app must not break.

---
## PHASE 4 — Crop guides (90 min)
Skills: design-taste-frontend (guide pages only), break-ui, mobile-native
Prompt 4A (data):
```
Read 01-SPEC.md and 02-RULES.md. Task: create src/lib/data/crops.json with 25 crops: tomato, onion, potato, chilli, brinjal, okra, cabbage, cauliflower, carrot, beans, cucumber, pumpkin, banana, mango, papaya, pomegranate, grapes, guava, coconut, watermelon, ragi, maize, groundnut, turmeric, ginger. Per crop: id, category, names en/kn/hi, bestSeason, soil, climate, waterNeeds, durationDays, expectedYield, growing stages (title+description en/kn/hi), requirements, commonPests, harvestTips, image path or emoji, youtubeSearchQuery, optional youtubeId (leave EMPTY, do not invent IDs), verified:true, verifiedBy:"Krishi seed content". Write conservative, general-purpose agronomy only: no chemical doses, no exact fertilizer quantities. Data only, no pages.
```
Prompt 4B (pages):
```
Read 01-SPEC.md and 02-RULES.md. Task: Guides UI. /guides: searchable grid with filter chips All / Vegetables / Fruits / Cereals. /guides/[id]: sections, steps timeline, requirement chips, Verified badge, responsive youtube-nocookie iframe ONLY if youtubeId exists, otherwise a "Watch videos" link to YouTube search. Missing photos get a clean colored emoji card. "Suggest an edit" form saves to guideSuggestions; /admin gets a "Guide suggestions" tab with Approve/Reject (status only). Add Guides to navigation. Use the design-taste-frontend skill ONLY for these new guide pages and follow 02-RULES.md section D. Do not restyle existing pages.
```
Done when: criterion 5 passes. I review the agronomy content myself or with a KVK/agri-student friend before showing it as "Verified".

---
## PHASE 5 — Kisan Mitra chatbot (90 min)
Skills: credentials, mobile-native
Prompt:
```
Read 01-SPEC.md and 02-RULES.md. Task: upgrade KisanChatbot, keep its UI and mascot.
1) /api/chat route calling Gemini with GEMINI_API_KEY. System prompt: you are "Kisan Mitra", friendly helper for Indian farmers; reply in the user's current language (en/kn/hi) in short simple sentences; you receive the user's state, district, crops; help with crop questions, government schemes for the state (PM-KISAN, PMFBY, Kisan Credit Card, plus state schemes) and suggesting Krishi communities and guides; say when unsure; NEVER give specific pesticide or chemical dosages, refer to the local KVK or agriculture officer; do not state scheme amounts or deadlines you are not sure of, say "check with your agriculture office". If the API fails, fall back to existing keyword answers.
2) Weather: when asked about weather/rain, call Open-Meteo (no key; geocode the district) and show a 3-day forecast in the bubble in the current language.
3) Quick chips: Weather, Govt schemes, Find a group, Crop help.
4) Mic button (SpeechRecognition en-IN/kn-IN/hi-IN) and "read aloud" (SpeechSynthesis) on replies, hidden if unsupported.
5) Suggested communities and guides render as tappable links.
Add strings in en/kn/hi. Do nothing else.
```
Done when: criteria 6 and 7 pass. Test a dosage question on purpose.

---
## PHASE 6 — Marketplace, PWA, cleanup (45 min)
Skills: mobile-native, animation-performance
Prompt:
```
Read 01-SPEC.md and 02-RULES.md. Tasks:
1) /marketplace: Coming soon page with mascot, short message in 3 languages, blurred skeleton product cards, Notify me button saving interest in localStorage with a thank-you state. Add to navigation.
2) public/manifest.json (name Krishi, theme #1f5134, standalone, 192 and 512 icons from the mascot), fix layout.tsx, and a basic service worker caching the app shell and /guides pages for offline.
3) Delete empty (browse) and (task) folders.
4) Replace hardcoded upvote useState(12) with persisted per-user likes and a real count.
5) Return i18n keys instead of hardcoded English errors in krishiService.ts.
Do nothing else.
```

---
## PHASE 7 — Optional (only if 2+ hours remain)
Prompt:
```
Read 01-SPEC.md and 02-RULES.md. Task: Problem posts. Toggle "I need help with my crop" on post creation; Open/Solved badge; post author can mark a comment "Best answer" and the post Solved. Then /news with 8 clearly labelled SAMPLE items in 3 languages ("Sample news, live feed coming soon"). No fake sources.
```

---
## PHASE 8 — QA, design pass, deploy (last 2 hours, protected)
Skills: break-ui, unslop, remove-animations, animation-performance, mobile-native
Prompt 8A:
```
Use break-ui across all screens in en, kn and hi at 375px. List every layout break, overflow, clipped Kannada/Hindi character, and English leak. Fix only those.
```
Prompt 8B (only after I review screenshots):
```
Use unslop on the screens I name: [LIST]. Remove generic AI-look patterns only. Keep existing tokens and layout. Follow 02-RULES.md section D. Do not add effects.
```
Prompt 8C:
```
Use remove-animations on frequent actions (like, comment, navigation) and animation-performance to ensure only transform/opacity are animated and prefers-reduced-motion is respected.
```
Then I walk through all 10 acceptance criteria on a real phone. Deploy to Vercel with GEMINI_API_KEY set in Vercel env vars, and re-test translation and chatbot on the live URL.
