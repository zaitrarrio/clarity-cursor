import { create } from 'zustand'

import { buildAnalysisBundle } from '@/lib/report-factory'
import { fetchDeepResearch } from '@/lib/research-api'
import type { AnalysisBundle } from '@/types/clarity-types'

const emptyPrompt = 'I want to sell luxury handbags to women in North America.'

interface ClarityState {
  readonly prompt: string
  readonly clickCount: number
  readonly isAnalyzing: boolean
  readonly bundle: AnalysisBundle | null
  readonly recentPrompts: readonly string[]
  readonly activeReportId: string | null
  readonly selectedCitationId: number | null
  readonly errorMessage: string | null
  readonly setPrompt: (value: string) => void
  readonly runAnalysis: () => Promise<void>
  readonly selectReport: (reportId: string) => void
  readonly openCitation: (citationId: number) => void
  readonly closeCitation: () => void
  readonly applyExample: () => void
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
  clickCount: 0,
  isAnalyzing: false,
  bundle: null,
  recentPrompts: [],
  activeReportId: null,
  selectedCitationId: null,
  errorMessage: null,
  setPrompt: (value) => set({ prompt: value }),
  runAnalysis: async () => {
    const { prompt, recentPrompts, clickCount } = get()
    const normalizedPrompt = prompt.trim()
    if (!normalizedPrompt) {
      return
    }

    set({ isAnalyzing: true, errorMessage: null })
    try {
      const researchResult = await fetchDeepResearch(normalizedPrompt)
      const bundle = buildAnalysisBundle(normalizedPrompt, researchResult.research, researchResult.mode)
      const firstReportId = bundle.reports[0]?.id ?? null
      set({
        isAnalyzing: false,
        bundle,
        activeReportId: firstReportId,
        selectedCitationId: null,
        clickCount: clickCount + 1,
        recentPrompts: appendRecentPrompt(recentPrompts, normalizedPrompt),
      })
    } catch {
      set({
        isAnalyzing: false,
        errorMessage: 'Analysis failed. Please retry with a clearer objective.',
      })
    }
  },
  selectReport: (reportId) => set({ activeReportId: reportId, selectedCitationId: null }),
  openCitation: (citationId) => set({ selectedCitationId: citationId }),
  closeCitation: () => set({ selectedCitationId: null }),
  applyExample: () =>
    set((state) => ({
      prompt: emptyPrompt,
      clickCount: state.clickCount + 1,
    })),
}))
