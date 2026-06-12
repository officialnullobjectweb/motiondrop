import type { SignalMap } from "@/lib/types/config"
import { INDUSTRY_RULES } from "@/constants/industryRules"
import { COLOR_PSYCHOLOGY } from "@/constants/colorPsychology"
import { EASING_CURVES } from "@/constants/animationLibrary"

export interface CompleteContext {
  brandName: string
  industry: string
  energyLevel: number
  colorFamily: string
  suggestedColors: {
    primary: string
    secondary: string
    background: string
    accent: string
  }
  duration: number
  personality: string[]
  motionStyle: string
}

const FAMILY_COLORS: Record<string, { primary: string; secondary: string; background: string; accent: string }> = {
  cool: { primary: "#6366F1", secondary: "#8B5CF6", background: "#0A0A12", accent: "#A78BFA" },
  warm: { primary: "#F97316", secondary: "#FB923C", background: "#0A0A0A", accent: "#FDBA74" },
  vibrant: { primary: "#D946EF", secondary: "#F472B6", background: "#0A0A12", accent: "#F0ABFC" },
  neutral: { primary: "#A1A1AA", secondary: "#D4D4D8", background: "#0A0A0A", accent: "#F4F4F5" },
}

const INDUSTRY_FAMILIES: Record<string, string> = {}
for (const [ind, rule] of Object.entries(INDUSTRY_RULES)) {
  INDUSTRY_FAMILIES[ind] = rule.colorFamily
}

const INDUSTRY_PERSONALITIES: Record<string, string[]> = {
  "fintech/banking": ["trustworthy", "professional", "secure"],
  "food/delivery": ["playful", "energetic", "friendly"],
  "fitness/health": ["bold", "motivating", "energetic"],
  "meditation/wellness": ["calm", "peaceful", "serene"],
  gaming: ["exciting", "bold", "energetic"],
  "luxury/fashion": ["elegant", "sophisticated", "refined"],
  education: ["friendly", "clear", "approachable"],
  "social/lifestyle": ["playful", "trendy", "social"],
  healthcare: ["gentle", "caring", "trustworthy"],
  "tech/saas": ["modern", "clean", "precise"],
  "crypto/web3": ["innovative", "bold", "futuristic"],
  travel: ["free", "adventurous", "warm"],
}

function calcDuration(energy: number, prompt: string): number {
  const lower = prompt.toLowerCase()
  if (lower.includes("fast") || lower.includes("quick")) return 2.5
  if (lower.includes("slow") || lower.includes("calm")) return 7.0
  if (energy >= 1 && energy <= 3) return 5.0
  if (energy >= 4 && energy <= 6) return 4.0
  return 3.0
}

function deriveColors(
  signals: SignalMap,
  colorFamily: string,
  ruleColors: { primary: string; secondary: string; background: string; accent: string },
): { primary: string; secondary: string; background: string; accent: string } {
  if (signals.colors.length > 0) {
    const colorWord = signals.colors[0]
    const psych = COLOR_PSYCHOLOGY[colorWord]
    const base = ruleColors

    const knownHexes: Record<string, string> = {
      red: "#EF4444",
      orange: "#F97316",
      blue: "#3B82F6",
      green: "#22C55E",
      purple: "#A855F7",
      black: "#0A0A0A",
      white: "#FFFFFF",
      gold: "#F59E0B",
      pink: "#EC4899",
      yellow: "#EAB308",
    }

    const primary = knownHexes[colorWord] || base.primary
    return {
      background: psych?.bgSuggestion ?? base.background,
      primary,
      secondary: blendHex(primary, "#ffffff", 0.3),
      accent: blendHex(primary, "#000000", 0.2),
    }
  }
  return ruleColors
}

function blendHex(hex: string, mixWith: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const mr = parseInt(mixWith.slice(1, 3), 16)
  const mg = parseInt(mixWith.slice(3, 5), 16)
  const mb = parseInt(mixWith.slice(5, 7), 16)
  const nr = Math.round(r + (mr - r) * amount)
  const ng = Math.round(g + (mg - g) * amount)
  const nb = Math.round(b + (mb - b) * amount)
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`
}

function derivePersonality(signals: SignalMap, industry: string, motionStyle: string): string[] {
  if (industry !== "unknown" && INDUSTRY_PERSONALITIES[industry]) {
    return INDUSTRY_PERSONALITIES[industry]
  }
  const fromKeywords = signals.keywords.filter((k) => k.length > 3 && !Object.keys(INDUSTRY_SYNONYM_LOOKUP).includes(k)).slice(0, 3)
  if (fromKeywords.length >= 2) return fromKeywords.slice(0, 3)
  return [motionStyle, "modern", "clean"]
}

const INDUSTRY_SYNONYM_LOOKUP: Record<string, string> = {
  fintech: "fintech/banking",
  bank: "fintech/banking",
  food: "food/delivery",
  fitness: "fitness/health",
  gym: "fitness/health",
  meditation: "meditation/wellness",
  wellness: "meditation/wellness",
  game: "gaming",
  luxury: "luxury/fashion",
  fashion: "luxury/fashion",
  education: "education",
  social: "social/lifestyle",
  healthcare: "healthcare",
  tech: "tech/saas",
  crypto: "crypto/web3",
  travel: "travel",
}

export function inferContext(signals: SignalMap): CompleteContext {
  const industry = signals.industry !== "unknown" ? signals.industry : "tech/saas"
  const rule = INDUSTRY_RULES[industry]
  const [energyMin, energyMax] = rule.energyRange

  let rawEnergy = signals.energy
  const clampedEnergy = Math.max(energyMin, Math.min(energyMax, rawEnergy))
  const finalEnergy = signals.industry !== "unknown" ? clampedEnergy : rawEnergy

  const colorFamily = rule.colorFamily
  const familyColors = FAMILY_COLORS[colorFamily] ?? FAMILY_COLORS.cool
  const suggestedColors = deriveColors(signals, colorFamily, familyColors)
  const motionStyle = rule.motionStyle
  const duration = calcDuration(finalEnergy, "")
  const personality = derivePersonality(signals, industry, motionStyle)

  return {
    brandName: signals.brandName !== "unknown" ? signals.brandName : "Brand",
    industry,
    energyLevel: finalEnergy,
    colorFamily,
    suggestedColors,
    duration,
    personality,
    motionStyle,
  }
}
