"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChevronDown, ChevronUp, RotateCcw, Pencil, Loader2 } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { generateKeyframes } from "@/lib/animation/keyframeGenerator"
import type { AnimationConfig } from "@/lib/types/animation"

interface EditorPanelProps {
  reloadAnimation: (updater: (config: AnimationConfig) => AnimationConfig) => void
  onRegenerate: () => void
  onEditPrompt: () => void
}

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

const COLOR_KEYS: (keyof AnimationConfig["colors"])[] = [
  "primary",
  "secondary",
  "accent",
  "background",
]

const COLOR_LABELS: Record<string, string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "BG",
}

export default function EditorPanel({ reloadAnimation, onRegenerate, onEditPrompt }: EditorPanelProps) {
  const editorOpen = useAppStore((s) => s.editorOpen)
  const setEditorOpen = useAppStore((s) => s.setEditorOpen)
  const currentConfig = useAppStore((s) => s.currentConfig)
  const playbackSpeed = useAppStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed)
  const isGenerating = useAppStore((s) => s.isGenerating)

  const [activeColor, setActiveColor] = useState<string | null>(null)

  if (!currentConfig) return null

  const cfg = currentConfig

  function handleSpeedChange(value: number) {
    setPlaybackSpeed(value)
  }

  function handleEnergyChange(value: number) {
    reloadAnimation((config) => {
      config.timing.energyLevel = value
      return config
    })
  }

  function handleColorChange(key: string, hex: string) {
    reloadAnimation((config) => {
      ;(config.colors as Record<string, string>)[key] = hex
      return config
    })
  }

  function handleTextChange(field: "primaryText" | "secondaryText", value: string) {
    reloadAnimation((config) => {
      config.text[field] = value
      return config
    })
  }

  function handleFontWeightChange() {
    reloadAnimation((config) => {
      config.text.fontWeight = config.text.fontWeight === "bold" ? "normal" : "bold"
      return config
    })
  }

  function handleParticleToggle() {
    reloadAnimation((config) => {
      config.particles.enabled = !config.particles.enabled
      return config
    })
  }

  return (
    <div className="border border-[#222222] rounded-xl bg-[#111111]/80 overflow-hidden">
      <button
        onClick={() => setEditorOpen(!editorOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1A1A1A] transition-colors"
      >
        <span className="text-sm font-medium text-white">Editor</span>
        {editorOpen ? (
          <ChevronUp className="w-4 h-4 text-[#666666]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#666666]" />
        )}
      </button>

      {editorOpen && (
        <div className="px-4 pb-4 space-y-5 border-t border-[#222222] pt-4">
          {/* Speed */}
          <SliderField
            label="Speed"
            value={playbackSpeed}
            min={0.5}
            max={2}
            step={0.1}
            display={`${playbackSpeed.toFixed(1)}x`}
            onChange={handleSpeedChange}
          />

          {/* Energy */}
          <SliderField
            label="Energy"
            value={cfg.timing.energyLevel}
            min={1}
            max={10}
            step={1}
            display={`${cfg.timing.energyLevel}`}
            leftLabel="Calm"
            rightLabel="Explosive"
            onChange={handleEnergyChange}
          />

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-xs text-[#888888] font-medium">Colors</label>
            <div className="flex gap-3">
              {COLOR_KEYS.map((key) => {
                const hex = cfg.colors[key]
                return (
                  <div key={key} className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => setActiveColor(activeColor === key ? null : key)}
                      className="w-8 h-8 rounded-full border-2 border-white/10 hover:border-white/30 transition-colors"
                      style={{ backgroundColor: hex }}
                      title={COLOR_LABELS[key]}
                    />
                    <span className="text-[10px] text-[#555555]">{COLOR_LABELS[key]}</span>
                  </div>
                )
              })}
            </div>
            {activeColor && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={cfg.colors[activeColor as keyof AnimationConfig["colors"]]}
                  onChange={(e) => handleColorChange(activeColor, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0"
                />
                <input
                  type="text"
                  value={cfg.colors[activeColor as keyof AnimationConfig["colors"]]}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      handleColorChange(activeColor, val)
                    }
                  }}
                  className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#6366F1]"
                  placeholder="#000000"
                />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <label className="text-xs text-[#888888] font-medium">Text</label>
            <DebouncedTextInput
              value={cfg.text.primaryText}
              maxLength={30}
              onChange={(v) => handleTextChange("primaryText", v)}
            />
            <DebouncedTextInput
              value={cfg.text.secondaryText}
              maxLength={30}
              onChange={(v) => handleTextChange("secondaryText", v)}
              placeholder="Tagline"
            />
            <button
              onClick={handleFontWeightChange}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                cfg.text.fontWeight === "bold"
                  ? "bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1]"
                  : "bg-transparent border-[#333333] text-[#888888] hover:border-[#555555]"
              }`}
            >
              Bold
            </button>
          </div>

          {/* Particles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#888888] font-medium">Particles</label>
              <button
                onClick={handleParticleToggle}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  cfg.particles.enabled ? "bg-[#6366F1]" : "bg-[#333333]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    cfg.particles.enabled ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
            </div>
            {cfg.particles.enabled && (
              <SliderField
                label="Intensity"
                value={cfg.particles.count}
                min={5}
                max={60}
                step={5}
                display={`${cfg.particles.count}`}
                onChange={(v) => {
                  reloadAnimation((config) => {
                    config.particles.count = v
                    return config
                  })
                }}
              />
            )}
          </div>

          {/* Regenerate / Edit Prompt */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#333333] disabled:text-[#666666] text-white text-xs font-medium rounded-full py-2 transition-colors"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              {isGenerating ? "Generating..." : "Regenerate"}
            </button>
            <button
              onClick={onEditPrompt}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white text-xs font-medium rounded-full py-2 border border-[#333333] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Prompt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- sub-components ---------- */

interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  leftLabel?: string
  rightLabel?: string
  onChange: (value: number) => void
}

function SliderField({ label, value, min, max, step, display, leftLabel, rightLabel, onChange }: SliderFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#888888] font-medium">{label}</label>
        <span className="text-xs font-mono text-white">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#222222] accent-[#6366F1] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
      />
      {leftLabel && rightLabel && (
        <div className="flex justify-between text-[10px] text-[#555555]">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  )
}

interface DebouncedTextInputProps {
  value: string
  maxLength: number
  onChange: (value: string) => void
  placeholder?: string
}

function DebouncedTextInput({ value, maxLength, onChange, placeholder }: DebouncedTextInputProps) {
  const [local, setLocal] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setLocal(value)
  }, [value])

  function handleChange(raw: string) {
    if (raw.length > maxLength) return
    setLocal(raw)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(raw), 300)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? "Brand name"}
        maxLength={maxLength}
        className="w-full bg-[#0A0A0A] border border-[#222222] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555555] focus:outline-none focus:border-[#6366F1] pr-12"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#555555] font-mono">
        {local.length}/{maxLength}
      </span>
    </div>
  )
}
