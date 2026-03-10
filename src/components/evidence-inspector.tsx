import type { AnalysisBundle, DetailedReport, ResearchSource } from '@/types/clarity-types'

interface EvidenceInspectorProps {
  readonly bundle: AnalysisBundle | null
  readonly report: DetailedReport | null
  readonly selectedCitationId: number | null
  readonly onCloseCitation: () => void
}

const groupSources = (sources: readonly ResearchSource[]): Record<string, readonly ResearchSource[]> =>
  sources.reduce<Record<string, readonly ResearchSource[]>>((accumulator, source) => {
    const current = accumulator[source.sourceType] ?? []
    return {
      ...accumulator,
      [source.sourceType]: [...current, source],
    }
  }, {})

export const EvidenceInspector = ({
  bundle,
  report,
  selectedCitationId,
  onCloseCitation,
}: EvidenceInspectorProps) => {
  const selectedCitation = report?.citations.find((citation) => citation.id === selectedCitationId) ?? null
  const selectedSource =
    report?.sources.find((source) => source.id === selectedCitation?.sourceId) ?? null
  const groupedSources = report ? groupSources(report.sources) : {}

  return (
    <aside className="inspector">
      <section className="inspector-card">
        <p className="section-title">Research mode</p>
        <p className="inspector-value">{bundle?.mode ?? 'not-run'}</p>
        <p className="muted">Perplexity mode uses API research; fallback mode uses local synthesis.</p>
      </section>

      <section className="inspector-card">
        <p className="section-title">Citation drawer</p>
        {selectedCitation && selectedSource ? (
          <div className="stack-sm">
            <p className="citation-title">
              Citation {selectedCitation.id} · {selectedSource.publisher}
            </p>
            <p>{selectedCitation.excerpt}</p>
            <p>
              <strong>Why relevant:</strong> {selectedCitation.whyItMatters}
            </p>
            <p>
              <strong>Related insight:</strong> {selectedCitation.relatedInsight}
            </p>
            <a href={selectedSource.url} rel="noreferrer" target="_blank">
              Open source
            </a>
            <button className="ghost-button" onClick={onCloseCitation} type="button">
              Close citation
            </button>
          </div>
        ) : (
          <p className="muted">Click any citation marker to open source metadata and excerpt.</p>
        )}
      </section>

      <section className="inspector-card">
        <p className="section-title">References</p>
        <div className="stack-sm">
          {Object.entries(groupedSources).map(([groupName, sources]) => (
            <article className="reference-group" key={groupName}>
              <h4>{groupName}</h4>
              <ul>
                {sources.map((source) => (
                  <li key={source.id}>
                    [{source.id}] {source.title}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {!report ? <p className="muted">No references yet.</p> : null}
        </div>
      </section>

      <section className="inspector-card">
        <p className="section-title">Assumptions</p>
        <div className="stack-sm">
          {report?.assumptions.map((assumption) => (
            <article className="assumption-card" key={assumption.id}>
              <p>
                <strong>{assumption.id}</strong> · {assumption.sensitivity}
              </p>
              <p>{assumption.statement}</p>
            </article>
          )) ?? <p className="muted">Run analysis to view assumptions.</p>}
        </div>
      </section>
    </aside>
  )
}
