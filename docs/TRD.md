# MotionDrop - Technical Requirements Document
Version: 1.0

---

## 1. TECHNOLOGY STACK

### Frontend Framework
Next.js 14 (App Router)
- Why: Vercel deployment is instant, React ecosystem, 
       API routes for any future backend needs

### Language
TypeScript
- Why: Catches errors before runtime, better for vibe coding
       because AI assistants write better TypeScript

### Styling
Tailwind CSS
- Why: Fast to build, no separate CSS files, 
       works perfectly with vibe coding

### UI Components
shadcn/ui
- Why: Free, beautiful, copy-paste components, 
       built on Tailwind, no extra complexity

### Animation Rendering
HTML Canvas API (native browser, no library)
- Why: Full control, no dependencies, 
       can capture frames for GIF/MP4 export

### Lottie Preview (for imported Lottie files)
lottie-web (npm package)
- Why: Official Lottie renderer, free, well maintained

### GIF Export
gif.js (npm package)
- Why: Client-side GIF generation, no server needed,
       captures canvas frames directly

### MP4 Export
MediaRecorder API (native browser)
- Why: Built into browser, no library needed,
       records canvas as video

### State Management
Zustand
- Why: Simple, small, no boilerplate,
       perfect for this tool's complexity level

### Local Storage Management
Custom hook using localStorage
- Why: No library needed, simple key-value storage

---

## 2. PROJECT STRUCTURE

motiondrop/
├── app/
│   ├── page.tsx                 (Landing page)
│   ├── app/
│   │   └── page.tsx             (Main tool page)
│   ├── history/
│   │   └── page.tsx             (History page)
│   ├── docs/
│   │   └── page.tsx             (Documentation page)
│   └── layout.tsx               (Root layout)
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx             (Main hero section)
│   │   ├── HowItWorks.tsx       (3 step explanation)
│   │   └── ExampleAnimations.tsx(Show example outputs)
│   │
│   ├── app/
│   │   ├── APIKeyInput.tsx      (API key management)
│   │   ├── ProviderSelector.tsx (Choose AI provider)
│   │   ├── PromptInput.tsx      (Main prompt textbox)
│   │   ├── FileUpload.tsx       (Drag and drop upload)
│   │   ├── CanvasPreview.tsx    (Animation preview)
│   │   ├── PlaybackControls.tsx (Play/Pause/Loop)
│   │   ├── CanvasSizeSelector.tsx(Size picker)
│   │   ├── EditorPanel.tsx      (Smart editor)
│   │   │   ├── SpeedSlider.tsx
│   │   │   ├── ColorEditor.tsx
│   │   │   ├── TextEditor.tsx
│   │   │   ├── EnergySlider.tsx
│   │   │   └── ParticleToggle.tsx
│   │   ├── ExportPanel.tsx      (Download options)
│   │   └── GenerateButton.tsx   (Main action button)
│   │
│   ├── history/
│   │   ├── HistoryGrid.tsx      (Grid of past animations)
│   │   └── HistoryCard.tsx      (Single history item)
│   │
│   └── shared/
│       ├── Navbar.tsx           (Top navigation)
│       ├── Footer.tsx           (Bottom footer)
│       └── LoadingSpinner.tsx   (Loading state)
│
├── lib/
│   ├── prompt/
│   │   ├── extractor.ts         (Extract signals from prompt)
│   │   ├── inferencer.ts        (Infer missing context)
│   │   ├── briefBuilder.ts      (Build AI brief)
│   │   └── industryRules.ts     (All industry motion rules)
│   │
│   ├── ai/
│   │   ├── providers/
│   │   │   ├── gemini.ts        (Gemini API connector)
│   │   │   ├── openrouter.ts    (OpenRouter connector)
│   │   │   ├── groq.ts          (Groq connector)
│   │   │   ├── openai.ts        (OpenAI connector)
│   │   │   └── anthropic.ts     (Anthropic connector)
│   │   ├── systemPrompt.ts      (Master system prompt)
│   │   └── validator.ts         (Validate AI response)
│   │
│   ├── animation/
│   │   ├── keyframeGenerator.ts (Generate keyframes from config)
│   │   ├── renderer.ts          (Canvas renderer)
│   │   ├── effects/
│   │   │   ├── background.ts    (Background effects)
│   │   │   ├── particles.ts     (Particle systems)
│   │   │   ├── logo.ts          (Logo animations)
│   │   │   └── text.ts          (Text animations)
│   │   └── easing.ts            (Easing functions)
│   │
│   ├── export/
│   │   ├── toLottie.ts          (Convert to Lottie JSON)
│   │   ├── toGIF.ts             (Convert to GIF)
│   │   ├── toMP4.ts             (Convert to MP4)
│   │   └── toCSS.ts             (Convert to CSS animation)
│   │
│   ├── storage/
│   │   ├── history.ts           (Save/load history)
│   │   └── apiKeys.ts           (Save/load API keys)
│   │
│   └── types/
│       ├── animation.ts         (All TypeScript types)
│       ├── config.ts            (Config types)
│       └── export.ts            (Export types)
│
├── hooks/
│   ├── useAnimationEngine.ts    (Main animation hook)
│   ├── useExport.ts             (Export functionality)
│   ├── useHistory.ts            (History management)
│   └── useAPIKey.ts             (API key management)
│
├── store/
│   └── useAppStore.ts           (Zustand global store)
│
├── constants/
│   ├── industryRules.ts         (Industry → motion rules)
│   ├── colorPsychology.ts       (Color → personality rules)
│   ├── animationLibrary.ts      (All available effects)
│   └── easingCurves.ts          (All easing functions)
│
└── public/
    └── examples/                (Example Lottie files)

---

## 3. DATA FLOW (TECHNICAL)

Step 1: User Input
─────────────────
User types prompt + optional file upload
→ Stored in Zustand store as: { prompt: string, file: File | null }

Step 2: Prompt Processing
──────────────────────────
extractor.ts reads prompt
→ Returns: { brandName, industry, colors, energy, keywords }

inferencer.ts takes extraction
→ Returns: { 
    inferredIndustry, 
    inferredColors, 
    inferredEnergy,
    inferredDuration,
    inferredEffects 
  }

briefBuilder.ts combines both
→ Returns: complete AnimationBrief object

Step 3: AI Call
───────────────
systemPrompt.ts wraps the brief
→ Returns: final prompt string to send to AI

Selected provider (gemini.ts etc) sends request
→ Returns: raw AI response string

validator.ts parses and validates
→ Returns: AnimationConfig object (or throws error → retry)

Step 4: Animation Generation
──────────────────────────────
keyframeGenerator.ts takes AnimationConfig
→ Returns: KeyframeData object with all layers

renderer.ts takes KeyframeData
→ Draws on HTML Canvas
→ Returns: running animation

Step 5: User Edits (Optional)
───────────────────────────────
Editor changes → update AnimationConfig → 
→ keyframeGenerator regenerates → renderer updates
→ No AI call needed for edits

Step 6: Export
──────────────
User clicks download format
→ Relevant exporter takes KeyframeData
→ Returns: downloadable file

---

## 4. ANIMATION CONFIG TYPE (THE CORE DATA STRUCTURE)

interface AnimationConfig {
  brand: {
    name: string
    tagline: string
    industry: string
    personality: string[]
  }
  colors: {
    background: string   // hex
    primary: string      // hex
    secondary: string    // hex
    accent: string       // hex
    glow: string         // rgba
    textPrimary: string  // hex
    textSecondary: string // hex
  }
  timing: {
    totalDuration: number    // seconds
    introEnd: number         // seconds
    holdStart: number        // seconds
    holdEnd: number          // seconds
    outroStart: number       // seconds
    energyLevel: number      // 1-10
    fps: number              // always 60
  }
  easing: {
    primary: string          // cubic-bezier string
    secondary: string        // cubic-bezier string
    character: string        // "bouncy" | "smooth" | "sharp" | "elastic"
  }
  background: {
    type: BackgroundEffectType
    intensity: number        // 0-1
    speed: number            // 0.5-2
  }
  particles: {
    enabled: boolean
    type: ParticleType
    count: number
    color: string
    sizeRange: [number, number]
    speed: number
    opacity: number
  }
  logo: {
    provided: boolean
    imageData: string | null  // base64 if user uploaded
    entranceAnimation: LogoEntranceType
    entranceStart: number
    entranceDuration: number
    idleAnimation: IdleAnimationType
    idleIntensity: number
    scale: number
  }
  text: {
    primaryText: string
    primaryAnimation: TextAnimationType
    primaryStart: number
    primaryDuration: number
    secondaryText: string
    secondaryAnimation: TextAnimationType
    secondaryStart: number
    secondaryDuration: number
    fontWeight: string
    letterSpacing: string
  }
  canvas: {
    width: number
    height: number
    aspectRatio: string
  }
  sequence: SequenceEvent[]
}

---

## 5. KEYFRAME DATA TYPE

interface KeyframeData {
  fps: number
  totalFrames: number
  layers: {
    background: BackgroundLayer
    particles: ParticleLayer
    logo: LogoLayer
    textPrimary: TextLayer
    textSecondary: TextLayer
  }
}

interface Keyframe {
  frame: number
  value: number | number[]
  easing: string
}

interface BackgroundLayer {
  type: string
  keyframes: {
    opacity: Keyframe[]
    colorShift: Keyframe[]
    scale: Keyframe[]
  }
}

---

## 6. LOTTIE CONVERSION SPECIFICATION

Our keyframes → Lottie JSON mapping:

Our frame number × (1000 / fps) = Lottie time (milliseconds)

Our scale [0 to 1] → Lottie scale [0 to 100]

Our opacity [0 to 1] → Lottie opacity [0 to 100]

Our easing cubic-bezier(a,b,c,d) → 
  Lottie: { "i": {"x": a, "y": b}, "o": {"x": c, "y": d} }

Lottie JSON structure we output:
{
  "v": "5.9.0",
  "fr": 60,
  "ip": 0,
  "op": totalFrames,
  "w": canvasWidth,
  "h": canvasHeight,
  "nm": brandName,
  "ddd": 0,
  "assets": [imageAsset if logo provided],
  "layers": [
    backgroundLayer,
    particleLayer,
    logoLayer,
    textPrimaryLayer,
    textSecondaryLayer
  ]
}

---

## 7. API PROVIDERS INTEGRATION

### Gemini (Primary Recommended)
endpoint: https://generativelanguage.googleapis.com/v1beta/models/
model: gemini-2.0-flash-exp (free)
auth: API key in request URL

### OpenRouter
endpoint: https://openrouter.ai/api/v1/chat/completions
model: user selects from free models list
auth: Bearer token in header

### Groq
endpoint: https://api.groq.com/openai/v1/chat/completions
model: llama-3.1-70b-versatile (free)
auth: Bearer token in header

### OpenAI
endpoint: https://api.openai.com/v1/chat/completions
model: gpt-4o-mini (cheapest)
auth: Bearer token in header

### Anthropic
endpoint: https://api.anthropic.com/v1/messages
model: claude-3-haiku (cheapest)
auth: x-api-key in header

All calls made FROM BROWSER directly to AI provider
No proxy server needed for V1

---

## 8. LOCAL STORAGE SCHEMA

Key: "motiondrop_apikeys"
Value: {
  "gemini": "AIza...",
  "openrouter": "sk-or-...",
  "groq": "gsk_...",
  "openai": "sk-...",
  "anthropic": "sk-ant-..."
}

Key: "motiondrop_provider"
Value: "gemini"

Key: "motiondrop_history"
Value: [
  {
    "id": "uuid",
    "timestamp": "ISO date string",
    "prompt": "original user prompt",
    "config": AnimationConfig,
    "keyframeData": KeyframeData,
    "thumbnail": "base64 PNG of first frame"
  }
]
(Maximum 5 items, oldest removed when 6th added)

Key: "motiondrop_preferences"
Value: {
  "defaultSize": "portrait",
  "defaultProvider": "gemini"
}

---

## 9. ERROR HANDLING

AI Response Errors:
→ Invalid JSON: retry once with stricter prompt
→ Missing fields: auto-fill with safe defaults
→ Invalid values: clamp to valid range
→ Second failure: use safe fallback config

Network Errors:
→ Show user-friendly message
→ "Check your API key and internet connection"
→ Retry button shown

Export Errors:
→ GIF/MP4: show progress, handle memory limits
→ Lottie: validate before download, never send broken file
→ CSS: always works (pure text output)

Canvas Errors:
→ WebGL not available: fallback to 2D context
→ Memory exceeded: reduce particle count automatically

---

## 10. PERFORMANCE REQUIREMENTS

Canvas rendering: 60fps on modern devices
AI response time: Under 10 seconds (depends on provider)
Keyframe generation: Under 500ms
GIF export: Under 30 seconds for 3s animation
MP4 export: Under 15 seconds for 3s animation
Lottie export: Under 1 second (just JSON conversion)
CSS export: Instant

Bundle size targets:
- Initial JS: Under 200KB gzipped
- With all libraries: Under 500KB gzipped