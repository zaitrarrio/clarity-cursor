export type ClarityModuleKey =
  | 'discovery'
  | 'research'
  | 'validation'
  | 'strategy'
  | 'execution'

export interface MarketHypothesis {
  readonly title: string
  readonly observation: string
  readonly confidence: 'high' | 'medium' | 'low'
}

export interface CompetitorSignal {
  readonly name: string
  readonly edge: string
  readonly gap: string
}

export interface AudiencePersona {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly goal: string
  readonly painPoints: readonly string[]
  readonly buyingTriggers: readonly string[]
  readonly preferredChannels: readonly string[]
}

export interface ConceptBrief {
  readonly id: string
  readonly label: string
  readonly promise: string
  readonly risk: string
  readonly signalScore: number
}

export interface ValidationExperiment {
  readonly id: string
  readonly test: string
  readonly targetMetric: string
  readonly successThreshold: string
  readonly owner: string
}

export interface StrategyArtifact {
  readonly northStar: string
  readonly positioning: string
  readonly messagePillars: readonly string[]
  readonly channelPlan: readonly string[]
  readonly pricingMove: string
}

export interface ExecutionTask {
  readonly id: string
  readonly workstream: string
  readonly task: string
  readonly dueWindow: string
  readonly expectedOutcome: string
}

export interface InsightRecommendation {
  readonly id: string
  readonly title: string
  readonly rationale: string
  readonly nextAction: string
}

export interface ClarityBrief {
  readonly rawPrompt: string
  readonly objective: string
  readonly offering: string
  readonly audience: string
  readonly region: string
}

export interface ClarityPipelineResult {
  readonly brief: ClarityBrief
  readonly hypotheses: readonly MarketHypothesis[]
  readonly competitorSignals: readonly CompetitorSignal[]
  readonly personas: readonly AudiencePersona[]
  readonly concepts: readonly ConceptBrief[]
  readonly experiments: readonly ValidationExperiment[]
  readonly strategy: StrategyArtifact
  readonly executionPlan: readonly ExecutionTask[]
  readonly recommendations: readonly InsightRecommendation[]
  readonly generatedAt: string
}
