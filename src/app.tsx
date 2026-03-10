import { CommandCenter } from '@/components/command-center'
import { EvidenceInspector } from '@/components/evidence-inspector'
import { GlobalNavigationSidebar } from '@/components/global-navigation-sidebar'
import { ReportSelector } from '@/components/report-selector'
import { ReportViewer } from '@/components/report-viewer'
import { WorkspaceModuleView } from '@/components/workspace-module-view'
import { workspaceSectionMeta } from '@/lib/workspace-sections'
import { useClarityStore } from '@/state/clarity-store'
import '@/styles/index.css'

const App = () => {
  const {
    workspaces,
    activeWorkspaceId,
    isAnalyzing,
    selectSection,
    createWorkspace,
    switchWorkspace,
    renameWorkspace,
    deleteWorkspace,
    setPrompt,
    runAnalysis,
    selectReport,
    openCitation,
    closeCitation,
    applyExample,
  } = useClarityStore((state) => state)

  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0] ?? null

  const activeBundle = activeWorkspace?.bundle ?? null
  const activeReport =
    activeBundle?.reports.find((report) => report.id === activeWorkspace?.activeReportId) ??
    activeBundle?.reports[0] ??
    null

  const activeSectionMeta = activeWorkspace
    ? workspaceSectionMeta[activeWorkspace.activeSection]
    : workspaceSectionMeta.dashboard

  return (
    <div className="workspace-grid">
      <GlobalNavigationSidebar
        activeWorkspaceId={activeWorkspaceId}
        onCreateWorkspace={createWorkspace}
        onDeleteWorkspace={deleteWorkspace}
        onRenameWorkspace={renameWorkspace}
        onSelectPrompt={setPrompt}
        onSelectSection={selectSection}
        onSwitchWorkspace={switchWorkspace}
        activeSection={activeWorkspace?.activeSection ?? 'dashboard'}
        recentPrompts={activeWorkspace?.recentPrompts ?? []}
        workspaces={workspaces}
      />

      <main className="main-column">
        <header className="top-shell">
          <div>
            <p className="eyebrow">Enterprise Workspace</p>
            <h2>Strategic Intelligence and Go-To-Market Operating System</h2>
            <p>{activeSectionMeta.subtitle}</p>
          </div>
          <div className="chip-row">
            <span className="chip">{activeWorkspace?.name ?? 'No workspace selected'}</span>
            <span className="chip">{activeSectionMeta.title}</span>
            <span className="chip">{activeBundle?.reports.length ?? 0} report templates</span>
            <span className="chip">Evidence-backed reporting standard</span>
          </div>
        </header>

        <CommandCenter
          clickCount={activeWorkspace?.clickCount ?? 0}
          errorMessage={activeWorkspace?.errorMessage ?? null}
          isAnalyzing={isAnalyzing}
          mode={activeBundle?.mode ?? null}
          onApplyExample={applyExample}
          onPromptChange={setPrompt}
          onRunAnalysis={runAnalysis}
          prompt={activeWorkspace?.prompt ?? ''}
        />

        <WorkspaceModuleView
          onSelectReport={selectReport}
          onSelectSection={selectSection}
          workspace={activeWorkspace}
        />

        {activeWorkspace?.activeSection === 'reports' ? (
          <>
            <ReportSelector
              activeReportId={activeWorkspace?.activeReportId ?? null}
              onSelectReport={selectReport}
              reports={activeBundle?.reports ?? []}
            />
            <ReportViewer onOpenCitation={openCitation} report={activeReport} />
          </>
        ) : null}
      </main>

      <EvidenceInspector
        bundle={activeBundle}
        onCloseCitation={closeCitation}
        report={activeReport}
        selectedCitationId={activeWorkspace?.selectedCitationId ?? null}
      />

      {isAnalyzing ? (
        <div className="loading-overlay">
          <div className="loading-card">
            <h3>Running deep research...</h3>
            <p>Clarity is synthesizing market intelligence, evidence links, and report artifacts.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
