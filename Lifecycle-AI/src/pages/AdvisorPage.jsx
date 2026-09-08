import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

import { api } from '../api';

export const AdvisorPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [productName, setProductName] = useState('Galaxy S24 Ultra 512GB');
  const [category, setCategory] = useState('Smartphones & Tablets');
  const [purchasePrice, setPurchasePrice] = useState(1419);
  const [warrantyCost, setWarrantyCost] = useState(169);
  const [warrantyYears, setWarrantyYears] = useState(2);
  const [ownershipYears, setOwnershipYears] = useState(3);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.documents.getAll()
      .then(docs => {
        setDocuments(docs);
        if (docs.length > 0) {
          const defaultDoc = docs.find(d => !d.extendedWarranty?.hasExtended) || docs[0];
          setSelectedDocId(defaultDoc.id);
          populateAndCalculate(defaultDoc);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const populateAndCalculate = (doc) => {
    setProductName(doc.productName);
    setCategory(doc.category || 'Smartphones & Tablets');
    setPurchasePrice(doc.purchasePrice || 1200);
    setWarrantyCost(doc.extendedWarranty?.cost || 169);
    calculateAdvisor(doc.productName, doc.category || 'Smartphones & Tablets', doc.purchasePrice || 1200, doc.extendedWarranty?.cost || 169, 2, 3);
  };

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) populateAndCalculate(doc);
  };

  const calculateAdvisor = async (pName, cat, price, extCost, years, ownYears) => {
    setLoading(true);
    try {
      const data = await api.ai.costBenefit({
        productName: pName,
        category: cat,
        purchasePrice: Number(price),
        extendedWarrantyCost: Number(extCost),
        extendedWarrantyYears: Number(years),
        expectedYearsOfOwnership: Number(ownYears)
      });
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to run cost benefit advisor:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-renewed">
            <Scale size={14} /> Feature 5: Decision Intelligence
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
          Extended-Warranty Cost-Benefit Advisor
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Combines failure-risk prediction with the price of extended warranty plans to recommend <strong>Buy vs Skip</strong> — a genuine decision-support engine, not just a reminder.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Input Variables */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
            Plan Parameters & Sliders
          </h3>

          <div className="form-group">
            <label className="form-label">Evaluate Stored Asset</label>
            <select 
              className="form-select"
              value={selectedDocId}
              onChange={(e) => handleDocChange(e.target.value)}
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.productName} (${d.purchasePrice})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Product Purchase Price: <strong>${purchasePrice}</strong></label>
            <input 
              type="range"
              min={100}
              max={5000}
              step={50}
              value={purchasePrice}
              onChange={(e) => {
                setPurchasePrice(Number(e.target.value));
                calculateAdvisor(productName, category, Number(e.target.value), warrantyCost, warrantyYears, ownershipYears);
              }}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Extended Warranty Price: <strong>${warrantyCost}</strong></label>
            <input 
              type="range"
              min={20}
              max={800}
              step={10}
              value={warrantyCost}
              onChange={(e) => {
                setWarrantyCost(Number(e.target.value));
                calculateAdvisor(productName, category, purchasePrice, Number(e.target.value), warrantyYears, ownershipYears);
              }}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Warranty Coverage</label>
              <select 
                className="form-select"
                value={warrantyYears}
                onChange={(e) => {
                  setWarrantyYears(Number(e.target.value));
                  calculateAdvisor(productName, category, purchasePrice, warrantyCost, Number(e.target.value), ownershipYears);
                }}
              >
                <option value={1}>+1 Year Extended</option>
                <option value={2}>+2 Years Extended</option>
                <option value={3}>+3 Years Extended</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Planned Usage</label>
              <select 
                className="form-select"
                value={ownershipYears}
                onChange={(e) => {
                  setOwnershipYears(Number(e.target.value));
                  calculateAdvisor(productName, category, purchasePrice, warrantyCost, warrantyYears, Number(e.target.value));
                }}
              >
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
                <option value={5}>5+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Recommendation Output */}
        {analysis && (
          <div className="card">
            {/* Top Badge */}
            <div 
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: analysis.recommendation.includes('BUY') 
                  ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' 
                  : analysis.recommendation.includes('SKIP') 
                  ? 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' 
                  : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: `1px solid ${analysis.recommendation.includes('BUY') ? '#A7F3D0' : analysis.recommendation.includes('SKIP') ? '#FECACA' : '#FDE68A'}`,
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {analysis.recommendation.includes('BUY') ? (
                    <CheckCircle2 size={32} color="#059669" />
                  ) : analysis.recommendation.includes('SKIP') ? (
                    <XCircle size={32} color="#DC2626" />
                  ) : (
                    <HelpCircle size={32} color="#D97706" />
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: analysis.recommendation.includes('BUY') ? '#065F46' : analysis.recommendation.includes('SKIP') ? '#991B1B' : '#92400E' }}>
                      AI Recommendation Verdict
                    </span>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: analysis.recommendation.includes('BUY') ? '#064E3B' : analysis.recommendation.includes('SKIP') ? '#7F1D1D' : '#78350F' }}>
                      {analysis.recommendationBadge}
                    </h2>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Expected Value</div>
                  <strong style={{ fontSize: '1.2rem', color: analysis.netExpectedValue >= 0 ? '#059669' : '#DC2626' }}>
                    {analysis.netExpectedValue >= 0 ? `+$${analysis.netExpectedValue}` : `-$${Math.abs(analysis.netExpectedValue)}`}
                  </strong>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '1rem', lineHeight: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem' }}>
                {analysis.decisionRationale}
              </p>
            </div>

            {/* Financial Metrics Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Failure Probability
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                  {Math.round(analysis.failureProbability * 100)}%
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>in extended window</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Avg. Out-of-Warranty Repair
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DC2626', marginTop: '0.2rem' }}>
                  ${analysis.averageRepairCost}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>based on parts & labor</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Expected Risk Exposure
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                  ${analysis.expectedOutofPocketWithoutWarranty}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>statistical cost without plan</span>
              </div>
            </div>

            {/* Comparison Table */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Scenario</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Cost Implication</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Risk Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.comparisonTable?.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i === 0 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{row.scenario}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{row.cost}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
