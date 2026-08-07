import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock3,
  NotebookPen,
  FileUp,
} from 'lucide-react'

const CARD_META = [
  {
    key: 'totalInterns',
    changeKey: 'totalInternsChange',
    label: 'Total Interns',
    icon: Users,
    tone: 'blue',
  },
  {
    key: 'activeProjects',
    changeKey: 'activeProjectsChange',
    label: 'Active Projects',
    icon: FolderKanban,
    tone: 'green',
  },
  {
    key: 'completedTasks',
    changeKey: 'completedTasksChange',
    label: 'Tasks Completed',
    icon: CheckCircle2,
    tone: 'purple',
  },
  {
    key: 'pendingTasks',
    changeKey: 'pendingTasksChange',
    label: 'Pending Tasks',
    icon: Clock3,
    tone: 'orange',
  },
  {
    key: 'workLogsThisWeek',
    changeKey: 'workLogsThisWeekChange',
    label: 'Work Logs',
    icon: NotebookPen,
    tone: 'teal',
  },
  {
    key: 'totalSubmissions',
    changeKey: 'totalSubmissionsChange',
    label: 'Submissions',
    icon: FileUp,
    tone: 'pink',
  },
]

export function StatCards({ summary }) {
  return (
    <div className="stat-grid">
      {CARD_META.map((card) => {
        const Icon = card.icon
        const change = summary?.[card.changeKey]
        const changeClass =
          change > 0 ? 'is-up' : change < 0 ? 'is-down' : 'is-flat'

        return (
          <div key={card.key} className="stat-card">
            <div className={`stat-card-icon tone-${card.tone}`}>
              <Icon size={18} />
            </div>
            <p className="stat-card-label">{card.label}</p>
            <p className="stat-card-value">{summary?.[card.key] ?? 0}</p>
            {change != null && (
              <p className={`stat-card-change ${changeClass}`}>
                {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}% from
                last period
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
