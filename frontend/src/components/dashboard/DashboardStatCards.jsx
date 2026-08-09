import {
  Users,
  FolderKanban,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  NotebookPen,
} from 'lucide-react'

const CARD_META = [
  { key: 'totalInterns', label: 'Total Interns', icon: Users, tone: 'blue' },
  { key: 'activeProjects', label: 'Active Projects', icon: FolderKanban, tone: 'green' },
  { key: 'pendingTasks', label: 'Pending Tasks', icon: Clock3, tone: 'orange' },
  { key: 'completedTasks', label: 'Completed Tasks', icon: CheckCircle2, tone: 'purple' },
  { key: 'overdueTasks', label: 'Overdue Tasks', icon: AlertTriangle, tone: 'pink' },
  { key: 'todaysWorkLogs', label: "Today's Work Logs", icon: NotebookPen, tone: 'teal' },
]

export function DashboardStatCards({ summary }) {
  return (
    <div className="stat-grid">
      {CARD_META.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.key} className="stat-card">
            <div className={`stat-card-icon tone-${card.tone}`}>
              <Icon size={18} />
            </div>
            <p className="stat-card-label">{card.label}</p>
            <p className="stat-card-value">{summary?.[card.key] ?? 0}</p>
          </div>
        )
      })}
    </div>
  )
}
