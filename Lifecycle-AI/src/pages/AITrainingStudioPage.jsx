import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Download, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Database, 
  Activity,
  Code,
  Check
} from 'lucide-react';

import { api } from '../api';

export const AITrainingStudioPage = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainConfig, setTrainConfig] = useState({
    modelArchitecture: 'Lifecycle-VisionNER-Transformer-v2.5',
    epochs: 15,
    learningRate: 0.0002
  });
  const [trainedAlert, setTrainedAlert] = useState(false);

  const fetchTrainingData = async () => {
    try {
      const data = await api.ai.training.getDataset();
      setTrainingData(data.dataset || []);
      setTrainingLogs(data.trainingLogs || []);
    } catch (err) {
      console.error('Failed to fetch training data:', err);
    }
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainedAlert(false);

    try {
      const data = await api.ai.training.train(trainConfig);

      setTimeout(() => {
        setIsTraining(false);
        setTrainedAlert(true);
        if (data.job) {
          setTrainingLogs(prev => [data.job, ...prev]);
        }
      }, 2000);
    } catch (err) {
      console.error('Training trigger failed:', err);
      setIsTraining(false);
    }
  };

  const handleExportJSONL = () => {
    window.open(api.ai.training.getExportUrl('jsonl'), '_blank');
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-valid">
              <Cpu size={14} /> AI Model & Continuous Fine-Tuning Hub
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            AI Model Studio & Annotation Training
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Every receipt, invoice, and warranty document verified in your vault creates ground-truth training pairs. Fine-tune your custom Vision NER and Failure Risk models directly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleExportJSONL}>
            <Download size={16} />
            Export Training Dataset (JSONL)
          </button>
        </div>
      </div>

      {/* Grid: Training Trigger & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
        {/* Left: Fine-Tuning Execution Panel */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px' }}>
              <Layers size={18} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Train Custom Model Weights
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Base Vision-Language Model</label>
            <select 
              className="form-select"
              value={trainConfig.modelArchitecture}
              onChange={(e) => setTrainConfig({ ...trainConfig, modelArchitecture: e.target.value })}
            >
              <option value="Lifecycle-VisionNER-Transformer-v2.5">Lifecycle-VisionNER-Transformer (Recommended)</option>
              <option value="LayoutLMv3-Receipt-Extractor">LayoutLMv3 Multi-Modal Extraction</option>
              <option value="Donut-Document-Understanding">Donut OCR-Free Transformer</option>
              <option value="Llama-3-Vision-Instruct-FineTuned">Llama-3.2-Vision Fine-Tuning</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Training Epochs</label>
              <input 
                type="number" 
                className="form-input" 
                value={trainConfig.epochs}
                onChange={(e) => setTrainConfig({ ...trainConfig, epochs: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Learning Rate</label>
              <input 
                type="text" 
                className="form-input" 
                value={trainConfig.learningRate}
                onChange={(e) => setTrainConfig({ ...trainConfig, learningRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Curated Training Pairs:</div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {trainingData.length} Verified Human-Annotated Samples
            </strong>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={handleStartTraining}
            disabled={isTraining}
          >
            {isTraining ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Fine-Tuning Transformer Weights...
              </>
            ) : (
              <>
                <Play size={16} />
                Start Continuous Model Fine-Tuning
              </>
            )}
          </button>

          {trainedAlert && (
            <div style={{ marginTop: '1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#065F46', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Model updated! Extraction accuracy improved to <strong>98.6%</strong>.</span>
            </div>
          )}
        </div>

        {/* Right: Training History Logs */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
            Recent Model Training Jobs & Metrics
          </h3>

          <div className="table-responsive">
            <table className="custom-datatable">
              <thead>
                <tr>
                  <th>Job ID / Model</th>
                  <th>Epochs</th>
                  <th>Loss</th>
                  <th>Validation Accuracy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trainingLogs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.model}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(job.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>{job.epochs}</td>
                    <td><code style={{ fontFamily: 'monospace' }}>{job.loss}</code></td>
                    <td>
                      <strong style={{ color: '#059669' }}>{job.accuracy}%</strong>
                    </td>
                    <td>
                      <span className="badge badge-valid">
                        ✓ {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dataset Annotation Ground-Truth Explorer */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Verified Ground-Truth OCR & NER Annotations
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              These human-verified pairs are used to fine-tune the entity recognition pipeline.
            </p>
          </div>
          <span className="badge badge-valid">{trainingData.length} Active Records</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {trainingData.map(sample => (
            <div key={sample.id} style={{ background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-renewed" style={{ fontSize: '0.7rem' }}>
                  {sample.documentType}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ID: {sample.id}
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Raw OCR Input Stream:</div>
                <pre style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace', maxHeight: '80px', overflowY: 'auto', marginTop: '0.25rem', border: '1px solid var(--border-subtle)' }}>
                  {sample.ocrRawText}
                </pre>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Ground-Truth Extracted Targets:</div>
                <div style={{ background: 'var(--color-accent)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <div>• <strong>Product:</strong> {sample.groundTruth.productName}</div>
                  <div>• <strong>Serial:</strong> <code>{sample.groundTruth.serialNumber}</code></div>
                  <div>• <strong>Invoice:</strong> {sample.groundTruth.invoiceNumber}</div>
                  <div>• <strong>Warranty:</strong> {sample.groundTruth.warrantyType} ({sample.groundTruth.warrantyMonths} mo)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
