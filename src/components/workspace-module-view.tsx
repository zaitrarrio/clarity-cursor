import type { JSX } from 'react'

import { workspaceSectionMeta } from '@/lib/workspace-sections'
import type { DetailedReport, WorkspaceRecord, WorkspaceSectionKey } from '@/types/clarity-types'

interface WorkspaceModuleViewProps {
  readonly workspace: WorkspaceRecord | null
  readonly onSelectSection: (section: WorkspaceSectionKey) => void
  readonly onSelectReport: (reportId: string) => void
}

const getReport = (workspace: WorkspaceRecord | null, reportId: string): DetailedReport | null =>
  workspace?.bundle?.reports.find((report) => report.id === reportId) ?? null

const formatSection = (workspace: WorkspaceRecord | null): JSX.Element => {
  if (!workspace) {
    return (
      <section className="module-shell">
        <h3>No workspace selected</h3>
        <p>Select or create a workspace to start building strategy artifacts.</p>
      </section>
    )
  }

  const section = workspace.activeSection
  const reportCount = workspace.bundle?.reports.length ?? 0
  const marketReport = getReport(workspace, 'market-research')
  const consumerReport = getReport(workspace, 'consumer-insights')
  const conceptReport = getReport(workspace, 'concept-testing')
  const strategyReport = getReport(workspace, 'go-to-market-strategy')
  const planReport = getReport(workspace, 'go-to-market-plan')
  const keyMetrics = marketReport?.metrics ?? []
  const sources = marketReport?.sources ?? []

  if (section === 'dashboard') {
    return (
      <section className="module-shell">
        <h3>Workspace performance overview</h3>
        <div className="module-grid">
          <article className="module-card">
            <p className="module-label">Report templates generated</p>
            <h4>{reportCount}</h4>
          </article>
          <article className="module-card">
            <p className="module-label">Tracked source references</p>
            <h4>{sources.length}</h4>
          </article>
          <article className="module-card">
            <p className="module-label">Recent prompt runs</p>
            <h4>{workspace.recentPrompts.length}</h4>
          </article>
          <article className="module-card">
            <p className="module-label">Collaboration notes</p>
            <h4>{workspace.collaborationNotes.length}</h4>
          </article>
        </div>
        <div className="module-grid">
          <article className="module-card">
            <p className="module-label">Top insights</p>
            <ul>
              {(workspace.bundle?.topInsights ?? ['Run deep analysis to populate insights.']).map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </article>
          <article className="module-card">
            <p className="module-label">Immediate strategic actions</p>
            <ul>
              {(workspace.bundle?.globalActions ?? ['No actions generated yet.']).map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    )
  }

  if (section === 'projects') {
    return (
      <section className="module-shell">
        <h3>Project workspace</h3>
        <article className="module-card">
          <p className="module-label">Current strategic objective</p>
          <p>{workspace.prompt || 'No objective defined yet.'}</p>
        </article>
        <article className="module-card">
          <p className="module-label">Workflow status</p>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Research', marketReport ? 'Generated' : 'Pending'],
                ['Personas', consumerReport ? 'Generated' : 'Pending'],
                ['Concepts', conceptReport ? 'Generated' : 'Pending'],
                ['Strategy', strategyReport ? 'Generated' : 'Pending'],
                ['Plan', planReport ? 'Generated' : 'Pending'],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    )
  }

  if (section === 'research') {
    return (
      <section className="module-shell">
        <h3>Research intelligence</h3>
        <article className="module-card">
          <p className="module-label">Source inventory</p>
          {sources.length === 0 ? (
            <p>No sources yet. Run deep analysis to populate evidence.</p>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Publisher</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td>{source.id}</td>
                    <td>{source.publisher}</td>
                    <td>{source.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
        <article className="module-card">
          <p className="module-label">Evidence highlights</p>
          <ul>
            {(marketReport?.evidence ?? []).slice(0, 4).map((evidence) => (
              <li key={evidence.id}>{evidence.claim}</li>
            ))}
            {(marketReport?.evidence ?? []).length === 0 ? <li>No evidence records yet.</li> : null}
          </ul>
        </article>
      </section>
    )
  }

  if (section === 'personas') {
    const personaSegments = consumerReport?.sections[0]?.charts[0]?.data ?? []
    return (
      <section className="module-shell">
        <h3>Persona intelligence library</h3>
        <div className="module-grid">
          {personaSegments.length > 0 ? (
            personaSegments.map((segment) => (
              <article className="module-card" key={segment.label}>
                <p className="module-label">{segment.label}</p>
                <h4>{segment.value.toFixed(0)} priority score</h4>
                <p>
                  Preferred channel: {segment.label.includes('Value') ? 'Search + lifecycle' : 'Creator + social'}
                </p>
                <p>Confidence: medium</p>
              </article>
            ))
          ) : (
            <article className="module-card">
              <p>Run consumer insights analysis to generate persona segments.</p>
            </article>
          )}
        </div>
      </section>
    )
  }

  if (section === 'concepts') {
    const conceptData = conceptReport?.sections[0]?.charts[0]?.data ?? []
    return (
      <section className="module-shell">
        <h3>Concept validation center</h3>
        <article className="module-card">
          <p className="module-label">Concept ranking</p>
          <div className="progress-list">
            {conceptData.length > 0 ? (
              conceptData.map((concept) => (
                <div className="progress-item" key={concept.label}>
                  <span>{concept.label}</span>
                  <div className="progress-track">
                    <span className="progress-fill" style={{ width: `${concept.value}%` }} />
                  </div>
                  <strong>{concept.value.toFixed(0)}</strong>
                </div>
              ))
            ) : (
              <p>No concept ranking yet.</p>
            )}
          </div>
        </article>
      </section>
    )
  }

  if (section === 'go-to-market-strategy') {
    return (
      <section className="module-shell">
        <h3>Strategy architecture</h3>
        <div className="module-grid">
          {(strategyReport?.sections ?? []).map((strategySection) => (
            <article className="module-card" key={strategySection.id}>
              <p className="module-label">{strategySection.title}</p>
              <p>{strategySection.summary}</p>
              <p>
                <strong>Action:</strong> {strategySection.action}
              </p>
            </article>
          ))}
          {!strategyReport ? (
            <article className="module-card">
              <p>Run strategy report generation to populate this workspace.</p>
            </article>
          ) : null}
        </div>
      </section>
    )
  }

  if (section === 'go-to-market-plan') {
    return (
      <section className="module-shell">
        <h3>Execution plan workspace</h3>
        <article className="module-card">
          <p className="module-label">Next experiments and milestones</p>
          <ul>
            {(planReport?.nextExperiments ?? []).map((experiment) => (
              <li key={experiment}>{experiment}</li>
            ))}
            {(planReport?.nextExperiments ?? []).length === 0 ? <li>No execution actions yet.</li> : null}
          </ul>
        </article>
      </section>
    )
  }

  if (section === 'campaigns') {
    return (
      <section className="module-shell">
        <h3>Campaign manager</h3>
        <div className="module-grid">
          {(workspace.bundle?.globalActions ?? []).map((action, index) => (
            <article className="module-card" key={`${action}-${index}`}>
              <p className="module-label">Campaign {index + 1}</p>
              <p>{action}</p>
              <p>Status: Planned</p>
            </article>
          ))}
          {(workspace.bundle?.globalActions ?? []).length === 0 ? (
            <article className="module-card">
              <p>No campaigns yet. Generate analysis to create campaign actions.</p>
            </article>
          ) : null}
        </div>
      </section>
    )
  }

  if (section === 'content') {
    const contentDrivers = consumerReport?.executiveSummary.keyFindings ?? []
    return (
      <section className="module-shell">
        <h3>Content studio</h3>
        <article className="module-card">
          <p className="module-label">Content brief queue</p>
          <ul>
            {contentDrivers.length > 0 ? (
              contentDrivers.map((finding) => <li key={finding}>{finding}</li>)
            ) : (
              <li>No briefs yet. Generate consumer insights first.</li>
            )}
          </ul>
        </article>
      </section>
    )
  }

  if (section === 'measurement') {
    return (
      <section className="module-shell">
        <h3>Measurement and optimization</h3>
        <div className="module-grid">
          {keyMetrics.length > 0 ? (
            keyMetrics.map((metric) => (
              <article className="module-card" key={metric.id}>
                <p className="module-label">{metric.label}</p>
                <h4>{metric.value}</h4>
                <p>{metric.change}</p>
              </article>
            ))
          ) : (
            <article className="module-card">
              <p>No metrics available. Run market research report generation first.</p>
            </article>
          )}
        </div>
      </section>
    )
  }

  if (section === 'collaboration') {
    return (
      <section className="module-shell">
        <h3>Collaboration workspace</h3>
        <article className="module-card">
          <p className="module-label">Team notes</p>
          <ul>
            {workspace.collaborationNotes.length > 0 ? (
              workspace.collaborationNotes.map((note) => <li key={note}>{note}</li>)
            ) : (
              <li>No collaboration notes yet.</li>
            )}
          </ul>
        </article>
      </section>
    )
  }

  if (section === 'settings') {
    return (
      <section className="module-shell">
        <h3>Workspace settings</h3>
        <article className="module-card">
          <p className="module-label">Configuration</p>
          <p>
            Active research mode: <strong>{workspace.bundle?.mode ?? 'not-run'}</strong>
          </p>
          <p>
            Workspace created: <strong>{new Date(workspace.createdAt).toLocaleString()}</strong>
          </p>
          <p>
            Last updated: <strong>{new Date(workspace.updatedAt).toLocaleString()}</strong>
          </p>
        </article>
      </section>
    )
  }

  return (
    <section className="module-shell">
      <h3>{workspaceSectionMeta.reports.title}</h3>
      <p>{workspaceSectionMeta.reports.subtitle}</p>
      <p>Use the report tabs below to navigate generated analyst views.</p>
    </section>
  )
}

export const WorkspaceModuleView = ({
  workspace,
  onSelectSection,
  onSelectReport,
}: WorkspaceModuleViewProps) => {
  if (!workspace) {
    return formatSection(null)
  }

  if (workspace.activeSection === 'reports') {
    return (
      <section className="module-shell">
        <h3>{workspaceSectionMeta.reports.title}</h3>
        <p>{workspaceSectionMeta.reports.subtitle}</p>
        <div className="module-report-shortcuts">
          {(workspace.bundle?.reports ?? []).map((report) => (
            <button
              className="module-shortcut-button"
              key={report.id}
              onClick={() => {
                onSelectSection('reports')
                onSelectReport(report.id)
              }}
              type="button"
            >
              {report.title}
            </button>
          ))}
          {(workspace.bundle?.reports ?? []).length === 0 ? (
            <p className="muted">Run deep analysis to generate report templates.</p>
          ) : null}
        </div>
      </section>
    )
  }

  return formatSection(workspace)
}
