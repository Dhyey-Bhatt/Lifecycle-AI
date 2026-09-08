import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Activity, 
  ShieldAlert, 
  Wrench, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export const RiskPredictorPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [customCategory, setCustomCategory] = useState('Laptops & Computers');
  const [productName, setProductName] = useState('MacBook Pro 16" M3 Max');
  const [ageMonths, setAgeMonths] = useState(14);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.documents.getAll()
      .then(docs => {
        setDocuments(docs);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
          setProductName(docs[0].productName);
          setCustomCategory(docs[0].category || 'Laptops & Computers');
          runPrediction(docs[0].productName, docs[0].category || 'Laptops & Computers', 14);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setProductName(doc.productName);
      setCustomCategory(doc.category || 'Laptops & Computers');
      runPrediction(doc.productName, doc.category || 'Laptops & Computers', ageMonths);
    }
  };

  const runPrediction = async (pName, category, age) => {
    setLoading(true);
    try {
      const data = await api.ai.predictRisk({
        productName: pName,
        category: category,
        currentAgeMonths: Number(age)
      });
      setRiskData(data);
    } catch (err) {
      console.error('Failed to run risk prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-expiring">
            <Flame size={14} /> Feature 2: Predictive Failure AI
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
          AI Risk Prediction Engine
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Instead of waiting until warranties expire, AI predicts component failure timelines using 45,000+ community repair reports and review sentiment.
        </p>
      </div>

      {/* Control Panel */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
          Select Asset or Configure Telemetry Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Stored Asset</label>
            <select 
              className="form-select"
              value={selectedDocId}
              onChange={(e) => handleDocChange(e.target.value)}
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.productName} ({d.brand})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                runPrediction(productName, e.target.value, ageMonths);
              }}
            >
              <option value="Laptops & Computers">Laptops & Computers</option>
              <option value="Smartphones & Tablets">Smartphones & Tablets</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Audio & Wearables">Audio & Wearables</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Device Age (Months): <strong>{ageMonths} mo</strong></label>
            <input 
              type="range" 
              min={1} 
              max={60} 
              value={ageMonths}
              onChange={(e) => {
                setAgeMonths(Number(e.target.value));
                runPrediction(productName, customCategory, Number(e.target.value));
              }}
              style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--color-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Risk Output Dashboard */}
      {riskData && (
        <div>
          {/* Top Score Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {/* Health Score */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white' }}>
              <div 
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `conic-gradient(${riskData.healthScore > 70 ? '#10B981' : riskData.healthScore > 45 ? '#F59E0B' : '#EF4444'} ${riskData.healthScore * 3.6}deg, #E2E8F0 0deg)`,
                  position: 'relative'
                }}
              >
                <div style={{ width: '70px', height: '70px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {riskData.healthScore}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <div>
                <span className={`badge ${riskData.healthScore > 70 ? 'badge-valid' : 'badge-expiring'}`}>
                  {riskData.riskLevel}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.35rem' }}>
                  Asset Health Index
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Device age: {riskData.ageMonths} months into expected lifecycle
                </p>
              </div>
            </div>

            {/* Community Telemetry Insight */}
            <div className="card" style={{ background: 'var(--color-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} color="var(--color-primary)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  AI Community Telemetry Model
                </h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {riskData.telemetrySummary}
              </p>
            </div>
          </div>

          {/* Component Failure Modes Table / Cards */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
            Predicted Hardware Failure Modes for {riskData.productName}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {riskData.failureModes.map((mode, idx) => (
              <div key={idx} className="card" style={{ background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className={`badge ${mode.currentFailureProbability > 0.35 ? 'badge-expired' : mode.currentFailureProbability > 0.20 ? 'badge-expiring' : 'badge-valid'}`}>
                    {mode.status} ({Math.round(mode.currentFailureProbability * 100)}% Prob.)
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Typical Onset: ~{mode.typicalOnsetMonths} mo
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                  {mode.component}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <strong>Key Symptoms:</strong> {mode.symptoms}
                </p>

                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Community Benchmark:</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {mode.communityInsight}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Est. Out-of-Warranty Repair:
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: '#DC2626' }}>
                    ${mode.estimatedRepairCost}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Preventive Recommendations */}
          <div className="card" style={{ background: 'linear-gradient(135deg, white, var(--color-accent))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ShieldAlert size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Recommended Preventive Measures
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {riskData.preventiveRecommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{rec}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/claim-generator')}>
                <Wrench size={16} />
                Draft Pre-emptive Warranty Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
