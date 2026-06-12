import type { AnimationConfig, KeyframeData, Keyframe } from "@/lib/types/animation"

interface LottieKeyframe {
  t: number
  s: number[]
  i?: { x: number[]; y: number[] }
  o?: { x: number[]; y: number[] }
}

interface LottieTransform {
  a: number
  k: LottieKeyframe[]
}

interface LottieLayer {
  ddd: number
  ind: number
  ty: number
  nm: string
  sr: number
  ks: {
    o: LottieTransform
    p: { a: number; k: LottieKeyframe[] | number[] }
    s: LottieTransform
    r: LottieTransform
  }
  shapes?: Record<string, unknown>[]
  t?: {
    d: {
      k: {
        t: number
        s: {
          t: number
          f: string
          s: string
          fc: number[]
          j: number
          tr: number
          lh: number
          ls: number
          sz: number[]
        }
      }[]
    }
  }
}

interface LottieJSON {
  v: string
  fr: number
  ip: number
  op: number
  w: number
  h: number
  nm: string
  ddd: number
  assets: unknown[]
  layers: LottieLayer[]
}

function parseCubicBezier(easing: string): { x1: number; y1: number; x2: number; y2: number } {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/)
  if (!match) return { x1: 0.4, y1: 0, x2: 0.2, y2: 1 }
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()))
  return { x1: parts[0] ?? 0.4, y1: parts[1] ?? 0, x2: parts[2] ?? 0.2, y2: parts[3] ?? 1 }
}

function toLottieKeyframes(
  frames: Keyframe[],
  valueScale: (v: number) => number,
  fps: number,
  lastValue: number,
): LottieKeyframe[] {
  const result: LottieKeyframe[] = []
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    const frameTime = f.frame
    const val = valueScale(typeof f.value === "number" ? f.value : (f.value as number[])[0])
    const kf: LottieKeyframe = { t: frameTime, s: [val] }
    if (i < frames.length - 1) {
      const bez = parseCubicBezier(f.easing)
      kf.o = { x: [bez.x1], y: [bez.y1] }
      kf.i = { x: [bez.x2], y: [bez.y2] }
    }
    result.push(kf)
  }
  if (result.length === 0) {
    result.push({ t: 0, s: [valueScale(lastValue)] })
  }
  return result
}

function makeTransform(animated: boolean, frames: LottieKeyframe[], staticVal?: number): LottieTransform {
  return {
    a: animated ? 1 : 0,
    k: animated ? frames : staticVal !== undefined ? [{ t: 0, s: [staticVal] }] : [{ t: 0, s: [0] }],
  }
}

function buildBackgroundLayer(config: AnimationConfig, keyframes: KeyframeData, index: number): LottieLayer {
  const { fps } = keyframes
  const bg = keyframes.layers.background
  const total = Math.ceil(config.timing.totalDuration * fps)

  const opacityFrames = toLottieKeyframes(bg.keyframes.opacity, (v) => v * 100, fps, 1)
  const colorShiftFrames = toLottieKeyframes(bg.keyframes.colorShift, (v) => v * 100, fps, 0)
  const scaleFrames = toLottieKeyframes(bg.keyframes.scale, (v) => v * 100, fps, 1)

  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: "Background",
    sr: 1,
    ks: {
      o: makeTransform(true, opacityFrames),
      p: { a: 0, k: [config.canvas.width / 2, config.canvas.height / 2] },
      s: makeTransform(config.background.type === "radial_pulse", scaleFrames, 100),
      r: { a: 0, k: [{ t: 0, s: [0] }] },
    },
    shapes: [
      {
        ty: "rc",
        nm: "Background Rect",
        d: 1,
        p: { a: 0, k: [config.canvas.width / 2, config.canvas.height / 2] },
        s: { a: 0, k: [config.canvas.width, config.canvas.height] },
        r: { a: 0, k: [0] },
      },
    ],
  }
}

function buildParticleLayer(config: AnimationConfig, keyframes: KeyframeData, index: number): LottieLayer {
  const { fps } = keyframes
  const pt = keyframes.layers.particles

  const opacityFrames = toLottieKeyframes(pt.keyframes.opacity, (v) => v * 100, fps, 1)
  const countFrames = toLottieKeyframes(pt.keyframes.count, (v) => v, fps, 0)

  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: "Particles",
    sr: 1,
    ks: {
      o: makeTransform(config.particles.enabled, opacityFrames),
      p: { a: 0, k: [config.canvas.width / 2, config.canvas.height / 2] },
      s: { a: 0, k: [{ t: 0, s: [100] }] },
      r: { a: 0, k: [{ t: 0, s: [0] }] },
    },
    shapes: [
      {
        ty: "el",
        nm: "Particle",
        d: 1,
        p: { a: 0, k: [config.canvas.width / 2, config.canvas.height / 2] },
        s: { a: 0, k: [config.particles.sizeRange[1] * 2, config.particles.sizeRange[1] * 2] },
      },
    ],
  }
}

function buildLogoLayer(config: AnimationConfig, keyframes: KeyframeData, index: number): LottieLayer {
  const { fps } = keyframes
  const logo = keyframes.layers.logo
  const total = Math.ceil(config.timing.totalDuration * fps)

  const scaleFrames = toLottieKeyframes(logo.keyframes.scale, (v) => v * 100, fps, 1)
  const opacityFrames = toLottieKeyframes(logo.keyframes.opacity, (v) => v * 100, fps, 1)
  const positionFrames = toLottieKeyframes(
    logo.keyframes.position.map((k) => ({ ...k, value: k.value as number })),
    (v) => v,
    fps,
    0,
  )
  const rotationFrames = toLottieKeyframes(logo.keyframes.rotation, (v) => v, fps, 0)

  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: "Logo",
    sr: 1,
    ks: {
      o: makeTransform(true, opacityFrames),
      p: makeTransform(true, positionFrames.map((k) => ({ t: k.t, s: [config.canvas.width / 2 + k.s[0], config.canvas.height / 2] }))),
      s: makeTransform(true, scaleFrames),
      r: makeTransform(true, rotationFrames),
    },
    shapes: [
      {
        ty: "rc",
        nm: "Logo Rect",
        d: 1,
        p: { a: 0, k: [100, 100] },
        s: { a: 0, k: [200, 200] },
        r: { a: 0, k: [24] },
      },
    ],
  }
}

function buildTextLayer(
  text: string,
  animation: string,
  layerNm: string,
  config: AnimationConfig,
  keyframes: KeyframeData,
  index: number,
  isPrimary: boolean,
): LottieLayer {
  const { fps } = keyframes
  const layerData = isPrimary ? keyframes.layers.textPrimary : keyframes.layers.textSecondary
  const total = Math.ceil(config.timing.totalDuration * fps)

  const opacityFrames = toLottieKeyframes(layerData.keyframes.opacity, (v) => v * 100, fps, 1)
  const positionFrames = toLottieKeyframes(
    layerData.keyframes.position.map((k) => ({ ...k, value: k.value as number })),
    (v) => v,
    fps,
    0,
  )
  const scaleFrames = toLottieKeyframes(layerData.keyframes.scale, (v) => v * 100, fps, 1)

  const centerX = config.canvas.width / 2
  const centerY = config.canvas.height * (isPrimary ? 0.5 : 0.6)

  return {
    ddd: 0,
    ind: index,
    ty: 5,
    nm: layerNm,
    sr: 1,
    ks: {
      o: makeTransform(true, opacityFrames),
      p: makeTransform(true, positionFrames.map((k) => ({ t: k.t, s: [centerX, centerY + k.s[0]] }))),
      s: makeTransform(true, scaleFrames),
      r: { a: 0, k: [{ t: 0, s: [0] }] },
    },
    t: {
      d: {
        k: [
          {
            t: 0,
            s: {
              t: 0,
              f: "Arial",
              s: text,
              fc: [1, 1, 1],
              j: 2,
              tr: 0,
              lh: 0,
              ls: 0,
              sz: [isPrimary ? 72 : 48, isPrimary ? 72 : 48],
            },
          },
        ],
      },
    },
  }
}

export function exportToLottie(config: AnimationConfig, keyframes: KeyframeData): string {
  const totalFrames = keyframes.totalFrames
  const layers: LottieLayer[] = []

  layers.push(buildBackgroundLayer(config, keyframes, 0))
  layers.push(buildParticleLayer(config, keyframes, 1))
  layers.push(buildLogoLayer(config, keyframes, 2))
  layers.push(
    buildTextLayer(
      config.text.primaryText,
      config.text.primaryAnimation,
      "Primary Text",
      config,
      keyframes,
      3,
      true,
    ),
  )
  layers.push(
    buildTextLayer(
      config.text.secondaryText,
      config.text.secondaryAnimation,
      "Secondary Text",
      config,
      keyframes,
      4,
      false,
    ),
  )

  const lottie: LottieJSON = {
    v: "5.9.0",
    fr: keyframes.fps,
    ip: 0,
    op: totalFrames,
    w: config.canvas.width,
    h: config.canvas.height,
    nm: config.brand.name,
    ddd: 0,
    assets: [],
    layers,
  }

  return JSON.stringify(lottie, null, 2)
}
