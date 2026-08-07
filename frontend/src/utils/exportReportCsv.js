function escapeCsv(value) {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(escapeCsv).join(',')).join('\n')
}

export function downloadReportCsv(summary, range = 'THIS_MONTH') {
  if (!summary) return

  const sections = []

  sections.push(['Reports & Analytics'])
  sections.push(['Range', range])
  sections.push([])

  sections.push(['Metric', 'Value', 'Change %'])
  sections.push(['Total Interns', summary.totalInterns, summary.totalInternsChange ?? ''])
  sections.push(['Active Projects', summary.activeProjects, summary.activeProjectsChange ?? ''])
  sections.push(['Tasks Completed', summary.completedTasks, summary.completedTasksChange ?? ''])
  sections.push(['Pending Tasks', summary.pendingTasks, summary.pendingTasksChange ?? ''])
  sections.push(['Work Logs', summary.workLogsThisWeek, summary.workLogsThisWeekChange ?? ''])
  sections.push(['Submissions', summary.totalSubmissions, summary.totalSubmissionsChange ?? ''])
  sections.push([])

  sections.push(['Task Status', 'Count'])
  for (const item of summary.tasksByStatus ?? []) {
    sections.push([item.name, item.value])
  }
  sections.push([])

  sections.push(['Day', 'Completed', 'Pending', 'Overdue'])
  for (const point of summary.taskProgressTrend ?? []) {
    sections.push([point.name, point.completed, point.pending, point.overdue])
  }
  sections.push([])

  sections.push(['Project', 'Progress %'])
  for (const item of summary.projectProgress ?? []) {
    sections.push([item.name, item.progressPercent])
  }
  sections.push([])

  sections.push(['Week', 'Work Logs'])
  for (const item of summary.workLogsByWeek ?? []) {
    sections.push([item.name, item.value])
  }
  sections.push([])

  sections.push(['Intern', 'Score %'])
  for (const item of summary.topInterns ?? []) {
    sections.push([item.name, item.score])
  }

  const csv = rowsToCsv(sections)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `internship-report-${range.toLowerCase()}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
