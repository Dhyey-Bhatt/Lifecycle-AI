import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../App.jsx'

// PDF download using browser print-to-PDF
function downloadPDF(docId, docNumber) {
  const el = document.getElementById('printable-area')
  if (!el) return
  const html = `<!DOCTYPE html><html><head><title>${docNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1C1914; margin: 40px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #F7F4EE; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #8C7B6A; border-bottom: 1px solid #E6DDD0; }
    td { padding: 10px 12px; border-bottom: 1px solid #F0EBE2; font-size: 13px; }
    .total-row { font-weight: bold; font-size: 15px; border-top: 2px solid #E6DDD0; padding-top: 8px; }
    h1 { font-size: 24px; color: #1C1914; margin: 0; }
    h2 { font-size: 16px; margin: 0 0 4px; }
    .green { color: #2D7D4E; }
    .muted { color: #8C7B6A; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .box { background: #F7F4EE; padding: 12px 16px; border-radius: 6px; }
    .footer { margin-top: 40px; border-top: 1px solid #E6DDD0; padding-top: 10px; font-size: 11px; color: #B0A090; text-align: center; }
  </style></head><body>${el.innerHTML}</body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) {
    win.onload = () => { win.print(); setTimeout(() => URL.revokeObjectURL(url), 3000) }
  }
}

export default function DocumentGenerationPage({ view = 'po' }) {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [approvedQuotes, setApprovedQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [docType, setDocType] = useState(view)
  const [emailInput, setEmailInput] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [generating, setGenerating] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const loadData = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([
        fetchWithAuth('/api/purchase-orders'),
        fetchWithAuth('/api/invoices'),
        fetchWithAuth('/api/quotations')
      ])
      if (r1.ok) { const d = await r1.json(); setPurchaseOrders(d.purchaseOrders || []) }
      if (r2.ok) { const d = await r2.json(); setInvoices(d.invoices || []) }
      if (r3.ok) { const d = await r3.json(); setApprovedQuotes((d.quotations || []).filter(q => q.status === 'approved')) }
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const generatePO = async (quote) => {
    setGenerating(true)
    try {
      const res = await fetchWithAuth('/api/purchase-orders', {
        method: 'POST',
        body: JSON.stringify({ rfq_id: quote.rfq_id, quotation_id: quote.id, vendor_id: quote.vendor_id, subtotal: quote.pricing_details })
      })
      if (res.ok) { loadData() }
    } catch { /* ignore */ } finally { setGenerating(false) }
  }

  const generateInvoice = async (po) => {
    setGenerating(true)
    try {
      const res = await fetchWithAuth('/api/invoices', {
        method: 'POST',
        body: JSON.stringify({ po_id: po.id, subtotal: po.subtotal, tax_amount: po.tax_amount, total_amount: po.total_amount })
      })
      if (res.ok) { loadData() }
    } catch { /* ignore */ } finally { setGenerating(false) }
  }

  const emailInvoice = async (id) => {
    if (!emailInput) return
    setEmailMsg('Sending…')
    try {
      const res = await fetchWithAuth(`/api/invoices/${id}/email`, {
        method: 'POST', body: JSON.stringify({ email: emailInput })
      })
      const d = await res.json()
      setEmailMsg(res.ok && d.success ? `✓ Sent to ${emailInput}` : 'Failed to send.')
      if (res.ok) setEmailInput('')
    } catch { setEmailMsg('Server error.') }
  }

  const markPaid = async (invoiceId) => {
    setStatusMsg('')
    try {
      const res = await fetchWithAuth(`/api/invoices/${invoiceId}`, {
        method: 'PUT', body: JSON.stringify({ status: 'paid' })
      })
      if (res.ok) {
        setStatusMsg('Invoice marked as Paid!')
        setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i))
        if (selectedDoc?.id === invoiceId) setSelectedDoc(d => ({ ...d, status: 'paid' }))
      }
    } catch { setStatusMsg('Error updating status.') }
  }

  const isPO = view === 'po'
  const docs = isPO ? purchaseOrders : invoices
  const title = isPO ? 'Purchase Orders' : 'Invoices'

  const statusBadge = s => {
    if (s === 'issued' || s === 'approved') return 'badge-green'
    if (s === 'paid') return 'badge-green'
    if (s === 'pending' || s === 'pending_approval') return 'badge-gold'
    if (s === 'overdue') return 'badge-red'
    return 'badge-gray'
  }

  return (
    <div className="content-area">
      <div className="page-header flex-between">
        <div>
          <h1>{title}</h1>
          <p>{isPO ? 'Auto-generated after approval · Convert to Invoice' : 'Tax invoices · Print · Email · Mark as Paid'}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isPO && approvedQuotes.length > 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => generatePO(approvedQuotes[0])} disabled={generating}>
              + Generate PO ({approvedQuotes.length} approved)
            </button>
          )}
          {selectedDoc && (
            <button className="btn btn-secondary btn-sm" onClick={() => downloadPDF(selectedDoc.id, isPO ? selectedDoc.po_number : selectedDoc.invoice_number)}>
              ⬇ Download PDF
            </button>
          )}
          {selectedDoc && (
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              🖨 Print
            </button>
          )}
        </div>
      </div>

      {statusMsg && <div className="alert alert-info" style={{ marginBottom: '16px' }}>{statusMsg}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px', color: '#8C7B6A' }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 1.1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

          {/* Document list */}
          <div className="card" style={{ padding: 0 }}>
            {docs.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ color: '#8C7B6A', margin: '0 0 16px' }}>No {title.toLowerCase()} found.</p>
                {isPO && approvedQuotes.length > 0 && (
                  <button className="btn btn-primary" onClick={() => generatePO(approvedQuotes[0])} disabled={generating}>
                    Generate PO from {approvedQuotes.length} Approved Quotation(s)
                  </button>
                )}
                {!isPO && purchaseOrders.length > 0 && (
                  <p style={{ fontSize: '0.875rem', color: '#8C7B6A' }}>
                    Go to <strong>Purchase Orders</strong> and click "→ Invoice" to generate invoices.
                  </p>
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isPO ? 'PO Number' : 'Invoice #'}</th>
                    <th>Amount</th>
                    <th>Tax (18%)</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>{isPO ? 'Date' : 'Due'}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => {
                    const isSel = selectedDoc?.id === doc.id
                    return (
                      <tr key={doc.id}
                        onClick={() => { setSelectedDoc(doc); setDocType(view); setEmailMsg(''); setStatusMsg('') }}
                        style={{ cursor: 'pointer', background: isSel ? '#EBF5EE' : 'transparent' }}>
                        <td style={{ fontWeight: '700', color: '#2D7D4E' }}>
                          {isPO ? doc.po_number : doc.invoice_number}
                        </td>
                        <td>₹{Number(doc.subtotal || 0).toLocaleString()}</td>
                        <td style={{ color: '#8C7B6A' }}>₹{Number(doc.tax_amount || 0).toLocaleString()}</td>
                        <td style={{ fontWeight: '700' }}>₹{Number(doc.total_amount || 0).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${statusBadge(doc.status)}`}>{doc.status}</span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#B0A090' }}>
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {isPO && !invoices.some(i => Number(i.po_id) === Number(doc.id)) && (
                            <button className="btn btn-secondary btn-sm" onClick={() => generateInvoice(doc)} disabled={generating}>
                              → Invoice
                            </button>
                          )}
                          {!isPO && doc.status === 'pending' && (
                            <button className="btn btn-primary btn-sm" onClick={() => markPaid(doc.id)}>
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Document viewer */}
          {selectedDoc && (
            <div className="card" style={{ padding: '28px' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #F0EBE2' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary btn-sm"
                    onClick={() => downloadPDF(selectedDoc.id, isPO ? selectedDoc.po_number : selectedDoc.invoice_number)}>
                    ⬇ Download PDF
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨 Print</button>
                  {!isPO && selectedDoc.status === 'pending' && (
                    <button className="btn btn-gold btn-sm" onClick={() => markPaid(selectedDoc.id)}>✓ Mark as Paid</button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(null)}>✕ Close</button>
                </div>
              </div>

              {/* Email row (invoices only) */}
              {!isPO && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
                  <input
                    type="email" placeholder="Send to email…" value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    style={{ flex: 1, padding: '7px 12px', borderRadius: '8px', border: '1px solid #E6DDD0', background: '#FDFCFA', fontSize: '0.82rem', outline: 'none' }}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={() => emailInvoice(selectedDoc.id)}>
                    ✉ Send Invoice
                  </button>
                </div>
              )}
              {emailMsg && <p style={{ margin: '-6px 0 12px', fontSize: '0.8rem', fontWeight: '600', color: emailMsg.startsWith('✓') ? '#2D7D4E' : '#C0392B' }}>{emailMsg}</p>}

              {/* Printable document body */}
              <div id="printable-area" style={{ fontFamily: 'Arial, sans-serif', color: '#1e293b' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E6DDD0', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', color: '#1C1914', fontSize: '1.1rem' }}>VendorBridge Corp</h2>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#8C7B6A', lineHeight: 1.6 }}>
                      Procurement ERP · New Delhi, India<br />
                      GSTIN: 07GSTIN1234F1Z1 · contact@vendorbridge.com
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#1C1914', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                      {isPO ? 'Purchase Order' : 'Invoice'}
                    </h1>
                    <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '1rem', color: '#2D7D4E' }}>
                      {isPO ? selectedDoc.po_number : selectedDoc.invoice_number}
                    </p>
                    <span className={`badge ${statusBadge(selectedDoc.status)}`}>{selectedDoc.status}</span>
                  </div>
                </div>

                {/* Meta grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px 14px', background: '#F7F4EE', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B6A' }}>Document Info</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.8, color: '#1C1914' }}>
                      <strong>Date:</strong> {new Date(selectedDoc.created_at).toLocaleDateString()}<br />
                      <strong>Ref:</strong> #{selectedDoc.id}<br />
                      {isPO ? <><strong>RFQ:</strong> #{selectedDoc.rfq_id}</> : <><strong>PO Ref:</strong> #{selectedDoc.po_id}</>}
                    </p>
                  </div>
                  <div style={{ padding: '12px 14px', background: '#F7F4EE', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B6A' }}>
                      {isPO ? 'Bill To / Vendor' : 'Bill To / Client'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.8, color: '#1C1914' }}>
                      <strong>Vendor ID:</strong> #{selectedDoc.vendor_id || selectedDoc.po_id}<br />
                      <strong>Payment:</strong> 30 days net<br />
                      <strong>Status:</strong> {selectedDoc.status}
                    </p>
                  </div>
                </div>

                {/* Line items */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ background: '#F7F4EE' }}>
                      {['Description', 'Qty', 'Unit Price', 'Amount'].map(h => (
                        <th key={h} style={{ padding: '9px 12px', textAlign: h === 'Description' ? 'left' : 'right', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#8C7B6A', borderBottom: '1px solid #E6DDD0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '11px 12px', fontSize: '0.875rem', color: '#1C1914', borderBottom: '1px solid #F0EBE2' }}>
                        Procurement Agreement — RFQ Deliverable Item
                      </td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontSize: '0.875rem', borderBottom: '1px solid #F0EBE2' }}>1</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontSize: '0.875rem', borderBottom: '1px solid #F0EBE2' }}>₹{Number(selectedDoc.subtotal || 0).toLocaleString()}</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '700', borderBottom: '1px solid #F0EBE2' }}>₹{Number(selectedDoc.subtotal || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '270px' }}>
                    {[
                      { label: 'Subtotal', val: `₹${Number(selectedDoc.subtotal || 0).toLocaleString()}` },
                      { label: 'GST (18%)', val: `₹${Number(selectedDoc.tax_amount || 0).toLocaleString()}` },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem', color: '#4A4034', borderBottom: '1px solid #F0EBE2' }}>
                        <span>{r.label}</span><span style={{ fontWeight: '600' }}>{r.val}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '1.05rem', fontWeight: '800', color: '#1C1914' }}>
                      <span>Grand Total</span>
                      <span style={{ color: '#2D7D4E' }}>₹{Number(selectedDoc.total_amount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <p style={{ marginTop: '28px', paddingTop: '12px', borderTop: '1px solid #E6DDD0', fontSize: '0.68rem', color: '#B0A090', textAlign: 'center' }}>
                  This is a computer-generated document. No physical signature required. VendorBridge ERP — Thank you for your partnership.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media print {
          aside, nav, .content-area > *:not(#print-wrap) { display: none !important; }
          #printable-area { display: block !important; margin: 0; padding: 20px; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  )
}
