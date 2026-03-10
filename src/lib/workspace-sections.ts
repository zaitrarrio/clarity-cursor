import type { WorkspaceSectionKey } from '@/types/clarity-types'

export const workspaceSectionMeta: Readonly<Record<WorkspaceSectionKey, { title: string; subtitle: string }>> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Executive view across strategy, execution, and evidence coverage.',
  },
  projects: {
    title: 'Projects',
    subtitle: 'Track strategic initiatives, owners, and workflow status.',
  },
  research: {
    title: 'Research',
    subtitle: 'Source-backed findings, evidence trails, and risk diagnostics.',
  },
  personas: {
    title: 'Personas',
    subtitle: 'Audience segments, motivations, objections, and preferred channels.',
  },
  concepts: {
    title: 'Concepts',
    subtitle: 'Concept ranking, adoption signals, and validation priorities.',
  },
  'go-to-market-strategy': {
    title: 'Go-To-Market Strategy',
    subtitle: 'Positioning, messaging architecture, channel priorities, and pricing.',
  },
  'go-to-market-plan': {
    title: 'Go-To-Market Plan',
    subtitle: 'Execution timeline, workstreams, and decision-gated milestones.',
  },
  campaigns: {
    title: 'Campaigns',
    subtitle: 'Active and planned campaign initiatives tied to strategic actions.',
  },
  content: {
    title: 'Content',
    subtitle: 'Content briefs and evidence-informed narrative priorities.',
  },
  measurement: {
    title: 'Measurement',
    subtitle: 'Performance metrics, trend diagnostics, and optimization loop.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Consulting-grade reports with summary → analysis → evidence → action.',
  },
  collaboration: {
    title: 'Collaboration',
    subtitle: 'Notes, decision checkpoints, and alignment items.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Workspace preferences, integrations, and model configuration.',
  },
}
