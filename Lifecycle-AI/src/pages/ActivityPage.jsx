import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

const FILTERS = ['All', 'Approvals', 'Delivery', 'Vendors', 'RFQs', 'Invoices']

const TYPE_COLORS = {
  Approvals: { bg: '#EBF5EE', color: '#2D7D4E', icon: '✓' },
  Delivery:  { bg: '#FBF3E3', color: '#B8923A', icon: '◉' },
  Vendors:   { bg: '#F0EBE2', color: '#8C7B6A', icon: '◎' },
  RFQs:      { bg: '#FAF0E8', color: '#C4713A', icon: '◈' },
  Invoices:  { bg: '#FDECEA', color: '#C0392B', icon: '◆' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ActivityPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetchWithAuth('/api/logs')
        if (res.ok) {
          const data = await res.json()
          setLogs(data.logs || [])
        }
      } catch {
        // Use mock data if backend not available
        setLogs(MOCK_LOGS)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filtered = filter === 'All' ? logs : logs.filter(l => l.type === filter)

  const counts = FILTERS.slice(1).reduce((acc, f) => {
    acc[f] = logs.filter(l => l.type === f).length
    return acc
  }, {})

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>Activity &amp; Logs</h1>
          <p>Procurement audit trail — all actions tracked</p>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#8C7B6A', background: '#F0EBE2', padding: '4px 12px', borderRadius: '99px', fontWeight: '600' }}>
          {logs.length} events
        </span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '99px',
              border: '1px solid',
              borderColor: filter === f ? '#2D7D4E' : '#E6DDD0',
              background: filter === f ? '#EBF5EE' : '#FFF',
              color: filter === f ? '#2D7D4E' : '#4A4034',
              fontWeight: filter === f ? '700' : '500',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {f}{f !== 'All' && counts[f] ? ` (${counts[f]})` : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        {/* Log feed */}
        <div className="card" style={{ padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8C7B6A' }}>Loading activity…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8C7B6A' }}>No activity found.</div>
          ) : (
            filtered.map((log, i) => {
              const style = TYPE_COLORS[log.type] || TYPE_COLORS['Vendors']
              return (
                <div key={log.id || i} style={{
                  display: 'flex', gap: '14px', padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #F0EBE2' : 'none',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: style.bg, color: style.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: '700', flexShrink: 0
                  }}>
                    {style.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#1C1914', lineHeight: 1.5 }}>
                      {log.action}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#8C7B6A' }}>{log.username}</span>
                      <span style={{ fontSize: '0.72rem', color: '#B0A090' }}>·</span>
                      <span style={{ fontSize: '0.75rem', color: '#B0A090' }}>{timeAgo(log.created_at)}</span>
                      {log.type && (
                        <span style={{
                          fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px',
                          borderRadius: '99px', background: style.bg, color: style.color
                        }}>
                          {log.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Summary sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <p className="section-title">Activity by type</p>
            {Object.entries(counts).map(([type, count]) => {
              const s = TYPE_COLORS[type]
              return (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.82rem', color: '#4A4034', fontWeight: '500' }}>{type}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1C1914' }}>{count}</span>
                </div>
              )
            })}
          </div>

          <div className="card">
            <p className="section-title">Audit info</p>
            <p style={{ fontSize: '0.8rem', color: '#8C7B6A', margin: 0, lineHeight: 1.6 }}>
              All logs are write-once and immutable. Audit trails are retained for compliance and review purposes.
              Logs are also sent to Supabase for centralized storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const MOCK_LOGS = [
  { id: 1, action: 'RFQ created — Office Furniture Procurement Q2', username: 'sarah.procure', type: 'RFQs', created_at: new Date(Date.now() - 2*60000).toISOString() },
  { id: 2, action: 'Approval granted — PO-2024 approved by manager', username: 'john.manager', type: 'Approvals', created_at: new Date(Date.now() - 35*60000).toISOString() },
  { id: 3, action: 'Vendor registered — TechCore Ltd added to registry', username: 'admin', type: 'Vendors', created_at: new Date(Date.now() - 2*3600000).toISOString() },
  { id: 4, action: 'Quotation submitted — Office Furniture Q2 by Infra Supplies', username: 'infra.vendor', type: 'RFQs', created_at: new Date(Date.now() - 5*3600000).toISOString() },
  { id: 5, action: 'Invoice INV-2024-003 marked as Paid', username: 'sarah.procure', type: 'Invoices', created_at: new Date(Date.now() - 24*3600000).toISOString() },
  { id: 6, action: 'Delivery confirmed — Furniture order received at warehouse', username: 'john.manager', type: 'Delivery', created_at: new Date(Date.now() - 48*3600000).toISOString() },
  { id: 7, action: 'Vendor Pathfinder Transport flagged for late delivery validation', username: 'sarah.procure', type: 'Vendors', created_at: new Date(Date.now() - 3*24*3600000).toISOString() },
  { id: 8, action: 'RFQ closed — Stationery Q1 2025 finalized', username: 'admin', type: 'RFQs', created_at: new Date(Date.now() - 4*24*3600000).toISOString() },
]
