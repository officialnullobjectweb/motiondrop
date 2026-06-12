# MotionDrop - Build Order & Vibe Coding Guide
Version: 1.0

THIS IS YOUR STEP-BY-STEP BUILD GUIDE.
Follow this exact order. Do not skip steps.
Each step is one vibe coding session.

---

## SETUP COMMANDS (Run these first, one time only)

npx create-next-app@latest motiondrop --typescript --tailwind --app
cd motiondrop
npm install zustand
npm install lottie-web
npm install gif.js
npm install @types/gif.js
npm install lucide-react
npx shadcn@latest init
npx shadcn@latest add button input textarea slider switch card dialog toast

---

## SESSION 1: PROJECT STRUCTURE
Prompt for vibe coder:
"Create this exact folder structure in the motiondrop project:
[paste the folder structure from TRD Document 2]
Create empty files in each location.
Add basic placeholder export in each .ts and .tsx file."

---

## SESSION 2: TYPES AND CONSTANTS
Prompt for vibe coder:
"Create the TypeScript types in lib/types/animation.ts
based on the AnimationConfig interface in the TRD document.
Also create lib/constants/industryRules.ts with the 
industry motion language map from the PRD.
Also create lib/constants/animationLibrary.ts with all 
the animation type string unions."

---

## SESSION 3: STORAGE LAYER
Prompt for vibe coder:
"Build lib/storage/apiKeys.ts and lib/storage/history.ts
following the localStorage schema in the Database document.
Build hooks/useAPIKey.ts and hooks/useHistory.ts.
Build store/useAppStore.ts with the Zustand store structure
from the Architecture document."

---

## SESSION 4: LANDING PAGE
Prompt for vibe coder:
"Build the landing page at app/page.tsx following the UI spec.
Build components/landing/Hero.tsx, HowItWorks.tsx.
Use the design system colors from the UI document.
Make it look premium and dark themed."

---

## SESSION 5: NAVBAR AND LAYOUT
Prompt for vibe coder:
"Build components/shared/Navbar.tsx following the UI spec.
Build app/layout.tsx with the Navbar included.
Add the Inter font from Google Fonts.
Build components/shared/Footer.tsx."

---

## SESSION 6: PROMPT BRAIN
Prompt for vibe coder:
"Build lib/prompt/extractor.ts that scans a string for
brand signals (name, industry, colors, energy, keywords).
Build lib/prompt/inferencer.ts that takes the signals
and fills in missing information using the industry rules.
Build lib/prompt/briefBuilder.ts that combines everything
into the brief template from the Prompt System document."

---

## SESSION 7: AI PROVIDERS
Prompt for vibe coder:
"Build lib/ai/providers/gemini.ts that sends a request
to the Gemini API using the user's API key.
Build lib/ai/providers/groq.ts for Groq API.
Build lib/ai/providers/openrouter.ts for OpenRouter.
Build lib/ai/providers/openai.ts for OpenAI.
Build lib/ai/providers/anthropic.ts for Anthropic.
Build lib/ai/systemPrompt.ts with the exact master prompt
from the Prompt System document.
Build lib/ai/validator.ts with all 8 validation rules."

---

## SESSION 8: KEYFRAME GENERATOR
Prompt for vibe coder:
"Build lib/animation/easing.ts with these functions:
smooth, bouncy, sharp, elastic - each takes a t value 
(0 to 1) and returns eased value (0 to 1).
Build lib/animation/keyframeGenerator.ts that takes
AnimationConfig and returns KeyframeData.
Generate keyframes for: background layer, particle layer,
logo layer, text primary layer, text secondary layer."

---

## SESSION 9: CANVAS RENDERER
Prompt for vibe coder:
"Build lib/animation/renderer.ts that takes KeyframeData
and an HTML Canvas element and renders the animation.
Use requestAnimationFrame for the loop.
Build lib/animation/effects/background.ts for all 6 
background effect types.
Build lib/animation/effects/particles.ts for all 
particle system types.
Build lib/animation/effects/logo.ts for logo rendering.
Build lib/animation/effects/text.ts for text animations.
Build hooks/useAnimationEngine.ts to manage this."

---

## SESSION 10: MAIN APP UI - LEFT COLUMN
Prompt for vibe coder:
"Build the left column of app/app/page.tsx:
- components/app/APIKeyInput.tsx (with modal)
- components/app/ProviderSelector.tsx  
- components/app/PromptInput.tsx
- components/app/FileUpload.tsx
- components/app/CanvasSizeSelector.tsx
- components/app/GenerateButton.tsx
Following the UI spec exactly for each component."

---

## SESSION 11: MAIN APP UI - RIGHT COLUMN (PREVIEW)
Prompt for vibe coder:
"Build the right column preview section:
- components/app/CanvasPreview.tsx with all 5 states
  (empty, generating, playing, paused)
- components/app/PlaybackControls.tsx with all elements
Connect the canvas to the animation engine hook."

---

## SESSION 12: EDITOR PANEL
Prompt for vibe coder:
"Build components/app/EditorPanel.tsx with all 5 controls:
SpeedSlider, EnergySlider, ColorEditor, TextEditor, 
ParticleToggle.
Each control must update the AnimationConfig in the store
and trigger re-render of the canvas without AI call.
Follow the UI spec for each control exactly."

---

## SESSION 13: EXPORT SYSTEM
Prompt for vibe coder:
"Build lib/export/toLottie.ts that converts KeyframeData
to valid Lottie JSON following the Lottie spec in the TRD.
Build lib/export/toGIF.ts using gif.js library.
Build lib/export/toMP4.ts using MediaRecorder API.
Build lib/export/toCSS.ts that outputs CSS keyframes.
Build hooks/useExport.ts to manage export state.
Build components/app/ExportPanel.tsx with 4 download 
buttons following the UI spec."

---

## SESSION 14: HISTORY FEATURE
Prompt for vibe coder:
"Build app/history/page.tsx.
Build components/history/HistoryGrid.tsx.
Build components/history/HistoryCard.tsx with all 
elements from the UI spec.
Connect to useHistory hook and localStorage."

---

## SESSION 15: DOCS PAGE
Prompt for vibe coder:
"Build app/docs/page.tsx with the 4 sections from the
UI spec. Make it clean and readable. Include code 
examples for using Lottie in React, iOS, Android, Web."

---

## SESSION 16: CONNECT EVERYTHING
Prompt for vibe coder:
"Connect the full generation flow in app/app/page.tsx:
1. User types prompt
2. Click generate
3. Prompt brain processes prompt
4. AI provider called with brief
5. Response validated
6. Keyframes generated
7. Canvas renders animation
8. Editor and export panels appear
9. History saved automatically
Make all generation states visible to user with 
progress messages."

---

## SESSION 17: TOAST NOTIFICATIONS
Prompt for vibe coder:
"Add toast notifications for:
- API key saved successfully
- Animation generated successfully
- Export complete (each format)
- Generation failed (with reason)
- Using fallback config (warning)
Use shadcn toast component following the spec."

---

## SESSION 18: FINAL POLISH
Prompt for vibe coder:
"Add keyboard shortcuts: Space for play/pause, 
R for restart, L for loop toggle.
Add loading states for all async operations.
Ensure all error states show user-friendly messages.
Test all 5 AI providers connect correctly.
Make sure Lottie export produces valid files."

---

## SESSION 19: DEPLOY
Commands:
git init
git add .
git commit -m "Initial MotionDrop release"
(create GitHub repo)
git remote add origin [your github url]
git push -u origin main
(go to vercel.com → import GitHub repo → deploy)

---

## IMPORTANT RULES FOR VIBE CODING

1. Complete each session fully before starting next
2. After each session: test what was built
3. If something breaks: fix it before moving on
4. Never skip the types and constants sessions
   (they are the foundation everything else uses)
5. Copy the system prompt EXACTLY as written
6. Copy the AnimationConfig type EXACTLY as written
7. The validation rules must all be implemented
8. Never hardcode colors or values - always use the config

---

## WHEN THINGS GO WRONG

AI generates wrong code:
→ Share the specific type definition with the vibe coder
→ Say "this must match the AnimationConfig type exactly"

Animation doesn't render:
→ Check KeyframeData is being generated correctly first
→ Log the keyframe object to console
→ Check canvas context is available

Lottie file doesn't work:
→ Paste the JSON into lottiefiles.com to validate
→ Check fps and time unit conversion

Export fails:
→ GIF: Check gif.js is imported correctly
→ MP4: Check MediaRecorder browser support
→ Test in Chrome first (best support)

API call fails:
→ Check API key is being sent correctly
→ Check CORS (some providers block browser calls)
→ OpenRouter and Gemini both work from browser directly