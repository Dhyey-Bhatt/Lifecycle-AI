import React, { useState, useEffect } from 'react';
import { DataTable } from '../components/DataTable';
import { 
  Files, 
  PlusCircle, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  Sparkles, 
  ExternalLink,
  Tag,
  Eye,
  Trash2,
  Scale,
  FileText,
  AlertOctagon,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export const DocumentsPage = ({ onOpenUpload }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';
  const isHousehelp = currentUser?.role === 'Househelp';
  const isSenior = currentUser?.role === 'Senior';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await api.documents.getAll();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (doc) => {
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to delete ${doc.productName}?`)) {
      try {
        await api.documents.delete(doc.id);
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        if (selectedDoc?.id === doc.id) setSelectedDoc(null);
      } catch (err) {
        console.error('Failed to delete doc:', err);
      }
    }
  };

  // DataTable column definitions
  const columns = [
    {
      header: "Product & Brand",
      accessor: "productName",
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {row.imageUrl ? (
            <img 
              src={row.imageUrl} 
              alt={row.productName} 
              style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
            />
          ) : (
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Files size={18} color="var(--color-primary)" />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-heading)' }}>{row.productName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {row.brand} • <code style={{ fontFamily: 'monospace' }}>{row.modelNumber || 'N/A'}</code>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Serial / IMEI",
      accessor: "serialNumber",
      render: (val) => <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{val || '—'}</code>
    },
    {
      header: "Category",
      accessor: "category",
      render: (val) => (
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {val || 'General'}
        </span>
      )
    },
    {
      header: "Warranty Expiry",
      accessor: "warrantyExpiryDate",
      render: (val, row) => {
        const isExpiring = row.status === 'Expiring Soon';
        const isExpired = row.status === 'Expired';
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, color: isExpired ? '#DC2626' : isExpiring ? '#D97706' : 'var(--text-main)' }}>
              {val || 'N/A'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {row.warrantyType || 'Standard'}
            </span>
          </div>
        );
      }
    },
    {
      header: "Status",
      accessor: "status",
      render: (val) => {
        let badgeClass = 'badge-valid';
        if (val === 'Expiring Soon') badgeClass = 'badge-expiring';
        else if (val === 'Expired') badgeClass = 'badge-expired';
        else if (val === 'Renewed') badgeClass = 'badge-renewed';
        else if (val === 'In Claim') badgeClass = 'badge-claim';

        return (
          <span className={`badge ${badgeClass}`}>
            {val}
          </span>
        );
      }
    },
    {
      header: "Purchase Price",
      accessor: "purchasePrice",
      render: (val) => <strong>${Number(val || 0).toLocaleString()}</strong>
    },
    {
      header: "Assigned Vault",
      accessor: "assignedTo",
      render: (val) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{val || 'Family Vault'}</span>
    }
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              {isHousehelp ? 'Appliance & Maintenance Inventory' : 'Document Lifecycle Management'}
            </h1>
            {!isAdmin && (
              <span className="badge badge-valid" style={{ background: '#F1F5F9', color: '#64748B' }}>
                View Only
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            {isHousehelp 
              ? 'Browse registered household equipment, check warranty validity, and find manuals via AI Chat.'
              : 'Interactive DataTable with automatic state tracking across Valid, Expiring Soon, Expired, Renewed, and In Claim states.'}
          </p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <PlusCircle size={16} />
            Scan & Add Document
          </button>
        )}
      </div>

      {/* Main DataTable */}
      <DataTable 
        columns={columns}
        data={documents}
        onRowClick={(row) => setSelectedDoc(row)}
        onDeleteRow={isAdmin ? (row) => handleDelete(row) : null}
        title={isHousehelp ? "Home Appliances & Equipment" : "Asset Warranties & Documents"}
        initialSortField="warrantyExpiryDate"
        initialSortAsc={true}
      />

      {/* Slide-over / Modal Detail View */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {selectedDoc.productName}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedDoc.brand} • Serial: <code>{selectedDoc.serialNumber}</code>
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-icon" onClick={() => setSelectedDoc(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Content Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Lifecycle Status
                </span>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className={`badge badge-${selectedDoc.status === 'Valid' ? 'valid' : selectedDoc.status === 'Expiring Soon' ? 'expiring' : 'expired'}`} style={{ fontSize: '0.85rem' }}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Warranty Expiry Date
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                  {selectedDoc.warrantyExpiryDate}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Invoice Number
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  {selectedDoc.invoiceNumber || 'N/A'}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Payment Method
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                  {selectedDoc.paymentMethod || 'Credit/Debit Card'}
                </div>
              </div>
            </div>

            {/* Extended Warranty Info */}
            <div style={{ background: 'var(--color-accent)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                Extended Warranty & Protection Coverage
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {selectedDoc.extendedWarranty?.hasExtended ? (
                  <>Active Plan: <strong>{selectedDoc.extendedWarranty.provider}</strong> (Valid through {selectedDoc.extendedWarranty.expiryDate || selectedDoc.warrantyExpiryDate})</>
                ) : (
                  <>No extended warranty active. You can run the <strong>Cost-Benefit Advisor</strong> to evaluate risk vs plan cost.</>
                )}
              </p>
            </div>

            {/* AI Action Buttons */}
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Instant AI Decision Tools
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSelectedDoc(null);
                  navigate('/risk-prediction');
                }}
              >
                <AlertOctagon size={16} color="#F59E0B" />
                Check Failure Risk
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedDoc(null);
                  navigate('/claim-generator');
                }}
              >
                <FileText size={16} color="var(--color-primary)" />
                Draft Legal Claim
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedDoc(null);
                  navigate('/advisor');
                }}
              >
                <Scale size={16} color="#0EA5E9" />
                Cost-Benefit Advisor
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedDoc(null);
                  navigate('/resale-estimator');
                }}
              >
                <Tag size={16} color="#10B981" />
                Resale Valuation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
