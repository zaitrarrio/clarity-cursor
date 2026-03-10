import { create } from 'zustand'

import { buildClarityPipeline } from '@/lib/clarity-engine'
import type { ClarityModuleKey, ClarityPipelineResult } from '@/types/clarity-types'

const emptyPrompt = 'I want to sell luxury handbags to women in North America.'

interface ClarityState {
  readonly prompt: string
  readonly selectedModule: ClarityModuleKey
  readonly clickCount: number
  readonly isGenerating: boolean
  readonly result: ClarityPipelineResult | null
  readonly recentPrompts: readonly string[]
  readonly setPrompt: (prompt: string) => void
  readonly selectModule: (moduleKey: ClarityModuleKey) => void
  readonly generate: () => void
  readonly applyExample: () => void
  readonly reset: () => void
}

const appendRecentPrompt = (
  recentPrompts: readonly string[],
  prompt: string,
): readonly string[] => {
  const normalized = prompt.trim()
  if (!normalized) {
    return recentPrompts
  }

  const deduped = recentPrompts.filter((entry) => entry !== normalized)
  return [normalized, ...deduped].slice(0, 4)
}

export const useClarityStore = create<ClarityState>((set, get) => ({
  prompt: '',
  selectedModule: 'discovery',
  clickCount: 0,
  isGenerating: false,
  result: null,
  recentPrompts: [],
  setPrompt: (prompt) => set({ prompt }),
  selectModule: (moduleKey) => set({ selectedModule: moduleKey }),
  generate: () => {
    const { prompt, recentPrompts, clickCount } = get()
    const normalizedPrompt = prompt.trim()
    if (!normalizedPrompt) {
      return
    }

    set({ isGenerating: true })

    const result = buildClarityPipeline(normalizedPrompt)
    set({
      isGenerating: false,
      result,
      clickCount: clickCount + 1,
      selectedModule: 'research',
      recentPrompts: appendRecentPrompt(recentPrompts, normalizedPrompt),
    })
  },
  applyExample: () =>
    set((state) => ({
      prompt: emptyPrompt,
      clickCount: state.clickCount + 1,
    })),
  reset: () => set({ prompt: '', result: null, selectedModule: 'discovery' }),
}))
