import { create } from "zustand"
import type { AnimationConfig, KeyframeData, AspectRatio, ProviderName } from "@/lib/types/animation"
import type { HistoryItem } from "@/lib/types/config"

interface AppState {
  selectedProvider: ProviderName
  apiKeys: Record<string, string>

  currentPrompt: string
  uploadedFile: File | null
  uploadedFileType: string
  selectedSize: AspectRatio

  isGenerating: boolean
  generationError: string | null
  generationStep: string

  currentConfig: AnimationConfig | null
  currentKeyframes: KeyframeData | null
  isPlaying: boolean
  isLooping: boolean
  playbackSpeed: number

  editorOpen: boolean

  isExporting: boolean
  exportFormat: string
  exportProgress: number

  history: HistoryItem[]
}

interface AppActions {
  setSelectedProvider: (provider: ProviderName) => void
  setApiKeys: (keys: Record<string, string>) => void

  setCurrentPrompt: (prompt: string) => void
  setUploadedFile: (file: File | null) => void
  setUploadedFileType: (type: string) => void
  setSelectedSize: (size: AspectRatio) => void

  setIsGenerating: (value: boolean) => void
  setGenerationError: (error: string | null) => void
  setGenerationStep: (step: string) => void

  setCurrentConfig: (config: AnimationConfig | null) => void
  setCurrentKeyframes: (keyframes: KeyframeData | null) => void
  setIsPlaying: (value: boolean) => void
  setIsLooping: (value: boolean) => void
  setPlaybackSpeed: (speed: number) => void

  setEditorOpen: (value: boolean) => void

  setIsExporting: (value: boolean) => void
  setExportFormat: (format: string) => void
  setExportProgress: (progress: number) => void

  setHistory: (history: HistoryItem[]) => void
  addToHistory: (item: HistoryItem) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void

  reset: () => void
}

const initialState = {
  selectedProvider: "gemini" as ProviderName,
  apiKeys: {} as Record<string, string>,

  currentPrompt: "",
  uploadedFile: null as File | null,
  uploadedFileType: "",
  selectedSize: "portrait" as AspectRatio,

  isGenerating: false,
  generationError: null as string | null,
  generationStep: "",

  currentConfig: null as AnimationConfig | null,
  currentKeyframes: null as KeyframeData | null,
  isPlaying: false,
  isLooping: true,
  playbackSpeed: 1,

  editorOpen: false,

  isExporting: false,
  exportFormat: "",
  exportProgress: 0,

  history: [] as HistoryItem[],
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  setApiKeys: (keys) => set({ apiKeys: keys }),

  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setUploadedFileType: (type) => set({ uploadedFileType: type }),
  setSelectedSize: (size) => set({ selectedSize: size }),

  setIsGenerating: (value) => set({ isGenerating: value }),
  setGenerationError: (error) => set({ generationError: error }),
  setGenerationStep: (step) => set({ generationStep: step }),

  setCurrentConfig: (config) => set({ currentConfig: config }),
  setCurrentKeyframes: (keyframes) => set({ currentKeyframes: keyframes }),
  setIsPlaying: (value) => set({ isPlaying: value }),
  setIsLooping: (value) => set({ isLooping: value }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  setEditorOpen: (value) => set({ editorOpen: value }),

  setIsExporting: (value) => set({ isExporting: value }),
  setExportFormat: (format) => set({ exportFormat: format }),
  setExportProgress: (progress) => set({ exportProgress: progress }),

  setHistory: (history) => set({ history }),
  addToHistory: (item) =>
    set((state) => {
      const next = [item, ...state.history]
      if (next.length > 5) next.pop()
      return { history: next }
    }),
  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    })),
  clearHistory: () => set({ history: [] }),

  reset: () => set(initialState),
}))
