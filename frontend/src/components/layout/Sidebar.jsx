import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  NotebookPen,
  FileUp,
  MessageSquare,
  BarChart3,
  Bell,
  UserRound,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
  ListTodo,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const adminMainMenu = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Interns', to: '/admin/interns', icon: Users },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Tasks', to: '/admin/tasks', icon: CheckSquare },
  { label: 'Daily Work Logs', to: '/admin/work-logs', icon: NotebookPen },
  { label: 'Submissions', icon: FileUp },
  { label: 'Feedback', icon: MessageSquare },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Notifications', icon: Bell },
]

const internMainMenu = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Tasks', icon: ListTodo },
  { label: 'Daily Work Logs', to: '/intern/work-logs', icon: NotebookPen },
  { label: 'Submissions', icon: FileUp },
  { label: 'Feedback', icon: MessageSquare },
  { label: 'Notifications', icon: Bell },
]

const otherMenu = [
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
]

export function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const homePath = user?.role === 'ADMIN' ? '/admin' : '/intern'
  const mainMenu = user?.role === 'ADMIN' ? adminMainMenu : internMainMenu

  function handlePlaceholder(label) {
    toast(`${label} coming soon`)
    onNavigate?.()
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="sidebar-brand-title">Internship</p>
          <p className="sidebar-brand-subtitle">Management System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Main Menu</p>
        <ul className="sidebar-menu">
          {mainMenu.map((item) => {
            const Icon = item.icon
            const isDashboard = item.label === 'Dashboard'

            if (item.to) {
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'is-active' : ''}`
                    }
                    onClick={() => onNavigate?.()}
                  >
                    <Icon className="sidebar-link-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            }

            if (!isDashboard) {
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className="sidebar-link"
                    onClick={() => handlePlaceholder(item.label)}
                  >
                    <Icon className="sidebar-link-icon" />
                    <span>{item.label}</span>
                    <ChevronRight className="sidebar-chevron" />
                  </button>
                </li>
              )
            }

            return (
              <li key={item.label}>
                <NavLink
                  to={homePath}
                  end
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'is-active' : ''}`
                  }
                  onClick={() => onNavigate?.()}
                >
                  <Icon className="sidebar-link-icon" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>

        <p className="sidebar-section-label">Other</p>
        <ul className="sidebar-menu">
          {otherMenu.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label}>
                <button
                  type="button"
                  className="sidebar-link"
                  onClick={() => handlePlaceholder(item.label)}
                >
                  <Icon className="sidebar-link-icon" />
                  <span>{item.label}</span>
                  <ChevronRight className="sidebar-chevron" />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        <LogOut className="sidebar-link-icon" />
        <span>Logout</span>
      </button>
    </div>
  )
}
