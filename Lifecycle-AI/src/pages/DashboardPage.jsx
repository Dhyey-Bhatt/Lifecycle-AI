import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  PlusCircle, 
  FileText, 
  AlertOctagon, 
  Scale, 
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export const DashboardPage = ({ onOpenUpload, onSelectDocument }) => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [mData, dData] = await Promise.all([
        api.metrics.get(),
        api.documents.getAll()
      ]);
      setMetrics(mData);
      setDocuments(dData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const expiringDocs = documents.filter(d => d.status === 'Expiring Soon');
  const validDocs = documents.filter(d => d.status === 'Valid');

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), var(--color-accent))',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-valid" style={{ fontSize: '0.75rem' }}>
              <Sparkles size={12} /> Lifecycle AI Active
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Connected to Family Vault
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Document & Warranty Lifecycle Hub
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '640px', marginTop: '0.35rem' }}>
            Automated document understanding beyond OCR, proactive failure risk telemetry, instant legal claim generation, and extended warranty decision intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/chat')}>
            <Sparkles size={16} color="var(--color-primary)" />
            Ask LifecycleBot
          </button>
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <PlusCircle size={16} />
            Scan New Receipt / Card
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box">
            <ShieldCheck size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{metrics?.totalDocuments || documents.length}</span>
            <span className="metric-label">Registered Assets</span>
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="metric-icon-box" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{metrics?.validCount || validDocs.length}</span>
            <span className="metric-label">Valid Warranties</span>
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="metric-icon-box" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{metrics?.expiringSoonCount || expiringDocs.length}</span>
            <span className="metric-label">Expiring Soon</span>
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="metric-icon-box">
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-value">
              ${(metrics?.totalPortfolioValue || documents.reduce((a, b) => a + (Number(b.purchasePrice) || 0), 0)).toLocaleString()}
            </span>
            <span className="metric-label">Insured Asset Value</span>
          </div>
        </div>
      </div>

      {/* Expiring Soon Alert Banner */}
      {expiringDocs.length > 0 && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#F59E0B', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400E' }}>
                  Warranty Expiration Warning ({expiringDocs.length} items require attention)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#B45309', marginTop: '0.2rem' }}>
                  <strong>{expiringDocs[0].productName}</strong> expires on <strong>{expiringDocs[0].warrantyExpiryDate}</strong>. Take preventive action or file a claim before standard coverage lapses.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', background: 'white' }}
                onClick={() => navigate('/advisor')}
              >
                <Scale size={14} />
                Cost-Benefit Advisor
              </button>
              <button 
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                onClick={() => navigate('/claim-generator')}
              >
                <FileText size={14} />
                Generate Claim / RMA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Launchpads & Intelligence Grid */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
        Lifecycle AI Feature Hub
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Feature 1: Document Understanding */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={onOpenUpload}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px' }}>
              <Sparkles size={20} />
            </div>
            <span className="badge badge-valid">Feature 1</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
            AI Document Understanding
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Deep multi-modal extraction: Product Name, Brand, Model, Serial/IMEI, Invoice #, Payment Method, and Warranty Expiry.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>Scan Receipt / Card</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Feature 2: Risk Prediction */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/risk-prediction')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
              <AlertOctagon size={20} />
            </div>
            <span className="badge badge-expiring">Feature 2</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
            AI Failure Risk Prediction
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Predicts hardware failure timelines (hinges, battery degradation, compressors) based on 45,000+ community reports.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>View Failure Telemetry</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Feature 4: Claim Generator */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/claim-generator')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #8B5CF6, #C084FC)' }}>
              <FileText size={20} />
            </div>
            <span className="badge badge-claim">Feature 4</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
            AI Claim & Dispute Generator
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            1-click auto-drafting for Consumer Legal Grievances, Brand Service Emails, Official Claim Letters, and Service Requests.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>Draft Dispute Document</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Feature 5: Extended Warranty Advisor */}
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/advisor')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)' }}>
              <Scale size={20} />
            </div>
            <span className="badge badge-renewed">Feature 5</span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
            Cost-Benefit Decision Advisor
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Combines failure risk probabilities with warranty pricing to give an objective <strong>Buy vs Skip</strong> recommendation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
            <span>Calculate Decision ROI</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Recent Documents Quick Overview */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Recently Registered Vault Documents
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time lifecycle tracking across all devices and appliances
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/documents')}>
            View All in DataTable
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {documents.slice(0, 3).map(doc => (
            <div 
              key={doc.id}
              style={{
                background: 'white',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge badge-${doc.status === 'Valid' ? 'valid' : doc.status === 'Expiring Soon' ? 'expiring' : 'expired'}`}>
                  {doc.status}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  ${doc.purchasePrice?.toLocaleString()}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {doc.productName}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {doc.brand} • Model: {doc.modelNumber}
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Expires: <strong>{doc.warrantyExpiryDate}</strong></span>
                <span>{doc.assignedTo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
