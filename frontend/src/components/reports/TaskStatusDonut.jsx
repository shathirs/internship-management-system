import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']

export function TaskStatusDonut({ data = [] }) {
  const chartData = (data ?? []).filter((d) => d.value > 0)
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Task Status Distribution</h3>
      {chartData.length === 0 ? (
        <p className="chart-card-empty">No data yet.</p>
      ) : (
        <div className="donut-layout">
          <div className="donut-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={2}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{total}</strong>
              <span>Tasks</span>
            </div>
          </div>
          <ul className="donut-legend">
            {chartData.map((item, index) => {
              const pct = total === 0 ? 0 : Math.round((item.value * 100) / total)
              return (
                <li key={item.name}>
                  <span
                    className="donut-legend-dot"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="donut-legend-label">{item.name}</span>
                  <span className="donut-legend-value">
                    {item.value} ({pct}%)
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
