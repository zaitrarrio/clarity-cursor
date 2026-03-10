import { buildFallbackResearch } from '@/lib/fallback-research'
import type { DeepResearchPayload } from '@/types/clarity-types'

interface DeepResearchApiResult {
  readonly mode: 'perplexity' | 'fallback'
  readonly research: DeepResearchPayload
}

const isDeepResearchPayload = (value: unknown): value is DeepResearchPayload => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const payload = value as Record<string, unknown>
  return (
    typeof payload.objective === 'string' &&
    typeof payload.market === 'string' &&
    typeof payload.audience === 'string' &&
    typeof payload.geography === 'string' &&
    Array.isArray(payload.findings) &&
    Array.isArray(payload.risks) &&
    Array.isArray(payload.recommendations) &&
    Array.isArray(payload.metrics) &&
    Array.isArray(payload.sources) &&
    Array.isArray(payload.assumptions)
  )
}

export const fetchDeepResearch = async (prompt: string): Promise<DeepResearchApiResult> => {
  try {
    const response = await fetch('/api/deep-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`Deep research request failed with ${response.status}`)
    }

    const payload = (await response.json()) as {
      mode?: 'perplexity' | 'fallback'
      research?: unknown
    }
    if (!isDeepResearchPayload(payload.research)) {
      throw new Error('Deep research payload shape is invalid.')
    }

    return {
      mode: payload.mode ?? 'fallback',
      research: payload.research,
    }
  } catch {
    return {
      mode: 'fallback',
      research: buildFallbackResearch(prompt),
    }
  }
}
