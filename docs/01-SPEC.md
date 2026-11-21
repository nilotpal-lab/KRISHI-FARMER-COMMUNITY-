# KRISHI — Build Spec (1-day scope)

This spec OVERRIDES the older v1.0/v1.1 specs and README wherever they conflict.
Self-signup, file uploads, audio, guides and real AI are now IN scope.

## 1. Product in one line
A community forum for Indian farmers, in their own language (English, Kannada, Hindi),
voice-friendly and low-literacy friendly, with crop guides and an AI helper (Kisan Mitra).

## 2. Users and design reality
- Farmers on cheap Android phones, weak network, bright sunlight, rough hands.
- Some read only one language. Some cannot type comfortably. Images and voice come first, text second.
- Therefore: big tap targets (48px), high contrast, large readable text, icons next to every key action,
  few words per screen, one question per screen in forms.

## 3. Stack (FIXED, do not change)
Next.js 15, React 19, TypeScript, vanilla CSS / CSS Modules, existing tokens.css and UI primitives,
lucide-react, MockKrishiService + localStorage for data.
Server routes only for AI: /api/translate and /api/chat (Gemini, key in .env.local as GEMINI_API_KEY).
No Tailwind. No database. No new npm packages without asking me first.

## 4. Languages
en, kn, hi. All UI strings live in dictionaries.ts with identical keys in all three.
User content keeps its own `lang` field and is auto-translated on display (Phase 3).

## 5. Features IN scope today
| # | Feature | Notes |
|---|---------|-------|
| 1 | First-visit language picker | /welcome, 3 big cards, each in own script, speaker button |
| 2 | Signup / login / guest | localStorage, SHA-256 hashed password, no OTP |
| 3 | Profile wizard | name, username, password, age, experience, photo, state, district, read langs, write langs, crops |
| 4 | Posts with image + audio | real file input, client compression, MediaRecorder, 60s max |
| 5 | Comments incl. voice comments | 30s max |
| 6 | Auto-translate | Gemini via /api/translate, cached, "Auto-translated from X · See original" |
| 7 | Crop guides (25) | JSON seed, image/emoji placeholder, YouTube embed ONLY if real ID present, steps, requirements, Verified badge, Suggest edit |
| 8 | Kisan Mitra chatbot | Gemini via /api/chat, weather via Open-Meteo, schemes by state, community suggestions, voice in/out |
| 9 | Marketplace | "Coming soon" page + Notify me |
| 10 | PWA basics | manifest.json, icons, simple service worker |

## 6. Optional if time remains
Problem posts (Open/Solved/Best answer), sample news page (clearly labelled sample), persisted likes.

## 7. OUT of scope (do not build, do not mention in UI as available)
OTP, privacy/legal pages beyond what exists, 1-to-1 chat, "Report bad translation", "Talk to an expert",
voice-only mode toggle, real moderator review queue, community notes, real marketplace, real backend.

## 8. Data model additions (localStorage, via MockKrishiService)
- UserProfile: + passwordHash, age?, experienceYears?, state, district?, readLangs[], writeLangs[], crops[], photoDataUrl?
- Post: + audioUrl?, imageUrl may now be a data URL, + kind?: 'normal' | 'problem', status?: 'open' | 'solved'
- Comment: + audioUrl?, + isBestAnswer?
- guideSuggestions: { id, guideId, author, text, status: 'pending'|'approved'|'rejected', createdAt }
- translationCache: key `${contentId}:${locale}` -> text
- marketplaceInterest: username -> boolean

## 9. AI behaviour requirements
- Chatbot replies in the user's current language, short simple sentences.
- Knows user's state, district, crops (passed in from profile).
- Says "I'm not sure" when unsure.
- NEVER gives specific pesticide/chemical dosages. Directs to local Krishi Vigyan Kendra (KVK) or agriculture officer.
- If API fails or key missing: fall back gracefully (existing keyword answers / original untranslated text). Never crash.

## 10. Acceptance criteria (the demo must pass these, tested by a human)
1. Fresh browser opens /welcome, picking Kannada shows the whole UI in Kannada.
2. Create an account through the wizard with only required fields, and with all fields.
3. Post with an image, post with a 10s voice note, comment with text and voice.
4. A Hindi post opened by a Kannada user shows Kannada with the "Auto-translated" badge and a working "See original".
5. /guides shows 25 crops, search works, detail pages open, no broken images.
6. Chatbot answers a weather question for the user's district, and a scheme question for their state.
7. Chatbot refuses a dosage question and points to KVK.
8. Marketplace shows Coming soon, Notify me works.
9. Everything usable at 375px width, no horizontal scroll, no overlapping text in Kannada or Hindi.
10. npm run build passes, verify-all.js and test-locales.js pass.
