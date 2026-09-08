import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../App.jsx'

export default function QuotationComparisonPage() {
  const { rfqId } = useParams()
  const navigate = useNavigate()
  const [rfq, setRfq] = useState(null)
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ text:'', type:'' })

  useEffect(() => {
    const load = async () => {
      try {
        const [r1,r2] = await Promise.all([fetchWithAuth('/api/rfqs'), fetchWithAuth(`/api/rfqs/${rfqId}/quotations`)])
        if (r1.ok) { const d = await r1.json(); setRfq(d.rfqs?.find(r => String(r.id)===rfqId)) }
        if (r2.ok) { const d = await r2.json(); setQuotations(d.quotations||[]) }
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    load()
  }, [rfqId])

  const lowestPrice = quotations.length > 0 ? Math.min(...quotations.map(q => Number(q.pricing_details))) : null

  const handleApproval = async () => {
    if (!selectedId) return
    setSubmitting(true); setMsg({ text:'', type:'' })
    try {
      const res = await fetchWithAuth('/api/approvals', {
        method:'POST', body: JSON.stringify({ rfq_id:Number(rfqId), quotation_id:Number(selectedId) })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg({ text:'Submitted for manager approval!', type:'success' })
        setTimeout(() => navigate('/rfqs'), 1500)
      } else { setMsg({ text: d.message||'Failed.', type:'error' }) }
    } catch { setMsg({ text:'Connection error.', type:'error' }) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>Quotation Comparison</h1>
          <p>RFQ: {rfq?.title || `#${rfqId}`} — {quotations.length} quotation{quotations.length !== 1 ? 's' : ''} received</p>
        </div>
        <Link to="/rfqs" className="btn btn-secondary btn-sm">← Back to RFQs</Link>
      </div>

      {loading ? (
        <p style={{ textAlign:'center', padding:'60px', color:'#8C7B6A' }}>Loading comparison…</p>
      ) : quotations.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'60px' }}>
          <h3 style={{ margin:'0 0 8px', color:'#1C1914' }}>No Quotations Submitted Yet</h3>
          <p style={{ color:'#8C7B6A', margin:0 }}>Vendors haven't submitted any bids for this RFQ yet.</p>
        </div>
      ) : (
        <>
          {/* Comparison table */}
          <div className="card" style={{ marginBottom:'20px', padding:0, overflowX:'auto' }}>
            <table className="data-table" style={{ minWidth:'600px' }}>
              <thead>
                <tr>
                  <th>Criteria</th>
                  {quotations.map(q => (
                    <th key={q.id} style={{ textAlign:'center', background: selectedId===q.id ? '#EBF5EE' : undefined }}>
                      {q.vendor_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight:'600', color:'#8C7B6A' }}>Grand Total</td>
                  {quotations.map(q => {
                    const isLow = Number(q.pricing_details) === lowestPrice
                    return (
                      <td key={q.id} style={{ textAlign:'center' }}>
                        <span style={{ fontWeight:'800', fontSize:'1.1rem', color: isLow ? '#2D7D4E' : '#1C1914' }}>
                          ₹{Number(q.pricing_details).toLocaleString()}
                        </span>
                        {isLow && <span className="badge badge-green" style={{ marginLeft:'6px', fontSize:'0.65rem' }}>Lowest</span>}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td style={{ fontWeight:'600', color:'#8C7B6A' }}>Delivery (days)</td>
                  {quotations.map(q => <td key={q.id} style={{ textAlign:'center', fontWeight:'600' }}>{q.delivery_timeline} days</td>)}
                </tr>
                <tr>
                  <td style={{ fontWeight:'600', color:'#8C7B6A' }}>Payment Terms</td>
                  {quotations.map(q => <td key={q.id} style={{ textAlign:'center', color:'#4A4034' }}>30 days</td>)}
                </tr>
                <tr>
                  <td style={{ fontWeight:'600', color:'#8C7B6A' }}>Notes</td>
                  {quotations.map(q => <td key={q.id} style={{ textAlign:'center', fontSize:'0.8rem', color:'#8C7B6A', fontStyle:'italic' }}>{q.notes || '—'}</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quote cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:'16px', marginBottom:'20px' }}>
            {quotations.map(q => {
              const isLow = Number(q.pricing_details) === lowestPrice
              const isSel = selectedId === q.id
              return (
                <div key={q.id} onClick={() => setSelectedId(q.id)} style={{
                  background: isSel ? '#EBF5EE' : '#FFF',
                  border: `2px solid ${isSel ? '#2D7D4E' : isLow ? '#B8D4C0' : '#E6DDD0'}`,
                  borderRadius:'16px', padding:'20px', cursor:'pointer',
                  transition:'all 0.15s', transform: isSel ? 'translateY(-2px)' : 'none',
                  boxShadow: isSel ? '0 4px 20px rgba(45,125,78,0.15)' : 'none'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                    <h3 style={{ margin:0, fontSize:'0.95rem', fontWeight:'700', color:'#1C1914' }}>{q.vendor_name}</h3>
                    {isLow && <span className="badge badge-green">Lowest</span>}
                  </div>
                  <p style={{ margin:'0 0 4px', fontSize:'1.6rem', fontWeight:'800', color: isLow ? '#2D7D4E' : '#1C1914', letterSpacing:'-0.02em' }}>
                    ₹{Number(q.pricing_details).toLocaleString()}
                  </p>
                  <p style={{ margin:'0 0 12px', fontSize:'0.8rem', color:'#8C7B6A' }}>Delivery: {q.delivery_timeline} days</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <input type="radio" checked={isSel} onChange={() => setSelectedId(q.id)} style={{ width:'auto', margin:0 }} />
                    <span style={{ fontSize:'0.82rem', fontWeight:'600', color: isSel ? '#2D7D4E' : '#8C7B6A' }}>
                      {isSel ? '✓ Selected' : 'Select for Approval'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action bar */}
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px' }}>
            <div>
              {msg.text && <p style={{ margin:0, fontSize:'0.85rem', fontWeight:'600', color: msg.type==='success'?'#2D7D4E':'#C0392B' }}>{msg.text}</p>}
              {!msg.text && <p style={{ margin:0, fontSize:'0.875rem', color:'#8C7B6A' }}>
                {selectedId ? `Quotation #${selectedId} selected. Click to send for manager approval.` : 'Select a quotation above to continue.'}
              </p>}
            </div>
            <div style={{ display:'flex', gap:'10px', flexShrink:0 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedId(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={!selectedId || submitting} onClick={handleApproval} style={{ opacity: !selectedId ? 0.5 : 1 }}>
                {submitting ? 'Submitting…' : 'Send & Approve'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
