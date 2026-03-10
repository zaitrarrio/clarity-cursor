import type {
  AnalysisBundle,
  ChartDatum,
  CitationDetail,
  ConfidenceLevel,
  DeepResearchPayload,
  DetailedReport,
  EvidenceBasis,
  EvidenceRecord,
  MetricCard,
  ReportKind,
  ReportSection,
  ResearchSource,
} from '@/types/clarity-types'

const confidenceToBasis = (confidence: ConfidenceLevel): EvidenceBasis => {
  if (confidence === 'high') {
    return 'source-backed'
  }
  if (confidence === 'medium') {
    return 'mixed'
  }
  return 'estimated'
}

const toMetricValue = (value: number, unit: string): string => {
  if (unit === '%') {
    return `${value.toFixed(1)}%`
  }
  if (unit === '$M') {
    return `$${value.toFixed(1)}M`
  }
  if (unit === 'index') {
    return `${Math.round(value)}`
  }
  return `${value.toFixed(1)} ${unit}`
}

const toChangeLabel = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)}% vs baseline`

const metricCardsFromPayload = (payload: DeepResearchPayload): readonly MetricCard[] =>
  payload.metrics.map((metric) => ({
    id: metric.id,
    label: metric.name,
    value: toMetricValue(metric.value, metric.unit),
    change: toChangeLabel(metric.changePercent),
    target: toMetricValue(metric.target, metric.unit),
    confidence: metric.changePercent > 10 ? 'high' : 'medium',
    basis: metric.sourceIds.length > 1 ? 'source-backed' : 'estimated',
    citationIds: metric.sourceIds,
  }))

const citationDetailsFromSources = (sources: readonly ResearchSource[]): readonly CitationDetail[] =>
  sources.map((source) => ({
    id: source.id,
    sourceId: source.id,
    excerpt: source.snippet,
    whyItMatters: source.relevance,
    relatedInsight: `Evidence from ${source.publisher} supports strategy confidence.`,
  }))

const evidenceRecordsFromPayload = (payload: DeepResearchPayload): readonly EvidenceRecord[] => [
  ...payload.findings.map((finding) => ({
    id: `E-${finding.id}`,
    claim: finding.detail,
    confidence: finding.confidence,
    basis: confidenceToBasis(finding.confidence),
    citationIds: finding.sourceIds,
    assumptionIds: ['A1'],
    implication: 'Use this finding to prioritize segment focus and messaging.',
  })),
  ...payload.risks.map((risk) => ({
    id: `E-${risk.id}`,
    claim: `${risk.risk} Mitigation: ${risk.mitigation}`,
    confidence: risk.likelihood,
    basis: (risk.sourceIds.length > 1 ? 'source-backed' : 'mixed') as EvidenceBasis,
    citationIds: risk.sourceIds,
    assumptionIds: ['A2'],
    implication: 'Use this risk to shape mitigation and execution sequencing.',
  })),
]

const chartDataFromMetrics = (payload: DeepResearchPayload): readonly ChartDatum[] =>
  payload.metrics.map((metric) => ({
    label: metric.name,
    value: metric.value,
    benchmark: metric.target,
  }))

const reportAudience = (kind: ReportKind): readonly string[] => {
  if (kind === 'market-research') {
    return ['Founder', 'Executive', 'Strategy Lead']
  }
  if (kind === 'consumer-insights') {
    return ['Marketing Lead', 'Product Manager', 'Research Analyst']
  }
  if (kind === 'concept-testing') {
    return ['Product Manager', 'Growth Team', 'Research Analyst']
  }
  if (kind === 'go-to-market-strategy') {
    return ['Executive Team', 'Marketing Leadership', 'Product Marketing']
  }
  return ['Growth Operations', 'Campaign Team', 'Leadership']
}

const sectionsForReport = (
  kind: ReportKind,
  payload: DeepResearchPayload,
  evidence: readonly EvidenceRecord[],
): readonly ReportSection[] => {
  const findingRows = payload.findings.map((finding) => [
    finding.id,
    finding.title,
    finding.confidence,
    finding.sourceIds.join(', '),
  ])

  if (kind === 'market-research') {
    return [
      {
        id: 'market-opportunity',
        title: 'Market Opportunity Scorecard',
        summary: 'Executive summary of market attractiveness, growth, and risk profile.',
        analysis:
          'The market demonstrates resilient premium demand with identifiable whitespace against generic incumbent messaging. Growth indicators are positive, while risk is manageable with disciplined evidence-led execution.',
        action:
          'Prioritize high-confidence segments first, then scale investment after validating conversion economics in the first two launch cycles.',
        charts: [
          {
            id: 'market-scorecard',
            title: 'Opportunity scorecard',
            visualization: 'bar',
            questionAnswered: 'What is happening?',
            data: chartDataFromMetrics(payload),
            citationIds: [1, 2, 3],
          },
          {
            id: 'growth-trend',
            title: 'Growth trend and target trajectory',
            visualization: 'line',
            questionAnswered: 'Where should we focus?',
            data: chartDataFromMetrics(payload),
            citationIds: [1, 3, 5],
          },
        ],
        table: {
          columns: ['Finding', 'Insight', 'Confidence', 'Source refs'],
          rows: findingRows,
        },
        citationIds: [1, 2, 3, 5],
        assumptionIds: ['A1'],
        evidenceIds: evidence.slice(0, 2).map((entry) => entry.id),
      },
      {
        id: 'competitive-landscape',
        title: 'Competitive Landscape and Risks',
        summary: 'Competitive positioning and risk register with evidence links.',
        analysis:
          'Incumbents retain structural advantages, but their broad positioning creates room for a precise, proof-backed narrative. The top execution risk remains pricing and message parity response.',
        action:
          'Introduce differentiation guardrails in every campaign brief and monitor competitor reaction weekly.',
        charts: [
          {
            id: 'risk-heatmap',
            title: 'Risk heat map',
            visualization: 'matrix',
            questionAnswered: 'Why is it happening?',
            data: payload.risks.map((risk, index) => ({
              label: `${risk.id} ${risk.risk.slice(0, 36)}...`,
              value: 100 - index * 15,
              benchmark: risk.likelihood === 'high' ? 90 : 70,
            })),
            citationIds: payload.risks.flatMap((risk) => risk.sourceIds),
          },
        ],
        citationIds: payload.risks.flatMap((risk) => risk.sourceIds),
        assumptionIds: ['A2'],
        evidenceIds: evidence.slice(1, 3).map((entry) => entry.id),
      },
    ]
  }

  if (kind === 'consumer-insights') {
    return [
      {
        id: 'segmentation-and-personas',
        title: 'Segmentation and Persona Intelligence',
        summary: 'Prioritized segments, pain points, and trigger mapping.',
        analysis:
          `${payload.audience} in ${payload.geography} show clear differences in trust drivers, willingness to pay, and channel responsiveness. Segment-specific narratives are required to maintain conversion quality.`,
        action: 'Launch top two persona journeys and attach experiment tags to every touchpoint.',
        charts: [
          {
            id: 'segment-distribution',
            title: 'Segment distribution and urgency',
            visualization: 'bar',
            questionAnswered: 'Where should we focus?',
            data: [
              { label: 'Status Seeker', value: 38, benchmark: 33 },
              { label: 'Value Maximizer', value: 34, benchmark: 30 },
              { label: 'Purpose-Driven Buyer', value: 28, benchmark: 24 },
            ],
            citationIds: [2, 4, 6],
          },
        ],
        citationIds: [2, 4, 6],
        assumptionIds: ['A3'],
        evidenceIds: evidence.slice(0, 2).map((entry) => entry.id),
      },
      {
        id: 'pain-and-wtp',
        title: 'Pain Point and Willingness-to-Pay Analysis',
        summary: 'Severity-weighted pain points and pricing signal diagnostics.',
        analysis:
          'Trust friction and price uncertainty remain key conversion blockers. Buyers reward transparent value framing when proof points are immediate.',
        action: 'Deploy proof modules and bundle framing tests in paid and lifecycle paths.',
        charts: [
          {
            id: 'pain-priority',
            title: 'Pain point priority chart',
            visualization: 'bar',
            questionAnswered: 'Why is it happening?',
            data: [
              { label: 'Trust uncertainty', value: 84, benchmark: 65 },
              { label: 'Price opacity', value: 77, benchmark: 60 },
              { label: 'Differentiation clarity', value: 71, benchmark: 59 },
            ],
            citationIds: [2, 4, 6],
          },
        ],
        citationIds: [2, 6],
        assumptionIds: ['A1', 'A3'],
        evidenceIds: evidence.slice(1, 3).map((entry) => entry.id),
      },
    ]
  }

  if (kind === 'concept-testing') {
    return [
      {
        id: 'preference-ranking',
        title: 'Concept Preference and Ranking',
        summary: 'Concept-level ranking with persona response and confidence.',
        analysis:
          'Concept testing indicates proof-rich narratives outperform abstract claims. Persona-level differences are meaningful and must guide message variants.',
        action: 'Advance top concept, refine second, and retire low-clarity variants.',
        charts: [
          {
            id: 'concept-ranking',
            title: 'Preference ranking bars',
            visualization: 'bar',
            questionAnswered: 'What should we do next?',
            data: [
              { label: 'Proof-led concept', value: 86, benchmark: 75 },
              { label: 'Premium confidence concept', value: 81, benchmark: 72 },
              { label: 'Segment pod concept', value: 74, benchmark: 68 },
            ],
            citationIds: [4, 5, 6],
          },
        ],
        citationIds: [4, 5, 6],
        assumptionIds: ['A3'],
        evidenceIds: evidence.slice(0, 2).map((entry) => entry.id),
      },
      {
        id: 'adoption-drivers',
        title: 'Adoption Likelihood and Driver Analysis',
        summary: 'Adoption probability drivers and objection clusters.',
        analysis:
          'Higher intent follows when distinct proof points reduce perceived risk. Objections cluster around value proof and complexity concerns.',
        action: 'Ship objection-handling assets with channel-persona variants.',
        charts: [
          {
            id: 'adoption-line',
            title: 'Adoption likelihood trend',
            visualization: 'line',
            questionAnswered: 'What is happening?',
            data: [
              { label: 'Week 1', value: 49, benchmark: 45 },
              { label: 'Week 2', value: 57, benchmark: 47 },
              { label: 'Week 3', value: 63, benchmark: 52 },
              { label: 'Week 4', value: 68, benchmark: 55 },
            ],
            citationIds: [4, 5],
          },
        ],
        citationIds: [4, 5],
        assumptionIds: ['A2', 'A3'],
        evidenceIds: evidence.slice(2, 4).map((entry) => entry.id),
      },
    ]
  }

  if (kind === 'go-to-market-strategy') {
    return [
      {
        id: 'segment-priority',
        title: 'Target Segment and Positioning Architecture',
        summary: 'Strategic segment choices with differentiation rationale.',
        analysis:
          'Winning strategy requires precise segment focus plus proof-first differentiation. Broad messaging reduces trust and weakens conversion quality.',
        action: 'Lock primary and secondary segment definitions and enforce channel-role guardrails.',
        charts: [
          {
            id: 'segment-matrix',
            title: 'Segment opportunity matrix',
            visualization: 'matrix',
            questionAnswered: 'Where should we focus?',
            data: [
              { label: 'Primary segment', value: 88, benchmark: 70 },
              { label: 'Secondary segment', value: 74, benchmark: 66 },
              { label: 'Tertiary segment', value: 59, benchmark: 55 },
            ],
            citationIds: [1, 2, 4],
          },
        ],
        citationIds: [1, 2, 4],
        assumptionIds: ['A1', 'A3'],
        evidenceIds: evidence.slice(0, 2).map((entry) => entry.id),
      },
      {
        id: 'messaging-and-channel',
        title: 'Messaging, Channel, and Pricing Strategy',
        summary: 'Integrated message tree and channel sequencing with pricing implications.',
        analysis:
          'Channel effectiveness and pricing acceptance depend on trust artifacts and segment-specific framing. Coordinated message architecture increases strategic coherence across campaigns.',
        action:
          'Activate search and creator channels first, then scale lifecycle and partnership motion based on conversion quality.',
        charts: [
          {
            id: 'channel-priority',
            title: 'Channel prioritization chart',
            visualization: 'bar',
            questionAnswered: 'What should we do next?',
            data: [
              { label: 'Search intent capture', value: 82, benchmark: 67 },
              { label: 'Creator proof loops', value: 78, benchmark: 65 },
              { label: 'Lifecycle email', value: 73, benchmark: 62 },
              { label: 'Partnership co-marketing', value: 61, benchmark: 58 },
            ],
            citationIds: [2, 5, 6],
          },
        ],
        citationIds: [2, 5, 6],
        assumptionIds: ['A2'],
        evidenceIds: evidence.slice(1, 3).map((entry) => entry.id),
      },
    ]
  }

  return [
    {
      id: 'execution-roadmap',
      title: 'Go-To-Market Plan and Workstream Roadmap',
      summary: 'Execution sequencing, owners, and milestone confidence.',
      analysis:
        'Execution success depends on synchronized workstreams across research, creative, channel, and measurement. Delays in evidence updates reduce strategy quality and budget efficiency.',
      action: 'Adopt weekly decision reviews linking evidence updates directly to plan changes.',
      charts: [
        {
          id: 'workstream-progress',
          title: 'Workstream confidence trend',
          visualization: 'line',
          questionAnswered: 'What is happening?',
          data: [
            { label: 'Discovery', value: 81, benchmark: 72 },
            { label: 'Validation', value: 76, benchmark: 70 },
            { label: 'Campaign launch', value: 68, benchmark: 66 },
            { label: 'Optimization', value: 64, benchmark: 63 },
          ],
          citationIds: [4, 5, 6],
        },
      ],
      table: {
        columns: ['Workstream', 'Owner', 'Milestone', 'Evidence status'],
        rows: [
          ['Research and sources', 'Research Lead', 'Complete source inventory', 'Source-backed'],
          ['Concept validation', 'Product Marketing', 'Confirm winning concept', 'Mixed'],
          ['Channel activation', 'Growth Lead', 'Launch top 2 channels', 'Source-backed'],
          ['Performance loop', 'Analytics Lead', 'Publish weekly insight pack', 'Estimated'],
        ],
      },
      citationIds: [4, 5, 6],
      assumptionIds: ['A2', 'A3'],
      evidenceIds: evidence.slice(0, 3).map((entry) => entry.id),
    },
    {
      id: 'measurement-loop',
      title: 'Measurement, Insight, and Optimization Loop',
      summary: 'Closed-loop view from strategy decisions to execution outcomes.',
      analysis:
        'The system now supports summary to evidence drill-down and allows teams to trace every decision to supporting sources, assumptions, or simulation signals.',
      action:
        'Enforce evidence coverage threshold of at least 90% for strategic claims before scaling spend.',
      charts: [
        {
          id: 'evidence-coverage',
          title: 'Evidence coverage by report section',
          visualization: 'bar',
          questionAnswered: 'Why is it happening?',
          data: [
            { label: 'Executive summary', value: 89, benchmark: 85 },
            { label: 'Core analysis', value: 84, benchmark: 80 },
            { label: 'Recommendations', value: 92, benchmark: 88 },
            { label: 'Execution plan', value: 81, benchmark: 82 },
          ],
          citationIds: [1, 2, 4, 5, 6],
        },
      ],
      citationIds: [1, 2, 4, 5, 6],
      assumptionIds: ['A1', 'A2', 'A3'],
      evidenceIds: evidence.slice(0, 4).map((entry) => entry.id),
    },
  ]
}

const reportTitle = (kind: ReportKind): string => {
  if (kind === 'market-research') {
    return 'Market Research Report'
  }
  if (kind === 'consumer-insights') {
    return 'Consumer Insights Report'
  }
  if (kind === 'concept-testing') {
    return 'Concept Testing Report'
  }
  if (kind === 'go-to-market-strategy') {
    return 'Go-To-Market Strategy Report'
  }
  return 'Go-To-Market Plan Report'
}

const reportExecutiveSummary = (payload: DeepResearchPayload) => ({
  verdict: `${payload.market} opportunity is attractive with disciplined evidence-led execution.`,
  summary:
    `This report translates ${payload.objective} into strategic decisions linked to sources, assumptions, and actionable workstreams.`,
  keyFindings: payload.findings.map((finding) => `${finding.title} [${finding.sourceIds.join(', ')}]`),
  majorRisks: payload.risks.map((risk) => `${risk.risk} (${risk.likelihood})`),
  recommendation:
    payload.recommendations[0]?.action ??
    'Prioritize high-confidence experiments before scaling investment.',
})

const buildDetailedReport = (
  kind: ReportKind,
  payload: DeepResearchPayload,
  generatedAt: string,
): DetailedReport => {
  const evidence = evidenceRecordsFromPayload(payload)
  const sources = payload.sources
  const citations = citationDetailsFromSources(sources)
  return {
    id: kind,
    kind,
    title: reportTitle(kind),
    audience: reportAudience(kind),
    generatedAt,
    version: 'v1.0',
    confidence: 'medium',
    executiveSummary: reportExecutiveSummary(payload),
    metrics: metricCardsFromPayload(payload),
    sections: sectionsForReport(kind, payload, evidence),
    evidence,
    assumptions: payload.assumptions,
    citations,
    sources,
    methodologyNotes: [
      'Structured as summary → explanation → evidence → action.',
      'Citations map each claim to traceable sources.',
      'Assumptions are marked separately from source citations.',
      'Confidence and basis indicators surface methodological strength.',
    ],
    nextExperiments: payload.recommendations.map((recommendation) => recommendation.action),
  }
}

export const buildAnalysisBundle = (
  prompt: string,
  payload: DeepResearchPayload,
  mode: 'perplexity' | 'fallback',
): AnalysisBundle => {
  const generatedAt = new Date().toISOString()
  const reportKinds: readonly ReportKind[] = [
    'market-research',
    'consumer-insights',
    'concept-testing',
    'go-to-market-strategy',
    'go-to-market-plan',
  ]

  return {
    prompt,
    generatedAt,
    mode,
    reports: reportKinds.map((kind) => buildDetailedReport(kind, payload, generatedAt)),
    topInsights: payload.findings.map((finding) => finding.title),
    globalActions: payload.recommendations.map((recommendation) => recommendation.action),
  }
}
