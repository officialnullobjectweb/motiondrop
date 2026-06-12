import type { SignalMap } from "@/lib/types/config"
import { INDUSTRY_RULES } from "@/constants/industryRules"
import { COLOR_PSYCHOLOGY } from "@/constants/colorPsychology"

const COMMON_WORDS = new Set([
  "the", "a", "an", "is", "it", "this", "that", "and", "or", "for",
  "with", "app", "called", "name", "my", "i", "want", "make", "create",
  "need", "like", "looking", "build", "design", "show", "get", "set",
  "has", "have", "can", "will", "would", "should", "not", "but", "are",
  "was", "were", "been", "being", "some", "any", "all", "each", "every",
  "from", "about", "into", "over", "after", "also", "just", "very",
  "too", "more", "here", "there", "where", "which", "what", "how",
  "new", "one", "two", "use", "using", "used", "does", "done",
])

const INDUSTRY_SYNONYMS: Record<string, string[]> = {
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

const HIGH_ENERGY = new Set([
  "fast", "explosive", "intense", "energetic", "dynamic", "powerful",
  "bold", "extreme", "rapid", "wild", "crazy", "hype", "hype", "lit",
  "electric", "pump", "amped", "aggressive", "high", "speed",
])

const LOW_ENERGY = new Set([
  "calm", "gentle", "soft", "peaceful", "slow", "relaxed", "quiet",
  "subtle", "minimal", "smooth", "serene", "tranquil", "mellow",
  "easy", "light", "delicate", "soothe", "chill", "zen",
])

const MEDIUM_ENERGY = new Set([
  "professional", "clean", "modern", "balanced", "steady", "moderate",
  "neutral", "standard", "simple", "natural", "consistent",
])

function detectBrandName(words: string[]): string {
  for (const word of words) {
    const cleaned = word.replace(/[^a-zA-Z]/g, "")
    if (!cleaned) continue
    const first = cleaned[0]
    const rest = cleaned.slice(1)
    const isCapitalized = first === first.toUpperCase() && first !== first.toLowerCase()
    const hasLowercase = rest.length === 0 || rest !== rest.toUpperCase()
    if (isCapitalized && hasLowercase && !COMMON_WORDS.has(cleaned.toLowerCase())) {
      return cleaned
    }
  }
  return "unknown"
}

function detectIndustry(words: string[], lowerWords: string[]): string {
  for (const lw of lowerWords) {
    for (const [industry, synonyms] of Object.entries(INDUSTRY_SYNONYMS)) {
      if (synonyms.includes(lw)) return industry
    }
  }
  for (const lw of lowerWords) {
    if (lw in INDUSTRY_RULES) return lw
  }
  return "unknown"
}

function detectColors(words: string[]): string[] {
  const found: string[] = []
  for (const w of words) {
    const cleaned = w.replace(/[^a-zA-Z]/g, "").toLowerCase()
    if (cleaned in COLOR_PSYCHOLOGY) {
      found.push(cleaned)
    }
  }
  return found
}

function detectEnergy(words: string[]): number {
  const lowerWords = words.map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(Boolean)
  let highCount = 0
  let lowCount = 0
  let mediumCount = 0

  for (const w of lowerWords) {
    if (HIGH_ENERGY.has(w)) highCount++
    else if (LOW_ENERGY.has(w)) lowCount++
    else if (MEDIUM_ENERGY.has(w)) mediumCount++
  }

  if (highCount > lowCount && highCount > mediumCount) return 8
  if (lowCount > highCount && lowCount > mediumCount) return 2
  if (mediumCount > 0) return 5
  return 5
}

export function extractSignals(prompt: string): SignalMap {
  const words = prompt.split(/\s+/).filter(Boolean)
  const lowerWords = words.map((w) => w.replace(/[^a-zA-Z]/g, "").toLowerCase()).filter(Boolean)

  return {
    brandName: detectBrandName(words),
    industry: detectIndustry(words, lowerWords),
    colors: detectColors(words),
    energy: detectEnergy(words),
    keywords: words.filter((w) => w.length > 2).map((w) => w.toLowerCase()),
    hasFile: false,
    fileType: "",
  }
}
