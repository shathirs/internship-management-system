import { getMySubmissions, getSubmissions } from './submissionService'
import { getMyWorkLogs, getWorkLogs } from './workLogService'
import { getMyTasks, getTasks } from './taskService'

export function mapSubmissionToFeedback(submission, { taskTitle, href } = {}) {
  return {
    id: `submission-${submission.id}`,
    source: 'SUBMISSION',
    sourceId: submission.id,
    title: taskTitle ? `Task: ${taskTitle}` : 'Submission',
    status: submission.status,
    comment: submission.adminComment || null,
    date: submission.reviewedAt || submission.updatedAt || submission.createdAt || null,
    internId: submission.internId || null,
    href,
  }
}

export function mapWorkLogToFeedback(log, { href } = {}) {
  return {
    id: `worklog-${log.id}`,
    source: 'WORK_LOG',
    sourceId: log.id,
    title: `Work log · ${log.logDate || 'Unknown date'}`,
    status: log.status,
    comment: log.adminComment || null,
    date: log.reviewedAt || log.updatedAt || log.createdAt || null,
    internId: log.internId || null,
    href,
  }
}

export function hasFeedback(item) {
  return Boolean(item.comment) || (item.status && item.status !== 'SUBMITTED')
}

export function isPending(item) {
  return item.status === 'SUBMITTED'
}

export function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da
  })
}

export async function getInternFeedbackInbox() {
  const [submissions, workLogs, tasks] = await Promise.all([
    getMySubmissions(),
    getMyWorkLogs(),
    getMyTasks(),
  ])

  const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]))

  const fromSubmissions = submissions.map((s) =>
    mapSubmissionToFeedback(s, {
      taskTitle: tasksById[s.taskId]?.title,
      href: '/intern/submissions',
    })
  )

  const fromWorkLogs = workLogs.map((log) =>
    mapWorkLogToFeedback(log, {
      href: '/intern/work-logs',
    })
  )

  return sortByDateDesc(
    [...fromSubmissions, ...fromWorkLogs].filter(hasFeedback)
  )
}

export async function getAdminFeedbackBoard() {
  const [submissions, workLogs, tasks] = await Promise.all([
    getSubmissions(),
    getWorkLogs(),
    getTasks(),
  ])

  const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]))

  const all = [
    ...submissions.map((s) =>
      mapSubmissionToFeedback(s, {
        taskTitle: tasksById[s.taskId]?.title,
        href: `/admin/submissions/${s.id}/review`,
      })
    ),
    ...workLogs.map((log) =>
      mapWorkLogToFeedback(log, {
        href: `/admin/work-logs/${log.id}/review`,
      })
    ),
  ]

  return {
    pending: sortByDateDesc(all.filter(isPending)),
    recent: sortByDateDesc(all.filter(hasFeedback)),
  }
}
