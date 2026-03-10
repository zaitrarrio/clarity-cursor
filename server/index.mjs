import cors from 'cors'
import express from 'express'

import { runPerplexityDeepResearch } from './perplexity-research-service.mjs'

const app = express()
const port = Number(process.env.CLARITY_SERVER_PORT ?? 8787)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'clarity-research-api' })
})

app.post('/api/deep-research', async (request, response) => {
  const prompt = String(request.body?.prompt ?? '').trim()
  if (!prompt) {
    response.status(400).json({ error: 'Prompt is required.' })
    return
  }

  const result = await runPerplexityDeepResearch(prompt)
  response.json(result)
})

app.listen(port, () => {
  console.log(`Clarity research API listening on port ${port}`)
})
