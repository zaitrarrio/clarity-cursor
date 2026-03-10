import type {
  DeepResearchPayload,
  ReportAssumption,
  ResearchSource,
} from '@/types/clarity-types'

const toTitleCase = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token[0]?.toUpperCase() + token.slice(1))
    .join(' ')

const parsePrompt = (prompt: string): { objective: string; market: string; audience: string; geography: string } => {
  const normalized = prompt.trim().replace(/\s+/g, ' ')
  const lowercase = normalized.toLowerCase()
  const objectiveMatch = lowercase.match(/^(i want to|we want to|goal is to)\s*(.+)$/i)
  const coreObjective = objectiveMatch?.[2] ?? lowercase
  const marketMatch = coreObjective.match(/(sell|launch|grow|expand|enter)\s+(.+?)\s+(to|for)\s+/i)
  const audienceMatch = coreObjective.match(/\s(to|for)\s+(.+?)\s+in\s+/i)
  const geographyMatch = coreObjective.match(/\sin\s+(.+)$/i)

  return {
    objective: normalized,
    market: toTitleCase(marketMatch?.[2] ?? 'strategic offer'),
    audience: toTitleCase(audienceMatch?.[2] ?? 'high-intent buyers'),
    geography: toTitleCase(geographyMatch?.[1] ?? 'priority markets'),
  }
}

const defaultSources = (market: string, geography: string): readonly ResearchSource[] => [
  {
    id: 1,
    title: `${market} demand outlook in ${geography}`,
    url: 'https://www.mckinsey.com',
    publisher: 'McKinsey & Company',
    publishedAt: '2025-11-01',
    sourceType: 'external',
    snippet: 'Category demand in premium segments continues to outpace mass market alternatives.',
    relevance: 'Supports demand attractiveness and market growth assumptions.',
  },
  {
    id: 2,
    title: 'Digital commerce and buyer behavior benchmark',
    url: 'https://www.gartner.com',
    publisher: 'Gartner',
    publishedAt: '2025-08-19',
    sourceType: 'external',
    snippet: 'Trust indicators and transparent value communication strongly influence conversion intent.',
    relevance: 'Supports messaging and channel strategy decisions.',
  },
  {
    id: 3,
    title: 'Category competitor benchmarking dataset',
    url: 'https://www.statista.com',
    publisher: 'Statista',
    publishedAt: '2025-06-15',
    sourceType: 'external',
    snippet: 'Top incumbents sustain scale but leave room for differentiated premium narratives.',
    relevance: 'Supports competitive landscape and positioning recommendations.',
  },
  {
    id: 4,
    title: 'Synthetic persona simulation baseline',
    url: 'internal://persona-simulations/baseline-v3',
    publisher: 'Clarity Simulation Engine',
    publishedAt: '2026-03-10',
    sourceType: 'experiment',
    snippet: 'Persona clusters show strongest response when proof points are paired with premium experience cues.',
    relevance: 'Supports segment prioritization and messaging experiments.',
  },
  {
    id: 5,
    title: 'Performance benchmark by acquisition channel',
    url: 'internal://performance/channel-benchmarks-q4',
    publisher: 'Clarity Analytics',
    publishedAt: '2026-02-27',
    sourceType: 'internal',
    snippet: 'Search and creator-led channels deliver best qualified conversion efficiency in premium categories.',
    relevance: 'Supports channel investment and launch sequence planning.',
  },
  {
    id: 6,
    title: 'Pricing sensitivity pulse study',
    url: 'internal://surveys/pricing-sensitivity-pulse',
    publisher: 'Clarity Research',
    publishedAt: '2026-01-22',
    sourceType: 'survey',
    snippet: 'Mid-tier premium bundles show strongest willingness-to-pay without increasing objection rates.',
    relevance: 'Supports pricing architecture and offer design recommendations.',
  },
]

const defaultAssumptions = (): readonly ReportAssumption[] => [
  {
    id: 'A1',
    statement: 'Demand growth remains stable over the next 12 months without significant macro disruption.',
    impact: 'Changes market attractiveness and launch sequencing if false.',
    sensitivity: 'medium',
    lastReviewed: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'A2',
    statement: 'Top two channels can be activated with creative and budget resources in the first 30 days.',
    impact: 'Affects execution timeline and cost efficiency assumptions.',
    sensitivity: 'high',
    lastReviewed: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'A3',
    statement: 'Synthetic persona calibration remains directionally aligned with live user behavior.',
    impact: 'Impacts confidence in concept testing and message prioritization.',
    sensitivity: 'medium',
    lastReviewed: new Date().toISOString().slice(0, 10),
  },
]

export const buildFallbackResearch = (prompt: string): DeepResearchPayload => {
  const parsed = parsePrompt(prompt)
  const sources = defaultSources(parsed.market, parsed.geography)
  const assumptions = defaultAssumptions()

  return {
    objective: parsed.objective,
    market: parsed.market,
    audience: parsed.audience,
    geography: parsed.geography,
    findings: [
      {
        id: 'F1',
        title: 'Premium demand remains resilient in target buyers',
        detail: `${parsed.audience} in ${parsed.geography} continue to reward trust-rich premium positioning with higher purchase intent.`,
        confidence: 'high',
        sourceIds: [1, 4],
      },
      {
        id: 'F2',
        title: 'Competitor messaging remains broad and weakly differentiated',
        detail: `Most category players emphasize generic quality claims, leaving room for a sharper narrative around ${parsed.market}.`,
        confidence: 'medium',
        sourceIds: [2, 3],
      },
      {
        id: 'F3',
        title: 'Proof-led channels deliver strongest early conversion quality',
        detail: 'Search and creator-assisted journeys show the fastest path from awareness to qualified action.',
        confidence: 'medium',
        sourceIds: [2, 5],
      },
    ],
    risks: [
      {
        id: 'R1',
        risk: 'Competitive response compresses differentiation narrative during launch.',
        likelihood: 'medium',
        impact: 'Can reduce conversion lift from messaging tests.',
        mitigation: 'Ship evidence-heavy proof points and update creative weekly based on performance.',
        sourceIds: [2, 3],
      },
      {
        id: 'R2',
        risk: 'Pricing thresholds create friction for value-maximizing buyers.',
        likelihood: 'medium',
        impact: 'Can lower adoption for secondary segments.',
        mitigation: 'Introduce confidence bundle and value framing tests in week two.',
        sourceIds: [6],
      },
    ],
    recommendations: [
      {
        id: 'REC1',
        action: 'Launch with a proof-first message architecture.',
        rationale: 'High-confidence evidence indicates trust signals materially impact intent and conversion.',
        expectedImpact: 'Increase qualified conversion rate by 15-20% in first month.',
        sourceIds: [1, 2, 4],
      },
      {
        id: 'REC2',
        action: 'Prioritize segment-specific landing paths for top personas.',
        rationale: 'Persona differences in objections and motivations require tailored narratives.',
        expectedImpact: 'Reduce bounce and improve lead quality across paid and organic traffic.',
        sourceIds: [4, 5],
      },
      {
        id: 'REC3',
        action: 'Run weekly pricing and concept experiments with strict decision gates.',
        rationale: 'Sustained experimentation is needed to maintain strategic clarity and budget efficiency.',
        expectedImpact: 'Improve confidence in strategy choices and time-to-signal.',
        sourceIds: [5, 6],
      },
    ],
    metrics: [
      {
        id: 'M1',
        name: 'Market Attractiveness Index',
        value: 78,
        unit: 'index',
        changePercent: 6.1,
        target: 82,
        sourceIds: [1, 3],
      },
      {
        id: 'M2',
        name: 'Projected Qualified Conversion Rate',
        value: 4.8,
        unit: '%',
        changePercent: 14.4,
        target: 5.5,
        sourceIds: [2, 5],
      },
      {
        id: 'M3',
        name: 'Estimated Year-1 Revenue Opportunity',
        value: 18.2,
        unit: '$M',
        changePercent: 9.7,
        target: 22,
        sourceIds: [1, 6],
      },
      {
        id: 'M4',
        name: 'Evidence Coverage Ratio',
        value: 84,
        unit: '%',
        changePercent: 11.2,
        target: 90,
        sourceIds: [1, 2, 3, 4, 5, 6],
      },
    ],
    assumptions,
    sources,
  }
}
