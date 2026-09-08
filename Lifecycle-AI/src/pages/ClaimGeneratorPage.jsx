import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Scale, 
  Mail, 
  ShieldCheck, 
  Wrench,
  AlertTriangle
} from 'lucide-react';

import { api } from '../api';

export const ClaimGeneratorPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [claimType, setClaimType] = useState('service_email');
  const [issueDescription, setIssueDescription] = useState('Screen flickering and occasional failure to power on when cold.');
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);

  // Form Fields
  const [formFields, setFormFields] = useState({
    productName: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    modelNumber: 'A2991',
    serialNumber: 'C02G8490MD6R',
    invoiceNumber: 'INV-APL-2024-88912',
    retailer: 'Apple Store Regent Street',
    purchaseDate: '2024-01-15'
  });

  useEffect(() => {
    api.documents.getAll()
      .then(docs => {
        setDocuments(docs);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
          populateFields(docs[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const populateFields = (doc) => {
    setFormFields({
      productName: doc.productName || '',
      brand: doc.brand || '',
      modelNumber: doc.modelNumber || '',
      serialNumber: doc.serialNumber || '',
      invoiceNumber: doc.invoiceNumber || '',
      retailer: doc.retailer || '',
      purchaseDate: doc.purchaseDate || ''
    });
  };

  const handleDocSelect = (docId) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) populateFields(doc);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSentAlert(false);
    try {
      const data = await api.ai.claimGenerator({
        ...formFields,
        issueDescription: issueDescription,
        claimType: claimType
      });
      setGeneratedDoc(data.generatedDocument);
    } catch (err) {
      console.error('Failed to generate claim:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    const text = `TITLE: ${generatedDoc.title}\nTO: ${generatedDoc.recipient}\nSUBJECT: ${generatedDoc.subject}\n\n${generatedDoc.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    const text = `TITLE: ${generatedDoc.title}\nTO: ${generatedDoc.recipient}\nSUBJECT: ${generatedDoc.subject}\n\n${generatedDoc.body}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warranty_claim_${formFields.serialNumber || 'doc'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    setSentAlert(true);
    setTimeout(() => setSentAlert(false), 4000);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-claim">
            <Sparkles size={14} /> Feature 4: AI Claim & Dispute Drafter
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
          AI Claim & Legal Dispute Generator
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Instantly generates legally sound Consumer Complaints, Service Center Escalation Emails, Formal Claim Letters, and Technical Service Requests.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Input Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
            Claim Setup & Document Type
          </h3>

          {/* Claim Type Selector Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <label className="form-label">Select Generation Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button 
                className={`btn ${claimType === 'service_email' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
                onClick={() => setClaimType('service_email')}
              >
                <Mail size={14} />
                Service Email
              </button>

              <button 
                className={`btn ${claimType === 'legal_complaint' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
                onClick={() => setClaimType('legal_complaint')}
              >
                <Scale size={14} />
                Legal Grievance
              </button>

              <button 
                className={`btn ${claimType === 'claim_letter' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
                onClick={() => setClaimType('claim_letter')}
              >
                <FileText size={14} />
                Claim Letter
              </button>

              <button 
                className={`btn ${claimType === 'service_request' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
                onClick={() => setClaimType('service_request')}
              >
                <Wrench size={14} />
                Service Ticket
              </button>
            </div>
          </div>

          {/* Stored Asset Picker */}
          <div className="form-group">
            <label className="form-label">Auto-Fill from Stored Asset</label>
            <select 
              className="form-select"
              value={selectedDocId}
              onChange={(e) => handleDocSelect(e.target.value)}
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.productName} ({d.brand})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formFields.productName}
              onChange={(e) => setFormFields({ ...formFields, productName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input 
                type="text" 
                className="form-input" 
                value={formFields.brand}
                onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model #</label>
              <input 
                type="text" 
                className="form-input" 
                value={formFields.modelNumber}
                onChange={(e) => setFormFields({ ...formFields, modelNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={formFields.serialNumber}
                onChange={(e) => setFormFields({ ...formFields, serialNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Invoice #</label>
              <input 
                type="text" 
                className="form-input" 
                value={formFields.invoiceNumber}
                onChange={(e) => setFormFields({ ...formFields, invoiceNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Describe Defect / Symptom</label>
            <textarea 
              className="form-textarea" 
              rows={3} 
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Hinge stiffness and trackpad unresponsive after normal usage..."
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={handleGenerate}
            disabled={loading}
          >
            <Sparkles size={16} />
            {loading ? 'AI Drafter Working...' : 'Generate Claim Document'}
          </button>
        </div>

        {/* Right: AI Output View */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {generatedDoc?.title || 'Generated Claim Preview'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Engine: Lifecycle-LegalDrafter-v3.1
              </span>
            </div>

            {generatedDoc && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={handleCopy} title="Copy to Clipboard">
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button className="btn btn-secondary" onClick={handleDownload} title="Download Text">
                  <Download size={14} />
                  Download
                </button>
                <button className="btn btn-primary" onClick={handleSendEmail} title="Dispatch Email">
                  <Send size={14} />
                  Send Email
                </button>
              </div>
            )}
          </div>

          {sentAlert && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#065F46', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10B981" />
              Email simulation dispatched to {generatedDoc?.recipient} with invoice attachment ref #{formFields.invoiceNumber}!
            </div>
          )}

          {generatedDoc ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                <div><strong>Recipient:</strong> <code>{generatedDoc.recipient}</code></div>
                <div style={{ marginTop: '0.25rem' }}><strong>Subject:</strong> {generatedDoc.subject}</div>
              </div>

              <pre className="code-preview" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {generatedDoc.body}
              </pre>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Sparkles size={36} color="var(--color-secondary)" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>Ready to draft claim</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Select an asset on the left and click "Generate Claim Document" to produce formal legal grievances, service emails, and claim notices.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
