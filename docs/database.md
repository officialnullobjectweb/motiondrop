# MotionDrop - Storage Document
Version: 1.0

Note: MotionDrop has NO database.
Everything is stored in browser localStorage.

---

## 1. STORAGE KEYS

### Key 1: motiondrop_apikeys
Purpose: Store user's API keys for each provider
When saved: When user types and saves API key
When read: On every app load
When cleared: When user clicks "Clear API Keys"

Structure:
{
  "gemini": "AIzaSy...",
  "openrouter": "sk-or-v1-...",
  "groq": "gsk_...",
  "openai": "sk-proj-...",
  "anthropic": "sk-ant-..."
}

Security note: 
Stored in plain text in localStorage.
We show user a warning about this.
Never sent anywhere except directly to AI provider.

---

### Key 2: motiondrop_provider
Purpose: Remember which provider user last used
When saved: When user changes provider selection
When read: On app load to pre-select provider

Structure:
"gemini"

---

### Key 3: motiondrop_history
Purpose: Last 5 generated animations
When saved: After each successful generation
When read: On history page load
When cleared: User clicks "Clear History"
Max items: 5 (remove oldest when adding 6th)

Structure:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "prompt": "fitness app called FitPro, blue, energetic",
    "provider": "gemini",
    "config": { ...full AnimationConfig object... },
    "keyframes": { ...full KeyframeData object... },
    "thumbnail": "data:image/png;base64,...",
    "canvasSize": "portrait",
    "duration": 3.2
  }
]

Thumbnail: First frame of animation captured as 
           300x168 PNG (small for storage)

Storage size estimate per item:
- Config: ~2KB
- Keyframes: ~15KB
- Thumbnail: ~20KB
- Total per item: ~37KB
- 5 items max: ~185KB total
Well within localStorage 5MB limit.

---

### Key 4: motiondrop_preferences
Purpose: User preferences
When saved: When user changes any preference
When read: On app load

Structure:
{
  "defaultSize": "portrait",
  "defaultProvider": "gemini",
  "autoLoop": true,
  "showGrid": false
}

---

## 2. STORAGE HELPER FUNCTIONS

All in: lib/storage/

getAPIKey(provider: string): string | null
setAPIKey(provider: string, key: string): void
clearAPIKey(provider: string): void
clearAllAPIKeys(): void

getHistory(): HistoryItem[]
addToHistory(item: HistoryItem): void
removeFromHistory(id: string): void
clearHistory(): void

getPreferences(): Preferences
setPreference(key: string, value: any): void

---

## 3. DATA NEVER STORED

We never store:
- Animation renders (too large)
- User's original uploaded files (too large)
- Usage analytics (privacy first)
- Error logs
- Any personal information