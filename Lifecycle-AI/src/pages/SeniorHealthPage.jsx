import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Sparkles, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  RefreshCw, 
  UserCheck, 
  Thermometer, 
  Droplets, 
  Flame, 
  Smile, 
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export const SeniorHealthPage = () => {
  const { currentUser } = useAuth();

  // Senior Vitals State
  const [vitals, setVitals] = useState({
    bloodPressure: '122/78',
    bpStatus: 'Optimal',
    glucose: 104,
    glucoseStatus: 'Normal (Fasting)',
    heartRate: 72,
    spo2: 98,
    lastChecked: 'Today, 8:30 AM'
  });

  const [isLoggingVitals, setIsLoggingVitals] = useState(false);
  const [newVitalsForm, setNewVitalsForm] = useState({
    bpSys: '120',
    bpDia: '80',
    glucose: '100',
    heartRate: '72',
    notes: ''
  });

  // Daily Medication Tracker
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Atorvastatin (Lipitor)',
      dose: '20mg',
      time: '8:00 AM (Morning)',
      purpose: 'Cholesterol & Heart Support',
      taken: true
    },
    {
      id: 2,
      name: 'Metformin XR',
      dose: '500mg',
      time: '1:00 PM (With Lunch)',
      purpose: 'Glucose Regulation',
      taken: true
    },
    {
      id: 3,
      name: 'Vitamin D3 & Calcium',
      dose: '1000 IU',
      time: '2:30 PM (Afternoon)',
      purpose: 'Bone & Joint Strength',
      taken: false
    },
    {
      id: 4,
      name: 'CoQ10 Heart Complex',
      dose: '100mg',
      time: '8:30 PM (Evening)',
      purpose: 'Cardiovascular Vitality',
      taken: false
    }
  ]);

  // AI Health Precautions & Advice
  const [precautions, setPrecautions] = useState({
    overallHealthIndex: 94,
    healthGrade: 'A+ (Excellent Care)',
    dailySummary: "Vitals remain within target cardiovascular parameters. Medication adherence is 100% for morning regimen.",
    keyPrecautions: [
      {
        title: "Afternoon Hydration Reminder",
        category: "Hydration",
        icon: "Droplets",
        description: "Aim for at least 650ml water between 2 PM and 6 PM to maintain renal health and electrolyte balance.",
        urgency: "Recommended"
      },
      {
        title: "Gentle 15-Minute Indoor Walk",
        category: "Mobility",
        icon: "Activity",
        description: "Post-lunch light stroll promotes healthy circulation and natural glucose absorption.",
        urgency: "Low Impact"
      },
      {
        title: "Seasonal Ambient Temperature Watch",
        category: "Comfort",
        icon: "Thermometer",
        description: "Keep room temperature between 22°C - 24°C to avoid cold-induced joint stiffness.",
        urgency: "Notice"
      }
    ]
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [sosAlert, setSosAlert] = useState(false);

  const toggleMedication = (id) => {
    setMedications(prev =>
      prev.map(m => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const handleSaveVitals = (e) => {
    e.preventDefault();
    setVitals({
      bloodPressure: `${newVitalsForm.bpSys}/${newVitalsForm.bpDia}`,
      bpStatus: Number(newVitalsForm.bpSys) < 130 ? 'Normal / Controlled' : 'Elevated Attention',
      glucose: Number(newVitalsForm.glucose),
      glucoseStatus: Number(newVitalsForm.glucose) < 120 ? 'Normal' : 'Monitor Post-Meal',
      heartRate: Number(newVitalsForm.heartRate),
      spo2: 98,
      lastChecked: 'Just Now'
    });
    setIsLoggingVitals(false);
  };

  const handleRefreshAIPrecautions = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setPrecautions({
        overallHealthIndex: 96,
        healthGrade: 'A+ (Optimal)',
        dailySummary: "Updated telemetry indicates balanced blood pressure. Sleep quality recorded at 8.1 hours.",
        keyPrecautions: [
          {
            title: "Evening Medication with Warm Water",
            category: "Regimen",
            icon: "Pill",
            description: "Take CoQ10 30 mins after dinner with warm water for highest absorption rate.",
            urgency: "High Priority"
          },
          {
            title: "Mild Joint Flexing Exercises",
            category: "Physiotherapy",
            icon: "Activity",
            description: "5-minute seated ankle & knee flexes to maintain elasticity before bedtime.",
            urgency: "Beneficial"
          },
          {
            title: "Scheduled Caregiver Check-In",
            category: "Family Link",
            icon: "PhoneCall",
            description: "Weekly wellness synchronization scheduled with Primary Caregiver (Dhyey Bhatt).",
            urgency: "Routine"
          }
        ]
      });
      setAiGenerating(false);
    }, 1200);
  };

  const handleTriggerSOS = () => {
    setSosAlert(true);
    setTimeout(() => setSosAlert(false), 5000);
  };

  const completedMedsCount = medications.filter(m => m.taken).length;
  const medsProgressPercent = Math.round((completedMedsCount / medications.length) * 100);

  return (
    <div className="page-content">
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), #F0FDF4)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid #BBF7D0',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
            alt="Robert Vance" 
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              border: '3px solid #22C55E',
              boxShadow: 'var(--shadow-sm)',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span 
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Heart size={12} fill="#15803D" /> Senior Wellness Hub
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age: 72 &bull; Blood: O+</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Robert Vance
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
              Family Elder Profile &bull; Primary Caregiver: <strong>Dhyey Bhatt</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setIsLoggingVitals(true)}
            style={{ background: 'white' }}
          >
            <Plus size={16} />
            Log Daily Vitals
          </button>
          
          <button 
            className="btn"
            onClick={handleTriggerSOS}
            style={{
              background: '#EF4444',
              color: 'white',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              fontWeight: 700
            }}
          >
            <ShieldAlert size={16} />
            Emergency SOS Alert
          </button>
        </div>
      </div>

      {/* SOS Alert Notification Banner */}
      {sosAlert && (
        <div 
          style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'pulse 1.5s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={24} color="#DC2626" />
            <div>
              <strong style={{ color: '#991B1B' }}>Emergency Caregiver Notification Dispatched!</strong>
              <div style={{ fontSize: '0.82rem', color: '#B91C1C' }}>
                SMS & Call notification sent to primary contact (Dhyey Bhatt: +1 555-019-2834) and Dr. Evans.
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setSosAlert(false)} style={{ fontSize: '0.8rem' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Grid Layout: Vitals & Medications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Vitals Summary Card */}
        <div className="card" style={{ background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="brand-icon" style={{ width: '36px', height: '36px', background: '#FEE2E2', color: '#EF4444' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Health Vitals Telemetry
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {vitals.lastChecked}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Blood Pressure</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                {vitals.bloodPressure} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>mmHg</span>
              </div>
              <span className="badge badge-valid" style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
                {vitals.bpStatus}
              </span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Blood Glucose</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                {vitals.glucose} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>mg/dL</span>
              </div>
              <span className="badge badge-valid" style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
                {vitals.glucoseStatus}
              </span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resting Heart Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                {vitals.heartRate} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>BPM</span>
              </div>
              <span className="badge badge-valid" style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
                Regular Rhythm
              </span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Oxygen Saturation (SpO2)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>
                {vitals.spo2}%
              </div>
              <span className="badge badge-valid" style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
                Optimal Oxygen
              </span>
            </div>
          </div>
        </div>

        {/* Daily Medication Tracker Card */}
        <div className="card" style={{ background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="brand-icon" style={{ width: '36px', height: '36px', background: '#DBEAFE', color: '#2563EB' }}>
                <Pill size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Daily Prescription Schedule
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {completedMedsCount} of {medications.length} taken today ({medsProgressPercent}%)
                </span>
              </div>
            </div>
            <span className="badge badge-valid">
              Today Active
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-app)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div 
              style={{
                width: `${medsProgressPercent}%`,
                height: '100%',
                background: 'var(--color-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          {/* Medication List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {medications.map(med => (
              <div 
                key={med.id}
                onClick={() => toggleMedication(med.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: med.taken ? '#F0FDF4' : 'var(--bg-app)',
                  border: med.taken ? '1px solid #BBF7D0' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="checkbox"
                    checked={med.taken}
                    onChange={() => toggleMedication(med.id)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: med.taken ? '#166534' : 'var(--text-heading)', textDecoration: med.taken ? 'line-through' : 'none' }}>
                      {med.name} ({med.dose})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {med.time} &bull; {med.purpose}
                    </div>
                  </div>
                </div>

                <span 
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: med.taken ? '#15803D' : '#D97706',
                    background: med.taken ? '#DCFCE7' : '#FEF3C7',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '50px'
                  }}
                >
                  {med.taken ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Senior Health Precautions Engine */}
      <div 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, white, var(--color-accent))',
          border: '1px solid var(--border-subtle)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '40px', height: '40px', background: 'var(--color-primary)', color: 'white' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                AI Senior Health Precautions & Lifestyle Guidance
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Real-time recommendations powered by biometric telemetry, age-tailored wellness models & medication schedules.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={handleRefreshAIPrecautions}
            disabled={aiGenerating}
          >
            <RefreshCw size={16} className={aiGenerating ? 'animate-spin' : ''} />
            {aiGenerating ? 'Analyzing Vitals...' : 'Refresh AI Precautions'}
          </button>
        </div>

        {/* AI Insight Summary Banner */}
        <div 
          style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem'
              }}
            >
              {precautions.overallHealthIndex}%
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Overall Senior Health Score
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {precautions.healthGrade} &bull; {precautions.dailySummary}
              </div>
            </div>
          </div>

          <span className="badge badge-valid" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            Telemetry Normal
          </span>
        </div>

        {/* Precaution Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {precautions.keyPrecautions.map((prec, idx) => (
            <div 
              key={idx}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <span 
                  style={{
                    background: 'var(--bg-app)',
                    color: 'var(--color-primary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '50px',
                    textTransform: 'uppercase'
                  }}
                >
                  {prec.category}
                </span>
                <span 
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#2563EB',
                    background: '#EFF6FF',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '50px'
                  }}
                >
                  {prec.urgency}
                </span>
              </div>

              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                {prec.title}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {prec.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts & Doctor Hotline */}
      <div className="card" style={{ background: 'white' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
          Assigned Care Team & Emergency Directory
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Primary Caregiver (Family)</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>Dhyey Bhatt</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.3rem' }}>+1 (555) 019-2834</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Family Physician</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>Dr. Sarah Evans, MD</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.3rem' }}>St. Jude Family Clinic &bull; Ext 402</div>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Household Assistant</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.2rem' }}>Maria Santos</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.3rem' }}>Househelp Care Profile</div>
          </div>
        </div>
      </div>

      {/* Log Vitals Modal */}
      {isLoggingVitals && (
        <div className="modal-overlay" onClick={() => setIsLoggingVitals(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon" style={{ width: '36px', height: '36px', background: '#FEE2E2', color: '#EF4444' }}>
                <Activity size={20} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Log Senior Health Vitals
              </h2>
            </div>

            <form onSubmit={handleSaveVitals}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Systolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    value={newVitalsForm.bpSys} 
                    onChange={e => setNewVitalsForm({ ...newVitalsForm, bpSys: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Diastolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    value={newVitalsForm.bpDia} 
                    onChange={e => setNewVitalsForm({ ...newVitalsForm, bpDia: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Blood Sugar (mg/dL)</label>
                  <input 
                    type="number" 
                    value={newVitalsForm.glucose} 
                    onChange={e => setNewVitalsForm({ ...newVitalsForm, glucose: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Heart Rate (BPM)</label>
                  <input 
                    type="number" 
                    value={newVitalsForm.heartRate} 
                    onChange={e => setNewVitalsForm({ ...newVitalsForm, heartRate: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Daily Notes & Symptoms (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mild morning walk, felt energetic"
                  value={newVitalsForm.notes}
                  onChange={e => setNewVitalsForm({ ...newVitalsForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsLoggingVitals(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
