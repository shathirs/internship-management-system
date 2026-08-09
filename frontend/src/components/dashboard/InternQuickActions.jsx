import { Link } from 'react-router-dom'
import { NotebookPen, FileUp, ListTodo, MessageSquare } from 'lucide-react'

const ACTIONS = [
  { to: '/intern/work-logs/new', label: 'Submit Work Log', icon: NotebookPen },
  { to: '/intern/submissions/new', label: 'Submit Work', icon: FileUp },
  { to: '/intern/tasks', label: 'My Tasks', icon: ListTodo },
  { to: '/intern/feedback', label: 'Feedback', icon: MessageSquare },
]

export function InternQuickActions() {
  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Quick Actions</h3>
      <div className="dashboard-quick-actions">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.to} to={action.to} className="dashboard-quick-action">
              <Icon size={18} />
              <span>{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
