import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt"
import { withRetry } from "@/lib/ai/retry"

export async function callGroq(brief: string, apiKey: string): Promise<string> {
  return withRetry(async () => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: brief },
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Groq API error (${res.status}): ${body}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      throw new Error("Groq returned empty response")
    }

    return text
  })
}
