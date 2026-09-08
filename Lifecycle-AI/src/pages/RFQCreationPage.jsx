import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWithAuth } from '../App.jsx'

export default function RFQCreationPage() {
  const [rfqs, setRfqs] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title:'', description:'', productDetails:'', quantity:1, deadline:'' })
  const [selectedVendors, setSelectedVendors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ text:'', type:'' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const loadData = async () => {
    try {
      const [r1,r2] = await Promise.all([fetchWithAuth('/api/rfqs'), fetchWithAuth('/api/vendors')])
      if (r1.ok) { const d = await r1.json(); setRfqs(d.rfqs || []) }
      if (r2.ok) { const d = await r2.json(); setVendors(d.vendors || []) }
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const toggleVendor = id => setSelectedVendors(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setMsg({ text:'', type:'' })
    try {
      const res = await fetchWithAuth('/api/rfqs', {
        method:'POST',
        body: JSON.stringify({ title:form.title.trim(), description:form.description, product_details:form.productDetails, quantity:Number(form.quantity), deadline:form.deadline||null, assigned_vendors:selectedVendors })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg({ text:'RFQ created and assigned to vendors!', type:'success' })
        setForm({ title:'', description:'', productDetails:'', quantity:1, deadline:'' })
        setSelectedVendors([])
        setStep(1)
        loadData()
      } else { setMsg({ text: d.message||'Failed to create RFQ.', type:'error' }) }
    } catch { setMsg({ text:'Connection error.', type:'error' }) }
    finally { setSubmitting(false) }
  }

  const inp = { width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #E6DDD0', background:'#FDFCFA', fontSize:'0.875rem', color:'#1C1914', outline:'none' }
  const lbl = { fontSize:'0.78rem', fontWeight:'600', color:'#4A4034', display:'block', marginBottom:'4px' }

  const STEPS = ['RFQ Details','Line Items','Assign Vendors']

  return (
    <div className="content-area">
      <div className="page-header">
        <h1>Create RFQ's</h1>
        <p>New request for quotation</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:'24px', alignItems:'start' }}>
        {/* Form */}
        <div className="card">
          {/* Stepper */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:'24px', gap:'0' }}>
            {STEPS.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer' }} onClick={() => setStep(i+1)}>
                  <div style={{
                    width:'26px', height:'26px', borderRadius:'50%', flexShrink:0,
                    background: step > i+1 ? '#EBF5EE' : step === i+1 ? '#2D7D4E' : '#F0EBE2',
                    color: step > i+1 ? '#2D7D4E' : step === i+1 ? '#FFF' : '#8C7B6A',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'0.72rem', fontWeight:'800'
                  }}>{step > i+1 ? '✓' : i+1}</div>
                  <span style={{ fontSize:'0.72rem', fontWeight: step===i+1?'700':'500', color: step===i+1?'#1C1914':'#8C7B6A', whiteSpace:'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length-1 && <div style={{ flex:1, height:'2px', background:'#E6DDD0', margin:'0 6px' }} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div><label style={lbl}>RFQ Title *</label><input style={inp} placeholder="Office Furniture Procurement Q2" value={form.title} onChange={set('title')} required /></div>
                <div><label style={lbl}>Line Total</label><input style={inp} placeholder="₹0.00" /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <div><label style={lbl}>Qty</label><input type="number" min="1" style={inp} value={form.quantity} onChange={set('quantity')} /></div>
                  <div><label style={lbl}>Unit Price</label><input style={inp} placeholder="0.00" /></div>
                </div>
                <div><label style={lbl}>Deadline</label><input type="date" style={inp} value={form.deadline} onChange={set('deadline')} /></div>
                <div><label style={lbl}>Description</label><textarea style={{ ...inp, minHeight:'70px', resize:'vertical' }} value={form.description} onChange={set('description')} placeholder="Describe the procurement need…" /></div>
                <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ marginTop:'8px' }}>Next →</button>
              </div>
            )}
            {step === 2 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div><label style={lbl}>Product / Service Specifications</label><textarea style={{ ...inp, minHeight:'100px', resize:'vertical' }} value={form.productDetails} onChange={set('productDetails')} placeholder="Detailed specs, brand preferences, quality requirements…" /></div>
                <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex:1 }}>← Back</button>
                  <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex:1 }}>Next →</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div>
                  <label style={lbl}>Send & Assign to Vendors ({vendors.length})</label>
                  <div style={{ border:'1px solid #E6DDD0', borderRadius:'8px', maxHeight:'180px', overflowY:'auto', padding:'8px' }}>
                    {vendors.length === 0 ? (
                      <p style={{ fontSize:'0.82rem', color:'#8C7B6A', padding:'8px' }}>No vendors. Register vendors first.</p>
                    ) : vendors.map(v => (
                      <label key={v.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'6px 4px', cursor:'pointer', fontSize:'0.875rem' }}>
                        <input type="checkbox" checked={selectedVendors.includes(v.id)} onChange={() => toggleVendor(v.id)} />
                        <span style={{ fontWeight:'500', color:'#1C1914' }}>{v.name}</span>
                        <span style={{ fontSize:'0.75rem', color:'#8C7B6A', marginLeft:'auto' }}>{v.category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {msg.text && <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'600', color: msg.type==='success'?'#2D7D4E':'#C0392B' }}>{msg.text}</p>}
                <div style={{ display:'flex', gap:'8px', marginTop:'4px' }}>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex:1 }}>← Back</button>
                  <button type="submit" disabled={submitting || selectedVendors.length===0} className="btn btn-primary" style={{ flex:1, opacity: selectedVendors.length===0 ? 0.5 : 1 }}>
                    {submitting ? 'Creating…' : 'Send to Vendors'}
                  </button>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex:1, fontSize:'0.8rem' }}>Save as Draft</button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* RFQ List */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #F0EBE2' }}>
            <h2 style={{ margin:0, fontSize:'1rem', fontWeight:'700', color:'#1C1914' }}>Active Procurement Tenders</h2>
          </div>
          {loading ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#8C7B6A' }}>Loading RFQs…</p>
          ) : rfqs.length === 0 ? (
            <p style={{ textAlign:'center', padding:'40px', color:'#8C7B6A' }}>No RFQs created yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Qty</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map(r => (
                  <tr key={r.id}>
                    <td>
                      <p style={{ margin:'0 0 2px', fontWeight:'600', color:'#1C1914' }}>{r.title}</p>
                      <p style={{ margin:0, fontSize:'0.78rem', color:'#8C7B6A' }}>{r.description}</p>
                    </td>
                    <td>{r.quantity}</td>
                    <td style={{ fontSize:'0.82rem', color:'#8C7B6A' }}>{r.deadline ? new Date(r.deadline).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${r.status==='active'?'badge-gold':'badge-green'}`}>{r.status}</span>
                    </td>
                    <td>
                      <Link to={`/comparison/${r.id}`} className="btn btn-secondary btn-sm">Compare Quotes</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
