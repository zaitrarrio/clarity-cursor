import type { DetailedReport } from '@/types/clarity-types'

interface ReportSelectorProps {
  readonly reports: readonly DetailedReport[]
  readonly activeReportId: string | null
  readonly onSelectReport: (reportId: string) => void
}

export const ReportSelector = ({ reports, activeReportId, onSelectReport }: ReportSelectorProps) => (
  <nav className="report-selector" aria-label="Report selector">
    {reports.map((report) => (
      <button
        className={report.id === activeReportId ? 'report-tab active' : 'report-tab'}
        key={report.id}
        onClick={() => onSelectReport(report.id)}
        type="button"
      >
        <span>{report.title}</span>
        <small>{report.confidence} confidence</small>
      </button>
    ))}
  </nav>
)
