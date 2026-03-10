interface ProjectPromptFormProps {
  readonly prompt: string
  readonly isGenerating: boolean
  readonly clickCount: number
  readonly onPromptChange: (nextPrompt: string) => void
  readonly onGenerate: () => void
  readonly onUseExample: () => void
}

export const ProjectPromptForm = ({
  prompt,
  isGenerating,
  clickCount,
  onPromptChange,
  onGenerate,
  onUseExample,
}: ProjectPromptFormProps) => (
  <section className="panel input-panel">
    <div className="panel-heading">
      <p className="eyebrow">Input less. Learn faster.</p>
      <h1>Tell Clarity what you want to do.</h1>
      <p className="panel-copy">
        One sentence is enough. Clarity expands it into discovery, research, validation, and strategy in
        2-3 clicks.
      </p>
    </div>

    <label className="prompt-label" htmlFor="project-prompt">
      Strategic objective
    </label>
    <textarea
      id="project-prompt"
      className="prompt-input"
      value={prompt}
      onChange={(event) => onPromptChange(event.target.value)}
      placeholder="I want to sell luxury handbags to women in North America."
      rows={3}
    />

    <div className="actions-row">
      <button className="primary-button" onClick={onGenerate} disabled={isGenerating || !prompt.trim()}>
        {isGenerating ? 'Generating...' : 'Generate strategy'}
      </button>
      <button className="ghost-button" onClick={onUseExample} type="button">
        Use example
      </button>
      <span className="chip">Clicks used: {clickCount}</span>
    </div>
  </section>
)
