import { Link } from 'react-router-dom'

export function RecentActivities({ items = [] }) {
  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Recent Activities</h3>
      {items.length === 0 ? (
        <p className="chart-card-empty">No recent activity.</p>
      ) : (
        <ul className="dashboard-activity-list">
          {items.map((item) => (
            <li key={item.id} className="dashboard-activity-item">
              <div>
                <p className="dashboard-activity-title">{item.title}</p>
                <p className="dashboard-activity-message">{item.message}</p>
                <p className="dashboard-activity-date">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                </p>
              </div>
              {item.href && (
                <Link to={item.href} className="btn-secondary">
                  Open
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
