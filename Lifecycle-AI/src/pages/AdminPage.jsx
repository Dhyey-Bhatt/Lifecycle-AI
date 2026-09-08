import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

const ROLES = ['procurement_officer', 'vendor', 'manager_approver', 'admin']
const ROLE_LABELS = {
  procurement_officer: 'Procurement Officer',
  vendor: 'Vendor',
  manager_approver: 'Manager / Approver',
  admin: 'Admin'
}
const ROLE_BADGE = {
  procurement_officer: 'badge-green',
  vendor: 'badge-gold',
  manager_approver: 'badge-orange',
  admin: 'badge-red'
}

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [stats, setStats] = useState({ users: 0, vendors: 0, rfqs: 0, pos: 0 })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('users')
  const [updatingId, setUpdatingId] = useState(null)
  const [msg, setMsg] = useState('')

  const loadData = async () => {
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetchWithAuth('/api/users').catch(() => null),
        fetchWithAuth('/api/vendors').catch(() => null),
        fetchWithAuth('/api/rfqs').catch(() => null),
        fetchWithAuth('/api/purchase-orders').catch(() => null),
      ])
      const usersData = r1?.ok ? (await r1.json()).users || [] : []
      const vendorsData = r2?.ok ? (await r2.json()).vendors || [] : []
      const rfqsData = r3?.ok ? (await r3.json()).rfqs || [] : []
      const posData = r4?.ok ? (await r4.json()).purchaseOrders || [] : []
      setUsers(usersData)
      setVendors(vendorsData)
      setStats({ users: usersData.length, vendors: vendorsData.length, rfqs: rfqsData.length, pos: posData.length })
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const updateRole = async (userId, newRole) => {
    setUpdatingId(userId); setMsg('')
    try {
      const res = await fetchWithAuth(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify({ role: newRole }) })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg('Role updated successfully.')
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      } else { setMsg(d.message || 'Update failed.') }
    } catch { setMsg('Connection error.') }
    finally { setUpdatingId(null) }
  }

  const toggleVendorStatus = async (vendorId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetchWithAuth(`/api/vendors/${vendorId}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) })
      if (res.ok) setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: newStatus } : v))
    } catch { /* ignore */ }
  }

  const inp = { padding: '6px 10px', borderRadius: '8px', border: '1px solid #E6DDD0', background: '#FDFCFA', fontSize: '0.82rem', color: '#1C1914', outline: 'none' }

  return (
    <div className="content-area">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage users, vendors &amp; view procurement analytics</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Users', value: stats.users, cls: 'stat-green' },
          { label: 'Registered Vendors', value: stats.vendors, cls: 'stat-gold' },
          { label: 'Active RFQs', value: stats.rfqs, cls: 'stat-orange' },
          { label: 'Purchase Orders', value: stats.pos, cls: 'stat-red' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ fontSize: '1.8rem' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[['users', 'User Management'], ['vendors', 'Vendor Registry']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 20px', borderRadius: '10px', border: '1px solid',
            borderColor: tab === key ? '#2D7D4E' : '#E6DDD0',
            background: tab === key ? '#EBF5EE' : '#FFF',
            color: tab === key ? '#2D7D4E' : '#4A4034',
            fontWeight: tab === key ? '700' : '500',
            fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s'
          }}>{label}</button>
        ))}
      </div>

      {msg && (
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>{msg}</div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px', color: '#8C7B6A' }}>Loading…</p>
      ) : tab === 'users' ? (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0EBE2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1C1914' }}>All Users ({users.length})</h2>
            <span className="text-muted">Change roles directly from the dropdown</span>
          </div>
          {users.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#8C7B6A' }}>
              No users found. Users are populated from Supabase Auth profiles.
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>User ID</th>
                  <th>Current Role</th>
                  <th>Joined</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '700', color: '#1C1914' }}>{u.username}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#8C7B6A' }}>{u.id?.slice(0, 12)}…</td>
                    <td>
                      <span className={`badge ${ROLE_BADGE[u.role] || 'badge-gray'}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#B0A090' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={e => updateRole(u.id, e.target.value)}
                        style={{ ...inp, width: '180px' }}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0EBE2' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1C1914' }}>All Vendors ({vendors.length})</h2>
          </div>
          {vendors.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#8C7B6A' }}>No vendors registered yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>GST</th>
                  <th>Status</th>
                  <th>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: '700', color: '#1C1914' }}>{v.name}</td>
                    <td style={{ color: '#4A4034' }}>{v.email}</td>
                    <td><span className="badge badge-gray">{v.category}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#B8923A' }}>{v.gst_details || '—'}</td>
                    <td>
                      <span className={`badge ${v.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleVendorStatus(v.id, v.status)}
                        className={`btn btn-sm ${v.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                      >
                        {v.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
