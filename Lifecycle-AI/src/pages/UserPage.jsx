import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, fetchWithAuth } from '../App.jsx'

function UserPage() {
  const auth = useAuth()
  const [requests, setRequests] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchRequests = async () => {
    try {
      const res = await fetchWithAuth('/api/requests')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setRequests(data.requests)
        }
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setSubmitting(true)
    setMessage({ text: '', type: '' })

    try {
      const res = await fetchWithAuth('/api/requests', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ text: 'Request submitted successfully!', type: 'success' })
        setTitle('')
        setDescription('')
        fetchRequests() // Refresh list
      } else {
        setMessage({ text: data.message || 'Submission failed.', type: 'error' })
      }
    } catch (err) {
      setMessage({ text: 'Could not reach the backend server.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      display: 'inline-block',
      letterSpacing: '0.05em'
    }
    if (status === 'approved') {
      return {
        ...base,
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }
    } else if (status === 'rejected') {
      return {
        ...base,
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      }
    } else {
      return {
        ...base,
        background: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }
    }
  }

  return (
    <div className="page-shell">
      <div className="panel-card" style={{ width: 'min(900px, 100%)' }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">User Workspace</p>
            <h1>User Landing</h1>
            <p className="subtitle">Submit connection requests and track status in real-time.</p>
          </div>
          <button className="btn btn-secondary" onClick={auth.logout}>
            Sign out
          </button>
        </div>

        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', margin: '24px 0' }}>
          {/* Left Column: Form */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#ffffff' }}>New connection request</h2>
            <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '14px' }}>
              <label>
                Request title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Warehouse Database Access"
                  required
                  disabled={submitting}
                />
              </label>
              
              <label>
                Description & justification
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe why you need this connection..."
                  required
                  disabled={submitting}
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '14px 16px',
                    color: '#eef1ff',
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </label>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '8px' }}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>

              {message.text && (
                <p style={{
                  color: message.type === 'success' ? '#34d399' : '#ff9ca3',
                  margin: '4px 0 0 0',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  {message.text}
                </p>
              )}
            </form>
          </div>

          {/* Right Column: List of requests */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#ffffff' }}>Your Requests ({requests.length})</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {requests.length === 0 ? (
                <div className="summary-item" style={{ textAlign: 'center', opacity: 0.7 }}>
                  <p>No requests submitted yet.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="summary-item" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>{req.title}</h3>
                      <span style={getStatusBadgeStyle(req.status)}>{req.status}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#dce7ff', opacity: 0.9 }}>
                      {req.description}
                    </p>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
                      Submitted: {new Date(req.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserPage
