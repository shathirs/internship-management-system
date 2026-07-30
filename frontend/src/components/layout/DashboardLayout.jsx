import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="dashboard-shell">
      {sidebarOpen ? (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside className={`dashboard-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-navbar">
          <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  )
}
