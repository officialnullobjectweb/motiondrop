export interface ColorPsychology {
  mood: string
  industries: string[]
  bgSuggestion: string
}

export const COLOR_PSYCHOLOGY: Record<string, ColorPsychology> = {
  red: {
    mood: "energetic, passionate, urgent",
    industries: ["food/delivery", "fitness/health", "gaming"],
    bgSuggestion: "#0A0A0A",
  },
  orange: {
    mood: "friendly, confident, playful",
    industries: ["food/delivery", "social/lifestyle", "education"],
    bgSuggestion: "#0D0D0D",
  },
  blue: {
    mood: "trustworthy, calm, professional",
    industries: ["fintech/banking", "tech/saas", "healthcare"],
    bgSuggestion: "#0A0A12",
  },
  green: {
    mood: "natural, balanced, healthy",
    industries: ["meditation/wellness", "healthcare", "travel"],
    bgSuggestion: "#0A0F0A",
  },
  purple: {
    mood: "creative, luxurious, spiritual",
    industries: ["meditation/wellness", "luxury/fashion"],
    bgSuggestion: "#0F0A12",
  },
  black: {
    mood: "premium, elegant, powerful",
    industries: ["luxury/fashion", "tech/saas"],
    bgSuggestion: "#000000",
  },
  white: {
    mood: "clean, minimal, pure",
    industries: ["tech/saas", "meditation/wellness"],
    bgSuggestion: "#0A0A0A",
  },
  gold: {
    mood: "luxurious, successful, premium",
    industries: ["luxury/fashion", "fintech/banking"],
    bgSuggestion: "#0F0D08",
  },
  pink: {
    mood: "playful, warm, feminine",
    industries: ["social/lifestyle", "food/delivery"],
    bgSuggestion: "#0F0A0A",
  },
  yellow: {
    mood: "optimistic, cheerful, warm",
    industries: ["education", "social/lifestyle"],
    bgSuggestion: "#0F0F08",
  },
}
