import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Heart, 
  Wrench, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsRole, loginWithCredentials } = useAuth();

  const [selectedRoleKey, setSelectedRoleKey] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleQuickLogin = (roleKey) => {
    setLoading(true);
    setTimeout(() => {
      loginAsRole(roleKey);
      setLoading(false);
      navigate(from, { replace: true });
    }, 400);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await loginWithCredentials(email, password);
    setLoading(false);
    navigate(from, { replace: true });
  };

  const roles = [
    {
      key: 'admin',
      data: DEMO_USERS.admin,
      badgeColor: '#DCFCE7',
      badgeText: '#15803D',
      icon: ShieldCheck,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      tagline: 'Household Administrator & Owner',
      features: [
        'Full receipt AI scanning & OCR upload',
        'AI Claim generator & warranty disputes',
        'Family Vault RBAC & ML Studio access',
        'Senior health reviews & telemetry'
      ]
    },
    {
      key: 'househelp',
      data: DEMO_USERS.househelp,
      badgeColor: '#FEF3C7',
      badgeText: '#B45309',
      icon: Wrench,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      tagline: 'Home Care & Maintenance Specialist',
      features: [
        'View-only access to household appliances',
        'AI Chatbot for operational & cleaning guides',
        'Warranty expiry & maintenance tracker',
        'Financial & admin editing tools restricted'
      ]
    },
    {
      key: 'senior',
      data: DEMO_USERS.senior,
      badgeColor: '#FEE2E2',
      badgeText: '#B91C1C',
      icon: Heart,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      tagline: 'Senior Citizen & Family Elder',
      features: [
        'Dedicated Senior Health & Wellness Hub',
        'Daily health vitals telemetry (BP, Sugar, Pulse)',
        'Medication reminder & adherence checklist',
        'AI Health Precautions & Emergency SOS'
      ]
    }
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(240, 253, 244, 0.8), rgba(247, 247, 248, 1))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        fontFamily: 'var(--font-family, inherit)'
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '640px' }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'white',
            padding: '0.5rem 1.25rem',
            borderRadius: '50px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1rem'
          }}
        >
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <ShieldAlert size={18} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Lifecycle AI
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
            Family Vault & Smart Care
          </span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-heading)', margin: '0.5rem 0' }}>
          Welcome to Your Family Portal
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.5, margin: 0 }}>
          Select your household persona below for a personalized, role-tailored experience with intelligent warranty protection, home maintenance, and senior wellness.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1080px',
          width: '100%',
          marginBottom: '2rem'
        }}
      >
        {roles.map(r => {
          const isSelected = selectedRoleKey === r.key;
          const IconComp = r.icon;

          return (
            <div 
              key={r.key}
              onClick={() => setSelectedRoleKey(r.key)}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 12px 28px rgba(34, 197, 94, 0.15)' : 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: isSelected ? 'translateY(-4px)' : 'none'
              }}
            >
              {isSelected && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '14px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <CheckCircle2 size={12} /> Active Selection
                </div>
              )}

              <div>
                {/* Persona Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <img 
                    src={r.data.avatar} 
                    alt={r.data.name} 
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${r.iconColor}`
                    }}
                  />
                  <div>
                    <span 
                      style={{
                        background: r.badgeColor,
                        color: r.badgeText,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '50px',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        marginBottom: '0.2rem'
                      }}
                    >
                      {r.data.role}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                      {r.data.name}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {r.tagline}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {r.data.description}
                </p>

                {/* Persona Features Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                  {r.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-heading)' }}>
                      <CheckCircle2 size={14} color={r.iconColor} style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* One-Click Login Button */}
              <button 
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin(r.key);
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 800
                }}
              >
                {loading && selectedRoleKey === r.key ? (
                  'Entering Portal...'
                ) : (
                  <>
                    <span>Enter as {r.data.role}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Alternative Credentials Sign-In Accordion */}
      <div 
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}
      >
        <button 
          onClick={() => setIsCustomMode(!isCustomMode)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Lock size={14} />
          {isCustomMode ? 'Hide Custom Credentials Login' : 'Or Sign In with Custom Email & Password'}
        </button>

        {isCustomMode && (
          <form onSubmit={handleCustomSubmit} style={{ marginTop: '1.25rem', textAlign: 'left' }}>
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. dhyey@lifecycle.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
