import type { CompleteContext } from "./inferencer"

export function buildBrief(
  context: CompleteContext,
  prompt: string,
  hasFile: boolean,
  canvasSize: string,
): string {
  const fileStr = hasFile ? `YES type: ${canvasSize}` : "NO"

  const lines = [
    "Animation Brief for AI:",
    "",
    "Brand Analysis:",
    `- Raw user input: ${prompt}`,
    `- Detected brand name: ${context.brandName || "Not specified"}`,
    `- Detected industry: ${context.industry || "Not detected - infer from context"}`,
    `- Detected colors: Not specified - derive from industry`,
    `- Detected energy: ${context.energyLevel} / 10`,
    `- File uploaded: ${fileStr}`,
    `- Canvas size: ${canvasSize.toUpperCase()}`,
    "",
    "Pre-analyzed context:",
    `- Suggested industry: ${context.industry}`,
    `- Suggested energy level: ${context.energyLevel} / 10`,
    `- Color family: ${context.colorFamily.toUpperCase()}`,
    `- Brand personality: ${context.personality.join(", ")}`,
    "",
    "Fill in the JSON config following all rules above.",
    "Make it look premium and professional.",
  ]

  return lines.join("\n")
}

/*
TEST - remove before production:
const test = buildBrief(
  inferContext(extractSignals("fitness app FitPro blue energetic")),
  "fitness app FitPro blue energetic",
  false,
  "portrait"
)
console.log(test)
*/
