const navSections = [
  'Dashboard',
  'Projects',
  'Research',
  'Personas',
  'Concepts',
  'Go-To-Market Strategy',
  'Go-To-Market Plan',
  'Campaigns',
  'Content',
  'Measurement',
  'Reports',
  'Collaboration',
  'Settings',
] as const

interface GlobalNavigationSidebarProps {
  readonly recentPrompts: readonly string[]
  readonly onSelectPrompt: (prompt: string) => void
}

export const GlobalNavigationSidebar = ({
  recentPrompts,
  onSelectPrompt,
}: GlobalNavigationSidebarProps) => (
  <aside className="global-sidebar">
    <div className="brand-shell">
      <p className="eyebrow">Clarity</p>
      <h2>Strategic Intelligence Platform</h2>
      <p>Consulting-grade analysis with live evidence, citations, and execution paths.</p>
    </div>

    <section className="side-section">
      <p className="section-title">Platform navigation</p>
      <div className="stack-sm">
        {navSections.map((section) => (
          <button className="section-link" key={section} type="button">
            {section}
          </button>
        ))}
      </div>
    </section>

    <section className="side-section">
      <p className="section-title">Recent strategic prompts</p>
      <div className="stack-sm">
        {recentPrompts.length === 0 ? (
          <p className="muted">No prompt history yet.</p>
        ) : (
          recentPrompts.map((prompt) => (
            <button className="history-entry" key={prompt} onClick={() => onSelectPrompt(prompt)} type="button">
              {prompt}
            </button>
          ))
        )}
      </div>
    </section>
  </aside>
)
