import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt"

export async function callAnthropic(brief: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: brief }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic API error (${res.status}): ${body}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text

  if (!text) {
    throw new Error("Anthropic returned empty response")
  }

  return text
}
