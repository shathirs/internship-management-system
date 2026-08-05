import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getTasks, deleteTask } from '../../../services/taskService'
import { getProjects } from '../../../services/projectService'
import { getInterns } from '../../../services/internService'

export function TaskListPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [projectId, setProjectId] = useState('')

  const projectsById = useMemo(() => {
    return Object.fromEntries(projects.map((p) => [p.id, p]))
  }, [projects])

  const internsById = useMemo(() => {
    return Object.fromEntries(interns.map((i) => [i.id, i]))
  }, [interns])

  async function loadLookups() {
    try {
      const [projectList, internList] = await Promise.all([
        getProjects(),
        getInterns(),
      ])
      setProjects(projectList)
      setInterns(internList)
    } catch {
      toast.error('Failed to load projects or interns')
    }
  }

  async function loadTasks() {
    setLoading(true)
    try {
      const data = await getTasks({
        search: search || undefined,
        status: status || undefined,
        projectId: projectId || undefined,
      })
      setTasks(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLookups()
    loadTasks()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadTasks()
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this task?')
    if (!confirmed) return

    try {
      await deleteTask(id)
      toast.success('Task deleted')
      loadTasks()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Task Management</h1>
          <p>Create, assign, and track internship tasks.</p>
        </div>
        <Link to="/admin/tasks/new" className="btn-primary">
          Create Task
        </Link>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="REVISION_REQUIRED">Revision Required</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </form>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{projectsById[task.projectId]?.name || '—'}</td>
                  <td>{task.priority || '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${task.status?.toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.deadline || '—'}</td>
                  <td>
                    {task.assignedInternId
                      ? internsById[task.assignedInternId]?.fullName || '—'
                      : 'Unassigned'}
                  </td>
                  <td className="table-actions">
                    <Link
                      to={`/admin/tasks/${task.id}/assign`}
                      title="Assign"
                      aria-label="Assign"
                    >
                      <UserPlus size={18} />
                    </Link>
                    <Link
                      to={`/admin/tasks/${task.id}/edit`}
                      title="Edit"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      type="button"
                      className="action-danger"
                      title="Delete"
                      aria-label="Delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
