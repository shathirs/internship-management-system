import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import {
  getInterns,
  activateIntern,
  deactivateIntern,
  deleteIntern,
} from '../../../services/internService'
import { InternViewModal } from '../../../components/modals/InternViewModal'

export function InternListPage() {
  const [interns, setInterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedIntern, setSelectedIntern] = useState(null)

  async function loadInterns() {
    setLoading(true)
    try {
      const data = await getInterns({
        search: search || undefined,
        status: status || undefined,
      })
      setInterns(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load interns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterns()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadInterns()
  }

  async function handleActivate(id) {
    try {
      await activateIntern(id)
      toast.success('Intern activated')
      loadInterns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate intern')
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateIntern(id)
      toast.success('Intern deactivated')
      loadInterns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate intern')
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Delete this intern and their login account?'
    )
    if (!confirmed) return

    try {
      await deleteIntern(id)
      toast.success('Intern deleted')
      loadInterns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete intern')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Intern Management</h1>
          <p>Create, search, and manage internship accounts.</p>
        </div>
        <Link to="/admin/interns/new" className="btn-primary">
          Create Intern
        </Link>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search name, email, university..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </form>

      <div className="table-card">
        {loading ? (
          <p>Loading...</p>
        ) : interns.length === 0 ? (
          <p>No interns found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>University</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((intern) => (
                <tr key={intern.id}>
                  <td>{intern.fullName}</td>
                  <td>{intern.email}</td>
                  <td>{intern.department || '—'}</td>
                  <td>{intern.university || '—'}</td>
                  <td>
                    <span
                      className={`status-pill status-${intern.status?.toLowerCase()}`}
                    >
                      {intern.status}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      type="button"
                      title="View"
                      aria-label="View"
                      onClick={() => setSelectedIntern(intern)}
                    >
                      <Eye size={18} />
                    </button>
                    <Link
                      to={`/admin/interns/${intern.id}/edit`}
                      title="Edit"
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </Link>
                    {intern.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        title="Deactivate"
                        aria-label="Deactivate"
                        onClick={() => handleDeactivate(intern.id)}
                      >
                        <UserX size={18} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        title="Activate"
                        aria-label="Activate"
                        onClick={() => handleActivate(intern.id)}
                      >
                        <UserCheck size={18} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="action-danger"
                      title="Delete"
                      aria-label="Delete"
                      onClick={() => handleDelete(intern.id)}
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

      <InternViewModal
        intern={selectedIntern}
        onClose={() => setSelectedIntern(null)}
      />
    </DashboardLayout>
  )
}
