import { withRetry } from "./retry"

export interface TestResult {
  ok: boolean
  status: number
  error?: string
}

/**
 * Test an API key by making a minimal request to the provider.
 * Uses withRetry for network resilience.
 */
export async function testProviderConnection(
  provider: string,
  apiKey: string,
): Promise<TestResult> {
  return withRetry(async () => {
    const trimmed = apiKey.trim()

    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(trimmed)}`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say 'ok' if you can read this." }] }],
        }),
      })
      return { ok: res.ok, status: res.status }
    }

    if (provider === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trimmed}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [{ role: "user", content: "Say 'ok'" }],
          max_tokens: 10,
        }),
      })
      return { ok: res.ok, status: res.status }
    }

    if (provider === "openrouter") {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trimmed}`,
          "HTTP-Referer": "https://motiondrop.app",
          "X-Title": "MotionDrop",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Say 'ok'" }],
          max_tokens: 10,
        }),
      })
      return { ok: res.ok, status: res.status }
    }

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trimmed}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Say 'ok'" }],
          max_tokens: 10,
        }),
      })
      return { ok: res.ok, status: res.status }
    }

    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": trimmed,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say 'ok'" }],
        }),
      })
      return { ok: res.ok, status: res.status }
    }

    return { ok: false, status: 0, error: `Unknown provider: ${provider}` }
  })
}

/**
 * Human-readable error message from a test result
 */
export function getTestErrorMessage(result: TestResult): string {
  if (result.ok) return ""

  const statusMessages: Record<number, string> = {
    400: "Invalid request — check your API key format",
    401: "Authentication failed — your API key is invalid",
    403: "Access denied — your API key doesn't have permission",
    404: "Endpoint not found — the API model may have changed",
    429: "Rate limited — too many requests, try again in a moment",
    500: "Provider server error — try again in a few seconds",
    502: "Provider gateway error — temporary outage, try again",
    503: "Provider service unavailable — temporary outage",
  }

  return statusMessages[result.status] || `Error ${result.status}`
}
