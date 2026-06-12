import type { AnimationConfig, ProviderName } from "@/lib/types/animation"
import { callGemini } from "./providers/gemini"
import { callGroq } from "./providers/groq"
import { callOpenRouter } from "./providers/openrouter"
import { callOpenAI } from "./providers/openai"
import { callAnthropic } from "./providers/anthropic"
import { validateAndParse, FALLBACK_CONFIG } from "./validator"

export async function generateAnimationConfig(
  brief: string,
  provider: ProviderName,
  apiKey: string,
  model?: string,
): Promise<AnimationConfig> {
  let rawResponse: string

  switch (provider) {
    case "gemini":
      rawResponse = await callGemini(brief, apiKey)
      break
    case "groq":
      rawResponse = await callGroq(brief, apiKey)
      break
    case "openrouter":
      rawResponse = await callOpenRouter(brief, apiKey, model ?? "gpt-4o-mini")
      break
    case "openai":
      rawResponse = await callOpenAI(brief, apiKey)
      break
    case "anthropic":
      rawResponse = await callAnthropic(brief, apiKey)
      break
    default:
      return FALLBACK_CONFIG
  }

  try {
    return validateAndParse(rawResponse)
  } catch (e) {
    throw new Error(`Failed to parse AI response: ${e instanceof Error ? e.message : "invalid format"}`)
  }
}
