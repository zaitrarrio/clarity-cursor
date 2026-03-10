import type {
  AudiencePersona,
  ClarityBrief,
  ClarityPipelineResult,
  CompetitorSignal,
  ConceptBrief,
  ExecutionTask,
  InsightRecommendation,
  MarketHypothesis,
  StrategyArtifact,
  ValidationExperiment,
} from '@/types/clarity-types'

const objectiveVerbs = ['sell', 'launch', 'grow', 'expand', 'enter', 'market']

const toTitleCase = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .map((token) => token[0]?.toUpperCase() + token.slice(1))
    .join(' ')

const normalizeText = (value: string): string => value.trim().replace(/\s+/g, ' ')

const parsePrompt = (prompt: string): ClarityBrief => {
  const cleanedPrompt = normalizeText(prompt)
  const lowercasePrompt = cleanedPrompt.toLowerCase()
  const objective =
    objectiveVerbs.find((verb) => lowercasePrompt.includes(verb)) ?? 'grow'

  const offeringMatch = lowercasePrompt.match(
    /(sell|launch|grow|expand|enter|market)\s+(.+?)\s+(to|for)\s+/i,
  )
  const audienceMatch = lowercasePrompt.match(/\s(to|for)\s+(.+?)\s+in\s+/i)
  const regionMatch = lowercasePrompt.match(/\sin\s+(.+)$/i)

  const offering = offeringMatch?.[2] ?? 'new offer'
  const audience = audienceMatch?.[2] ?? 'high-intent buyers'
  const region = regionMatch?.[1] ?? 'priority market'

  return {
    rawPrompt: cleanedPrompt,
    objective,
    offering: toTitleCase(offering),
    audience: toTitleCase(audience),
    region: toTitleCase(region),
  }
}

const buildHypotheses = (brief: ClarityBrief): readonly MarketHypothesis[] => [
  {
    title: 'Demand is concentrated in premium intent pockets',
    observation: `${brief.audience} are willing to pay for clear differentiation when the value narrative is specific to ${brief.region}.`,
    confidence: 'high',
  },
  {
    title: 'Incumbents over-index on generic messaging',
    observation: `Most alternatives in ${brief.region} position on broad utility, leaving room for a precision narrative around ${brief.offering}.`,
    confidence: 'medium',
  },
  {
    title: 'Fast trust signals increase conversion velocity',
    observation: `Category proof, social evidence, and founder authority can shorten evaluation cycles for ${brief.audience}.`,
    confidence: 'medium',
  },
]

const buildCompetitorSignals = (brief: ClarityBrief): readonly CompetitorSignal[] => [
  {
    name: 'Incumbent Premium Brands',
    edge: 'Strong distribution and brand familiarity.',
    gap: `Low personalization for ${brief.audience} in ${brief.region}.`,
  },
  {
    name: 'DTC Challenger Set',
    edge: 'Compelling digital storytelling.',
    gap: 'Weak retention economics and inconsistent trust proof.',
  },
  {
    name: 'Marketplace Aggregators',
    edge: 'Volume and convenience.',
    gap: `Commoditized positioning that undervalues ${brief.offering}.`,
  },
]

const buildPersonas = (brief: ClarityBrief): readonly AudiencePersona[] => [
  {
    id: 'P-01',
    name: 'Status Seeker',
    role: `${brief.audience} professional`,
    goal: 'Signal taste and confidence through high-quality choices.',
    painPoints: ['Too many low-trust options', 'Hard to compare quality signals'],
    buyingTriggers: ['Peer validation', 'Editorial endorsements'],
    preferredChannels: ['Instagram', 'Creator partnerships'],
  },
  {
    id: 'P-02',
    name: 'Value Maximizer',
    role: `${brief.audience} budget optimizer`,
    goal: 'Achieve premium outcomes with rational trade-offs.',
    painPoints: ['Pricing opacity', 'Fear of overpaying'],
    buyingTriggers: ['Transparent pricing', 'Durability proof'],
    preferredChannels: ['Search', 'Email lifecycle'],
  },
  {
    id: 'P-03',
    name: 'Purpose-Driven Buyer',
    role: `${brief.audience} conscious consumer`,
    goal: 'Buy from brands aligned with values and craft integrity.',
    painPoints: ['Unclear sourcing', 'Greenwashing concerns'],
    buyingTriggers: ['Traceability story', 'Mission alignment'],
    preferredChannels: ['Community content', 'Referral'],
  },
]

const buildConcepts = (brief: ClarityBrief): readonly ConceptBrief[] => [
  {
    id: 'C-01',
    label: 'Premium Confidence System',
    promise: `Position ${brief.offering} as the confidence layer for ${brief.audience}.`,
    risk: 'Message may feel abstract without proof points.',
    signalScore: 87,
  },
  {
    id: 'C-02',
    label: 'Proof-Led Storytelling',
    promise: `Lead with evidence, craftsmanship, and outcomes in ${brief.region}.`,
    risk: 'Asset production load can slow launch speed.',
    signalScore: 82,
  },
  {
    id: 'C-03',
    label: 'Segment-Specific Launch Pods',
    promise: 'Deploy tailored journeys for each persona archetype.',
    risk: 'Requires disciplined channel orchestration.',
    signalScore: 79,
  },
]

const buildExperiments = (brief: ClarityBrief): readonly ValidationExperiment[] => [
  {
    id: 'E-01',
    test: 'Message framing A/B test',
    targetMetric: 'Qualified conversation rate',
    successThreshold: '+20% over baseline',
    owner: 'Growth Lead',
  },
  {
    id: 'E-02',
    test: 'Channel mix test',
    targetMetric: 'Cost per qualified lead',
    successThreshold: '15% lower than current mix',
    owner: 'Performance Marketing',
  },
  {
    id: 'E-03',
    test: `Offer architecture test for ${brief.region}`,
    targetMetric: 'Checkout completion',
    successThreshold: '+12% conversion lift',
    owner: 'Lifecycle Team',
  },
]

const buildStrategy = (brief: ClarityBrief): StrategyArtifact => ({
  northStar: `Become the default choice for ${brief.audience} seeking ${brief.offering} in ${brief.region}.`,
  positioning: `A precision-focused brand that turns complex decisions into confident outcomes for ${brief.audience}.`,
  messagePillars: [
    'Proof before promise',
    'Personalized guidance at speed',
    'Premium experience with transparent value',
  ],
  channelPlan: ['Search + intent capture', 'Creator proof loops', 'Lifecycle email journeys'],
  pricingMove: 'Anchor premium tier, then offer confidence bundles to accelerate first conversion.',
})

const buildExecutionPlan = (brief: ClarityBrief): readonly ExecutionTask[] => [
  {
    id: 'T-01',
    workstream: 'Discovery',
    task: `Run fast market scan for ${brief.region}.`,
    dueWindow: 'Week 1',
    expectedOutcome: 'Prioritized demand pockets with evidence.',
  },
  {
    id: 'T-02',
    workstream: 'Research',
    task: `Create persona interview synthesis for ${brief.audience}.`,
    dueWindow: 'Week 1-2',
    expectedOutcome: 'High-confidence persona narratives and objections map.',
  },
  {
    id: 'T-03',
    workstream: 'Validation',
    task: 'Launch concept and pricing experiments.',
    dueWindow: 'Week 2-3',
    expectedOutcome: 'Winning concept stack and pricing signal.',
  },
  {
    id: 'T-04',
    workstream: 'Strategy',
    task: 'Finalize positioning and messaging architecture.',
    dueWindow: 'Week 3',
    expectedOutcome: 'Approved strategic artifact set.',
  },
  {
    id: 'T-05',
    workstream: 'Execution',
    task: 'Activate launch channels and reporting cadence.',
    dueWindow: 'Week 4',
    expectedOutcome: 'Campaigns live with closed-loop measurement.',
  },
]

const buildRecommendations = (brief: ClarityBrief): readonly InsightRecommendation[] => [
  {
    id: 'I-01',
    title: 'Lead with proof-heavy creative',
    rationale: `${brief.audience} in ${brief.region} respond fastest when trust signals are visible in first-touch content.`,
    nextAction: 'Prioritize social proof and expert validation in launch assets.',
  },
  {
    id: 'I-02',
    title: 'Front-load segment-specific landing pages',
    rationale: 'Personalized paths reduce bounce and increase qualification quality.',
    nextAction: 'Ship top two persona pages before broad campaign spend.',
  },
  {
    id: 'I-03',
    title: 'Treat experiments as a weekly decision engine',
    rationale: 'Fast iteration protects budget and compounds clarity.',
    nextAction: 'Hold a weekly insight-to-action review with owners.',
  },
]

export const buildClarityPipeline = (prompt: string): ClarityPipelineResult => {
  const brief = parsePrompt(prompt)

  return {
    brief,
    hypotheses: buildHypotheses(brief),
    competitorSignals: buildCompetitorSignals(brief),
    personas: buildPersonas(brief),
    concepts: buildConcepts(brief),
    experiments: buildExperiments(brief),
    strategy: buildStrategy(brief),
    executionPlan: buildExecutionPlan(brief),
    recommendations: buildRecommendations(brief),
    generatedAt: new Date().toISOString(),
  }
}
