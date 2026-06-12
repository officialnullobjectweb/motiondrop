# MotionDrop - Product Requirements Document
Version: 1.0
Status: Final
Last Updated: 2025

---

## 1. PRODUCT OVERVIEW

### What is MotionDrop?
MotionDrop is a free, open-source, browser-based tool that uses AI 
to generate premium splash screen animations. Users provide their 
API key, describe what they want, and get a production-ready 
animation they can download instantly.

### One Line Description
"Type a prompt. Get a premium animation. Download and use anywhere."

### Core Philosophy
- Zero complexity for the user
- Zero cost to use (user brings their own API key)
- Zero compromise on animation quality
- Zero server costs (everything runs in browser)

---

## 2. TARGET USERS

### Primary User
- Mobile app developers who need splash screens
- Web developers who need loading animations
- Startup founders who need brand animations
- Designers who want quick animation prototypes

### User Technical Level
- Beginner to intermediate
- Knows what Lottie is OR will learn quickly
- Has or can get a free API key from Gemini/Groq/OpenRouter

### User Goal
Come in → Get animation → Use it in their project
Total time target: Under 3 minutes

---

## 3. CORE FEATURES (V1)

### Feature 1: Smart Prompt Understanding
- User types anything (even a single word)
- System extracts every signal from their words
- Infers missing information using industry rules
- Builds complete motion design brief
- Works even with weak/free AI models

### Feature 2: AI-Powered Animation Generation
- Supports: Gemini, OpenRouter, Groq, OpenAI, Anthropic
- User pastes their own API key (stored in localStorage only)
- AI receives pre-analyzed brief (not raw prompt)
- AI returns config JSON (not animation code)
- Our engine builds animation from config

### Feature 3: Live Canvas Preview
- Animation plays in browser immediately after generation
- Play / Pause / Loop controls
- Animation visible on screen before download
- User can watch it loop and decide

### Feature 4: Smart Editor (20% features, 80% value)
ONLY these editing controls after generation:
- Speed control (slider: 0.5x to 2x)
- Color palette (change primary, secondary, background)
- Text editor (change brand name and tagline text)
- Energy level (slider: calm to explosive)
- Particle toggle (on/off)
These 5 controls cover 80% of what users want to change.

### Feature 5: File Upload Support
- PNG: placed as central logo element
- SVG: placed as central logo element (vector preserved)
- JPG: placed as central logo element
- JSON/Lottie: imported as base, AI enhances it

### Feature 6: Export in 4 Formats
- Lottie JSON (.json) - lightweight, scalable, use in apps
- GIF (.gif) - use anywhere, share easily
- MP4 (.mp4) - video format, social media ready
- CSS Animation (.css) - use in web projects

### Feature 7: History (Last 5 in Browser)
- Last 5 generated animations saved in localStorage
- Click to reload any previous animation
- No server, no account needed
- Clears when localStorage is cleared

### Feature 8: Canvas Size Selector
- Mobile Portrait: 1080 x 1920
- Mobile Square: 1080 x 1080
- Desktop: 1920 x 1080
- User selects before or after generation

---

## 4. WHAT WE ARE NOT BUILDING IN V1

- No user accounts
- No cloud storage
- No collaboration features
- No animation marketplace
- No timeline scrubbing editor
- No frame-by-frame editing
- No team features
- No billing system
- No mobile app

---

## 5. SUCCESS METRICS

- Animation generates successfully: 95%+ of the time
- Lottie file opens without error: 99%+ of the time
- Time from prompt to preview: Under 15 seconds
- User downloads after seeing preview: Target 60%+
- Works with free AI models: Yes, always

---

## 6. PAGES IN THE APP

1. Landing Page (/) 
   - What it is, how it works, get started button

2. App Page (/app)
   - Main tool: input + preview + editor + download

3. History Page (/history)
   - Last 5 generated animations

4. Docs Page (/docs)
   - How to use API keys, how to use Lottie files

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- Load time: Under 3 seconds on average connection
- Works on: Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browser: View only (generation on desktop recommended)
- No backend server required
- Deployable on Vercel free tier
- Open source: MIT License
- Repository: GitHub public

---

## 8. OPEN SOURCE STRATEGY

- Full code on GitHub
- MIT License (anyone can use, modify, distribute)
- Community can add:
  - New animation effects
  - New industry rules
  - Better system prompts
  - New export formats
- This is the auto-improvement system for V1