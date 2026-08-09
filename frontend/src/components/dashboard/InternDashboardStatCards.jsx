import {
  ListTodo,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
  NotebookPen,
  FileUp,
} from 'lucide-react'

const CARD_META = [
  { key: 'myTasks', label: 'My Tasks', icon: ListTodo, tone: 'blue' },
  { key: 'inProgressTasks', label: 'In Progress', icon: LoaderCircle, tone: 'orange' },
  { key: 'completedTasks', label: 'Completed', icon: CheckCircle2, tone: 'green' },
  { key: 'overdueTasks', label: 'Overdue', icon: AlertTriangle, tone: 'pink' },
  { key: 'myWorkLogs', label: 'My Work Logs', icon: NotebookPen, tone: 'teal' },
  { key: 'pendingSubmissions', label: 'Pending Submissions', icon: FileUp, tone: 'purple' },
]

export function InternDashboardStatCards({ summary }) {
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
