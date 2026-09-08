import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft, Users, RefreshCw } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loginAsRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = currentUser.role || 'Househelp';
  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!isAllowed) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            maxWidth: '560px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock size={32} />
          </div>

          <div>
            <span 
              style={{
                display: 'inline-block',
                background: '#FEF3C7',
                color: '#B45309',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '50px',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Access Restricted
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0.25rem 0' }}>
              Permission Required
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.5rem' }}>
              Your current persona (<strong>{currentUser.name}</strong> &bull; <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{userRole}</span>) does not have authorization to view this module (<strong>{location.pathname}</strong>).
            </p>
          </div>

          <div 
            style={{
              background: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              width: '100%',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}
          >
            <strong>Allowed Roles:</strong> {allowedRoles.join(', ')}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <Link to="/" className="btn btn-secondary" style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            
            {allowedRoles.includes('Admin') && userRole !== 'Admin' && (
              <button 
                onClick={() => loginAsRole('admin')} 
                className="btn btn-primary" 
                style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}
              >
                <RefreshCw size={16} />
                Switch to Admin
              </button>
            )}
            {allowedRoles.includes('Senior') && userRole !== 'Senior' && (
              <button 
                onClick={() => loginAsRole('senior')} 
                className="btn btn-primary" 
                style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}
              >
                <Users size={16} />
                Switch to Senior
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};
