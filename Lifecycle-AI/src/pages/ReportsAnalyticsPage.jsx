import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']
const MOCK_MONTHLY = [120000, 185000, 95000, 220000, 310000, 240000]

export default function ReportsAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('May 2025')
  const [spending, setSpending] = useState({ total:0, activeVendors:0, fulfillment:94, trends:3 })
  const [categories, setCategories] = useState([
    { name:'Furniture',   amount:1240000, color:'#2D7D4E' },
    { name:'IT Hardware', amount:950000,  color:'#B8923A' },
    { name:'Stationery',  amount:320000,  color:'#C4713A' },
    { name:'Logistics',   amount:320000,  color:'#8C7B6A' },
  ])
  const [topVendors] = useState([
    { name:'TechCore Ltd',    spend:'₹4,20,000', pos:8 },
    { name:'Infra Supplies',  spend:'₹1,90,000', pos:4 },
    { name:'PathFinder Trans',spend:'₹1,30,000', pos:3 },
  ])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth('/api/invoices')
        if (res.ok) {
          const d = await res.json()
          const total = d.invoices?.reduce((s,i) => s+Number(i.total_amount||0), 0) || 0
          setSpending(p => ({ ...p, total, activeVendors: d.invoices?.length || 0 }))
        }
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const maxCat = Math.max(...categories.map(c => c.amount))
  const maxBar = Math.max(...MOCK_MONTHLY)

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>Reports &amp; Analytics</h1>
          <p>Procurement Insights: May 2025</p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <select style={{ padding:'7px 12px', borderRadius:'8px', border:'1px solid #E6DDD0', background:'#FFF', fontSize:'0.82rem', color:'#1C1914' }}
            value={month} onChange={e=>setMonth(e.target.value)}>
            {['Jan 2025','Feb 2025','Mar 2025','Apr 2025','May 2025','Jun 2025'].map(m=><option key={m}>{m}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm">Export</button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign:'center', padding:'60px', color:'#8C7B6A' }}>Loading analytics…</p>
      ) : (
        <>
          {/* Top stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
            {[
              { label:'Total Spend', value: spending.total > 0 ? `₹${(spending.total/100000).toFixed(1)}L` : '₹12.4L', cls:'stat-green' },
              { label:'Active Vendors', value: spending.activeVendors || 28, cls:'stat-gold' },
              { label:'% Fulfillment', value:`${spending.fulfillment}%`, cls:'stat-orange' },
              { label:'Months Trend', value:`+${spending.trends}`, cls:'stat-red' },
            ].map(s => (
              <div key={s.label} className={`stat-card ${s.cls}`}>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ fontSize:'1.6rem' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
            {/* Spend by category */}
            <div className="card">
              <p className="section-title">Spend by Category</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {categories.map(c => (
                  <div key={c.name}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'0.82rem', fontWeight:'600', color:'#1C1914', display:'flex', alignItems:'center', gap:'6px' }}>
                        <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:c.color, display:'inline-block' }} />
                        {c.name}
                      </span>
                      <span style={{ fontSize:'0.82rem', color:'#4A4034', fontWeight:'600' }}>₹{(c.amount/100000).toFixed(1)}L</span>
                    </div>
                    <div style={{ height:'6px', background:'#F0EBE2', borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(c.amount/maxCat)*100}%`, background:c.color, borderRadius:'99px', transition:'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top vendors */}
            <div className="card">
              <p className="section-title">Top Vendors by Spend</p>
              <table className="data-table">
                <thead><tr><th>Vendor</th><th>Spend (₹)</th><th>POs</th></tr></thead>
                <tbody>
                  {topVendors.map(v => (
                    <tr key={v.name}>
                      <td style={{ fontWeight:'600', color:'#1C1914' }}>{v.name}</td>
                      <td style={{ fontWeight:'700', color:'#2D7D4E' }}>{v.spend}</td>
                      <td><span className="badge badge-gray">{v.pos}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly trend bar chart */}
          <div className="card">
            <p className="section-title">Monthly Procurement Trend</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'12px', height:'120px', padding:'0 8px' }}>
              {MONTHS.map((m,i) => (
                <div key={m} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flex:1 }}>
                  <span style={{ fontSize:'0.68rem', color:'#8C7B6A', fontWeight:'600' }}>₹{(MOCK_MONTHLY[i]/100000).toFixed(1)}L</span>
                  <div style={{ width:'100%', background:'#F0EBE2', borderRadius:'6px 6px 0 0', overflow:'hidden', flex:1, display:'flex', alignItems:'flex-end' }}>
                    <div style={{
                      width:'100%',
                      height:`${(MOCK_MONTHLY[i]/maxBar)*100}%`,
                      background: i===4 ? '#2D7D4E' : '#D4C9B8',
                      borderRadius:'4px 4px 0 0',
                      transition:'height 0.5s'
                    }} />
                  </div>
                  <span style={{ fontSize:'0.72rem', color:'#8C7B6A' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
