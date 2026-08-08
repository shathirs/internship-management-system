import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Mail, Menu, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUnreadCount } from '../../services/notificationService'

export function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const [unread, setUnread] = useState(0)

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : 'Intern'
  const notificationsPath =
    user?.role === 'ADMIN' ? '/admin/notifications' : '/intern/notifications'

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadCount() {
      try {
        const count = await getUnreadCount()
        if (!cancelled) setUnread(count)
      } catch {
        if (!cancelled) setUnread(0)
      }
    }

    loadCount()
    const timer = setInterval(loadCount, 60000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [user])

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
        <Link
          to={notificationsPath}
          className="topbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="topbar-badge">{unread}</span>}
        </Link>

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
        </button>
      </div>
    </header>
  )
}
