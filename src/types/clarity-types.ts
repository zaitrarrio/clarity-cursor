export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type EvidenceBasis = 'source-backed' | 'estimated' | 'simulated' | 'mixed'

export type ReportKind =
  | 'market-research'
  | 'consumer-insights'
  | 'concept-testing'
  | 'go-to-market-strategy'
  | 'go-to-market-plan'

export type WorkspaceSectionKey =
  | 'dashboard'
  | 'projects'
  | 'research'
  | 'personas'
  | 'concepts'
  | 'go-to-market-strategy'
  | 'go-to-market-plan'
  | 'campaigns'
  | 'content'
  | 'measurement'
  | 'reports'
  | 'collaboration'
  | 'settings'

export interface ResearchSource {
  readonly id: number
  readonly title: string
  readonly url: string
  readonly publisher: string
  readonly publishedAt: string
  readonly sourceType: 'external' | 'internal' | 'survey' | 'experiment'
  readonly snippet: string
  readonly relevance: string
}

export interface CitationDetail {
  readonly id: number
  readonly sourceId: number
  readonly excerpt: string
  readonly whyItMatters: string
  readonly relatedInsight: string
}

export interface ReportAssumption {
  readonly id: string
  readonly statement: string
  readonly impact: string
  readonly sensitivity: ConfidenceLevel
  readonly lastReviewed: string
}

export interface EvidenceRecord {
  readonly id: string
  readonly claim: string
  readonly confidence: ConfidenceLevel
  readonly basis: EvidenceBasis
  readonly citationIds: readonly number[]
  readonly assumptionIds: readonly string[]
  readonly implication: string
}

export interface MetricCard {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly change: string
  readonly target: string
  readonly confidence: ConfidenceLevel
  readonly basis: EvidenceBasis
  readonly citationIds: readonly number[]
}

export interface ChartDatum {
  readonly label: string
  readonly value: number
  readonly benchmark?: number
}

export interface ChartBlock {
  readonly id: string
  readonly title: string
  readonly visualization: 'bar' | 'line' | 'matrix'
  readonly questionAnswered: string
  readonly data: readonly ChartDatum[]
  readonly citationIds: readonly number[]
}

export interface DataTable {
  readonly columns: readonly string[]
  readonly rows: ReadonlyArray<readonly string[]>
}

export interface ReportSection {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly analysis: string
  readonly action: string
  readonly charts: readonly ChartBlock[]
  readonly table?: DataTable
  readonly citationIds: readonly number[]
  readonly assumptionIds: readonly string[]
  readonly evidenceIds: readonly string[]
}

export interface ExecutiveSummary {
  readonly verdict: string
  readonly summary: string
  readonly keyFindings: readonly string[]
  readonly majorRisks: readonly string[]
  readonly recommendation: string
}

export interface DetailedReport {
  readonly id: string
  readonly kind: ReportKind
  readonly title: string
  readonly audience: readonly string[]
  readonly generatedAt: string
  readonly version: string
  readonly confidence: ConfidenceLevel
  readonly executiveSummary: ExecutiveSummary
  readonly metrics: readonly MetricCard[]
  readonly sections: readonly ReportSection[]
  readonly evidence: readonly EvidenceRecord[]
  readonly assumptions: readonly ReportAssumption[]
  readonly citations: readonly CitationDetail[]
  readonly sources: readonly ResearchSource[]
  readonly methodologyNotes: readonly string[]
  readonly nextExperiments: readonly string[]
}

export interface DeepResearchFinding {
  readonly id: string
  readonly title: string
  readonly detail: string
  readonly confidence: ConfidenceLevel
  readonly sourceIds: readonly number[]
}

export interface DeepResearchRisk {
  readonly id: string
  readonly risk: string
  readonly likelihood: ConfidenceLevel
  readonly impact: string
  readonly mitigation: string
  readonly sourceIds: readonly number[]
}

export interface DeepResearchRecommendation {
  readonly id: string
  readonly action: string
  readonly rationale: string
  readonly expectedImpact: string
  readonly sourceIds: readonly number[]
}

export interface DeepResearchMetric {
  readonly id: string
  readonly name: string
  readonly value: number
  readonly unit: string
  readonly changePercent: number
  readonly target: number
  readonly sourceIds: readonly number[]
}

export interface DeepResearchPayload {
  readonly objective: string
  readonly market: string
  readonly audience: string
  readonly geography: string
  readonly findings: readonly DeepResearchFinding[]
  readonly risks: readonly DeepResearchRisk[]
  readonly recommendations: readonly DeepResearchRecommendation[]
  readonly metrics: readonly DeepResearchMetric[]
  readonly assumptions: readonly ReportAssumption[]
  readonly sources: readonly ResearchSource[]
}

export interface AnalysisBundle {
  readonly prompt: string
  readonly generatedAt: string
  readonly mode: 'perplexity' | 'fallback'
  readonly reports: readonly DetailedReport[]
  readonly topInsights: readonly string[]
  readonly globalActions: readonly string[]
}

export interface WorkspaceRecord {
  readonly id: string
  readonly name: string
  readonly prompt: string
  readonly clickCount: number
  readonly bundle: AnalysisBundle | null
  readonly recentPrompts: readonly string[]
  readonly activeReportId: string | null
  readonly selectedCitationId: number | null
  readonly errorMessage: string | null
  readonly activeSection: WorkspaceSectionKey
  readonly collaborationNotes: readonly string[]
  readonly createdAt: string
  readonly updatedAt: string
}
