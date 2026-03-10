import { CommandCenter } from '@/components/command-center'
import { EvidenceInspector } from '@/components/evidence-inspector'
import { GlobalNavigationSidebar } from '@/components/global-navigation-sidebar'
import { ReportSelector } from '@/components/report-selector'
import { ReportViewer } from '@/components/report-viewer'
import { useClarityStore } from '@/state/clarity-store'
import '@/styles/index.css'

const App = () => {
  const {
    prompt,
    clickCount,
    isAnalyzing,
    bundle,
    recentPrompts,
    activeReportId,
    selectedCitationId,
    errorMessage,
    setPrompt,
    runAnalysis,
    selectReport,
    openCitation,
    closeCitation,
    applyExample,
  } = useClarityStore((state) => state)

  const activeReport = bundle?.reports.find((report) => report.id === activeReportId) ?? null

  return (
    <div className="workspace-grid">
      <GlobalNavigationSidebar onSelectPrompt={setPrompt} recentPrompts={recentPrompts} />

      <main className="main-column">
        <header className="top-shell">
          <div>
            <p className="eyebrow">Enterprise Workspace</p>
            <h2>Strategic Intelligence and Go-To-Market Operating System</h2>
            <p>Designed for summary → analysis → evidence → action decision workflows.</p>
          </div>
          <div className="chip-row">
            <span className="chip">{bundle?.reports.length ?? 0} report templates</span>
            <span className="chip">Evidence-backed reporting standard</span>
          </div>
        </header>

        <CommandCenter
          clickCount={clickCount}
          errorMessage={errorMessage}
          isAnalyzing={isAnalyzing}
          mode={bundle?.mode ?? null}
          onApplyExample={applyExample}
          onPromptChange={setPrompt}
          onRunAnalysis={runAnalysis}
          prompt={prompt}
        />

        <ReportSelector
          activeReportId={activeReportId}
          onSelectReport={selectReport}
          reports={bundle?.reports ?? []}
        />

        <ReportViewer onOpenCitation={openCitation} report={activeReport} />
      </main>

      <EvidenceInspector
        bundle={bundle}
        onCloseCitation={closeCitation}
        report={activeReport}
        selectedCitationId={selectedCitationId}
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
