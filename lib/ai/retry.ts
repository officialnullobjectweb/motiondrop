/**
 * Retry configuration
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Base delay in ms between retries (default: 1000) */
  baseDelay?: number
  /** Maximum delay in ms (default: 10000) */
  maxDelay?: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
}

/**
 * Returns true if the error is retryable (server errors, rate limits, network errors).
 * Client errors (4xx except 429) are NOT retried.
 */
function isRetryable(err: unknown, attempt: number): boolean {
  const msg = err instanceof Error ? err.message : String(err)

  // Always retry network errors (no HTTP status)
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network")) {
    return true
  }

  // Extract HTTP status from error messages like "Gemini API error (500): ..."
  const statusMatch = msg.match(/\((\d+)\)/)
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10)
    if (status === 429) return true // Rate limit - always retry
    if (status >= 500) return true // Server error - retry
    return false // Client error (4xx except 429) - don't retry
  }

  // If we can't determine, don't retry on last attempt, do retry otherwise
  return true
}

/**
 * Execute an async function with exponential backoff retry logic.
 *
 * Only retries on:
 * - Network errors (Failed to fetch, NetworkError)
 * - Server errors (5xx HTTP status)
 * - Rate limiting (429 HTTP status)
 *
 * Does NOT retry on:
 * - Client errors (4xx HTTP status except 429)
 * - Authentication failures
 * - Invalid request errors
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay } = { ...DEFAULT_OPTIONS, ...options }

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      if (attempt === maxRetries) {
        break // Last attempt failed, throw
      }

      if (!isRetryable(err, attempt)) {
        break // Non-retryable error
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 500,
        maxDelay,
      )

      console.debug(
        `[retry] Attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${Math.round(delay)}ms...`,
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
