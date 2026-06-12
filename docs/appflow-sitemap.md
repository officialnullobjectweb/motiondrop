# MotionDrop - App Flow & Sitemap
Version: 1.0

---

## 1. SITEMAP

motiondrop.com/
│
├── / (Landing Page)
│   Purpose: Explain the tool, convert visitors to users
│   CTA: "Start Creating" → goes to /app
│
├── /app (Main Application)
│   Purpose: The actual tool
│   This is where 95% of user time is spent
│
├── /history (History Page)
│   Purpose: View last 5 generated animations
│   Access: From navbar or /app
│
└── /docs (Documentation)
    Purpose: How to get API keys, how to use Lottie
    Access: From navbar and footer

---

## 2. USER FLOW - FIRST TIME USER

Step 1: Lands on / (Landing Page)
   └── Sees: Hero headline, example animations, how it works
   └── Clicks: "Start Creating Free" button
   └── Goes to: /app

Step 2: Arrives at /app
   └── Sees: API key prompt at top (no key stored yet)
   └── Sees: Prompt input box (disabled until API key added)
   └── Action: Clicks "Add API Key"

Step 3: API Key Modal opens
   └── Sees: Dropdown to select provider
   └── Sees: Link to get free API key (opens AI provider in new tab)
   └── Action: Pastes API key
   └── Action: Clicks "Save"
   └── Modal closes, input box becomes active

Step 4: User types prompt
   └── Types: anything about their brand/app
   └── Optionally: Drags file (logo) onto upload zone
   └── Optionally: Selects canvas size (default: portrait)
   └── Action: Clicks "Generate Animation" button

Step 5: Generation happens
   └── Sees: Progress indicator with steps:
           "Understanding your prompt..."
           "Building motion design..."
           "Generating animation..."
           "Rendering preview..."
   └── Wait: 5-15 seconds depending on provider

Step 6: Animation appears
   └── Sees: Animation playing on canvas preview
   └── Sees: Play/Pause/Loop controls below canvas
   └── Sees: Editor panel on the right side
   └── Sees: Download buttons below or beside canvas

Step 7: User optionally edits
   └── Adjusts: Speed slider
   └── Changes: Colors
   └── Edits: Text
   └── Toggles: Particles
   └── All changes apply instantly (no AI call)

Step 8: User downloads
   └── Clicks: Download format (Lottie/GIF/MP4/CSS)
   └── File downloads to their computer
   └── History item automatically saved

---

## 3. USER FLOW - RETURNING USER

Step 1: Lands on /app
   └── API key already loaded from localStorage
   └── Prompt box immediately active
   └── Previous history thumbnail visible in corner

Step 2: Either:
   A. Types new prompt → Generate
   B. Goes to /history → Loads old animation → Edit → Download
   C. Uploads new file → Types prompt → Generate

---

## 4. USER FLOW - HISTORY PAGE

Step 1: User goes to /history
   └── Sees: Grid of up to 5 past animations
   └── Each card shows: thumbnail, prompt text, date, duration

Step 2: User clicks a history card
   └── Goes to: /app with that animation loaded
   └── Can: Watch it, edit it, download it, regenerate it

Step 3: User can delete individual history items
   └── Clicks X on card
   └── Removed from localStorage immediately

---

## 5. GENERATION STATES (what user sees during generation)

State 1: IDLE
- Empty canvas with placeholder text "Your animation will appear here"
- Generate button active and ready

State 2: GENERATING (steps shown one by one)
- "Reading your prompt..." (0.5s)
- "Understanding your brand..." (1s)  
- "Designing the motion..." (2-8s - AI call happening)
- "Building your animation..." (0.5s)
- "Rendering preview..." (0.5s)

State 3: PREVIEW READY
- Animation plays automatically on loop
- All controls appear
- Success state

State 4: ERROR
- Error message shown clearly
- "Try Again" button
- Suggestion of what might be wrong

State 5: EXPORTING
- Progress bar shown
- "Preparing your Lottie file..."
- File downloads when ready