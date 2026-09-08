import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

const CATEGORIES = ['IT & Hardware','Software Licensing','Office Supplies','Logistics & Shipping','Consulting & Services','Furniture','Stationery']

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [form, setForm] = useState({ name:'', email:'', contact:'', gst:'', category:'IT & Hardware' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ text:'', type:'' })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const loadVendors = async () => {
    try {
      const res = await fetchWithAuth('/api/vendors')
      if (res.ok) { const d = await res.json(); if (d.success) setVendors(d.vendors) }
    } catch { /* ignore */ }
  }

  useEffect(() => { loadVendors() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setSubmitting(true); setMsg({ text:'', type:'' })
    try {
      const res = await fetchWithAuth('/api/vendors', {
        method: 'POST',
        body: JSON.stringify({ name:form.name.trim(), email:form.email.trim(), contact_details:form.contact, gst_details:form.gst, category:form.category })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        setMsg({ text:'Vendor registered successfully!', type:'success' })
        setForm({ name:'', email:'', contact:'', gst:'', category:'IT & Hardware' })
        loadVendors()
      } else { setMsg({ text: d.message || 'Registration failed.', type:'error' }) }
    } catch { setMsg({ text:'Failed to connect to server.', type:'error' }) }
    finally { setSubmitting(false) }
  }

  const filtered = vendors.filter(v =>
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || v.category === catFilter)
  )

  const inp = {
    width:'100%', padding:'9px 12px', borderRadius:'8px', border:'1px solid #E6DDD0',
    background:'#FDFCFA', fontSize:'0.875rem', color:'#1C1914', outline:'none'
  }

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>Vendors</h1>
          <p>Manage supplier profiles and registrations</p>
        </div>
        <span className="badge badge-green">{vendors.length} registered</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'24px', alignItems:'start' }}>
        {/* Add Vendor Form */}
        <div className="card">
          <h2 style={{ margin:'0 0 20px', fontSize:'1rem', fontWeight:'700', color:'#1C1914' }}>+ Add New Vendor</h2>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {[
              { k:'name', label:'Vendor Name', placeholder:'e.g. Acme Tech Solutions', type:'text', req:true },
              { k:'email', label:'Contact Email', placeholder:'info@vendor.com', type:'email', req:true },
              { k:'contact', label:'Contact Person', placeholder:'John Doe, +91 99998 88877', type:'text' },
              { k:'gst', label:'GST Number', placeholder:'07AAAAA1111A1Z1', type:'text' },
            ].map(f => (
              <div key={f.k}>
                <label style={{ fontSize:'0.78rem', fontWeight:'600', color:'#4A4034', display:'block', marginBottom:'4px' }}>{f.label}</label>
                <input type={f.type} style={inp} placeholder={f.placeholder} value={form[f.k]} onChange={set(f.k)} required={f.req} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:'0.78rem', fontWeight:'600', color:'#4A4034', display:'block', marginBottom:'4px' }}>Category</label>
              <select style={inp} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {msg.text && (
              <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'600', color: msg.type==='success' ? '#2D7D4E' : '#C0392B' }}>{msg.text}</p>
            )}

            <button type="submit" disabled={submitting} style={{
              padding:'10px', borderRadius:'10px', background: submitting ? '#6EAF85' : '#2D7D4E',
              color:'#FFF', border:'none', fontWeight:'700', fontSize:'0.875rem', cursor:'pointer', marginTop:'4px'
            }}>
              {submitting ? 'Registering…' : 'Register Vendor'}
            </button>
          </form>
        </div>

        {/* Vendor List */}
        <div className="card" style={{ padding:'0' }}>
          <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #F0EBE2', display:'flex', gap:'12px' }}>
            <input style={{ ...inp, flex:1 }} placeholder="Search by name, email, GST…" value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={{ ...inp, width:'180px' }} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ overflowY:'auto', maxHeight:'520px' }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign:'center', padding:'40px', color:'#8C7B6A' }}>No vendors found.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Category</th>
                    <th>Email</th>
                    <th>GST No.</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight:'600', color:'#1C1914' }}>{v.name}</td>
                      <td><span className="badge badge-gray">{v.category}</span></td>
                      <td style={{ color:'#4A4034' }}>{v.email}</td>
                      <td style={{ fontFamily:'monospace', fontSize:'0.8rem', color:'#B8923A' }}>{v.gst_details || '—'}</td>
                      <td style={{ fontSize:'0.82rem', color:'#8C7B6A' }}>{v.contact_details || '—'}</td>
                      <td>
                        <span className={`badge ${v.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ fontSize:'0.78rem', color:'#B0A090' }}>{new Date(v.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
