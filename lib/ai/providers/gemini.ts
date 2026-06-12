import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt"
import { withRetry } from "@/lib/ai/retry"

export async function callGemini(brief: string, apiKey: string): Promise<string> {
  return withRetry(async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${brief}` }] }],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Gemini API error (${res.status}): ${body}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error("Gemini returned empty response")
    }

    return text
  })
}
