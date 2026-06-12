import type { AnimationConfig, KeyframeData } from "@/lib/types/animation"
import { AnimationRenderer } from "@/lib/animation/renderer"

const GIF_FPS = 30
const FRAME_MS = 1000 / GIF_FPS

export async function exportToGIF(
  config: AnimationConfig,
  keyframes: KeyframeData,
  canvas: HTMLCanvasElement,
  onProgress: (percent: number) => void,
): Promise<Blob> {
  const totalMs = config.timing.totalDuration * 1000
  const totalFrames = Math.ceil(totalMs / FRAME_MS)

  const offscreen = document.createElement("canvas")
  offscreen.width = config.canvas.width
  offscreen.height = config.canvas.height

  const renderer = new AnimationRenderer()
  renderer.init(offscreen)
  renderer.load(config, keyframes)

  const GIF = (await import("gif.js")).default

  return new Promise<Blob>((resolve, reject) => {
    const gif = new GIF({
      workers: 0,
      quality: 10,
      width: config.canvas.width,
      height: config.canvas.height,
      background: config.colors.background,
    })

    gif.on("progress", (pct: number) => {
      onProgress(Math.round(pct * 100))
    })

    gif.on("finished", (blob: Blob) => {
      renderer.destroy()
      resolve(blob)
    })

    gif.on("abort", () => {
      renderer.destroy()
      reject(new Error("GIF export aborted"))
    })

    for (let i = 0; i < totalFrames; i++) {
      const time = (i * FRAME_MS) / 1000
      renderer.seekTo(time)
      renderer.restart()
      renderer.pause()
      gif.addFrame(offscreen.getContext("2d")!, { copy: true, delay: FRAME_MS })
      onProgress(Math.round(((i + 1) / totalFrames) * 50))
    }

    onProgress(50)
    gif.render()
  })
}
