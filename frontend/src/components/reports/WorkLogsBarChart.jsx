import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export function WorkLogsBarChart({ data = [] }) {
  const chartData = data ?? []

  return (
    <div className="chart-card">
      <h3 className="chart-card-title">Work Logs Overview</h3>
      {chartData.length === 0 ? (
        <p className="chart-card-empty">No data yet.</p>
      ) : (
        <div className="chart-card-body chart-card-body-sm">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="Logs" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
