const parsePrompt = (prompt) => {
  const normalized = String(prompt ?? '').trim().replace(/\s+/g, ' ')
  const lowercase = normalized.toLowerCase()
  const marketMatch = lowercase.match(/(sell|launch|grow|expand|enter)\s+(.+?)\s+(to|for)\s+/i)
  const audienceMatch = lowercase.match(/\s(to|for)\s+(.+?)\s+in\s+/i)
  const geographyMatch = lowercase.match(/\sin\s+(.+)$/i)

  const titleCase = (value) =>
    value
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token[0].toUpperCase() + token.slice(1))
      .join(' ')

  return {
    objective: normalized,
    market: titleCase(marketMatch?.[2] ?? 'strategic offer'),
    audience: titleCase(audienceMatch?.[2] ?? 'high-intent buyers'),
    geography: titleCase(geographyMatch?.[1] ?? 'priority market'),
  }
}

const fallbackResearchPayload = (prompt) => {
  const parsed = parsePrompt(prompt)
  return {
    objective: parsed.objective,
    market: parsed.market,
    audience: parsed.audience,
    geography: parsed.geography,
    findings: [
      {
        id: 'F1',
        title: 'Category demand is strong in premium-intent segments',
        detail: `${parsed.audience} in ${parsed.geography} respond strongly to proof-rich premium narratives.`,
        confidence: 'high',
        sourceIds: [1, 2],
      },
      {
        id: 'F2',
        title: 'Competitor narratives are broad and weakly differentiated',
        detail: `Incumbent positioning leaves room for focused differentiation around ${parsed.market}.`,
        confidence: 'medium',
        sourceIds: [2, 3],
      },
      {
        id: 'F3',
        title: 'Top channels are search and creator trust loops',
        detail: 'Demand conversion improves when social proof is paired with intent capture.',
        confidence: 'medium',
        sourceIds: [4, 5],
      },
    ],
    risks: [
      {
        id: 'R1',
        risk: 'Incumbent counter-positioning can erode differentiation.',
        likelihood: 'medium',
        impact: 'Weakens early conversion if messaging lacks proof assets.',
        mitigation: 'Use measurable proof points in every campaign narrative.',
        sourceIds: [2, 3],
      },
      {
        id: 'R2',
        risk: 'Price sensitivity creates drop-off in evaluation stage.',
        likelihood: 'medium',
        impact: 'Reduces qualified conversion volume.',
        mitigation: 'Deploy package and value-framing experiments.',
        sourceIds: [6],
      },
    ],
    recommendations: [
      {
        id: 'REC1',
        action: 'Lead with evidence-heavy positioning and source-backed proof points.',
        rationale: 'Trust signal density strongly influences premium conversion behavior.',
        expectedImpact: 'Increase qualified conversion by 15%+.',
        sourceIds: [1, 2, 4],
      },
      {
        id: 'REC2',
        action: 'Prioritize top two segments with dedicated landing narratives.',
        rationale: 'Segment-specific objection handling reduces bounce and improves quality.',
        expectedImpact: 'Improve qualification and reduce wasted spend.',
        sourceIds: [4, 5],
      },
      {
        id: 'REC3',
        action: 'Run weekly concept and pricing experiments with decision gates.',
        rationale: 'Continuous validation is required for strategic clarity.',
        expectedImpact: 'Accelerate evidence-backed decisions.',
        sourceIds: [5, 6],
      },
    ],
    metrics: [
      {
        id: 'M1',
        name: 'Market Attractiveness Index',
        value: 78,
        unit: 'index',
        changePercent: 6.2,
        target: 82,
        sourceIds: [1, 3],
      },
      {
        id: 'M2',
        name: 'Projected Qualified Conversion Rate',
        value: 4.9,
        unit: '%',
        changePercent: 14.8,
        target: 5.5,
        sourceIds: [2, 5],
      },
      {
        id: 'M3',
        name: 'Estimated Year-1 Revenue Opportunity',
        value: 18.5,
        unit: '$M',
        changePercent: 9.4,
        target: 22,
        sourceIds: [1, 6],
      },
      {
        id: 'M4',
        name: 'Evidence Coverage Ratio',
        value: 84,
        unit: '%',
        changePercent: 10.9,
        target: 90,
        sourceIds: [1, 2, 3, 4, 5, 6],
      },
    ],
    assumptions: [
      {
        id: 'A1',
        statement: 'Demand growth remains stable over the next 12 months.',
        impact: 'Affects market size and opportunity confidence.',
        sensitivity: 'medium',
        lastReviewed: new Date().toISOString().slice(0, 10),
      },
      {
        id: 'A2',
        statement: 'Top channels can launch within first 30 days with available resources.',
        impact: 'Affects execution timing and CAC assumptions.',
        sensitivity: 'high',
        lastReviewed: new Date().toISOString().slice(0, 10),
      },
      {
        id: 'A3',
        statement: 'Persona simulations are directionally aligned with early live data.',
        impact: 'Affects confidence in concept and message choices.',
        sensitivity: 'medium',
        lastReviewed: new Date().toISOString().slice(0, 10),
      },
    ],
    sources: [
      {
        id: 1,
        title: `${parsed.market} demand outlook in ${parsed.geography}`,
        url: 'https://www.mckinsey.com',
        publisher: 'McKinsey & Company',
        publishedAt: '2025-11-01',
        sourceType: 'external',
        snippet: 'Premium category demand remains resilient in trust-sensitive buyer cohorts.',
        relevance: 'Supports market attractiveness baseline.',
      },
      {
        id: 2,
        title: 'Buyer behavior and trust signal benchmark',
        url: 'https://www.gartner.com',
        publisher: 'Gartner',
        publishedAt: '2025-08-19',
        sourceType: 'external',
        snippet: 'Transparent proof points drive evaluation and conversion intent.',
        relevance: 'Supports messaging and conversion assumptions.',
      },
      {
        id: 3,
        title: 'Competitor pricing and positioning database',
        url: 'https://www.statista.com',
        publisher: 'Statista',
        publishedAt: '2025-06-15',
        sourceType: 'external',
        snippet: 'Major incumbents emphasize broad positioning with limited persona specificity.',
        relevance: 'Supports competitive gap claims.',
      },
      {
        id: 4,
        title: 'Synthetic persona response simulation',
        url: 'internal://persona-simulations/v3',
        publisher: 'Clarity Simulation Engine',
        publishedAt: '2026-03-10',
        sourceType: 'experiment',
        snippet: 'Proof-led narratives outperform generalized premium claims.',
        relevance: 'Supports concept testing and persona strategy.',
      },
      {
        id: 5,
        title: 'Channel conversion benchmark',
        url: 'internal://performance/channel-benchmark-q4',
        publisher: 'Clarity Analytics',
        publishedAt: '2026-02-27',
        sourceType: 'internal',
        snippet: 'Search and creator loops produce strongest qualified conversion yield.',
        relevance: 'Supports channel prioritization strategy.',
      },
      {
        id: 6,
        title: 'Pricing sensitivity pulse',
        url: 'internal://surveys/pricing-sensitivity',
        publisher: 'Clarity Research',
        publishedAt: '2026-01-22',
        sourceType: 'survey',
        snippet: 'Mid-tier premium bundles maximize intent without objection spike.',
        relevance: 'Supports pricing and offer architecture.',
      },
    ],
  }
}

const extractJsonFromMessage = (messageContent) => {
  const raw = String(messageContent ?? '').trim()
  if (!raw) {
    return null
  }

  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  if (first < 0 || last < 0 || first >= last) {
    return null
  }

  try {
    return JSON.parse(raw.slice(first, last + 1))
  } catch {
    return null
  }
}

const validateResearchPayload = (value) => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const payload = value
  return (
    typeof payload.objective === 'string' &&
    typeof payload.market === 'string' &&
    typeof payload.audience === 'string' &&
    typeof payload.geography === 'string' &&
    Array.isArray(payload.findings) &&
    Array.isArray(payload.risks) &&
    Array.isArray(payload.recommendations) &&
    Array.isArray(payload.metrics) &&
    Array.isArray(payload.assumptions) &&
    Array.isArray(payload.sources)
  )
}

const systemPrompt = `
You are a senior strategic research analyst.
Return ONLY valid JSON (no markdown).
Output schema:
{
  "objective": "string",
  "market": "string",
  "audience": "string",
  "geography": "string",
  "findings": [{"id":"F1","title":"string","detail":"string","confidence":"high|medium|low","sourceIds":[1,2]}],
  "risks": [{"id":"R1","risk":"string","likelihood":"high|medium|low","impact":"string","mitigation":"string","sourceIds":[1]}],
  "recommendations": [{"id":"REC1","action":"string","rationale":"string","expectedImpact":"string","sourceIds":[1,2]}],
  "metrics": [{"id":"M1","name":"string","value":1,"unit":"index|%|$M","changePercent":1,"target":1,"sourceIds":[1]}],
  "assumptions": [{"id":"A1","statement":"string","impact":"string","sensitivity":"high|medium|low","lastReviewed":"YYYY-MM-DD"}],
  "sources": [{"id":1,"title":"string","url":"https://...","publisher":"string","publishedAt":"YYYY-MM-DD","sourceType":"external|internal|survey|experiment","snippet":"string","relevance":"string"}]
}
Requirements:
- Create at least 3 findings, 2 risks, 3 recommendations, 4 metrics, 3 assumptions, 6 sources.
- Every finding, risk, recommendation, and metric must reference sourceIds.
- Include evidence-grounded, consulting-grade analysis with concise language.
`

export const runPerplexityDeepResearch = async (prompt) => {
  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) {
    return {
      mode: 'fallback',
      research: fallbackResearchPayload(prompt),
    }
  }

  const model = process.env.PERPLEXITY_MODEL ?? 'sonar-pro'
  const userPrompt = `
Perform deep market, audience, concept, and go-to-market research for this objective:
"${prompt}"

Return structured JSON only.
`

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      return {
        mode: 'fallback',
        research: fallbackResearchPayload(prompt),
      }
    }

    const completion = await response.json()
    const content = completion?.choices?.[0]?.message?.content
    const parsed = extractJsonFromMessage(content)

    if (!validateResearchPayload(parsed)) {
      return {
        mode: 'fallback',
        research: fallbackResearchPayload(prompt),
      }
    }

    return {
      mode: 'perplexity',
      research: parsed,
    }
  } catch {
    return {
      mode: 'fallback',
      research: fallbackResearchPayload(prompt),
    }
  }
}
