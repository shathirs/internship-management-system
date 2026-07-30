import { Bell, Mail, Menu, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : 'Intern'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <label className="topbar-search">
          <Search className="topbar-search-icon" />
          <input type="search" placeholder="Search anything..." />
        </label>
      </div>

      <div className="topbar-right">
        <button type="button" className="topbar-icon-btn" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="topbar-badge">5</span>
        </button>

        <button type="button" className="topbar-icon-btn" aria-label="Messages">
          <Mail className="h-5 w-5" />
          <span className="topbar-badge">3</span>
        </button>

        <div className="topbar-divider" />

        <button type="button" className="topbar-user">
          <div className="topbar-avatar" aria-hidden="true">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="topbar-user-text">
            <p className="topbar-user-name">{user?.name || 'User'}</p>
            <p className="topbar-user-role">{roleLabel}</p>
          </div>
          <ChevronDown className="h-4 w-4 topbar-user-chevron" />
        </button>
      </div>
    </header>
  )
}
