export function InternViewModal({ intern, onClose }) {
    if (!intern) return null
  
    const rows = [
      { label: 'Full name', value: intern.fullName },
      { label: 'Email', value: intern.email },
      { label: 'Phone', value: intern.phone },
      { label: 'University', value: intern.university },
      { label: 'Department', value: intern.department },
      { label: 'Batch', value: intern.batch },
      { label: 'Start date', value: intern.startDate },
      { label: 'End date', value: intern.endDate },
      { label: 'Status', value: intern.status },
    ]
  
    return (
      <div className="modal-overlay" onClick={onClose} role="presentation">
        <div
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intern-view-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 id="intern-view-title">Intern details</h2>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
  
          <dl className="modal-details">
            {rows.map((row) => (
              <div key={row.label} className="modal-detail-row">
                <dt>{row.label}</dt>
                <dd>{row.value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }