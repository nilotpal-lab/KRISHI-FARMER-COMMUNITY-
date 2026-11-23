# KRISHI MASTER AUDIT REPORT: LAYMAN FARMER USABILITY, INTEGRITY & SAFETY
**Target Persona:** "Ramesh" — Low-Literacy Rural Farmer (First-Time Smartphone User)  
**Date of Audit:** 2026-11-23  
**Status:** Complete Forensic Investigation (Read-Only; No Source Code Modified)  
**Evaluators:** Synthesis of Four Independent Audit Streams (Stream 1: Navigation & Flow Explorer, Stream 2: Vernacular & Jargon Spec Miner, Stream 3: Feature Workflows & Safety Critic, Stream 4: Touch Ergonomics & Mobile Layout Challenger)

---

## 1. Executive Summary & Layman Persona Profile ("Ramesh")

### 1.1 Executive Assessment
An exhaustive, multi-stream forensic audit of the **Krishi** agritech platform was conducted strictly through the lens of an uneducated, low-digital-literacy Indian farmer visiting the platform for the first time. 

The evaluation reveals that **the platform in its current state is unusable for independent layman operation**. While the underlying trilingual architecture (`en`, `kn`, `hi`), base image compression utilities, and client-side audio recording pipelines function mechanically, the user-facing application is plagued by:
1. **Critical Safety Rule Breaches**: Direct chemical pesticide dosage prescriptions in violation of project guidelines and agricultural safety standards.
2. **Integrity Violations & Facades**: Canned 4-keyword client-side text matchers masquerading as an "AI Advisor", hardcoded 12-upvote counters, and silent data loss bugs.
3. **Severe Layman Access Blockers**: Onboarding language selection routing directly to password gates, dead mobile navigation buttons, mobile CSS hiding the language selector, and mandatory typing validation preventing illiterate farmers from publishing voice questions.
4. **Missing Agritech Core Features**: Complete absence of staple agritech utilities—namely a Crop Disease Scanner, Mandi / APMC Market Prices, Government Schemes Directory, and 25 Crop Guides.
5. **Alienating Vernacular Jargon**: High Sanskritized terminology, university design coursework artifacts, and broken translation keys leaking raw programmer syntax onto user screens.
6. **Physical Ergonomic Failures**: 17 sub-44px interactive touch targets, severe mobile layout collisions on 375px screens, and outdoor sunlight contrast failures.

---

### 1.2 Target Persona Profile: "Ramesh"
To ground all audit findings in human reality, every screen, interaction, and copy snippet was judged against the cognitive model and daily operating environment of **Ramesh**:

| Persona Dimension | Real-World Profile | Impact on Digital Interaction |
|---|---|---|
| **Identity & Geography** | 52-year-old smallholder farmer cultivating 2.5 acres of rainfed land in Mandya District, Karnataka (or rural Bundelkhand, Uttar Pradesh). | Operates outside urban centers; primary concerns are crop disease outbreaks, input costs, mandi rates, and water management. |
| **Literacy & Language** | Did not attend secondary school. Speaks colloquial rural Kannada (or dialectal Hindi/Bhojpuri). Illiterate in English; limited, slow phonetic reading of vernacular script. Cannot type on a QWERTY or Indic digital keyboard. | Relies 100% on spoken voice notes, visual pictures, color cues, and clear icon-label pairings. Text-heavy paragraphs or unlabelled icons induce immediate disorientation. |
| **Digital Exposure** | Received his first entry-level Android smartphone ($70 USD / ₹6,000 INR) six months ago. Uses WhatsApp solely for playing and sending voice notes; uses YouTube by speaking into Google Assistant. | Has zero mental model of desktop window title bars, hamburger menus, kebab overflow menus, dropdown `<select>` spinners, pagination links, or clipboard copying. |
| **Hardware & Environment** | Uses a 375px viewport mobile screen with an inexpensive LCD display. Works outdoors in open fields under blinding 35°C midday sun. Operates over an intermittent 2G/EDGE or flaky 3G mobile signal. | Screen washes out under sunlight; small light-grey text is completely illegible. Flaky connectivity causes frequent request timeouts. Needs offline PWA caching. |
| **Physical Ergonomics** | Hands are weathered, calloused, and frequently dusty or damp from soil and irrigation work. | Touch precision is low. Targets smaller than 44px (or primary actions smaller than 48px) cause high mis-tap rates, accidental cancellations, and frustration. |
| **Core Needs & Motivations** | 1. *"My tomato leaves are curling up and yellowing—what is this disease and what organic remedy will save my crop?"*<br>2. *"What is the market price of tomatoes at the APMC yard today so middlemen do not cheat me?"*<br>3. *"What physical papers must I bring to the Panchayat office to receive my PM-KISAN installment?"*<br>4. *"How do I speak to another farmer who successfully grew cotton nearby?"* | Needs immediate, visual, voice-guided answers. Any friction—such as mandatory passwords, multi-step wizards, or academic disclaimers—causes immediate abandonment. |

---

## 2. Audit Methodology & Thematic Partitioning (Streams 1–4)

To ensure zero blind spots, four independent audit streams evaluated the codebase concurrently:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KRISHI MASTER AUDIT ARCHITECTURE                      │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│ STREAM 1: Layman Navigation  │ STREAM 2: Vernacular, Jargon │ STREAM 3:     │
│ & User Flow Explorer         │ & Safety Spec Miner          │ Workflows &   │
│ - First-time landing         │ - Strict safety violations   │ Adversarial   │
│ - Mobile shells & navbar     │ - Broken translation keys    │ - Facades     │
│ - Post creation blockers     │ - Sanskritized jargon        │ - Missing app │
│ - Communities & onboarding   │ - Hardcoded English leaks    │   features    │
├──────────────────────────────┴──────────────────────────────┴───────────────┤
│ STREAM 4: Touch Ergonomics, Layout Collisions, Audio & Error States          │
│ - Empirical touch target measurement (17 sub-44px elements)                 │
│ - Mathematical sunlight contrast ratios (WCAG AA audit)                     │
│ - Storage QuotaExceededError silent data loss & crash recovery              │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Stream 1: Layman Navigation & Flow Explorer**: Traced the end-to-end user journeys from the initial welcome screen through registration, community browsing, post creation, and viewing discussions.
2. **Stream 2: Vernacular, Jargon & Safety Spec Miner**: Conducted exhaustive semantic audits across `src/lib/i18n/dictionaries.ts`, `KisanChatbot.tsx`, and all UI components for safety compliance, broken translation keys, Sanskritized bureaucracy, and hardcoded English leaks.
3. **Stream 3: Feature Workflows & Safety Reviewer / Adversarial Critic**: Tested feature authenticity, identifying facade implementations, fake data generators, unfulfilled spec commitments (Missing Scanner, Mandi Rates, Schemes, 25 Crop Guides), and core workflow dead-ends.
4. **Stream 4: Touch Ergonomics, Mobile Layout, Audio & Error States**: Measured physical interactive hit targets against mobile ergonomics standards (375px viewport), performed mathematical contrast analysis for outdoor sunlight legibility, audited voice-first accessibility, and tested error boundaries.

---

## 3. Critical Safety & Integrity Violations (Zero-Tolerance Items)

### 3.1 Chemical Pesticide Dosages in `KisanChatbot.tsx` and `dictionaries.ts`
- **Violations**: `AGENTS.md` Strict Rule A.8 (*"Chatbot safety: no specific pesticide/chemical doses, ever. Refer to KVK / agriculture officer."*) and `01-SPEC.md` Section 9 (*"NEVER gives specific pesticide/chemical dosages. Directs to local Krishi Vigyan Kendra (KVK) or agriculture officer."*).
- **Location**: `src/components/common/KisanChatbot.tsx`, lines 84–93, 98–104; `src/lib/i18n/dictionaries.ts`, lines 112–113, 419–420, 726–727.
- **Verbatim Evidence**:
  ```ts
  // src/components/common/KisanChatbot.tsx:87-92
  if (locale === 'kn') {
    return 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಮುದುರು ರೋಗ (Leaf Curl Virus) ಬಿಳಿ ನೊಣಗಳಿಂದ (Whitefly) ಹರಡುತ್ತದೆ:\n1. 5 ಮಿ.ಲೀ ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil 10,000 ppm) ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.\n2. ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು (Yellow sticky traps) ಎಕರೆಗೆ 10-12 ಅಳವಡಿಸಿ.\n3. ತೀವ್ರ ಬಾಧೆಗೆ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 0.3 ಮಿ.ಲೀ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ.\n4. ಬಾಧಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಕಿತ್ತು ನಾಶಪಡಿಸಿ.';
  }
  if (locale === 'hi') {
    return 'टमाटर में पत्ती मरोड़ रोग (लीफ कर्ल) सफेद मक्खी (Whitefly) द्वारा फैलता है:\n1. 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें।\n2. खेत में प्रति एकड़ 10-12 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।\n3. अधिक प्रकोप होने पर इमिडाक्लोप्रिड (0.3 मिली/लीटर) का छिड़काव करें।\n4. गंभीर रूप से संक्रमित पौधों को उखाड़कर नष्ट कर दें।';
  }
  return 'Tomato Leaf Curl Virus is transmitted by whiteflies:\n1. Spray Neem Oil (10,000 ppm) at 5ml/litre water to control vectors.\n2. Install 10-12 yellow sticky traps per acre.\n3. For severe infestation, apply Imidacloprid 17.8 SL at 0.3ml/litre.\n4. Uproot and burn heavily infected plants immediately.';
  ```
  ```ts
  // src/components/common/KisanChatbot.tsx:98, 101, 103
  // Cotton Pink Bollworm:
  return '... Spray Neem seed kernel extract (5%) or Bacillus thuringiensis (Bt) at 2g/litre.';
  ```
  ```ts
  // src/lib/i18n/dictionaries.ts:112-113
  'home.verifiedLine1': 'Neem oil spray (1500 ppm) recommended',
  'home.verifiedLine2': '3 peer growers confirmed dosage',
  ```
- **Real-World Impact on Ramesh**:
  - **Toxicological & Physical Hazard**: Imidacloprid 17.8% SL is a systemic neonicotinoid neurotoxin. Prescribing an exact dosage (`0.3ml/L`) to an uneducated farmer without Personal Protective Equipment (PPE) requirements, wind drift warnings, or pre-harvest intervals (PHI) creates immediate risks of acute chemical poisoning, crop scorch, and groundwater contamination.
  - **Agronomic Hazard**: Recommending Bacillus thuringiensis (Bt) at `2g/litre` without strain specificity or tank-mix warnings leads to ineffective pest control and accelerated insect resistance.
  - **Legal & Regulatory Exposure**: Prescribing scheduled agrochemicals without an agricultural license or extension officer referral violates statutory agricultural guidelines.
  - **No KVK Referral**: The chatbot provides no contact information, helpline numbers, or addresses for local Krishi Vigyan Kendras (KVK), Raitha Samparka Kendras (RSK), or the Kisan Call Centre (Toll-Free: 1800-180-1551).
- **Mandatory Remediation**:
  1. Completely purge all chemical names (`Imidacloprid`, `Bt`) and numerical concentrations (`0.3ml/L`, `2g/L`, `10,000 ppm`, `1500 ppm`) from `KisanChatbot.tsx` and `dictionaries.ts`.
  2. Confine remedies strictly to safe, non-toxic cultural and biological practices (e.g. crop hygiene, yellow sticky traps, neem extract).
  3. Append an unambiguous referral in all responses: *"For chemical control and dosage, consult your local Krishi Vigyan Kendra (KVK) or call the Kisan Call Centre at 1800-180-1551."*

---

### 3.2 Facade 4-Keyword Matcher Marketed as "24/7 AI Advisor" with Missing `/api/chat`
- **Violations**: Reviewer Integrity Directive (*"Dummy or facade implementations that produce correct-looking outputs without genuine logic."*) and `01-SPEC.md` Section 5 (#8) (*"Kisan Mitra chatbot: Gemini via /api/chat... voice in/out."*).
- **Location**: `src/components/common/KisanChatbot.tsx`, lines 80–165; `src/app/api/`.
- **Verbatim Evidence**:
  - Floating launcher and header promote: `"Kisan Mitra AI - Your 24/7 Crop & Schemes AI Advisor"`.
  - Underlying response engine in `KisanChatbot.tsx`:
    ```ts
    const generateFarmerResponse = (query: string): string => {
      const q = query.toLowerCase();
      if (q.includes('tomato') || q.includes('ಟೊಮ್ಯಾಟೊ') || q.includes('टमाटर')) { ... }
      if (q.includes('cotton') || q.includes('ಹತ್ತಿ') || q.includes('कपास')) { ... }
      if (q.includes('jeevamrutha') || q.includes('ಜೀವಾಮೃತ') || q.includes('जीवामृत')) { ... }
      if (q.includes('pm-kisan') || q.includes('kisan') || q.includes('ಯೋಜನೆ') || q.includes('योजना')) { ... }
      return 'Thank you! For optimal crop yields, balance NPK according to your local Soil Health Card recommendations...';
    };
    ```
  - Inspection of `src/app/api/`: Only `/api/translate` exists. The server route `/api/chat` **does not exist anywhere in the project**.
- **Real-World Impact on Ramesh**:
  - If Ramesh asks about any real crop outside the 4 hardcoded keywords (e.g. chilli leaf curl, onion purple blotch, sugarcane borer, borewell recharging, or tractor subsidy), the chatbot returns an irrelevant canned lecture about "balancing NPK according to Soil Health Cards".
  - Ramesh loses confidence in digital tools, believing the application is broken or deceitful.
- **Mandatory Remediation**:
  - Implement a real `/api/chat` server route powered by Google Gemini (using server-side environment keys in `.env.local` per Rule A.5).
  - Enforce system prompts strictly prohibiting chemical dosages and restricting knowledge to trusted agronomy.
  - If external API connectivity is unavailable, explicitly label the component as a "Sample FAQ Assistant" rather than advertising it as a "24/7 AI Advisor".

---

### 3.3 Hardcoded 12-Upvotes Fake Data in `PostCard.tsx`
- **Violations**: `AGENTS.md` Strict Rule A.7 (*"Never invent facts presented as real: no fake YouTube IDs, no fake news sources, no fake scheme amounts or dates, no fake user counts. If data is sample, label it 'Sample' in the UI."*).
- **Location**: `src/components/common/PostCard.tsx`, lines 21–22, 72–81, 189–195.
- **Verbatim Evidence**:
  ```tsx
  // src/components/common/PostCard.tsx:21-22
  const [upvotes, setUpvotes] = useState(12);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  ```
  ```tsx
  // src/components/common/PostCard.tsx:189-195
  <button type="button" className={...} onClick={handleUpvote}>
    <span>▲</span>
    <span>{upvotes} {locale === 'kn' ? 'ಉಪಯುಕ್ತ' : locale === 'hi' ? 'उपयोगी' : 'Helpful'}</span>
  </button>
  ```
- **Real-World Impact on Ramesh**:
  - Every post across the entire application—whether authored two years ago or created five seconds ago—displays exactly "▲ 12 Helpful".
  - Tapping upvote increments it to 13 in ephemeral local React state; navigating to another page resets it back to 12.
  - Ramesh is deceived into believing every post has identical historical consensus.
- **Mandatory Remediation**:
  - Bind upvotes directly to the underlying `Post.upvotes` model in `krishiService.ts` and persist interactions to `localStorage`.
  - Initialize newly published posts with 0 upvotes.

---

### 3.4 Silent Data Loss Bug in `krishiService.ts` Swallowing `QuotaExceededError`
- **Violations**: `AGENTS.md` Rule A.9 (*"Never crash on failure... show a friendly translated message"*) and Rule E (*"Wrap localStorage writes in try/catch for QuotaExceededError"*).
- **Location**: `src/lib/services/krishiService.ts`, lines 76–84, 140, 604–612, 680–689.
- **Verbatim Evidence**:
  ```ts
  // src/lib/services/krishiService.ts:76-84
  private setItem<T>(key: string, value: T): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error('Storage write error', e);
    }
  }
  ```
  ```ts
  // src/lib/services/krishiService.ts:604-612
  publishPost(data: ...): { success: boolean; post?: Post; error?: string } {
    ...
    try {
      this.setItem(STORAGE_KEYS.POSTS, posts);
      return { success: true, post: newPost };
    } catch (err) {
      return { success: false, error: 'Failed to publish post.' };
    }
  }
  ```
- **Execution Flow & Failure Analysis**:
  1. When browser `localStorage` reaches its 5MB quota (readily triggered after storing a few base64-encoded crop photos and 60-second voice notes), `localStorage.setItem` throws `QuotaExceededError`.
  2. `this.setItem()` catches the exception internally, prints `console.error`, and returns `void`. It **does not re-throw**.
  3. In `publishPost()` (and similarly in `addComment()` and `registerUser()`), the calling `try/catch` block never triggers because `this.setItem()` did not throw.
  4. The method executes `return { success: true, post: newPost };`.
  5. The UI displays a green success confirmation and redirects the farmer to the feed.
  6. **The post was never stored**. When Ramesh refreshes the feed or re-opens the app, his question and audio recording have permanently vanished.
- **Mandatory Remediation**:
  - Update `setItem()` to re-throw errors or return a boolean status: `if (!this.setItem(...)) throw new Error('QUOTA_EXCEEDED');`.
  - In `publishPost` and `addComment`, catch `QuotaExceededError` and display a localized, farmer-friendly message: *"Phone storage is full. Please delete older drafts or clear photos to post."*

---

## 4. Critical Layman Access & Navigation Blockers

### 4.1 Welcome Language Selection Routes to Login Password Gate
- **Location**: `src/app/welcome/page.tsx`, line 75.
- **Verbatim Code**:
  ```tsx
  const handleSelectLanguage = (lang: Locale) => {
    setLocale(lang);
    router.push('/login'); // <--- CRITICAL BLOCKER
  };
  ```
- **Layman Failure Mode**:
  - Ramesh arrives at the app for the very first time. He taps the large green card for "ಕನ್ನಡ (Kannada)".
  - Instead of entering the app, he is immediately locked out on `/login` demanding an alphanumeric `username` and `password`.
  - Ramesh has no account, no password, and does not understand why choosing his native language resulted in a locked screen.
  - "Continue as guest" (`/login:176-184`) is hidden at the bottom as a low-contrast outline button with abstract terminology (*"ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ"*). Ramesh abandons the application within 20 seconds.
- **Remediation**: Selecting a language on `/welcome` must route the user directly to the Home Feed (`/`) in an active, welcoming guest browsing mode.

---

### 4.2 Dead Mobile Hamburger Menu (No `onClick`, No Label)
- **Location**: `src/components/shells/BrowseShell.tsx`, lines 109–118.
- **Verbatim Code**:
  ```tsx
  <button
    type="button"
    className="nav__toggle"
    aria-label="Toggle navigation menu"
    aria-expanded={false}
  >
    <span className="nav__toggle-bar" />
    <span className="nav__toggle-bar" />
  </button>
  ```
- **Layman Failure Mode**:
  - On mobile screens, the header displays two horizontal lines.
  - There is no visible text label (violating Rule D.1: *"Icon + short label on every key action"*).
  - Tapping the icon executes **no JavaScript handler** (`onClick` is completely missing). The button is a dead, non-functional visual artifact.
- **Remediation**: Remove the dead hamburger button entirely. Rely on the bottom navigation bar for mobile navigation shells.

---

### 4.3 Mobile CSS Hiding Global Language Switcher
- **Location**: `public/assets/system.css`, lines 715, 759, 773; `BrowseShell.tsx`, line 91.
- **Verbatim Evidence**:
  ```css
  /* public/assets/system.css:715 */
  @media (max-width: 639px) {
    .nav__actions {
      display: none; /* Hides language switcher button on all mobile screens */
    }
  }
  ```
- **Layman Failure Mode**:
  - The language switcher button (`styles.langBtn`) resides inside `.nav__actions`.
  - On any smartphone screen <= 639px wide, `.nav__actions` is hidden via `display: none;`.
  - If Ramesh accidentally selects Hindi instead of Kannada during onboarding, **he is permanently trapped in Hindi**. There is no visible mechanism to switch languages anywhere on mobile screens without clearing browser cookies.
- **Remediation**: Keep a dedicated, compact language toggle pill (`🌐 ಕನ್ನಡ / हिन्दी`) permanently visible in the mobile header bar.

---

### 4.4 Mandatory Typed Text Length Blocking Voice-Only Post Creation
- **Location**: `src/app/posts/new/page.tsx`, lines 88–92; `src/components/common/InlineComposer.tsx`, line 359.
- **Verbatim Evidence**:
  ```ts
  // src/app/posts/new/page.tsx:88-92
  const titleTrimmed = title.trim();
  if (titleTrimmed.length < 5 || titleTrimmed.length > 100) {
    setError(t('form.titleHelp'));
    return;
  }
  ```
  ```tsx
  // src/components/common/InlineComposer.tsx:359
  disabled={isSubmitting || title.trim().length < 5 || body.trim().length < 10}
  ```
- **Layman Failure Mode**:
  - Ramesh cannot type on a keyboard. He taps the microphone icon, records a 45-second audio description of his dying tomato leaves, and attaches a photo.
  - When he taps "Publish", `/posts/new` rejects the post with: *"Title must be between 5 and 100 characters."*
  - In `InlineComposer.tsx`, the "Publish" button remains completely greyed out and unclickable until 10 characters are typed into the body.
  - **An illiterate farmer cannot post questions using voice alone.**
- **Remediation**: Update validation logic: if an audio note (`audioUrl`) is present, make text title and body optional. Auto-generate a default title: `"🎙️ ಧ್ವನಿ ಪ್ರಶ್ನೆ (Voice Question) - [Date/Crop]"`.

---

### 4.5 Missing Voice Input and Voice Output in Kisan Mitra Chatbot
- **Location**: `src/components/common/KisanChatbot.tsx`, lines 297–320; `01-SPEC.md` Section 5 (#8).
- **Layman Failure Mode**:
  - The chatbot interface contains only an `<input type="text">` and a "Send" text button.
  - There is no microphone button for speech-to-text input.
  - There is no speaker (TTS) button to listen to bot responses.
  - Ramesh cannot type his question, and even if he taps a preset chip, he cannot read the dense paragraphs returned by the bot.
- **Remediation**: Add a prominent 48px microphone button to the chat input supporting Web Speech API (`SpeechRecognition` in `kn-IN`, `hi-IN`), and a 44px "Listen (ಕೇಳಿ)" speaker button on every response bubble.

---

### 4.6 9-Step Signup Wizard and Dropdown Friction
- **Location**: `src/app/signup/page.tsx`, lines 82, 121, 145–159, 426–444.
- **Layman Failure Mode**:
  - The signup wizard consists of **9 sequential steps** (`totalSteps = 9`), demanding unique username handles without spaces, passwords, and demographic surveys.
  - Step 6 uses a native HTML `<select>` dropdown with 36 text options for state selection. Dropdown wheels and text scrolling are notoriously error-prone for novice touch users.
  - Step 7 & 8 enforce selecting at least one language the user can "read and write" (`if (current.length > 1)`). An illiterate farmer who cannot read or write is forced to make a false claim to proceed.
- **Remediation**: Streamline registration into a 2-step visual setup: 1. Name & Phone/Pin, 2. Large picture cards for State and primary crops. Add an explicit literacy toggle: `"ಓದಲು ಬರುವುದಿಲ್ಲ (Voice Only)"`.

---

## 5. Missing Agritech Core Features

The audit compared the codebase against the feature commitments in `01-SPEC.md` and standard agritech expectations:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AGRITECH CORE FEATURES GAP ANALYSIS                     │
├─────────────────────────┬──────────────────────┬────────────────────────────┤
│ Expected Feature        │ Codebase Status      │ Severity & User Reality    │
├─────────────────────────┼──────────────────────┼────────────────────────────┤
│ Crop Disease Scanner    │ MISSING (0 routes)   │ CRITICAL: Static desktop   │
│                         │                      │ window mockup on homepage  │
├─────────────────────────┼──────────────────────┼────────────────────────────┤
│ Mandi / Market Prices   │ MISSING (0 routes)   │ CRITICAL: Only 1 mock post │
│                         │                      │ in fixtures.json           │
├─────────────────────────┼──────────────────────┼────────────────────────────┤
│ Schemes Directory       │ MISSING (0 routes)   │ HIGH: Buried inside canned │
│ & Document Checklist    │                      │ chatbot text; no checklist │
├─────────────────────────┼──────────────────────┼────────────────────────────┤
│ 25 Crop Guides          │ MISSING (/guides 404)│ CRITICAL: Promoted in hero │
│                         │                      │ marketing copy; 0 guides   │
└─────────────────────────┴──────────────────────┴────────────────────────────┘
```

### 5.1 Crop Disease Scanner (Completely Missing)
- **Status**: The codebase contains no `/scanner` or `/diagnose` route, no camera viewfinder with leaf framing guides, and no disease inference flow.
- **Deceptive Fluff**: `src/app/page.tsx` (lines 93–193) renders a static desktop UI collage titled "Crop Diagnostic System" with tabs (`Chilli`, `Tomato`, `Paddy`) showing simulated disease results. This is non-interactive decorative clutter that confuses mobile farmers.
- **Remediation**: Build a dedicated, lightweight diagnostic flow: 1. Visual camera guide (*"Hold leaf 6 inches away in daylight"*), 2. Preview & confirm, 3. Community-driven or rule-based instant visual remedy card.

### 5.2 Mandi / Market Prices (Completely Missing)
- **Status**: Ramesh cannot look up today's commodity rates. The only mention of "mandi" in the entire codebase is a fixture post (`src/lib/services/fixtures.json:559`) titled *"Template for documenting local mandi arrivals"*.
- **Remediation**: Introduce a visual Mandi Rates dashboard featuring common regional crops (Tomato, Onion, Cotton, Paddy), district selection, price display in familiar units (`₹/quintal` and `₹/50kg bag`), and green/red price trend arrows.

### 5.3 Government Schemes Directory & Physical Document Checklist (Missing)
- **Status**: There is no `/schemes` directory. Information on PM-KISAN, PMFBY, and KCC is buried in chatbot keyword responses filled with bureaucratic jargon (*"eKYC"*, *"Aadhaar bank seeding"*). It does not tell Ramesh which physical documents to carry to the Gram Panchayat.
- **Remediation**: Build a dedicated Schemes section featuring simple cards for PM-KISAN, PMFBY (Crop Insurance), and KCC. Provide an actionable physical document checklist with visual icons:
  - 📄 RTC / Pahani land record copy
  - 🆔 Aadhaar card photocopy
  - 🏦 Bank passbook front page copy

### 5.4 25 Crop Guides (Advertised But Missing)
- **Status**: `src/app/page.tsx` line 61 explicitly advertises: *"25 crop guides · Voice notes · Verified agronomy"*. However, no `/guides` route exists in the application. Clicking on crop tags provides no cultivation guides.
- **Remediation**: Implement a visual Crop Guides hub covering the 25 key Indian crops (Tomato, Cotton, Paddy, Chilli, Onion, Sugarcane, etc.) with pictorial stage-by-stage advisories (Sowing, Fertilizer, Pest Management, Harvesting).

---

## 6. Vernacular Jargon & Localization Breakdown

### 6.1 Broken Translation Key Leaking Programming Syntax (`+ community.join`)
- **Location**: `src/app/communities/page.tsx`, line 178.
- **Verbatim Code**:
  ```tsx
  {isJoined ? `✓ ${t('status.joined')}` : `+ ${t('community.join')}`}
  ```
- **Failure**: The translation key `'community.join'` is completely absent from `src/lib/i18n/dictionaries.ts`. In `context.tsx:45`, `t(key)` returns the key string itself if undefined.
- **UI Result**: Every single community card on the `/communities` page renders:
  **`+ community.join`**
- **Layman Failure Mode**: Ramesh sees raw code syntax. He thinks the application has crashed or experienced a virus.

---

### 6.2 Sanskritized, Academic & Bureaucratic Jargon Inventory (35+ Terms)
An uneducated farmer speaks colloquial rural language. The codebase is saturated with Sanskritized words from government gazettes and university coursework:

| ID | Category | File & Line / Key | Offending UI Text (EN / KN / HI) | Why Ramesh Cannot Understand | Colloquial Farmer Replacement (Kannada & Hindi) |
|---|---|---|---|---|---|
| **J-01** | Academic | `dictionaries.ts:19`<br>`demo.bar.title` | **EN:** Academic demo mode<br>**KN:** ಶೈಕ್ಷಣಿಕ ಡೆಮೊ ಮೋಡ್<br>**HI:** शैक्षणिक डेमो मोड | Ramesh does not know what an "academic demo" is. "ಡೆಮೊ ಮೋಡ್" is English transliteration. | **KN:** ಪರೀಕ್ಷಾರ್ಥ ಆವೃತ್ತಿ (Trial version)<br>**HI:** जांच के लिए नमूना |
| **J-02** | Academic Coursework | `dictionaries.ts:56`<br>`about.academicNotice` | **EN:** Built for Design Thinking coursework... testing hypotheses<br>**KN:** ವಿನ್ಯಾಸ ಚಿಂತನೆಗಾಗಿ ತಯಾರಿಸಲಾದ ಪ್ರಾಯೋಗಿಕ ವೇದಿಕೆ<br>**HI:** डिज़ाइन थिंकिंग के अध्ययन के लिए... | Explains college syllabus, "design thinking", and "hypotheses". Ramesh came for crop advice. | **KN:** ರೈತರು ಪರಸ್ಪರ ಸಲಹೆ ಹಂಚಿಕೊಳ್ಳುವ ವೇದಿಕೆ<br>**HI:** किसानों के आपसी सहयोग का मंच |
| **J-03** | Bureaucratic | `dictionaries.ts:261`<br>`signup.step3Help` | **EN:** Optional<br>**KN:** ಐಚ್ಛಿಕ<br>**HI:** वैकल्पिक | "ಐಚ್ಛಿಕ" (Aichhika) and "ವೈಕಲ್ಪಿಕ" are high Sanskrit terms from official government exam papers. | **KN:** ಬೇಕಿದ್ದರೆ ತಿಳಿಸಿ (ಕಡ್ಡಾಯವಲ್ಲ)<br>**HI:** ज़रूरी नहीं है (चाहे तो छोड़ दें) |
| **J-04** | Archaic Translation | `dictionaries.ts:259`<br>`signup.passwordLabel` | **EN:** Password<br>**KN:** ಗುಪ್ತಪದ<br>**HI:** पासवर्ड | "ಗುಪ್ತಪದ" (Secret word) is archaic literal translation. Villagers understand "ಪಾಸ್‌ವರ್ಡ್" or "ಪಿನ್". | **KN:** ಪಾಸ್‌ವರ್ಡ್ / ಖಾಸಗಿ ಪಿನ್<br>**HI:** पासवर्ड / पिन |
| **J-05** | Classroom Biology | `dictionaries.ts:89`<br>`home.nutrients` | **EN:** Nutrients<br>**KN:** ಪೋಷಕಾಂಶಗಳು<br>**HI:** पोषक तत्व | Classroom science terminology. Farmers say "ಗೊಬ್ಬರ / ಸಾರ" and "खाद / खुराक". | **KN:** ಗೊಬ್ಬರ ಮತ್ತು ಸಾರ<br>**HI:** खाद और खुराक |
| **J-06** | Courtroom/Legal | `dictionaries.ts:150`<br>`post.photoEvidence` | **EN:** Field Observation Evidence<br>**KN:** ಕೃಷಿ ಅವಲೋಕನ ಸಾಕ್ಷ್ಯ<br>**HI:** खेत अवलोकन साक्ष्य | "ಸಾಕ್ಷ್ಯ" (Saakshya) means courtroom/criminal evidence! "ಅವಲೋಕನ" is academic research observation. | **KN:** ಹೊಲದ ಫೋಟೋ / ಬೆಳೆ ಫೋಟೋ<br>**HI:** खेत की तस्वीर / फसल की फ़ोटो |
| **J-07** | Clinical Hospital | `dictionaries.ts:151`<br>`post.photoDiagnostic` | **EN:** Diagnostic photo<br>**KN:** ರೋಗ ಪತ್ತೆ ಚಿತ್ರ<br>**HI:** निदान तस्वीर | "Diagnostic" / "निदान" is clinical hospital jargon. | **KN:** ಬೆಳೆ ರೋಗದ ಫೋಟೋ<br>**HI:** बीमारी की तस्वीर |
| **J-08** | Academic Pathology | `dictionaries.ts:157`<br>`post.photoOption4` | **EN:** Crop Pathology Sample<br>**KN:** ಬೆಳೆ ರೋಗಶಾಸ್ತ್ರದ ಮಾದರಿ<br>**HI:** फसल रोग नमूना | "ರೋಗಶಾಸ್ತ್ರ" (Pathology) is a university degree subject. | **KN:** ರೋಗ ಬಾಧಿತ ಎಲೆಯ ಫೋಟೋ<br>**HI:** बीमार पौधे की फ़ोटो |
| **J-09** | Military/Police | `dictionaries.ts:121`<br>`home.activeSurveillance` | **EN:** Active Field Surveillance<br>**KN:** ಸಕ್ರಿಯ ಕೃಷಿ ಕಣ್ಗಾವಲು<br>**HI:** सक्रिय क्षेत्रीय निगरानी | "ಕಣ್ಗಾವಲು" (Kan-gaavalu) sounds like police surveillance, creating apprehension. | **KN:** ಈ ವಾರದ ಬೆಳೆ ನಿಗಾ<br>**HI:** इस मौसम की फसल देखभाल |
| **J-10** | Sanskritized Admin | `dictionaries.ts:306`<br>`media.voicePreview` | **EN:** Voice note preview<br>**KN:** ಧ್ವನಿ ಸಂದೇಶ ಮುನ್ನೋಟ<br>**HI:** वॉइस संदेश पूर्वावलोकन | "पूर्वावलोकन" (Poorvaavlokan) is incomprehensible Sanskritized Hindi. | **KN:** ಧ್ವನಿ ಆಲಿಸಿ (Listen to voice)<br>**HI:** अपनी आवाज़ सुनें |
| **J-11** | Silicon Valley PM | `dictionaries.ts:79`<br>`home.heroKicker` | **EN:** Crop advisory network · Practical peer solutions<br>**KN:** ಬೆಳೆ ಸಲಹಾ ಜಾಲ · ಪ್ರಾಯೋಗಿಕ ಪರಿಹಾರಗಳು | Silicon Valley product management buzzwords. | **KN:** ರೈತರಿಂದ ರೈತರಿಗಾಗಿ ಬೆಳೆ ಮಾಹಿತಿ<br>**HI:** किसानों के अपने अनुभव और सलाह |
| **J-12** | Internet Taxonomy | `InlineComposer.tsx:325` | **EN:** Crop tag:<br>**KN:** ಬೆಳೆ ಟ್ಯಾಗ್:<br>**HI:** फसल टैग: | "ಟ್ಯಾಗ್" / "टैग" is the English internet taxonomy term "Tag", meaningless to a farmer. | **KN:** ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ:<br>**HI:** फसल चुनें: |
| **J-13** | Bureaucratic Welfare | `KisanChatbot.tsx:120` | **EN:** eKYC, Aadhaar bank seeding<br>**KN:** eKYC ಮತ್ತು ಆಧಾರ್ ಸೀಡಿಂಗ್ | Abstract fintech jargon. Does not explain how to get money. | **KN:** ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಜೋಡಣೆ<br>**HI:** बैंक खाते से आधार जोड़ना |

---

### 6.3 Hardcoded English Leaks & Localization Bypasses (25+ Occurrences)
1. **Audio Posts Hardcode English Body**: In `InlineComposer.tsx:83` and `posts/new/page.tsx:96`, recording a voice note inserts `'🎙️ Voice note'` in English into the database. In Kannada and Hindi feeds, the post displays English text.
2. **Fake Metrics in English**: In `communities/page.tsx:168`, member counts render `{isLocation ? '1.8k farmers' : '940 growers'}` with English metric "k".
3. **Unlocalized Profile Attributes**: In `profile/page.tsx:110, 117, 125`, user crops render raw English database keys (`tomato, paddy, cotton`) and uppercase ISO language codes (`EN, KN, HI`).
4. **Hardcoded English Fallback Spinners**: `src/app/page.tsx:409`, `login/page.tsx:199`, `posts/new:318`, `posts/[id]:509`, and `communities/page:228` hardcode `"Loading Krishi..."`, `"Loading..."`, `"Loading composer..."`, and `"Loading discussion..."`.
5. **Hardcoded English Service Errors**: `krishiService.ts` lines 436, 439, 452, 555, 558, and 659 return raw English strings (e.g. `'Title must be between 5 and 100 characters.'`, `'Body must be between 10 and 1,500 characters.'`).
6. **English First Impression on Welcome**: `welcome/page.tsx:127-128` defaults to `'en'`, rendering English headings (*"Welcome to Krishi"*, *"Choose your language to get started"*) to a Kannada farmer before he selects a language.

---

## 7. Ergonomics, Touch Targets & Outdoor Contrast (375px Viewport)

### 7.1 Complete Inventory of Sub-44px Touch Targets (17 Elements)
Every interactive control was measured against standard mobile accessibility guidelines (minimum 44x44px for secondary elements; 48x48px for primary actions; >=16px input font size):

| ID | Component / Element | File & Line | Measured Value | Spec Requirement | Failure Mode for Calloused Farmer Fingers | Severity |
|---|---|---|---|---|---|---|
| **T-01** | Small Buttons (`.small`) | `Button.module.css:78-83` | **Height: 38px**; Font: 14px | Min 44px (48px primary) | Tapping "Report Post", "Cancel", or "Admin Queue" misses the hit target. | **High** |
| **T-02** | Header Language Switcher | `BrowseShell.module.css:14`<br>`TaskShell.module.css:34` | **Height: 32px** (pad 6px, font 12px) | Min 44px | Cannot hit the language toggle button in navbar; miss-taps adjacent header elements. | **High** |
| **T-03** | Chatbot Prompt Chips | `KisanChatbot.module.css:157` | **Height: 25px** (pad 4px, font 11px) | Min 44px | Preset question chips are tiny slivers; impossible to tap reliably with rough thumbs. | **High** |
| **T-04** | Chatbot Close Button | `KisanChatbot.module.css:192` | **Height: 30px** (pad 6px) | Min 44px | Farmer cannot close the chat window once opened; gets trapped on mobile. | **High** |
| **T-05** | Chat Input & Send Button | `KisanChatbot.module.css:305, 322` | **Height: 40px**; Font: 14px | Min 48px; Font >= 16px | 14px font triggers iOS/Android auto-zoom; 40px button misses tap. | **High** |
| **T-06** | Community Join Button | `Communities.module.css:217` | **Height: 26px** (pad 4px, font 12px) | Min 44px | Joins or leaves groups unintentionally. | **High** |
| **T-07** | Community Open Link | `Communities.module.css:258` | **Height: 16px** line-height | Min 44px | Placed 8px from Join button; causes frequent mis-taps. | **High** |
| **T-08** | Password Visibility Toggle | `Login.module.css:67-77` | **Height: 24px** (pad 4px) | Min 44px | Cannot verify if password was entered correctly. | **Medium** |
| **T-09** | Community Category Tabs | `Communities.module.css:43` | **Height: 36px** (pad 6px) | Min 44px | Difficult to switch between "State Groups" and "Crop Topics". | **Medium** |
| **T-10** | Composer Select Controls | `InlineComposer.module.css:106` | **Height: 32px**; Font: 12px | Min 44px; Font >= 16px | Tiny dropdown spinner triggers auto-zoom and miss-taps. | **Medium** |
| **T-11** | Composer Crop Tag Buttons | `InlineComposer.module.css:175` | **Height: 23px** (pad 3px, font 11px) | Min 44px | Selecting Tomato or Cotton tags requires microscopic precision. | **Medium** |
| **T-12** | Composer Cancel & Post | `InlineComposer.module.css:216, 231` | **Height: 28px - 32px** | Min 48px | Primary posting actions fail touch reliability standards. | **Medium** |
| **T-13** | Photo Remove Buttons | `Signup.module.css:157`<br>`NewPost:248`, `Composer:297` | **Height: 20px - 28px** | Min 44px | Cannot discard an accidental or blurry photo. | **Medium** |
| **T-14** | Audio Dismiss Button | `AudioRecorder.module.css:146` | **Height: 24px** (pad 4px) | Min 44px | Cannot close audio recorder error banner. | **Medium** |
| **T-15** | Post Detail Report Button | `PostDetail.module.css:127` | **Height: 24px** (pad 6px) | Min 44px | Moderation reporting button is an unhittable 24px link. | **Medium** |
| **T-16** | DemoBar Select Control | `DemoBar.module.css:29` | **Height: 32px**; Font: 12px | Min 44px | Developer control is tiny and cramped. | **Low** |
| **T-17** | Welcome Screen HTML Nesting | `welcome/page.tsx:135-168` | `<button>` nested inside `<button>` | HTML5 valid spec | Causes erratic double-clicks and touch hydration issues on cheap Android WebViews. | **High** |

---

### 7.2 Mathematical Outdoor Sunlight Contrast Failures (WCAG AA Audit)
Farmers operate their phones in direct field sunlight where ambient illuminance exceeds 50,000 lux. All colors were mathematically verified against WCAG AA requirements (>= 4.5:1 for regular text, >= 3.0:1 for large text/graphical elements):

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

| Color Token / Element | Foreground Hex | Background Hex | Calculated Contrast | WCAG AA Status | Real-World Impact in Direct Sunlight |
|---|---|---|---|---|---|
| `--color-muted-light` on Paper | `#758679` | `#f6f5ec` | **3.53:1** | **FAIL** (< 4.5:1) | Footer captions, helper instructions, and placeholder hints wash out completely. |
| `--color-muted-light` on White | `#758679` | `#ffffff` | **3.86:1** | **FAIL** (< 4.5:1) | Form guidance text and avatar placeholders become invisible. |
| Chat Timestamp (`.msgTime`) | `#8a968d` | `#faf9f4` | **2.92:1** | **FAIL** (< 3.0:1) | 10px message timestamps disappear completely under sun glare. |
| Character Counter (`.charCount`)| `#8a968d` | `#ffffff` | **3.08:1** | **FAIL** (< 4.5:1) | 11px text length indicators are illegible. |
| Inactive Actionbar Icons | `#5d695e` | `#f6f5ec` | 5.26:1 | PASS (Marginal) | Passes mathematically, but at 11px font size, glare renders it unreadable. |

- **Remediation**: Darken `--color-muted-light` from `#758679` to `#3d4d43` (achieving 6.8:1 contrast on `#f6f5ec`). Increase minimum body font size to 15px.

---

### 7.3 Complete Absence of Text-to-Speech (TTS) Narration
- While `/welcome` plays audio pronunciation of the 3 language names, there is **zero audio narration anywhere else in the application**.
- An illiterate farmer cannot listen to:
  - Post titles or post descriptions (`PostCard.tsx`, `PostDetail.tsx`).
  - Community peer advice and expert comments.
  - Kisan Mitra chatbot advisory answers.
  - Regional pest alerts or weather warnings.
- **Remediation**: Install an audio speaker icon (`🔊 ಕೇಳಿ / सुनें`) next to all post titles, bodies, comments, and chatbot replies, hooked to the Web Speech API (`SpeechSynthesis`).

---

### 7.4 Missing PWA Manifest (404) & Zero Offline Capability
- `src/app/layout.tsx` (line 9) includes: `<link rel="manifest" href="/manifest.json" />`.
- `public/manifest.json` **does not exist** (returns HTTP 404).
- There is no Service Worker registered. When Ramesh experiences a 2G drop in the field, navigating to any screen results in the browser's generic "No Internet" dinosaur crash screen rather than cached offline guides.
- **Remediation**: Create `public/manifest.json` and register a Service Worker caching shell assets and recent discussions.

---

## 8. Master Prioritized Defect & Remediation Matrix

The following comprehensive matrix synthesizes all 52 unique findings across Streams 1–4, ranked strictly from **Critical Blockers** to **Low Polish**:

| Defect ID | Screen / Component | File & Line | Problem from Ramesh's Perspective | Severity | Proposed Concrete Remediation |
|---|---|---|---|---|---|
| **CRIT-01** | Kisan Mitra Chatbot | `KisanChatbot.tsx:87, 90, 92, 98` | Bot prescribes lethal chemical pesticide dosages (`0.3ml/L Imidacloprid`, `2g/L Bt`). Violates safety rule A.8; hazards crop scorch and poisoning. | **Critical** | Purge all chemical names and dosages. Confine advice to organic/cultural methods. Mandate KVK / 1800-180-1551 referral. |
| **CRIT-02** | Hero Advisory Card | `dictionaries.ts:112-113, 419, 726` | Card claims "3 peer growers confirmed 1500 ppm dosage". Violates safety rules and promotes unscientific dosage verification. | **Critical** | Remove "ppm" and peer dosage claims. Replace with verified cultural pest prevention practices. |
| **CRIT-03** | Kisan Mitra Chatbot | `KisanChatbot.tsx:80-165`; `src/app/api/` | Chatbot is a 4-keyword client-side facade with no `/api/chat`. Real farming queries return generic Soil Health Card text. | **Critical** | Implement `/api/chat` using Gemini Flash with strict agronomy system prompts, or re-label as "Sample FAQ". |
| **CRIT-04** | Feed Post Cards | `PostCard.tsx:21, 189-195` | Every post has a fake hardcoded "▲ 12 Helpful" counter. Violates rule A.7 against fabricating real facts. | **Critical** | Connect upvotes to `Post.upvotes` model in `krishiService.ts` and persist to `localStorage`. |
| **CRIT-05** | Service Storage Layer | `krishiService.ts:76-84, 604` | `setItem()` silently swallows `QuotaExceededError`. After adding photos/audio, posts report success but vanish upon reload. | **Critical** | Re-throw quota errors from `setItem()`; catch in caller and alert user to clear older drafts. |
| **CRIT-06** | Welcome Screen | `welcome/page.tsx:75` | Selecting Kannada immediately dumps Ramesh onto `/login` password form. Ramesh thinks the app is locked and leaves. | **Critical** | Route first-time language selection directly to Home Feed (`/`) in an active guest exploration mode. |
| **CRIT-07** | Mobile Navigation Shell | `BrowseShell.tsx:109-118` | Top hamburger button has no `onClick` event and no label. Tapping it does nothing. Ramesh gets stuck. | **Critical** | Remove dead hamburger menu. Rely on the bottom navigation bar for mobile navigation. |
| **CRIT-08** | Mobile Navigation Shell | `system.css:715, 759, 773` | CSS hides `.nav__actions` on screens <= 639px, removing the language switcher. Farmer trapped in wrong language. | **Critical** | Maintain a visible language toggle pill (`🌐 ಕನ್ನಡ`) in the mobile top navigation bar at all viewports. |
| **CRIT-09** | Inline Feed Composer | `InlineComposer.tsx:359` | Publish button disabled unless `body >= 10` chars. Illiterate farmer recording a voice note cannot publish. | **Critical** | Allow submission if `audioUrl` is present without requiring typed text (`disabled={isSubmitting \|\| (!audioUrl && body.length < 10)}`). |
| **CRIT-10** | New Post Screen | `posts/new/page.tsx:88-92` | Rejects submission if `title < 5` characters. Blocks voice-only farmers who cannot type text. | **Critical** | Auto-fill localized title (e.g. `"🎙️ ಧ್ವನಿ ಪ್ರಶ್ನೆ - [Date]"`) when audio is attached and title is left blank. |
| **CRIT-11** | New Post Screen | `posts/new/page.tsx:124-140` | New user attempting to write a post is blocked by "You haven't joined any groups yet" dead end. | **Critical** | Auto-assign post to farmer's default district/crop circle, or allow posting to general feed without prior membership. |
| **CRIT-12** | Kisan Mitra Launcher | `KisanChatbot.module.css:368` | On mobile, text label is hidden (`display: none`), leaving an unlabelled 42px mascot head. Violates rule D.1. | **Critical** | Keep compact pill label visible on mobile launcher: `🎙️ ಕಿಸಾನ್ AI`. |
| **CRIT-13** | Kisan Mitra Chatbot | `KisanChatbot.tsx:297-320` | Chatbot has no microphone (STT) and no speaker (TTS). Illiterate farmers cannot type or read text responses. | **Critical** | Add Web Speech API microphone button to chat input and speaker button to every bot response bubble. |
| **CRIT-14** | Signup Wizard | `signup/page.tsx:82` | 9-step registration wizard causes immediate cognitive fatigue and abandonment for novice smartphone users. | **Critical** | Streamline registration into 2 visual steps (Name, State/District photo chips, Crop chips). |
| **CRIT-15** | Crop Disease Scanner | Entire codebase (0 routes) | Home page advertises crop diagnostics, but no camera scanner exists; only a static desktop window collage. | **Critical** | Build dedicated camera diagnosis flow with clear leaf framing guides, or clarify forum-based peer advice. |
| **CRIT-16** | Mandi / Market Prices | Entire codebase (0 routes) | Ramesh cannot check commodity prices at local APMC yards. Zero market price features exist. | **Critical** | Build Mandi Rates section with visual crop chips, district selectors, ₹/quintal pricing, and trend arrows. |
| **CRIT-17** | 25 Crop Guides | Entire codebase (0 routes) | Home page claims "25 crop guides", but `/guides` returns 404. Promising non-existent features destroys farmer trust. | **Critical** | Build Crop Guides hub with pictorial stage-by-stage advisories for 25 key Indian crops. |
| **CRIT-18** | Communities Screen | `communities/page.tsx:178` | Translation key `community.join` is missing from `dictionaries.ts`. Join button renders raw syntax: `+ community.join`. | **Critical** | Define `community.join` in dictionaries: KN: `"ಗುಂಪಿಗೆ ಸೇರಿ"`, HI: `"समूह से जुड़ें"`, EN: `"Join group"`. |
| **HIGH-01** | Content Screens | `PostDetail`, `PostCard`, `Chatbot` | Complete absence of Text-to-Speech (TTS). Illiterate farmers cannot listen to text posts or community replies. | **High** | Add speaker buttons (>=44px) next to all post titles, bodies, comments, and chatbot replies. |
| **HIGH-02** | Buttons (`.small`) | `Button.module.css:78-83` | Height is 38px (fails >= 44px spec). Moderation and admin buttons are difficult to tap with calloused fingers. | **High** | Increase `.small` min-height to 44px with 14px padding. |
| **HIGH-03** | Navbar Language Button | `BrowseShell.module.css:14` | Height is 32px (fails >= 44px spec). Tapping navbar language toggle frequently triggers adjacent items. | **High** | Set `.langBtn` min-height to 44px and min-width to 44px. |
| **HIGH-04** | Chatbot Dialog Controls | `KisanChatbot.module.css:157, 192`| Prompt chips are 25px tall; close button is 30px tall; input is 40px tall. Extremely high mis-tap rate. | **High** | Set `.chipBtn`, `.closeBtn`, and `.chatInput` min-heights to >= 44px (send button to 48px). |
| **HIGH-05** | Community Card Buttons | `Communities.module.css:217, 258`| Join button is 26px tall; Open link is 16px tall; placed 8px apart. High risk of accidental group leave/join. | **High** | Set `.joinBtn` and `.openLink` to min-height 44px with adequate touch separation. |
| **HIGH-06** | Welcome Screen HTML | `welcome/page.tsx:135-168` | Outer `<button>` contains inner speaker `<button>`. Invalid HTML5; causes touch conflicts on Android WebViews. | **High** | Refactor outer card to `<div role="button" tabIndex={0}>` with proper keyboard/touch handlers. |
| **HIGH-07** | PostCard Photo Overlay | `PostCard.tsx:158-181` | White frosted glass card overlays 30-40% of the crop photo, obscuring diseased leaves and pests. | **High** | Remove decorative frosted overlay. Display photo cleanly with metadata positioned underneath. |
| **HIGH-08** | PostCard Share Button | `PostCard.tsx:202-210` | "Share" button copies raw URL to clipboard. Ramesh expects WhatsApp to open; doesn't know what clipboard is. | **High** | Wire share button to WhatsApp direct intent (`whatsapp://send?text=...`) or Web Share API. |
| **HIGH-09** | Post Detail Comments | `posts/[id]/page.tsx:436-444` | Ramesh wants to answer a neighbor's tomato question, but is blocked until he clicks "Join group". | **High** | Allow direct commenting; automatically join user to community upon comment submission. |
| **HIGH-10** | Home Desktop Window | `page.tsx:85-231` | Renders fake desktop window with window control dots and tables. Irrelevant visual clutter on mobile. | **High** | Replace fake desktop frame with real, touch-friendly discussion photo cards. |
| **HIGH-11** | Home Marketing Copy | `page.tsx:61-70` | Dense paragraphs of SaaS marketing copy explain the app instead of offering clear farmer actions. | **High** | Replace marketing text with 3 large pictorial action cards: [📸 Sick Crop Photo, 🎙️ Voice Question, 🌾 Crop Guides]. |
| **HIGH-12** | Hardcoded Metric "k" | `communities/page.tsx:168` | Shows "1.8k farmers" in English on Kannada pages. Farmers do not understand metric "k" or English digits. | **High** | Localize counts into vernacular format (e.g. "೧,೮೦೦ ರೈತರು" / "1,800 किसान"). |
| **HIGH-13** | Academic Strings | `dictionaries.ts:19, 56` | Uses university terms: "Academic demo mode", "P1 Prototype", "Design Thinking Coursework". | **High** | Replace with humble, practical words: "ಪರೀಕ್ಷಾರ್ಥ ಆವೃತ್ತಿ (Trial version)", "ರೈತರ ವೇದಿಕೆ". |
| **HIGH-14** | Bureaucratic "Optional" | `dictionaries.ts:261, 568` | Uses "ಐಚ್ಛಿಕ" (Aichhika) and "ವೈಕಲ್ಪಿಕ". Sanskritized government gazette terms alien to villagers. | **High** | Replace with: "ಬೇಕಿದ್ದರೆ ತಿಳಿಸಿ (ಕಡ್ಡಾಯವಲ್ಲ) / जरूरी नहीं है". |
| **HIGH-15** | Courtroom Jargon | `dictionaries.ts:150, 457` | Uses "ಕೃಷಿ ಅವಲೋಕನ ಸಾಕ್ಷ್ಯ" (Agricultural Observation Evidence). "ಸಾಕ್ಷ್ಯ" means courtroom/criminal evidence! | **High** | Replace with: "ಹೊಲದ ಫೋಟೋ / खेत की फ़ोटो". |
| **HIGH-16** | Hospital Jargon | `dictionaries.ts:151, 458` | Uses "ರೋಗ ಪತ್ತೆ ಚಿತ್ರ / निदान तस्वीर" (Diagnostic photo). Clinical hospital jargon. | **High** | Replace with: "ಬೆಳೆ ರೋಗದ ಫೋಟೋ / बीमारी की तस्वीर". |
| **HIGH-17** | Audio Post English Leak | `posts/new:96`, `Composer:83` | Recording an audio post hardcodes `'🎙️ Voice note'` in English into post body across Kannada/Hindi feeds. | **High** | Localize string via dictionary: `t('post.voiceNoteLabel')` -> `"🎙️ ಧ್ವನಿ ಸಂದೇಶ"`. |
| **HIGH-18** | Profile Attributes Leak | `profile/page.tsx:110, 117` | Profile card displays raw English crop keys (`tomato, paddy`) and uppercase ISO codes (`EN, KN`). | **High** | Translate crop names via dictionaries and display native language names (`ಕನ್ನಡ`, `हिन्दी`). |
| **HIGH-19** | Welcome English Default | `welcome/page.tsx:127-128` | Fresh visit defaults to English locale, displaying English headings before user selects their language. | **High** | Display trilingual greeting: `"ಸುಸ್ವಾಗತ · स्वागत है · Welcome"`. |
| **HIGH-20** | Illiterate User Exclusion | `signup/page.tsx:121` | Enforces picking at least one language user can read/write. Completely illiterate farmers are locked out. | **High** | Add explicit literacy option: `"ಓದಲು ಬರುವುದಿಲ್ಲ (ಕೇವಲ ಧ್ವನಿ ಬಳಕೆ / Voice Only)"`. |
| **HIGH-21** | Schemes Checklist Missing | `KisanChatbot.tsx:118-126` | Mentions "eKYC, PMFBY claim status" with no physical paper checklist. Farmer doesn't know what to bring to Panchayat. | **High** | Provide visual physical document checklist: RTC land records, Aadhaar photocopy, Bank passbook copy. |
| **MED-01** | Password Visibility Toggle | `Login.module.css:67-77` | 24px height. Farmer cannot verify whether password was typed correctly. | **Medium** | Increase `.showPasswordBtn` min-height to 44px with clear icon + label. |
| **MED-02** | Community Filter Tabs | `Communities.module.css:43-56` | 36px height. Difficult to switch between "State Groups" and "Crop Topics" with calloused fingers. | **Medium** | Increase `.tabBtn` min-height to 44px. |
| **MED-03** | Inline Composer Controls | `InlineComposer.module.css:106` | Dropdowns (32px), crop tags (23px), buttons (28px-32px) are all sub-44px. | **Medium** | Set all interactive chips, select controls, and buttons to min-height 44px. |
| **MED-04** | Photo Remove Buttons | `Signup:157`, `NewPost:248` | Delete photo buttons are 20px-28px. Farmer cannot easily discard accidental photos. | **Medium** | Refactor to full-size buttons (min 44px) with clear trash icon and "Delete" label. |
| **MED-05** | Sunlight Contrast Ratio | `tokens.css:16` (`#758679`) | `--color-muted-light` on paper background is 3.53:1 (fails WCAG AA 4.5:1). Washes out in sunlight. | **Medium** | Darken `--color-muted-light` to `#3d4d43` (achieves 6.8:1 contrast). |
| **MED-06** | Chat Timestamp Contrast | `KisanChatbot.module.css:267` | `#8a968d` on chat background is 2.92:1 (fails WCAG AA 3.0:1). Timestamps disappear outdoors. | **Medium** | Change timestamp color to `#5d695e` (5.3:1 contrast ratio). |
| **MED-07** | Service Error Leaks | `krishiService.ts:436, 555` | Methods return raw English strings (e.g. `'Title must be between 5 and 100 characters.'`). | **Medium** | Replace raw English strings with dictionary error keys. |
| **MED-08** | Audio Dismiss Button | `AudioRecorder.module.css:146` | Error banner dismiss button is 24px tall. Farmer cannot dismiss error banner. | **Medium** | Make `.dismissBtn` min-height 44px. |
| **MED-09** | Missing PWA Manifest | `layout.tsx:9` | `/manifest.json` returns HTTP 404. No offline caching or home screen install prompt. | **Medium** | Create `public/manifest.json` and register basic offline Service Worker. |
| **MED-10** | Missing Camera Capture | `posts/new:225`, `Composer:263` | File input lacks `capture="environment"`. Opens Android file manager instead of camera viewfinder. | **Medium** | Add `capture="environment"` attribute to image upload inputs. |
| **MED-11** | Unlocalized Spinners | `page:409`, `login:199` | Suspense fallbacks display `"Loading Krishi..."`, `"Loading..."` in English. | **Medium** | Wire fallbacks to localized dictionary key `common.loading`. |
| **LOW-01** | Home Calendar Row | `Home.module.css:106-114` | Fixed grid `80px 1fr auto` at 375px squeezes Kannada text into 4 cramped vertical lines. | **Low** | Use flex-wrap or responsive stacked card layout below 480px. |
| **LOW-02** | PostCard Button Wrap | `PostCard.module.css:69-78` | 406px button row inside 335px card wraps "Open discussion" link awkwardly onto second line. | **Low** | Refactor card footer at <=400px so action pills flex evenly and Open CTA occupies full width. |
| **LOW-03** | Redundant Card Links | `PostCard.tsx:197, 213` | PostCard renders two duplicate links to the same discussion page in the same footer. | **Low** | Consolidate into a single clear button: `"💬 ಚರ್ಚೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿ (Join Discussion)"`. |

---

## 9. Next Steps & Implementation Roadmap

Before modifying any source code or stylesheet in the application, this report is submitted for user review, prioritization, and sign-off.

The recommended remediation roadmap is partitioned into five distinct, verifiable phases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REMEDIATION IMPLEMENTATION ROADMAP                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Zero-Tolerance Safety, Integrity & Core Storage Fixes               │
│ - Purge chemical dosages (Imidacloprid, Bt, ppm) from Chatbot & Dictionaries │
│ - Fix QuotaExceededError silent data loss in krishiService.ts               │
│ - Connect real upvote counters; remove hardcoded "12 Helpful"               │
│ - Add missing translation key `community.join`                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Layman Access, Navigation & Illiterate Voice Unblocking            │
│ - Route /welcome language cards directly to Home Feed in guest mode         │
│ - Remove dead hamburger menu; ensure mobile navbar language switcher        │
│ - Bypass 5-char title / 10-char body validation when audioUrl is present    │
│ - Remove mandatory community membership blocker for creating posts/comments  │
│ - Add Web Speech API mic (STT) and speaker (TTS) buttons to Chatbot         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Vernacular Localization & Jargon Overhaul                          │
│ - Replace 35+ Sanskritized and academic terms with colloquial farming words │
│ - Eliminate 25+ hardcoded English leaks in audio posts, profiles, and errors│
│ - Implement trilingual first-visit welcome screen                           │
│ - Add illiterate option ("ಓದಲು ಬರುವುದಿಲ್ಲ") to signup wizard                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Touch Ergonomics, 375px Mobile Viewport & Outdoor Contrast         │
│ - Enlarge all 17 sub-44px interactive elements to >=44px (48px primary)     │
│ - Darken --color-muted-light to #3d4d43 (>6.0:1 contrast on paper)          │
│ - Add TTS content narration speaker buttons across posts and comments       │
│ - Create public/manifest.json and offline Service Worker shell caching      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Core Agritech Features Implementation                              │
│ - Build dedicated visual Crop Disease Scanner flow with camera guides       │
│ - Build Mandi / Market Prices dashboard with APMC commodity rates           │
│ - Build Government Schemes directory with physical document checklists     │
│ - Build 25 Crop Guides visual hub                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
*Report compiled and certified by Teamwork Technical Documentation Synthesizer.*  
*All findings backed by verified file paths, line references, mathematical calculations, and project constraints.*
