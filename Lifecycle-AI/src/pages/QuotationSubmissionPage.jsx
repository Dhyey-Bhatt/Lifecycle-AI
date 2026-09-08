import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

export default function QuotationSubmissionPage() {
  const [rfqs, setRfqs] = useState([])
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRfq, setSelectedRfq] = useState(null)
  const [pricing, setPricing] = useState('')
  const [timeline, setTimeline] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ text:'', type:'' })

  const loadData = async () => {
    try {
      const [r1,r2] = await Promise.all([fetchWithAuth('/api/rfqs'), fetchWithAuth('/api/quotations')])
      if (r1.ok) { const d = await r1.json(); setRfqs(d.rfqs||[]) }
      if (r2.ok) { const d = await r2.json(); setQuotations(d.quotations||[]) }
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const selectRfq = (rfq) => {
    setSelectedRfq(rfq)
    const ex = quotations.find(q => Number(q.rfq_id) === Number(rfq.id))
    if (ex) { setPricing(ex.pricing_details); setTimeline(ex.delivery_timeline); setNotes(ex.notes||'') }
    else { setPricing(''); setTimeline(''); setNotes('') }
    setMsg({ text:'', type:'' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRfq || !pricing || !timeline) return
    setSubmitting(true); setMsg({ text:'', type:'' })
    try {
      const res = await fetchWithAuth('/api/quotations', {
        method:'POST',
        body: JSON.stringify({ rfq_id:selectedRfq.id, pricing_details:Number(pricing), delivery_timeline:Number(timeline), notes:notes.trim() })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg({ text:'Quotation submitted successfully!', type:'success' })
        setPricing(''); setTimeline(''); setNotes(''); setSelectedRfq(null)
        loadData()
      } else { setMsg({ text: d.message||'Submission failed.', type:'error' }) }
    } catch { setMsg({ text:'Connection error.', type:'error' }) }
    finally { setSubmitting(false) }
  }

  const inp = { width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #E6DDD0', background:'#FDFCFA', fontSize:'0.875rem', color:'#1C1914', outline:'none' }
  const lbl = { fontSize:'0.78rem', fontWeight:'600', color:'#4A4034', display:'block', marginBottom:'4px' }

  const statusBadge = s => {
    if (s==='approved') return 'badge-green'
    if (s==='rejected') return 'badge-red'
    if (s==='selected') return 'badge-orange'
    return 'badge-gold'
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <h1>Submit Quotations</h1>
        <p>RFQ: {selectedRfq?.title || 'Select an RFQ below to submit your bid'}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'24px', alignItems:'start' }}>
        {/* Left: form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Your quotation form */}
          <div className="card">
            <h2 style={{ margin:'0 0 16px', fontSize:'1rem', fontWeight:'700', color:'#1C1914' }}>Your Quotation</h2>
            {!selectedRfq ? (
              <div style={{ padding:'24px', textAlign:'center', border:'2px dashed #E6DDD0', borderRadius:'12px', color:'#8C7B6A', fontSize:'0.875rem' }}>
                Select an RFQ from the right to submit your pricing proposal
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div style={{ padding:'10px 14px', background:'#EBF5EE', borderRadius:'8px', border:'1px solid #C3E0CE' }}>
                  <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'700', color:'#2D7D4E' }}>Bidding for: {selectedRfq.title}</p>
                  <p style={{ margin:'2px 0 0', fontSize:'0.75rem', color:'#4A7C5A' }}>Qty: {selectedRfq.quantity} · Deadline: {selectedRfq.deadline ? new Date(selectedRfq.deadline).toLocaleDateString() : 'Open'}</p>
                </div>
                <div><label style={lbl}>Qty</label><input style={inp} value={selectedRfq.quantity} disabled /></div>
                <div><label style={lbl}>Unit Price (₹)</label><input type="number" min="1" style={inp} placeholder="0.00" value={pricing} onChange={e=>setPricing(e.target.value)} required /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <div><label style={lbl}>Total Price (₹)</label><input style={inp} value={pricing ? `₹${Number(pricing).toLocaleString()}` : ''} readOnly /></div>
                  <div><label style={lbl}>Delivery (days)</label><input type="number" min="1" style={inp} value={timeline} onChange={e=>setTimeline(e.target.value)} required /></div>
                </div>
                <div><label style={lbl}>Payment Terms</label><input style={inp} placeholder="e.g. 30 days net" /></div>
                <div><label style={lbl}>Notes / Shipping Details</label><textarea style={{ ...inp, minHeight:'60px', resize:'vertical' }} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Specify warranty, shipping, special conditions…" /></div>
                {msg.text && <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'600', color: msg.type==='success'?'#2D7D4E':'#C0392B' }}>{msg.text}</p>}
                <div style={{ display:'flex', gap:'8px' }}>
                  <button type="submit" disabled={submitting} style={{ flex:1, padding:'10px', borderRadius:'10px', background:'#2D7D4E', color:'#FFF', border:'none', fontWeight:'700', cursor:'pointer' }}>
                    {submitting ? 'Submitting…' : 'Submit Quotation'}
                  </button>
                  <button type="button" onClick={() => setSelectedRfq(null)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Submitted bids */}
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #F0EBE2' }}>
              <h2 style={{ margin:0, fontSize:'0.9rem', fontWeight:'700', color:'#1C1914' }}>Your Submitted Bids ({quotations.length})</h2>
            </div>
            {quotations.length === 0 ? (
              <p style={{ padding:'20px', textAlign:'center', color:'#8C7B6A', fontSize:'0.875rem' }}>No quotations submitted yet.</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>RFQ #</th><th>Price</th><th>Timeline</th><th>Status</th></tr></thead>
                <tbody>
                  {quotations.map(q => (
                    <tr key={q.id}>
                      <td style={{ fontWeight:'600' }}>#{q.rfq_id}</td>
                      <td>₹{Number(q.pricing_details).toLocaleString()}</td>
                      <td>{q.delivery_timeline}d</td>
                      <td><span className={`badge ${statusBadge(q.status)}`}>{q.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: RFQ list */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #F0EBE2' }}>
            <h2 style={{ margin:0, fontSize:'1rem', fontWeight:'700', color:'#1C1914' }}>Assigned RFQ Tenders ({rfqs.length})</h2>
          </div>
          {loading ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#8C7B6A' }}>Loading…</p>
          ) : rfqs.length === 0 ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#8C7B6A' }}>No RFQs assigned to your profile.</p>
          ) : (
            <div style={{ maxHeight:'600px', overflowY:'auto' }}>
              {rfqs.map(rfq => {
                const bidded = quotations.some(q => Number(q.rfq_id) === Number(rfq.id))
                const isActive = rfq === selectedRfq
                return (
                  <div key={rfq.id} onClick={() => rfq.status==='active' && selectRfq(rfq)} style={{
                    padding:'16px 20px', borderBottom:'1px solid #F0EBE2', cursor: rfq.status==='active' ? 'pointer' : 'default',
                    background: isActive ? '#EBF5EE' : 'transparent',
                    transition:'background 0.15s'
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                      <h3 style={{ margin:0, fontSize:'0.925rem', fontWeight:'700', color:'#1C1914' }}>{rfq.title}</h3>
                      <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                        {bidded && <span className="badge badge-gold">Bid Submitted</span>}
                        <span className={`badge ${rfq.status==='active'?'badge-green':'badge-gray'}`}>{rfq.status}</span>
                      </div>
                    </div>
                    <p style={{ margin:'0 0 8px', fontSize:'0.8rem', color:'#8C7B6A', lineHeight:1.5 }}>{rfq.description}</p>
                    <div style={{ display:'flex', gap:'16px', fontSize:'0.78rem', color:'#B0A090' }}>
                      <span>Qty: <strong style={{ color:'#4A4034' }}>{rfq.quantity}</strong></span>
                      <span>Deadline: <strong style={{ color:'#4A4034' }}>{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'Open'}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
