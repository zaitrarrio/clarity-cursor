interface CommandCenterProps {
  readonly prompt: string
  readonly clickCount: number
  readonly isAnalyzing: boolean
  readonly mode: 'perplexity' | 'fallback' | null
  readonly errorMessage: string | null
  readonly onPromptChange: (value: string) => void
  readonly onApplyExample: () => void
  readonly onRunAnalysis: () => Promise<void>
}

export const CommandCenter = ({
  prompt,
  clickCount,
  isAnalyzing,
  mode,
  errorMessage,
  onPromptChange,
  onApplyExample,
  onRunAnalysis,
}: CommandCenterProps) => (
  <section className="command-center">
    <div className="command-header">
      <div>
        <p className="eyebrow">Strategic command center</p>
        <h1>Generate executive-grade analysis in 2-3 clicks.</h1>
        <p>
          Clarity expands minimal input into market research, consumer insight, concept validation, and
          Go-To-Market reports with evidence and references.
        </p>
      </div>
      <div className="chip-row">
        <span className="chip">Clicks used: {clickCount}</span>
        <span className="chip">Research mode: {mode ?? 'not-run'}</span>
      </div>
    </div>

    <label className="prompt-label" htmlFor="strategic-prompt">
      Strategic objective
    </label>
    <textarea
      id="strategic-prompt"
      className="prompt-area"
      value={prompt}
      onChange={(event) => onPromptChange(event.target.value)}
      rows={4}
      placeholder="I want to sell luxury handbags to women in North America."
    />

    <div className="button-row">
      <button className="primary-button" disabled={isAnalyzing || !prompt.trim()} onClick={() => void onRunAnalysis()}>
        {isAnalyzing ? 'Running deep research...' : 'Run deep analysis'}
      </button>
      <button className="ghost-button" onClick={onApplyExample} type="button">
        Use example objective
      </button>
    </div>

    {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
  </section>
)
