"use client"

import { useCallback, useEffect, useRef } from "react"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import APIKeyInput from "@/components/app/APIKeyInput"
import ProviderSelector from "@/components/app/ProviderSelector"
import PromptInput from "@/components/app/PromptInput"
import FileUpload from "@/components/app/FileUpload"
import CanvasSizeSelector from "@/components/app/CanvasSizeSelector"
import GenerateButton from "@/components/app/GenerateButton"
import CanvasPreview from "@/components/app/CanvasPreview"
import PlaybackControls from "@/components/app/PlaybackControls"
import EditorPanel from "@/components/app/EditorPanel"
import ExportPanel from "@/components/app/ExportPanel"
import { useAppStore } from "@/store/useAppStore"
import { useAnimationEngine } from "@/hooks/useAnimationEngine"
import { useExport } from "@/hooks/useExport"
import { extractSignals } from "@/lib/prompt/extractor"
import { inferContext } from "@/lib/prompt/inferencer"
import { buildBrief } from "@/lib/prompt/briefBuilder"
import { generateAnimationConfig } from "@/lib/ai"
import { generateKeyframes } from "@/lib/animation/keyframeGenerator"
import { AnimationRenderer } from "@/lib/animation/renderer"
import { addToHistory } from "@/lib/storage/history"
import { toastError, toastSuccess, toastWarning } from "@/lib/toast"
import type { AnimationConfig } from "@/lib/types/animation"

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function captureThumbnail(config: AnimationConfig, keyframes: import("@/lib/types/animation").KeyframeData): string {
  const thumbW = 300
  const thumbH = Math.round(300 / (config.canvas.width / config.canvas.height))
  const canvas = document.createElement("canvas")
  canvas.width = thumbW
  canvas.height = thumbH
  const renderer = new AnimationRenderer()
  renderer.init(canvas)
  renderer.load(config, keyframes)
  const captureTime = config.timing.holdStart || config.timing.totalDuration * 0.4
  renderer.seekTo(captureTime)
  renderer.pause()
  return canvas.toDataURL("image/png", 0.7)
}

export default function AppContent() {
  const { canvasRef, controls, loadAnimation } = useAnimationEngine()
  const exportApi = useExport(canvasRef)
  const hasLoadedFromHistory = useRef(false)

  const prompt = useAppStore((s) => s.currentPrompt)
  const selectedSize = useAppStore((s) => s.selectedSize)
  const selectedProvider = useAppStore((s) => s.selectedProvider)
  const apiKeys = useAppStore((s) => s.apiKeys)
  const isGenerating = useAppStore((s) => s.isGenerating)
  const generationError = useAppStore((s) => s.generationError)
  const currentConfig = useAppStore((s) => s.currentConfig)
  const currentKeyframes = useAppStore((s) => s.currentKeyframes)

  const setIsGenerating = useAppStore((s) => s.setIsGenerating)
  const setGenerationError = useAppStore((s) => s.setGenerationError)
  const setCurrentConfig = useAppStore((s) => s.setCurrentConfig)
  const setCurrentKeyframes = useAppStore((s) => s.setCurrentKeyframes)
  const setIsLooping = useAppStore((s) => s.setIsLooping)
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed)
  const isLooping = useAppStore((s) => s.isLooping)
  const playbackSpeed = useAppStore((s) => s.playbackSpeed)

  const hasConfig = currentConfig !== null

  useEffect(() => {
    if (hasLoadedFromHistory.current) return
    const state = useAppStore.getState()
    if (state.currentConfig && state.currentKeyframes) {
      loadAnimation(state.currentConfig, state.currentKeyframes)
      hasLoadedFromHistory.current = true
    }
  }, [loadAnimation])

  const runGeneration = useCallback(async (p: string, size: string, provider: string, keys: Record<string, string>) => {
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const apiKey = keys[provider]
      if (!apiKey) {
        throw new Error(`No API key found for ${provider}. Add one in the API Key section.`)
      }

      const signals = extractSignals(p)
      const context = inferContext(signals)
      const brief = buildBrief(context, p, false, size)

      const config = await generateAnimationConfig(brief, provider as any, apiKey)

      const sizeMap: Record<string, { width: number; height: number }> = {
        portrait: { width: 1080, height: 1920 },
        square: { width: 1080, height: 1080 },
        desktop: { width: 1920, height: 1080 },
      }
      const dims = sizeMap[size]
      config.canvas = { ...config.canvas, ...dims, aspectRatio: size as any }

      const keyframes = generateKeyframes(config)

      setCurrentConfig(config)
      setCurrentKeyframes(keyframes)

      loadAnimation(config, keyframes)

      const thumbnail = captureThumbnail(config, keyframes)

      addToHistory({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        prompt: p,
        provider: provider as any,
        config,
        keyframes,
        thumbnail,
        canvasSize: size as any,
        duration: config.timing.totalDuration,
      })

      toastSuccess("Animation generated successfully")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed"
      setGenerationError(msg)
      toastError(msg)
    } finally {
      setIsGenerating(false)
    }
  }, [setIsGenerating, setGenerationError, setCurrentConfig, setCurrentKeyframes, loadAnimation])

  const setSelectedSize = useAppStore((s) => s.setSelectedSize)
  const setEditorOpen = useAppStore((s) => s.setEditorOpen)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toastWarning("Enter a prompt first")
      return
    }
    await runGeneration(prompt, selectedSize, selectedProvider, apiKeys)
  }, [prompt, selectedSize, selectedProvider, apiKeys, runGeneration])

  const handleRegenerate = useCallback(async () => {
    await runGeneration(prompt, selectedSize, selectedProvider, apiKeys)
  }, [prompt, selectedSize, selectedProvider, apiKeys, runGeneration])

  const handleEditPrompt = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      document.querySelector("textarea")?.focus()
    }, 400)
  }, [])

  const reloadAnimation = useCallback((updater: (config: AnimationConfig) => AnimationConfig) => {
    const state = useAppStore.getState()
    if (!state.currentConfig) return
    const config = updater(cloneDeep(state.currentConfig))
    const keyframes = generateKeyframes(config)
    state.setCurrentConfig(config)
    state.setCurrentKeyframes(keyframes)
    loadAnimation(config, keyframes)
    toastSuccess("Animation updated")
  }, [loadAnimation])

  const handleSpeedChange = useCallback((value: number) => {
    controls.setSpeed(value)
    setPlaybackSpeed(value)
  }, [controls, setPlaybackSpeed])

  // Keyboard shortcuts (defined after all callbacks to avoid Temporal Dead Zone)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Global shortcuts (always available)
      switch (e.code) {
        case "Digit1":
        case "Numpad1":
          e.preventDefault()
          setSelectedSize("portrait")
          break
        case "Digit2":
        case "Numpad2":
          e.preventDefault()
          setSelectedSize("square")
          break
        case "Digit3":
        case "Numpad3":
          e.preventDefault()
          setSelectedSize("desktop")
          break
        case "KeyG":
          if (prompt.trim() && !isGenerating) {
            e.preventDefault()
            handleGenerate()
          }
          break
        case "Escape":
          e.preventDefault()
          setEditorOpen(false)
          break
        default:
          break
      }

      // Playback shortcuts (only when animation loaded)
      if (!hasConfig) return
      switch (e.code) {
        case "Space":
          e.preventDefault()
          if (controls.isPlaying) controls.pause()
          else controls.play()
          break
        case "KeyR":
          e.preventDefault()
          controls.restart()
          controls.play()
          break
        case "KeyL":
          e.preventDefault()
          const next = !isLooping
          controls.setLooping(next)
          setIsLooping(next)
          break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [hasConfig, controls, isLooping, setIsLooping, prompt, isGenerating, handleGenerate, setSelectedSize, setEditorOpen])

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state, prev) => {
      if (state.isGenerating && !prev.isGenerating) {
        handleGenerate()
      }
    })
    return unsubscribe
  }, [handleGenerate])

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          <div className="space-y-6">
            <APIKeyInput />
            <ProviderSelector />
            <PromptInput />
            <FileUpload />
            <CanvasSizeSelector />
            <GenerateButton />
          </div>

          <div className="flex flex-col gap-4">
            <ErrorBoundary>
              <CanvasPreview
                canvasRef={canvasRef}
                config={currentConfig}
                isGenerating={isGenerating}
                isPlaying={controls.isPlaying}
                currentTime={controls.currentTime}
                duration={controls.duration}
                selectedSize={selectedSize}
                generationError={generationError}
              />
            </ErrorBoundary>

            {hasConfig && (
              <PlaybackControls
                handlers={{
                  play: controls.play,
                  pause: controls.pause,
                  restart: controls.restart,
                  seekTo: controls.seekTo,
                  setSpeed: handleSpeedChange,
                  setLooping: (l) => { controls.setLooping(l); setIsLooping(l) },
                }}
                isPlaying={controls.isPlaying}
                currentTime={controls.currentTime}
                duration={controls.duration}
                playbackSpeed={playbackSpeed}
                isLooping={isLooping}
              />
            )}

            {hasConfig && (
              <EditorPanel
                reloadAnimation={reloadAnimation}
                onRegenerate={handleRegenerate}
                onEditPrompt={handleEditPrompt}
              />
            )}

            {hasConfig && (
              <ExportPanel
                onExportLottie={exportApi.exportLottie}
                onExportGIF={exportApi.exportGIF}
                onExportMP4={exportApi.exportMP4}
                onExportCSS={exportApi.exportCSS}
                isExporting={exportApi.isExporting}
                exportProgress={exportApi.exportProgress}
                currentFormat={exportApi.currentFormat}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
