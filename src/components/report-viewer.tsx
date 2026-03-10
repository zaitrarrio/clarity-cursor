import type {
  ChartBlock,
  ChartDatum,
  DetailedReport,
  EvidenceRecord,
  ReportSection,
} from '@/types/clarity-types'

interface ReportViewerProps {
  readonly report: DetailedReport | null
  readonly onOpenCitation: (citationId: number) => void
}

const CitationMarkers = ({
  citationIds,
  onOpenCitation,
}: {
  readonly citationIds: readonly number[]
  readonly onOpenCitation: (citationId: number) => void
}) => (
  <span className="citation-group">
    {citationIds.map((citationId) => (
      <button
        className="citation-marker"
        key={citationId}
        onClick={() => onOpenCitation(citationId)}
        type="button"
      >
        {citationId}
      </button>
    ))}
  </span>
)

const valueScale = (value: number, maxValue: number): string => {
  const bounded = Math.max(0, Math.min(100, (value / maxValue) * 100))
  return `${bounded}%`
}

const BarChartBlock = ({ title, data }: { readonly title: string; readonly data: readonly ChartDatum[] }) => {
  const maxValue = Math.max(...data.map((entry) => Math.max(entry.value, entry.benchmark ?? 0)), 1)
  return (
    <article className="chart-card">
      <h4>{title}</h4>
      <div className="stack-sm">
        {data.map((entry) => (
          <div className="bar-row" key={entry.label}>
            <div className="bar-label">
              <span>{entry.label}</span>
              <span>{entry.value.toFixed(1)}</span>
            </div>
            <div className="bar-track">
              <span className="bar-fill" style={{ width: valueScale(entry.value, maxValue) }} />
              {entry.benchmark ? (
                <span className="bar-benchmark" style={{ left: valueScale(entry.benchmark, maxValue) }} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

const LineChartBlock = ({ title, data }: { readonly title: string; readonly data: readonly ChartDatum[] }) => {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1)
  const points = data
    .map((entry, index) => {
      const x = (index / Math.max(1, data.length - 1)) * 100
      const y = 100 - (entry.value / maxValue) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <article className="chart-card">
      <h4>{title}</h4>
      <svg className="line-chart" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline fill="none" points={points} stroke="url(#line-gradient)" strokeWidth="3" />
        <defs>
          <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="line-labels">
        {data.map((entry) => (
          <span key={entry.label}>
            {entry.label}: {entry.value.toFixed(1)}
          </span>
        ))}
      </div>
    </article>
  )
}

const MatrixChartBlock = ({ title, data }: { readonly title: string; readonly data: readonly ChartDatum[] }) => (
  <article className="chart-card">
    <h4>{title}</h4>
    <div className="matrix-grid">
      {data.map((entry) => (
        <div className="matrix-cell" key={entry.label}>
          <p>{entry.label}</p>
          <strong>{entry.value.toFixed(0)}</strong>
          <small>benchmark {entry.benchmark?.toFixed(0) ?? 'n/a'}</small>
        </div>
      ))}
    </div>
  </article>
)

const ChartRenderer = ({ chart }: { readonly chart: ChartBlock }) => {
  if (chart.visualization === 'bar') {
    return <BarChartBlock data={chart.data} title={chart.title} />
  }
  if (chart.visualization === 'line') {
    return <LineChartBlock data={chart.data} title={chart.title} />
  }
  return <MatrixChartBlock data={chart.data} title={chart.title} />
}

const SectionCard = ({
  section,
  onOpenCitation,
}: {
  readonly section: ReportSection
  readonly onOpenCitation: (citationId: number) => void
}) => (
  <section className="report-section-card">
    <header className="section-header">
      <h3>{section.title}</h3>
      <CitationMarkers citationIds={section.citationIds} onOpenCitation={onOpenCitation} />
    </header>
    <p>
      <strong>Summary:</strong> {section.summary}
    </p>
    <p>
      <strong>Analysis:</strong> {section.analysis}
    </p>
    <p>
      <strong>Action:</strong> {section.action}
    </p>

    <div className="chart-grid">
      {section.charts.map((chart) => (
        <div className="chart-shell" key={chart.id}>
          <div className="chart-meta">
            <span>{chart.questionAnswered}</span>
            <CitationMarkers citationIds={chart.citationIds} onOpenCitation={onOpenCitation} />
          </div>
          <ChartRenderer chart={chart} />
        </div>
      ))}
    </div>

    {section.table ? (
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              {section.table.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, index) => (
              <tr key={`${section.id}-row-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${section.id}-cell-${index}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null}
  </section>
)

const EvidenceTable = ({
  evidence,
  onOpenCitation,
}: {
  readonly evidence: readonly EvidenceRecord[]
  readonly onOpenCitation: (citationId: number) => void
}) => (
  <section className="evidence-shell">
    <h3>Supporting evidence</h3>
    <div className="stack-sm">
      {evidence.map((entry) => (
        <article className="evidence-card" key={entry.id}>
          <p className="evidence-claim">{entry.claim}</p>
          <p>
            <strong>Basis:</strong> {entry.basis} · <strong>Confidence:</strong> {entry.confidence}
          </p>
          <p>
            <strong>Implication:</strong> {entry.implication}
          </p>
          <CitationMarkers citationIds={entry.citationIds} onOpenCitation={onOpenCitation} />
        </article>
      ))}
    </div>
  </section>
)

export const ReportViewer = ({ report, onOpenCitation }: ReportViewerProps) => {
  if (!report) {
    return (
      <section className="empty-report-shell">
        <h2>No report yet.</h2>
        <p>Run deep analysis to generate full report structures, visual diagnostics, evidence, and references.</p>
      </section>
    )
  }

  return (
    <section className="report-viewer">
      <header className="report-header">
        <div>
          <p className="eyebrow">{report.title}</p>
          <h2>{report.executiveSummary.verdict}</h2>
          <p>{report.executiveSummary.summary}</p>
        </div>
        <div className="stack-sm">
          <span className="chip">Version {report.version}</span>
          <span className="chip">Generated {new Date(report.generatedAt).toLocaleString()}</span>
        </div>
      </header>

      <section className="metric-grid">
        {report.metrics.map((metric) => (
          <article className="metric-card" key={metric.id}>
            <p className="metric-label">{metric.label}</p>
            <h3>{metric.value}</h3>
            <p>{metric.change}</p>
            <p>Target {metric.target}</p>
            <p>
              {metric.basis} · {metric.confidence}
            </p>
            <CitationMarkers citationIds={metric.citationIds} onOpenCitation={onOpenCitation} />
          </article>
        ))}
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <h3>Key findings</h3>
          <ul>
            {report.executiveSummary.keyFindings.map((finding) => (
              <li key={finding}>{finding}</li>
            ))}
          </ul>
        </article>
        <article className="summary-card">
          <h3>Major risks</h3>
          <ul>
            {report.executiveSummary.majorRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </article>
        <article className="summary-card">
          <h3>Recommendation</h3>
          <p>{report.executiveSummary.recommendation}</p>
        </article>
      </section>

      <div className="stack-md">
        {report.sections.map((section) => (
          <SectionCard key={section.id} onOpenCitation={onOpenCitation} section={section} />
        ))}
      </div>

      <EvidenceTable evidence={report.evidence} onOpenCitation={onOpenCitation} />
    </section>
  )
}
