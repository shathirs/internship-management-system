import { Link } from 'react-router-dom'
import { UserPlus, FolderPlus, ListPlus, FileUp, NotebookPen } from 'lucide-react'

const ACTIONS = [
  { to: '/admin/interns/new', label: 'Add Intern', icon: UserPlus },
  { to: '/admin/projects/new', label: 'Create Project', icon: FolderPlus },
  { to: '/admin/tasks/new', label: 'Create Task', icon: ListPlus },
  { to: '/admin/submissions', label: 'Review Submissions', icon: FileUp },
  { to: '/admin/work-logs', label: 'Work Logs', icon: NotebookPen },
]

export function QuickActions() {
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
