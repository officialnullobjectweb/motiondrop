import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt"

export async function callOpenAI(brief: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: brief },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI API error (${res.status}): ${body}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content

  if (!text) {
    throw new Error("OpenAI returned empty response")
  }

  return text
}
