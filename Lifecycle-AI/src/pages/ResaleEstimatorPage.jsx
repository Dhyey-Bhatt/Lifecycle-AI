import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Tag, 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

import { api } from '../api';

export const ResaleEstimatorPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [productName, setProductName] = useState('MacBook Pro 16" M3 Max');
  const [category, setCategory] = useState('Laptops & Computers');
  const [purchasePrice, setPurchasePrice] = useState(3499);
  const [purchaseDate, setPurchaseDate] = useState('2024-01-15');
  const [condition, setCondition] = useState('Mint (Like New with Box)');
  const [valuationData, setValuationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.documents.getAll()
      .then(docs => {
        setDocuments(docs);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
          populateAndEstimate(docs[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const populateAndEstimate = (doc) => {
    setProductName(doc.productName);
    setCategory(doc.category || 'Laptops & Computers');
    setPurchasePrice(doc.purchasePrice || 2000);
    setPurchaseDate(doc.purchaseDate || '2024-01-15');
    runEstimator(doc.productName, doc.category || 'Laptops & Computers', doc.purchasePrice || 2000, doc.purchaseDate || '2024-01-15', condition);
  };

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) populateAndEstimate(doc);
  };

  const runEstimator = async (pName, cat, price, pDate, cond) => {
    setLoading(true);
    try {
      const data = await api.ai.resaleEstimate({
        productName: pName,
        category: cat,
        purchasePrice: Number(price),
        purchaseDate: pDate,
        condition: cond
      });
      setValuationData(data);
    } catch (err) {
      console.error('Failed to run resale estimator:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-valid">
            <TrendingUp size={14} /> Feature 6: Market Valuation Engine
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
          Resale Value Estimator
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Predict current market value of your owned electronics and appliances using device age, cosmetic condition, and real-time secondary market listing algorithms.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Product & Condition Controls */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
            Asset Parameters
          </h3>

          <div className="form-group">
            <label className="form-label">Evaluate Stored Document</label>
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
            <label className="form-label">Cosmetic & Functional Condition</label>
            <select 
              className="form-select"
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                runEstimator(productName, category, purchasePrice, purchaseDate, e.target.value);
              }}
            >
              <option value="Mint (Like New with Box)">Mint (Like New with Original Box & Accessories)</option>
              <option value="Good (Minor scratches)">Good (Minor micro-scratches, fully functional)</option>
              <option value="Fair (Visible wear)">Fair (Visible scuffs, normal battery wear)</option>
              <option value="Poor (Cracked / degraded)">Poor (Cracked screen / cosmetic flaws)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Original Purchase Price: <strong>${purchasePrice}</strong></label>
            <input 
              type="number" 
              className="form-input"
              value={purchasePrice}
              onChange={(e) => {
                setPurchasePrice(Number(e.target.value));
                runEstimator(productName, category, Number(e.target.value), purchaseDate, condition);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Purchase Date</label>
            <input 
              type="date" 
              className="form-input"
              value={purchaseDate}
              onChange={(e) => {
                setPurchaseDate(e.target.value);
                runEstimator(productName, category, purchasePrice, e.target.value, condition);
              }}
            />
          </div>
        </div>

        {/* Right: Valuation Results */}
        {valuationData && (
          <div>
            {/* Value Hero Banner */}
            <div 
              style={{
                background: 'linear-gradient(135deg, white, var(--color-accent))',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <span className="badge badge-valid" style={{ marginBottom: '0.35rem' }}>
                  Estimated Current Market Value
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
                  ${valuationData.currentResaleValue.toLocaleString()}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Original: ${valuationData.originalPrice.toLocaleString()} ({valuationData.depreciationToDatePercentage}% depreciation over {valuationData.ageMonths} months)
                </p>
              </div>

              <div style={{ background: 'white', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <Clock size={16} />
                  <span>Optimal Trade-In Window</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {valuationData.optimalSellingWindow}
                </p>
              </div>
            </div>

            {/* Market Listings Benchmarks */}
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
              Real-Time Platform Listing Benchmarks
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>eBay Avg</div>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-heading)' }}>
                  ${valuationData.marketListingsBenchmark.ebayAvg}
                </strong>
              </div>

              <div style={{ background: 'white', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Swappa Market</div>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-heading)' }}>
                  ${valuationData.marketListingsBenchmark.swappaAvg}
                </strong>
              </div>

              <div style={{ background: 'white', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant Trade-In</div>
                <strong style={{ fontSize: '1.15rem', color: '#0EA5E9' }}>
                  ${valuationData.marketListingsBenchmark.tradeInOffer}
                </strong>
              </div>

              <div style={{ background: 'white', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Pickup</div>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-heading)' }}>
                  ${valuationData.marketListingsBenchmark.localMarketplace}
                </strong>
              </div>
            </div>

            {/* 18-Month Value Trajectory Table */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
                18-Month Projected Depreciation Curve
              </h3>

              <div className="table-responsive">
                <table className="custom-datatable">
                  <thead>
                    <tr>
                      <th>Timeline</th>
                      <th>Projected Value</th>
                      <th>Total Depreciation</th>
                      <th>Visual Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuationData.valuationProjection?.map((p, idx) => (
                      <tr key={idx}>
                        <td><strong>{p.monthLabel}</strong></td>
                        <td>${p.estimatedValue.toLocaleString()}</td>
                        <td><span style={{ color: '#DC2626', fontWeight: 700 }}>-{p.depreciationPercent}%</span></td>
                        <td>
                          <div style={{ width: '120px', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                width: `${Math.max(10, 100 - p.depreciationPercent)}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' 
                              }} 
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
