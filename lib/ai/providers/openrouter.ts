import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt"
import { withRetry } from "@/lib/ai/retry"

export async function callOpenRouter(brief: string, apiKey: string, model: string): Promise<string> {
  return withRetry(async () => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://motiondrop.app",
        "X-Title": "MotionDrop",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: brief },
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`OpenRouter API error (${res.status}): ${body}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      throw new Error("OpenRouter returned empty response")
    }

    return text
  })
}
