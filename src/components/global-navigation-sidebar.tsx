import { useState } from 'react'

import type { WorkspaceRecord } from '@/types/clarity-types'

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
  readonly workspaces: readonly WorkspaceRecord[]
  readonly activeWorkspaceId: string
  readonly recentPrompts: readonly string[]
  readonly onCreateWorkspace: (name: string) => void
  readonly onSwitchWorkspace: (workspaceId: string) => void
  readonly onRenameWorkspace: (workspaceId: string, name: string) => void
  readonly onDeleteWorkspace: (workspaceId: string) => void
  readonly onSelectPrompt: (prompt: string) => void
}

export const GlobalNavigationSidebar = ({
  workspaces,
  activeWorkspaceId,
  recentPrompts,
  onCreateWorkspace,
  onSwitchWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  onSelectPrompt,
}: GlobalNavigationSidebarProps) => {
  const [workspaceName, setWorkspaceName] = useState('')

  const createWorkspace = (): void => {
    onCreateWorkspace(workspaceName)
    setWorkspaceName('')
  }

  return (
    <aside className="global-sidebar">
      <div className="brand-shell">
        <p className="eyebrow">Clarity</p>
        <h2>Strategic Intelligence Platform</h2>
        <p>Consulting-grade analysis with live evidence, citations, and execution paths.</p>
      </div>

      <section className="side-section">
        <p className="section-title">Workspaces</p>
        <div className="stack-sm">
          <div className="workspace-create-row">
            <input
              aria-label="New workspace name"
              className="workspace-name-input"
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="New workspace name"
              value={workspaceName}
            />
            <button className="workspace-create-button" onClick={createWorkspace} type="button">
              Create
            </button>
          </div>
          {workspaces.map((workspace) => (
            <article className="workspace-card" key={workspace.id}>
              <button
                className={workspace.id === activeWorkspaceId ? 'workspace-switch active' : 'workspace-switch'}
                onClick={() => onSwitchWorkspace(workspace.id)}
                type="button"
              >
                <span>{workspace.name}</span>
                <small>{workspace.bundle ? `${workspace.bundle.reports.length} reports` : 'No reports yet'}</small>
              </button>
              <div className="workspace-actions">
                <button
                  className="workspace-action"
                  onClick={() => {
                    const nextName = window.prompt('Rename workspace', workspace.name)
                    if (nextName) {
                      onRenameWorkspace(workspace.id, nextName)
                    }
                  }}
                  type="button"
                >
                  Rename
                </button>
                <button
                  className="workspace-action delete"
                  onClick={() => {
                    const shouldDelete = window.confirm(
                      `Delete workspace "${workspace.name}"? This removes only local workspace state.`,
                    )
                    if (shouldDelete) {
                      onDeleteWorkspace(workspace.id)
                    }
                  }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

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
}
