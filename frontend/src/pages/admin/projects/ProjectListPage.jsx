import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { getProjects, deleteProject } from '../../../services/projectService'

export function ProjectListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  async function loadProjects() {
    setLoading(true)
    try {
      const data = await getProjects({
        search: search || undefined,
        status: status || undefined,
      })
      setProjects(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadProjects()
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this project?')
    if (!confirmed) return

    try {
      await deleteProject(id)
      toast.success('Project deleted')
      loadProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Project Management</h1>
          <p>Create, search, and manage internship projects.</p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary">
          Create Project
        </Link>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search name, technology..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </form>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Technology</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.technology || '—'}</td>
                  <td>{project.deadline || '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${project.status?.toLowerCase()}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>{project.assignedInternIds?.length || 0}</td>
                  <td className="table-actions">
                    <Link
                      to={`/admin/projects/${project.id}/edit`}
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
                      onClick={() => handleDelete(project.id)}
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
