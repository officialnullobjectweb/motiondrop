import type { AnimationConfig, KeyframeData, AspectRatio, ProviderName } from "./animation"

export interface HistoryItem {
  id: string
  timestamp: string
  prompt: string
  provider: ProviderName
  config: AnimationConfig
  keyframes: KeyframeData
  thumbnail: string
  canvasSize: AspectRatio
  duration: number
}

export interface Preferences {
  defaultSize: AspectRatio
  defaultProvider: ProviderName
  autoLoop: boolean
  showGrid: boolean
}

export interface SignalMap {
  brandName: string
  industry: string
  colors: string[]
  energy: number
  keywords: string[]
  hasFile: boolean
  fileType: string
}
