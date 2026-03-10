import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { buildAnalysisBundle } from '@/lib/report-factory'
import { fetchDeepResearch } from '@/lib/research-api'
import type { WorkspaceRecord } from '@/types/clarity-types'

const emptyPrompt = 'I want to sell luxury handbags to women in North America.'
const initialWorkspaceName = 'Workspace 1'

interface ClarityState {
  readonly workspaces: readonly WorkspaceRecord[]
  readonly activeWorkspaceId: string
  readonly isAnalyzing: boolean
  readonly createWorkspace: (name: string) => void
  readonly switchWorkspace: (workspaceId: string) => void
  readonly renameWorkspace: (workspaceId: string, name: string) => void
  readonly deleteWorkspace: (workspaceId: string) => void
  readonly setPrompt: (value: string) => void
  readonly runAnalysis: () => Promise<void>
  readonly selectReport: (reportId: string) => void
  readonly openCitation: (citationId: number) => void
  readonly closeCitation: () => void
  readonly applyExample: () => void
}

const buildWorkspaceId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `workspace-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

const nowIso = (): string => new Date().toISOString()

const buildWorkspace = (name: string): WorkspaceRecord => {
  const now = nowIso()
  return {
    id: buildWorkspaceId(),
    name,
    prompt: '',
    clickCount: 0,
    bundle: null,
    recentPrompts: [],
    activeReportId: null,
    selectedCitationId: null,
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
  }
}

const touchWorkspace = (workspace: WorkspaceRecord): WorkspaceRecord => ({
  ...workspace,
  updatedAt: nowIso(),
})

const updateWorkspaceById = (
  workspaces: readonly WorkspaceRecord[],
  workspaceId: string,
  updater: (workspace: WorkspaceRecord) => WorkspaceRecord,
): readonly WorkspaceRecord[] =>
  workspaces.map((workspace) => (workspace.id === workspaceId ? updater(workspace) : workspace))

const getActiveWorkspace = (state: ClarityState): WorkspaceRecord | null =>
  state.workspaces.find((workspace) => workspace.id === state.activeWorkspaceId) ?? null

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

const initialWorkspace = buildWorkspace(initialWorkspaceName)

export const useClarityStore = create<ClarityState>()(
  persist(
    (set, get) => ({
      workspaces: [initialWorkspace],
      activeWorkspaceId: initialWorkspace.id,
      isAnalyzing: false,
      createWorkspace: (name) =>
        set((state) => {
          const trimmedName = name.trim()
          const safeName = trimmedName || `Workspace ${state.workspaces.length + 1}`
          const nextWorkspace = buildWorkspace(safeName)
          return {
            workspaces: [nextWorkspace, ...state.workspaces],
            activeWorkspaceId: nextWorkspace.id,
          }
        }),
      switchWorkspace: (workspaceId) =>
        set((state) => {
          const exists = state.workspaces.some((workspace) => workspace.id === workspaceId)
          if (!exists) {
            return {}
          }
          return { activeWorkspaceId: workspaceId }
        }),
      renameWorkspace: (workspaceId, name) =>
        set((state) => {
          const trimmedName = name.trim()
          if (!trimmedName) {
            return {}
          }

          return {
            workspaces: updateWorkspaceById(state.workspaces, workspaceId, (workspace) =>
              touchWorkspace({ ...workspace, name: trimmedName }),
            ),
          }
        }),
      deleteWorkspace: (workspaceId) =>
        set((state) => {
          if (state.workspaces.length <= 1) {
            return {}
          }

          const remainingWorkspaces = state.workspaces.filter((workspace) => workspace.id !== workspaceId)
          if (remainingWorkspaces.length === state.workspaces.length) {
            return {}
          }

          const nextActiveWorkspaceId =
            state.activeWorkspaceId === workspaceId
              ? (remainingWorkspaces[0]?.id ?? state.activeWorkspaceId)
              : state.activeWorkspaceId

          return {
            workspaces: remainingWorkspaces,
            activeWorkspaceId: nextActiveWorkspaceId,
          }
        }),
      setPrompt: (value) =>
        set((state) => ({
          workspaces: updateWorkspaceById(state.workspaces, state.activeWorkspaceId, (workspace) =>
            touchWorkspace({ ...workspace, prompt: value }),
          ),
        })),
      runAnalysis: async () => {
        const stateBeforeRun = get()
        const activeWorkspace = getActiveWorkspace(stateBeforeRun)
        const normalizedPrompt = activeWorkspace?.prompt.trim() ?? ''
        if (!activeWorkspace || !normalizedPrompt) {
          return
        }

        const workspaceId = activeWorkspace.id
        set((state) => ({
          isAnalyzing: true,
          workspaces: updateWorkspaceById(state.workspaces, workspaceId, (workspace) =>
            touchWorkspace({ ...workspace, errorMessage: null }),
          ),
        }))

        try {
          const researchResult = await fetchDeepResearch(normalizedPrompt)
          const bundle = buildAnalysisBundle(normalizedPrompt, researchResult.research, researchResult.mode)
          const firstReportId = bundle.reports[0]?.id ?? null

          set((state) => ({
            isAnalyzing: false,
            workspaces: updateWorkspaceById(state.workspaces, workspaceId, (workspace) =>
              touchWorkspace({
                ...workspace,
                bundle,
                activeReportId: firstReportId,
                selectedCitationId: null,
                clickCount: workspace.clickCount + 1,
                recentPrompts: appendRecentPrompt(workspace.recentPrompts, normalizedPrompt),
              }),
            ),
          }))
        } catch {
          set((state) => ({
            isAnalyzing: false,
            workspaces: updateWorkspaceById(state.workspaces, workspaceId, (workspace) =>
              touchWorkspace({
                ...workspace,
                errorMessage: 'Analysis failed. Please retry with a clearer objective.',
              }),
            ),
          }))
        }
      },
      selectReport: (reportId) =>
        set((state) => ({
          workspaces: updateWorkspaceById(state.workspaces, state.activeWorkspaceId, (workspace) =>
            touchWorkspace({ ...workspace, activeReportId: reportId, selectedCitationId: null }),
          ),
        })),
      openCitation: (citationId) =>
        set((state) => ({
          workspaces: updateWorkspaceById(state.workspaces, state.activeWorkspaceId, (workspace) =>
            touchWorkspace({ ...workspace, selectedCitationId: citationId }),
          ),
        })),
      closeCitation: () =>
        set((state) => ({
          workspaces: updateWorkspaceById(state.workspaces, state.activeWorkspaceId, (workspace) =>
            touchWorkspace({ ...workspace, selectedCitationId: null }),
          ),
        })),
      applyExample: () =>
        set((state) => ({
          workspaces: updateWorkspaceById(state.workspaces, state.activeWorkspaceId, (workspace) =>
            touchWorkspace({
              ...workspace,
              prompt: emptyPrompt,
              clickCount: workspace.clickCount + 1,
            }),
          ),
        })),
    }),
    {
      name: 'clarity-workspace-store',
      version: 2,
      partialize: (state) => ({
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    },
  ),
)
