import type { ClarityModuleKey } from '@/types/clarity-types'

const moduleLabels: ReadonlyArray<{ key: ClarityModuleKey; label: string }> = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'research', label: 'Research' },
  { key: 'validation', label: 'Validation' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'execution', label: 'Execution' },
]

interface ModuleTabsProps {
  readonly selectedModule: ClarityModuleKey
  readonly onSelectModule: (moduleKey: ClarityModuleKey) => void
}

export const ModuleTabs = ({ selectedModule, onSelectModule }: ModuleTabsProps) => (
  <nav className="module-tabs" aria-label="Clarity modules">
    {moduleLabels.map((module) => (
      <button
        key={module.key}
        className={selectedModule === module.key ? 'tab-button active' : 'tab-button'}
        onClick={() => onSelectModule(module.key)}
        type="button"
      >
        {module.label}
      </button>
    ))}
  </nav>
)
