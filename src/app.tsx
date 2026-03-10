import { ModuleTabs } from '@/components/module-tabs'
import { PipelineView } from '@/components/pipeline-view'
import { ProjectPromptForm } from '@/components/project-prompt-form'
import { useClarityStore } from '@/state/clarity-store'
import '@/styles/index.css'

const moduleSummary: ReadonlyArray<{ key: string; title: string; detail: string }> = [
  {
    key: 'discovery',
    title: 'Discovery',
    detail: 'Expand one sentence into a structured project brief.',
  },
  {
    key: 'research',
    title: 'Research',
    detail: 'Synthesize market signals and competitor intelligence.',
  },
  {
    key: 'validation',
    title: 'Validation',
    detail: 'Rank concepts and define decision-grade experiments.',
  },
  {
    key: 'strategy',
    title: 'Strategy',
    detail: 'Turn insight into positioning, messaging, and channel design.',
  },
  {
    key: 'execution',
    title: 'Execution',
    detail: 'Ship a launch-ready roadmap with owners and outcomes.',
  },
]

const App = () => {
  const {
    prompt,
    clickCount,
    isGenerating,
    result,
    selectedModule,
    recentPrompts,
    setPrompt,
    selectModule,
    generate,
    applyExample,
  } = useClarityStore((state) => state)

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Clarity</p>
          <h2>Strategic Intelligence OS</h2>
          <p>From unknowns to decisions in a continuous loop.</p>
        </div>

        <div className="sidebar-section">
          <p className="section-title">Workflow</p>
          {moduleSummary.map((module) => (
            <article className="module-item" key={module.key}>
              <h3>{module.title}</h3>
              <p>{module.detail}</p>
            </article>
          ))}
        </div>

        <div className="sidebar-section">
          <p className="section-title">Recent prompts</p>
          <div className="stack">
            {recentPrompts.length === 0 ? (
              <p className="muted">No prompt history yet.</p>
            ) : (
              recentPrompts.map((entry) => (
                <button
                  className="history-button"
                  key={entry}
                  onClick={() => setPrompt(entry)}
                  type="button"
                >
                  {entry}
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="top-bar">
          <div>
            <h1>Clarity Workspace</h1>
            <p>AI-assisted discovery, research, validation, and execution planning.</p>
          </div>
          <div className="chip-row">
            <span className="chip">2-3 click journey</span>
            <span className="chip">
              Last run: {result ? new Date(result.generatedAt).toLocaleTimeString() : 'Not generated'}
            </span>
          </div>
        </header>

        <ProjectPromptForm
          prompt={prompt}
          clickCount={clickCount}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={generate}
          onUseExample={applyExample}
        />

        <ModuleTabs selectedModule={selectedModule} onSelectModule={selectModule} />
        <PipelineView result={result} selectedModule={selectedModule} />
      </main>
    </div>
  )
}

export default App
