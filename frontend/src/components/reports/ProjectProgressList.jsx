export function ProjectProgressList({ items = [] }) {
  const list = items ?? []

  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Project Progress</h3>
      {list.length === 0 ? (
        <p className="chart-card-empty">No projects yet.</p>
      ) : (
        <ul className="progress-list">
          {list.map((item) => (
            <li key={item.projectId || item.name} className="progress-list-item">
              <div className="progress-list-meta">
                <span>{item.name}</span>
                <strong>{item.progressPercent}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, item.progressPercent)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
