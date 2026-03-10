import type { JSX } from 'react'

import type { ClarityModuleKey, ClarityPipelineResult } from '@/types/clarity-types'

interface PipelineViewProps {
  readonly selectedModule: ClarityModuleKey
  readonly result: ClarityPipelineResult | null
}

const EmptyState = () => (
  <section className="panel">
    <h2>Strategic clarity appears here.</h2>
    <p className="panel-copy">
      Enter one objective and generate. Clarity will auto-build the research narrative, synthetic personas,
      validation plan, strategy, and first execution sprint.
    </p>
  </section>
)

const DiscoveryPanel = ({ result }: { readonly result: ClarityPipelineResult }) => (
  <section className="panel">
    <h2>Project brief</h2>
    <div className="grid-two">
      <article className="card">
        <p className="eyebrow">Offering</p>
        <h3>{result.brief.offering}</h3>
      </article>
      <article className="card">
        <p className="eyebrow">Audience</p>
        <h3>{result.brief.audience}</h3>
      </article>
      <article className="card">
        <p className="eyebrow">Region</p>
        <h3>{result.brief.region}</h3>
      </article>
      <article className="card">
        <p className="eyebrow">Objective</p>
        <h3>{result.brief.objective}</h3>
      </article>
    </div>

    <h2>Decision recommendations</h2>
    <div className="stack">
      {result.recommendations.map((recommendation) => (
        <article className="card" key={recommendation.id}>
          <p className="eyebrow">{recommendation.id}</p>
          <h3>{recommendation.title}</h3>
          <p>{recommendation.rationale}</p>
          <p className="next-action">Next: {recommendation.nextAction}</p>
        </article>
      ))}
    </div>
  </section>
)

const ResearchPanel = ({ result }: { readonly result: ClarityPipelineResult }) => (
  <section className="panel">
    <h2>Market hypotheses</h2>
    <div className="stack">
      {result.hypotheses.map((hypothesis) => (
        <article className="card" key={hypothesis.title}>
          <div className="card-header-row">
            <h3>{hypothesis.title}</h3>
            <span className="confidence">{hypothesis.confidence}</span>
          </div>
          <p>{hypothesis.observation}</p>
        </article>
      ))}
    </div>

    <h2>Competitive intelligence</h2>
    <div className="stack">
      {result.competitorSignals.map((signal) => (
        <article className="card" key={signal.name}>
          <h3>{signal.name}</h3>
          <p>
            <strong>Edge:</strong> {signal.edge}
          </p>
          <p>
            <strong>Gap:</strong> {signal.gap}
          </p>
        </article>
      ))}
    </div>
  </section>
)

const ValidationPanel = ({ result }: { readonly result: ClarityPipelineResult }) => (
  <section className="panel">
    <h2>Concept stack</h2>
    <div className="stack">
      {result.concepts.map((concept) => (
        <article className="card" key={concept.id}>
          <div className="card-header-row">
            <h3>
              {concept.id} · {concept.label}
            </h3>
            <span className="confidence">score {concept.signalScore}</span>
          </div>
          <p>{concept.promise}</p>
          <p>
            <strong>Risk:</strong> {concept.risk}
          </p>
        </article>
      ))}
    </div>

    <h2>Validation roadmap</h2>
    <div className="stack">
      {result.experiments.map((experiment) => (
        <article className="card" key={experiment.id}>
          <h3>
            {experiment.id} · {experiment.test}
          </h3>
          <p>
            <strong>Metric:</strong> {experiment.targetMetric}
          </p>
          <p>
            <strong>Success threshold:</strong> {experiment.successThreshold}
          </p>
          <p>
            <strong>Owner:</strong> {experiment.owner}
          </p>
        </article>
      ))}
    </div>
  </section>
)

const StrategyPanel = ({ result }: { readonly result: ClarityPipelineResult }) => (
  <section className="panel">
    <h2>Strategy artifact</h2>
    <article className="card">
      <p className="eyebrow">North star</p>
      <h3>{result.strategy.northStar}</h3>
    </article>
    <article className="card">
      <p className="eyebrow">Positioning</p>
      <p>{result.strategy.positioning}</p>
    </article>
    <article className="card">
      <p className="eyebrow">Message pillars</p>
      <ul>
        {result.strategy.messagePillars.map((pillar) => (
          <li key={pillar}>{pillar}</li>
        ))}
      </ul>
    </article>
    <article className="card">
      <p className="eyebrow">Channel plan</p>
      <ul>
        {result.strategy.channelPlan.map((channel) => (
          <li key={channel}>{channel}</li>
        ))}
      </ul>
    </article>
    <article className="card">
      <p className="eyebrow">Pricing move</p>
      <p>{result.strategy.pricingMove}</p>
    </article>
  </section>
)

const ExecutionPanel = ({ result }: { readonly result: ClarityPipelineResult }) => (
  <section className="panel">
    <h2>Execution plan</h2>
    <div className="stack">
      {result.executionPlan.map((task) => (
        <article className="card" key={task.id}>
          <div className="card-header-row">
            <h3>
              {task.id} · {task.task}
            </h3>
            <span className="confidence">{task.dueWindow}</span>
          </div>
          <p>
            <strong>Workstream:</strong> {task.workstream}
          </p>
          <p>
            <strong>Expected outcome:</strong> {task.expectedOutcome}
          </p>
        </article>
      ))}
    </div>

    <h2>Synthetic personas</h2>
    <div className="stack">
      {result.personas.map((persona) => (
        <article className="card" key={persona.id}>
          <h3>
            {persona.id} · {persona.name}
          </h3>
          <p>{persona.role}</p>
          <p>
            <strong>Goal:</strong> {persona.goal}
          </p>
          <p>
            <strong>Pain points:</strong> {persona.painPoints.join(', ')}
          </p>
        </article>
      ))}
    </div>
  </section>
)

const byModule: Record<ClarityModuleKey, (result: ClarityPipelineResult) => JSX.Element> = {
  discovery: (result) => <DiscoveryPanel result={result} />,
  research: (result) => <ResearchPanel result={result} />,
  validation: (result) => <ValidationPanel result={result} />,
  strategy: (result) => <StrategyPanel result={result} />,
  execution: (result) => <ExecutionPanel result={result} />,
}

export const PipelineView = ({ selectedModule, result }: PipelineViewProps) => {
  if (!result) {
    return <EmptyState />
  }

  return byModule[selectedModule](result)
}
