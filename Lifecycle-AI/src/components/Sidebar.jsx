import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  AlertOctagon, 
  FileText, 
  Scale, 
  TrendingUp, 
  MessageSquareText, 
  Users, 
  Cpu, 
  PlusCircle, 
  Palette,
  ShieldAlert,
  Heart,
  Wrench,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ onOpenUpload, onOpenThemeModal, metrics }) => {
  const { currentUser } = useAuth();
  const expiringCount = metrics?.expiringSoonCount || 0;
  const role = currentUser?.role || 'Househelp';

  const isAdmin = role === 'Admin';
  const isSenior = role === 'Senior';
  const isHousehelp = role === 'Househelp';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-icon">
          <ShieldAlert size={22} />
        </div>
        <div className="brand-title">
          <span>Lifecycle AI</span>
          <span className="brand-subtitle">Family Vault & Smart Care</span>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div 
        style={{
          margin: '0 0.75rem 0.85rem 0.75rem',
          padding: '0.45rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          background: isAdmin ? '#DCFCE7' : isSenior ? '#FEE2E2' : '#FEF3C7',
          color: isAdmin ? '#15803D' : isSenior ? '#B91C1C' : '#B45309',
          fontSize: '0.72rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {isAdmin && <ShieldAlert size={14} />}
        {isSenior && <Heart size={14} />}
        {isHousehelp && <Wrench size={14} />}
        <span>Mode: {role}</span>
      </div>

      {/* Quick Action Button - Only visible for Admin */}
      {isAdmin && (
        <div style={{ padding: '0 0.75rem 0.85rem 0.75rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={onOpenUpload}
            style={{ width: '100%', padding: '0.65rem 0.85rem' }}
          >
            <PlusCircle size={18} />
            Scan Document
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <ul className="nav-links">
        <div className="nav-section-title">
          {isHousehelp ? 'Home Maintenance' : 'Overview & Vault'}
        </div>
        
        <li>
          <NavLink to="/" end className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/documents" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Files size={18} />
            <span>{isHousehelp ? 'Appliance Inventory' : 'All Documents'}</span>
            {expiringCount > 0 && (
              <span className="nav-badge nav-badge-warn">{expiringCount}</span>
            )}
          </NavLink>
        </li>

        {/* Senior Health Hub (Senior and Admin only) */}
        {(isSenior || isAdmin) && (
          <li>
            <NavLink to="/senior-health" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
              <Heart size={18} color="#EF4444" />
              <span>Senior Health Hub</span>
              <span className="nav-badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>Care</span>
            </NavLink>
          </li>
        )}

        {/* Family Vault (Admin and Senior only) */}
        {(isAdmin || isSenior) && (
          <li>
            <NavLink to="/family-vault" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Family Vault</span>
            </NavLink>
          </li>
        )}

        {/* AI Assistant available to everyone (Admin, Househelp, Senior) */}
        <div className="nav-section-title">
          {isHousehelp ? 'AI Smart Assistant' : 'AI Intelligence Engines'}
        </div>

        <li>
          <NavLink to="/chat" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <MessageSquareText size={18} />
            <span>AI Chat Assistant</span>
          </NavLink>
        </li>

        {/* Advanced AI Engines (Admin only) */}
        {isAdmin && (
          <>
            <li>
              <NavLink to="/risk-prediction" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                <AlertOctagon size={18} />
                <span>AI Risk Prediction</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/claim-generator" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                <FileText size={18} />
                <span>AI Claim Generator</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/advisor" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                <Scale size={18} />
                <span>Cost-Benefit Advisor</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/resale-estimator" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                <TrendingUp size={18} />
                <span>Resale Estimator</span>
              </NavLink>
            </li>

            <div className="nav-section-title">Machine Learning</div>

            <li>
              <NavLink to="/ai-training" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                <Cpu size={18} />
                <span>AI Training Studio</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="btn btn-secondary" 
          onClick={onOpenThemeModal}
          style={{ width: '100%', fontSize: '0.82rem' }}
        >
          <Palette size={16} />
          Pastel Theme Engine
        </button>
      </div>
    </aside>
  );
};
