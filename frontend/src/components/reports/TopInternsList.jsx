function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function TopInternsList({ items = [] }) {
  const list = items ?? []

  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Top Performing Interns</h3>
      {list.length === 0 ? (
        <p className="chart-card-empty">No interns yet.</p>
      ) : (
        <ul className="top-interns-list">
          {list.map((item, index) => (
            <li key={item.internId || item.name} className="top-intern-item">
              <div className="top-intern-identity">
                <span className="top-intern-rank">{index + 1}</span>
                <span className="top-intern-avatar">{initials(item.name)}</span>
                <span className="top-intern-name">{item.name}</span>
              </div>
              <div className="top-intern-score">
                <div className="progress-track">
                  <div
                    className="progress-fill progress-fill-blue"
                    style={{ width: `${Math.min(100, item.score)}%` }}
                  />
                </div>
                <strong>{item.score}%</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
