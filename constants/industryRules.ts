export interface IndustryRule {
  energyRange: [number, number]
  easing: string
  colorFamily: string
  motionStyle: string
}

export const INDUSTRY_RULES: Record<string, IndustryRule> = {
  "fintech/banking": {
    energyRange: [2, 4],
    easing: "smooth",
    colorFamily: "cool",
    motionStyle: "professional",
  },
  "food/delivery": {
    energyRange: [6, 8],
    easing: "bouncy",
    colorFamily: "warm",
    motionStyle: "playful",
  },
  "fitness/health": {
    energyRange: [7, 9],
    easing: "bouncy",
    colorFamily: "warm",
    motionStyle: "bold",
  },
  "meditation/wellness": {
    energyRange: [1, 3],
    easing: "smooth",
    colorFamily: "cool",
    motionStyle: "calm",
  },
  gaming: {
    energyRange: [8, 10],
    easing: "elastic",
    colorFamily: "vibrant",
    motionStyle: "explosive",
  },
  "luxury/fashion": {
    energyRange: [1, 3],
    easing: "sharp",
    colorFamily: "neutral",
    motionStyle: "minimal",
  },
  education: {
    energyRange: [4, 6],
    easing: "smooth",
    colorFamily: "cool",
    motionStyle: "friendly",
  },
  "social/lifestyle": {
    energyRange: [5, 7],
    easing: "bouncy",
    colorFamily: "warm",
    motionStyle: "playful",
  },
  healthcare: {
    energyRange: [2, 4],
    easing: "smooth",
    colorFamily: "cool",
    motionStyle: "gentle",
  },
  "tech/saas": {
    energyRange: [4, 6],
    easing: "sharp",
    colorFamily: "cool",
    motionStyle: "precise",
  },
  "crypto/web3": {
    energyRange: [6, 8],
    easing: "sharp",
    colorFamily: "vibrant",
    motionStyle: "electric",
  },
  travel: {
    energyRange: [4, 6],
    easing: "smooth",
    colorFamily: "warm",
    motionStyle: "flowing",
  },
}
