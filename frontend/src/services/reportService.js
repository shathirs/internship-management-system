import api from '../lib/api'

export async function getReportSummary(range = 'THIS_MONTH') {
  const { data } = await api.get('/api/reports/summary', {
    params: { range },
  })
  return data
}
