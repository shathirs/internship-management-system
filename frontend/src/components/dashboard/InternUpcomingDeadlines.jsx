import { Link } from 'react-router-dom'

export function InternUpcomingDeadlines({ items = [] }) {
  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Upcoming Deadlines</h3>
      {items.length === 0 ? (
        <p className="chart-card-empty">No upcoming deadlines.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.taskId}>
                <td>{item.title}</td>
                <td>{item.deadline || '—'}</td>
                <td>{item.priority || '—'}</td>
                <td>
                  <span className={`status-pill status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <Link to="/intern/tasks" className="btn-secondary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
