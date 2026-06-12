import type { SignalMap } from "@/lib/types/config"

/**
 * Industry synonyms mapped to canonical industry keys.
 * Used by the prompt extractor to detect industry from user input.
 */
export const INDUSTRY_SYNONYMS: Record<string, string[]> = {
  "fintech/banking": ["finance", "financial", "bank", "banking", "money", "pay", "payment", "invest", "wallet", "crypto"],
  "food/delivery": ["food", "delivery", "restaurant", "cafe", "coffee", "meal", "kitchen", "cooking", "drink", "snack", "eat"],
  "fitness/health": ["fitness", "gym", "workout", "exercise", "train", "running", "yoga", "sport", "athlete", "muscle", "run"],
  "meditation/wellness": ["meditation", "wellness", "mindful", "calm", "relax", "breathe", "sleep", "zen", "spiritual", "peace"],
  gaming: ["game", "gaming", "play", "gamer", "esports", "rpg", "fps", "console", "arcade"],
  "luxury/fashion": ["luxury", "fashion", "premium", "elegant", "style", "designer", "beauty", "cosmetic", "jewelry", "watch"],
  education: ["education", "learn", "study", "school", "course", "class", "tutor", "teach", "student", "knowledge", "train"],
  "social/lifestyle": ["social", "lifestyle", "community", "connect", "chat", "share", "friend", "network", "media", "trend"],
  healthcare: ["health", "healthcare", "medical", "doctor", "hospital", "clinic", "care", "patient", "therapy", "wellness"],
  "tech/saas": ["tech", "saas", "software", "app", "platform", "cloud", "digital", "startup", "ai", "data", "code", "dev"],
  "crypto/web3": ["crypto", "web3", "blockchain", "nft", "token", "defi", "bitcoin", "ethereum", "wallet", "dao", "metaverse"],
  travel: ["travel", "trip", "journey", "vacation", "holiday", "tour", "explore", "adventure", "flight", "hotel", "destination"],
}

/**
 * Energy keywords grouped by intensity level.
 */
export const ENERGY_KEYWORDS = {
  high: new Set([
    "fast", "explosive", "intense", "energetic", "dynamic", "powerful",
    "bold", "extreme", "rapid", "wild", "crazy", "hype", "lit",
    "electric", "pump", "amped", "aggressive", "high", "speed",
  ]),
  medium: new Set([
    "professional", "clean", "modern", "balanced", "steady", "moderate",
    "neutral", "standard", "simple", "natural", "consistent",
  ]),
  low: new Set([
    "calm", "gentle", "soft", "peaceful", "slow", "relaxed", "quiet",
    "subtle", "minimal", "smooth", "serene", "tranquil", "mellow",
    "easy", "light", "delicate", "soothe", "chill", "zen",
  ]),
} as const

/**
 * Determine energy level from extracted signals.
 * Returns a value between 1 and 10.
 */
export function detectEnergyFromSignals(signals: SignalMap): number {
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0

  for (const word of signals.keywords) {
    if (ENERGY_KEYWORDS.high.has(word)) highCount++
    else if (ENERGY_KEYWORDS.medium.has(word)) mediumCount++
    else if (ENERGY_KEYWORDS.low.has(word)) lowCount++
  }

  if (highCount > lowCount && highCount > mediumCount) return 8
  if (lowCount > highCount && lowCount > mediumCount) return 2
  if (mediumCount > 0) return 5
  return 5
}
