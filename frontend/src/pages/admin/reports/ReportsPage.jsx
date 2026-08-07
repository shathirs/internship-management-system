import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CalendarDays, Download, Info } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { StatCards } from '../../../components/reports/StatCards'
import { InternProgressChart } from '../../../components/reports/InternProgressChart'
import { TaskStatusDonut } from '../../../components/reports/TaskStatusDonut'
import { ProjectProgressList } from '../../../components/reports/ProjectProgressList'
import { WorkLogsBarChart } from '../../../components/reports/WorkLogsBarChart'
import { TopInternsList } from '../../../components/reports/TopInternsList'
import { getReportSummary } from '../../../services/reportService'
import { downloadReportCsv } from '../../../utils/exportReportCsv'

const RANGE_OPTIONS = [
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'ALL', label: 'All Time' },
]

export function ReportsPage() {
  const [range, setRange] = useState('THIS_MONTH')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getReportSummary(range)
        setSummary(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [range])

  function handleExport() {
    if (!summary) {
      toast.error('No report data to export')
      return
    }
    downloadReportCsv(summary, range)
    toast.success('Report exported')
  }

  return (
    <DashboardLayout>
      <div className="page-header reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Overview of internship program performance</p>
        </div>
        <div className="reports-actions">
          <label className="reports-filter">
            <CalendarDays size={16} />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              aria-label="Report date range"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn-primary reports-export" onClick={handleExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading reports…</p>
      ) : !summary ? (
        <p>No report data available.</p>
      ) : (
        <div className="reports-page">
          <StatCards summary={summary} />

          <div className="reports-mid-grid">
            <InternProgressChart data={summary.taskProgressTrend} />
            <TaskStatusDonut data={summary.tasksByStatus} />
          </div>

          <div className="reports-bottom-grid">
            <ProjectProgressList items={summary.projectProgress} />
            <WorkLogsBarChart data={summary.workLogsByWeek} />
            <TopInternsList items={summary.topInterns} />
          </div>

          <p className="reports-footnote">
            <Info size={14} />
            Reports are updated in real-time. All dates and times are based on your selected
            timezone.
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
