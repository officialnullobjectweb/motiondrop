# MotionDrop - System Architecture Document
Version: 1.0

---

## 1. HIGH LEVEL ARCHITECTURE

MotionDrop is a FRONTEND-ONLY application.
No backend server. No database. No auth server.

┌─────────────────────────────────────────────────────┐
│                    BROWSER                           │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           Next.js Application                │    │
│  │                                              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │  PROMPT  │  │   AI     │  │ANIMATION │  │    │
│  │  │  BRAIN   │→ │  LAYER   │→ │ ENGINE   │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  │    │
│  │                                      │       │    │
│  │                               ┌──────────┐  │    │
│  │                               │  EXPORT  │  │    │
│  │                               │  ENGINE  │  │    │
│  │                               └──────────┘  │    │
│  │                                             │    │
│  │  ┌──────────────────────────────────────┐  │    │
│  │  │         LOCAL STORAGE                 │  │    │
│  │  │  API Keys | History | Preferences     │  │    │
│  │  └──────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS API calls
        ┌──────────────┼──────────────────┐
        ↓              ↓                  ↓
   ┌─────────┐   ┌─────────┐      ┌─────────────┐
   │ Gemini  │   │  Groq   │      │ OpenRouter  │
   │   API   │   │   API   │      │     API     │
   └─────────┘   └─────────┘      └─────────────┘

---

## 2. PROMPT BRAIN ARCHITECTURE

Purpose: Turn any user input into a complete animation brief

┌─────────────────────────────────────────────────────┐
│                  PROMPT BRAIN                        │
│                                                      │
│  INPUT: raw user prompt string + optional file       │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  STAGE 1: SIGNAL EXTRACTOR                  │     │
│  │                                             │     │
│  │  Scans every word for:                      │     │
│  │  - Brand name (capitalized words)           │     │
│  │  - Industry keywords                        │     │
│  │  - Color words                              │     │
│  │  - Feeling words                            │     │
│  │  - Speed words                              │     │
│  │  - Style words                              │     │
│  │                                             │     │
│  │  OUTPUT: SignalMap object                   │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│  ┌────────────────────────────────────────────┐     │
│  │  STAGE 2: INFERENCER                        │     │
│  │                                             │     │
│  │  Takes SignalMap                            │     │
│  │  Applies industry rules from constants      │     │
│  │  Fills in ALL missing information           │     │
│  │                                             │     │
│  │  Rules example:                             │     │
│  │  food industry → warm colors if none given  │     │
│  │  energetic word → energy level 8+           │     │
│  │  luxury word → energy level 3 max           │     │
│  │                                             │     │
│  │  OUTPUT: CompleteContext object             │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│  ┌────────────────────────────────────────────┐     │
│  │  STAGE 3: BRIEF BUILDER                     │     │
│  │                                             │     │
│  │  Takes CompleteContext                      │     │
│  │  Structures it into AnimationBrief          │     │
│  │  Adds multiple-choice options for AI        │     │
│  │  Wraps in system prompt                     │     │
│  │                                             │     │
│  │  OUTPUT: Final prompt string for AI         │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│  OUTPUT: AI-ready brief (AI job made easy)           │
└─────────────────────────────────────────────────────┘

---

## 3. AI LAYER ARCHITECTURE

Purpose: Send brief to AI, get back AnimationConfig

┌─────────────────────────────────────────────────────┐
│                    AI LAYER                          │
│                                                      │
│  INPUT: AI-ready brief string                        │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  PROVIDER ROUTER                            │     │
│  │                                             │     │
│  │  Reads: which provider user selected        │     │
│  │  Loads: correct provider module             │     │
│  │  Formats: request for that provider's API   │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│                   API CALL                           │
│                        ↓                             │
│  ┌────────────────────────────────────────────┐     │
│  │  VALIDATOR                                  │     │
│  │                                             │     │
│  │  Parse JSON from response                   │     │
│  │  Check all required fields exist            │     │
│  │  Validate all values in allowed range       │     │
│  │  Check timing logic is correct              │     │
│  │  Auto-correct minor issues                  │     │
│  │                                             │     │
│  │  If invalid: retry once                     │     │
│  │  If still invalid: use fallback config      │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│  OUTPUT: Valid AnimationConfig object                │
└─────────────────────────────────────────────────────┘

---

## 4. ANIMATION ENGINE ARCHITECTURE

Purpose: Take AnimationConfig, produce visible animation

┌─────────────────────────────────────────────────────┐
│               ANIMATION ENGINE                       │
│                                                      │
│  INPUT: AnimationConfig                              │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  KEYFRAME GENERATOR                         │     │
│  │                                             │     │
│  │  For each layer:                            │     │
│  │  - Background: calculate color/opacity kfs  │     │
│  │  - Particles: calculate position paths      │     │
│  │  - Logo: calculate scale/opacity kfs        │     │
│  │  - Text Primary: calculate per-letter kfs   │     │
│  │  - Text Secondary: calculate kfs            │     │
│  │                                             │     │
│  │  Uses easing functions from config          │     │
│  │  All math done here, not in renderer        │     │
│  │                                             │     │
│  │  OUTPUT: KeyframeData object                │     │
│  └─────────────────────┬───────────────────────┘     │
│                        ↓                             │
│  ┌────────────────────────────────────────────┐     │
│  │  CANVAS RENDERER                            │     │
│  │                                             │     │
│  │  Uses requestAnimationFrame loop            │     │
│  │  Each frame:                                │     │
│  │  1. Clear canvas                            │     │
│  │  2. Draw background layer                   │     │
│  │  3. Draw particle layer                     │     │
│  │  4. Draw logo layer                         │     │
│  │  5. Draw text primary layer                 │     │
│  │  6. Draw text secondary layer               │     │
│  │                                             │     │
│  │  Reads current time → looks up keyframe     │     │
│  │  Interpolates between keyframes (lerp)      │     │
│  │  Draws result to canvas                     │     │
│  │                                             │     │
│  │  OUTPUT: Live animation on screen           │     │
│  └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘

---

## 5. EXPORT ENGINE ARCHITECTURE

┌─────────────────────────────────────────────────────┐
│                 EXPORT ENGINE                        │
│                                                      │
│  INPUT: KeyframeData + AnimationConfig               │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │  LOTTIE EXPORTER                         │        │
│  │  KeyframeData → Lottie JSON spec         │        │
│  │  Frame numbers converted to milliseconds │        │
│  │  Scale values multiplied by 100          │        │
│  │  Easing curves converted to Lottie format│        │
│  │  Output: valid .json file                │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │  GIF EXPORTER                            │        │
│  │  Replays animation on offscreen canvas   │        │
│  │  Captures frame every 1000/fps ms        │        │
│  │  gif.js encodes frames                   │        │
│  │  Output: .gif file                       │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │  MP4 EXPORTER                            │        │
│  │  MediaRecorder records canvas stream     │        │
│  │  Replays animation during recording      │        │
│  │  Output: .mp4 or .webm file              │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │  CSS EXPORTER                            │        │
│  │  KeyframeData → @keyframes CSS           │        │
│  │  Each layer becomes a CSS animation      │        │
│  │  Output: .css file with HTML example     │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘

---

## 6. STATE MANAGEMENT

Single Zustand store with these slices:

appStore = {
  // API Configuration
  selectedProvider: string
  apiKeys: Record<string, string>
  
  // Input State
  currentPrompt: string
  uploadedFile: File | null
  uploadedFileType: string
  selectedSize: "portrait" | "square" | "desktop"
  
  // Generation State
  isGenerating: boolean
  generationError: string | null
  generationStep: string (shows user what is happening)
  
  // Animation State
  currentConfig: AnimationConfig | null
  currentKeyframes: KeyframeData | null
  isPlaying: boolean
  isLooping: boolean
  playbackSpeed: number
  
  // Editor State
  editorOpen: boolean
  
  // Export State
  isExporting: boolean
  exportFormat: string
  exportProgress: number
  
  // History
  history: HistoryItem[]
}