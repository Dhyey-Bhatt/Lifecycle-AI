import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [actioning, setActioning] = useState(null)
  const [msg, setMsg] = useState({ text:'', type:'' })

  const loadApprovals = async () => {
    try {
      const res = await fetchWithAuth('/api/approvals')
      if (res.ok) { const d = await res.json(); if (d.success) setApprovals(d.approvals) }
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadApprovals() }, [])

  const select = app => { setSelected(app); setRemarks(''); setMsg({ text:'', type:'' }) }

  const resolve = async (status) => {
    if (!selected) return
    setActioning(selected.id); setMsg({ text:'', type:'' })
    try {
      const res = await fetchWithAuth(`/api/approvals/${selected.id}`, {
        method:'PUT', body: JSON.stringify({ status, remarks: remarks.trim() || `Resolved as ${status}` })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg({ text:`Procurement request ${status}!`, type:'success' })
        setSelected(null); loadApprovals()
      } else { setMsg({ text: d.message||'Action failed.', type:'error' }) }
    } catch { setMsg({ text:'Connection error.', type:'error' }) }
    finally { setActioning(null) }
  }

  const statusBadge = s => s==='approved'?'badge-green':s==='rejected'?'badge-red':'badge-gold'

  const inp = { width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #E6DDD0', background:'#FDFCFA', fontSize:'0.875rem', color:'#1C1914', outline:'none', minHeight:'80px', resize:'vertical' }

  const pending = approvals.filter(a => a.status==='pending')
  const resolved = approvals.filter(a => a.status!=='pending')

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>Approval Workflow</h1>
          <p>Review and action procurement approval requests</p>
        </div>
        <span className="badge badge-gold">{pending.length} pending</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'24px', alignItems:'start' }}>
        {/* Left: approval list */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #F0EBE2' }}>
            <h2 style={{ margin:0, fontSize:'1rem', fontWeight:'700', color:'#1C1914' }}>Incoming Requests ({approvals.length})</h2>
          </div>
          {loading ? (
            <p style={{ padding:'40px', textAlign:'center', color:'#8C7B6A' }}>Loading…</p>
          ) : approvals.length === 0 ? (
            <p style={{ padding:'40px', textAlign:'center', color:'#8C7B6A' }}>No approval records found.</p>
          ) : (
            <div style={{ maxHeight:'550px', overflowY:'auto' }}>
              {approvals.map(app => (
                <div key={app.id} onClick={() => select(app)} style={{
                  padding:'14px 20px', borderBottom:'1px solid #F0EBE2', cursor:'pointer',
                  background: selected?.id===app.id ? '#EBF5EE' : 'transparent',
                  transition:'background 0.15s'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <strong style={{ fontSize:'0.875rem', color:'#1C1914' }}>Request #{app.id}</strong>
                    <span className={`badge ${statusBadge(app.status)}`}>{app.status}</span>
                  </div>
                  <p style={{ margin:'0 0 4px', fontSize:'0.8rem', color:'#4A4034' }}>
                    RFQ #{app.rfq_id} · Quote #{app.quotation_id}
                  </p>
                  <span style={{ fontSize:'0.75rem', color:'#B0A090' }}>{new Date(app.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: detail + action */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {!selected ? (
            <div className="card" style={{ textAlign:'center', padding:'60px', border:'2px dashed #E6DDD0' }}>
              <p style={{ color:'#8C7B6A', margin:0 }}>Select an approval request from the left to review and action it.</p>
            </div>
          ) : (
            <>
              {/* Approval card */}
              <div className="card">
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
                  <div>
                    <p style={{ margin:'0 0 2px', fontSize:'0.72rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:'#8C7B6A' }}>Approval Case</p>
                    <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:'800', color:'#1C1914' }}>Request #{selected.id}</h2>
                  </div>
                  <span className={`badge ${statusBadge(selected.status)}`} style={{ height:'fit-content' }}>{selected.status}</span>
                </div>

                {/* Stepper */}
                <div style={{ display:'flex', alignItems:'center', marginBottom:'20px', gap:'0' }}>
                  {['Submitted','Under Review','Decision'].map((s,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', flex: i<2?1:'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <div style={{ width:'24px', height:'24px', borderRadius:'50%', background: selected.status!=='pending'&&i<2?'#EBF5EE':i===1?'#2D7D4E':'#F0EBE2', color: selected.status!=='pending'&&i<2?'#2D7D4E':i===1?'#FFF':'#8C7B6A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:'800' }}>
                          {selected.status!=='pending'&&i===2 ? '✓' : i+1}
                        </div>
                        <span style={{ fontSize:'0.72rem', fontWeight:'600', color:'#8C7B6A', whiteSpace:'nowrap' }}>{s}</span>
                      </div>
                      {i<2 && <div style={{ flex:1, height:'2px', background:'#E6DDD0', margin:'0 6px' }} />}
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' }}>
                  {[
                    { label:'RFQ Reference', value:`#${selected.rfq_id}` },
                    { label:'Quotation Selected', value:`#${selected.quotation_id}` },
                    { label:'Date Submitted', value:new Date(selected.created_at).toLocaleDateString() },
                    { label:'Current Status', value:selected.status.toUpperCase() },
                  ].map(f => (
                    <div key={f.label} style={{ padding:'10px 14px', background:'#F7F4EE', borderRadius:'8px' }}>
                      <p style={{ margin:'0 0 2px', fontSize:'0.72rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em', color:'#8C7B6A' }}>{f.label}</p>
                      <p style={{ margin:0, fontSize:'0.875rem', fontWeight:'700', color:'#1C1914' }}>{f.value}</p>
                    </div>
                  ))}
                </div>

                {selected.status === 'pending' ? (
                  <div style={{ borderTop:'1px solid #F0EBE2', paddingTop:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
                    <div>
                      <label style={{ fontSize:'0.78rem', fontWeight:'600', color:'#4A4034', display:'block', marginBottom:'6px' }}>Review Remarks</label>
                      <textarea style={inp} value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Specify your approval remarks, conditions, or rejection reason…" disabled={!!actioning} />
                    </div>
                    {msg.text && <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'600', color: msg.type==='success'?'#2D7D4E':'#C0392B' }}>{msg.text}</p>}
                    <div style={{ display:'flex', gap:'10px' }}>
                      <button onClick={() => resolve('approved')} disabled={!!actioning} style={{ flex:1, padding:'11px', borderRadius:'10px', background:'#2D7D4E', color:'#FFF', border:'none', fontWeight:'700', cursor:'pointer' }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => resolve('rejected')} disabled={!!actioning} style={{ flex:1, padding:'11px', borderRadius:'10px', background:'#FDECEA', color:'#C0392B', border:'1px solid #F2B8B3', fontWeight:'700', cursor:'pointer' }}>
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ borderTop:'1px solid #F0EBE2', paddingTop:'12px' }}>
                    <p style={{ fontSize:'0.75rem', fontWeight:'600', color:'#8C7B6A', margin:'0 0 4px' }}>Resolution Remarks</p>
                    <p style={{ margin:0, fontSize:'0.875rem', color:'#1C1914', fontStyle:'italic' }}>"{selected.remarks}"</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quotation summary card */}
          {selected && (
            <div className="card">
              <p className="section-title">Quotation Summary</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {[
                  { l:'Vendor', v:'Infra Supplies Ltd' },
                  { l:'Delivery', v:'15 days' },
                  { l:'Rating', v:'4.2 ★' },
                  { l:'Total Price', v:'₹1,85,400' },
                ].map(i => (
                  <div key={i.l} style={{ padding:'8px 12px', background:'#F7F4EE', borderRadius:'8px' }}>
                    <p style={{ margin:'0 0 2px', fontSize:'0.7rem', color:'#8C7B6A', fontWeight:'600', textTransform:'uppercase' }}>{i.l}</p>
                    <p style={{ margin:0, fontWeight:'700', fontSize:'0.875rem', color:'#1C1914' }}>{i.v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
