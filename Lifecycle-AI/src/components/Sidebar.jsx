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
  UserCheck, 
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ 
  onOpenUpload, 
  onOpenThemeModal, 
  metrics, 
  isOpen, 
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const { currentUser } = useAuth();
  const expiringCount = metrics?.expiringSoonCount || 0;
  const role = currentUser?.role || 'Househelp';

  const isAdmin = role === 'Admin';
  const isSenior = role === 'Senior';
  const isHousehelp = role === 'Househelp';

  const handleLinkClick = () => {
    if (onClose && typeof window !== 'undefined' && window.innerWidth < 992) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Floating Border Expand / Collapse Toggle Button */}
      {onToggleCollapse && (
        <button 
          className="sidebar-border-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* Brand Header */}
      <div className="brand-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
          <div className="brand-icon">
            <ShieldAlert size={22} />
          </div>
          <div className="brand-title brand-title-wrap">
            <span>Lifecycle AI</span>
            <span className="brand-subtitle">Family Vault & Smart Care</span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          className="btn btn-secondary btn-icon mobile-sidebar-close"
          onClick={onClose}
          style={{ display: 'none', padding: '0.35rem' }}
          title="Close Navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role Indicator Banner */}
      <div 
        className="role-indicator-banner"
        title={`Current Persona Mode: ${role}`}
        style={{
          margin: '0 0.4rem 0.85rem 0.4rem',
          padding: '0.45rem 0.7rem',
          borderRadius: 'var(--radius-md)',
          background: isAdmin ? '#DCFCE7' : isSenior ? '#FEE2E2' : '#FEF3C7',
          color: isAdmin ? '#15803D' : isSenior ? '#B91C1C' : '#B45309',
          fontSize: '0.72rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        {isAdmin && <ShieldAlert size={15} style={{ flexShrink: 0 }} />}
        {isSenior && <Heart size={15} style={{ flexShrink: 0 }} />}
        {isHousehelp && <Wrench size={15} style={{ flexShrink: 0 }} />}
        <span className="role-indicator-text">Mode: {role}</span>
      </div>

      {/* Quick Action Button - Only visible for Admin */}
      {isAdmin && (
        <div style={{ padding: '0 0.4rem 0.85rem 0.4rem' }}>
          <button 
            className="btn btn-primary scan-doc-btn" 
            onClick={onOpenUpload}
            style={{ width: '100%', padding: '0.65rem 0.85rem', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            title="Scan Document & Invoices"
          >
            <PlusCircle size={18} style={{ flexShrink: 0 }} />
            <span className="scan-doc-text">Scan Document</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <ul className="nav-links">
        <div className="nav-section-title">
          {isHousehelp ? 'Home Maintenance' : 'Overview & Vault'}
        </div>
        
        <li>
          <NavLink 
            to="/" 
            end 
            onClick={handleLinkClick} 
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            title="Dashboard Overview"
          >
            <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
            <span className="nav-link-text">Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/documents" 
            onClick={handleLinkClick} 
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            title={isHousehelp ? 'Appliance Inventory' : 'All Documents & Warranties'}
          >
            <Files size={18} style={{ flexShrink: 0 }} />
            <span className="nav-link-text">{isHousehelp ? 'Appliance Inventory' : 'All Documents'}</span>
            {expiringCount > 0 && (
              <span className="nav-badge nav-badge-warn">{expiringCount}</span>
            )}
          </NavLink>
        </li>

        {/* Senior Health Hub (Senior and Admin only) */}
        {(isSenior || isAdmin) && (
          <li>
            <NavLink 
              to="/senior-health" 
              onClick={handleLinkClick} 
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              title="Senior Health & Vitals Hub"
            >
              <Heart size={18} color="#EF4444" style={{ flexShrink: 0 }} />
              <span className="nav-link-text">Senior Health Hub</span>
              <span className="nav-badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>Care</span>
            </NavLink>
          </li>
        )}

        {/* Family Vault (Admin and Senior only) */}
        {(isAdmin || isSenior) && (
          <li>
            <NavLink 
              to="/family-vault" 
              onClick={handleLinkClick} 
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              title="Family Vault & Members"
            >
              <Users size={18} style={{ flexShrink: 0 }} />
              <span className="nav-link-text">Family Vault</span>
            </NavLink>
          </li>
        )}

        {/* AI Assistant available to everyone (Admin, Househelp, Senior) */}
        <div className="nav-section-title">
          {isHousehelp ? 'AI Smart Assistant' : 'AI Intelligence Engines'}
        </div>

        <li>
          <NavLink 
            to="/chat" 
            onClick={handleLinkClick} 
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            title="Lifecycle AI Chat Assistant"
          >
            <MessageSquareText size={18} style={{ flexShrink: 0 }} />
            <span className="nav-link-text">AI Chat Assistant</span>
          </NavLink>
        </li>

        {/* Advanced AI Engines (Admin only) */}
        {isAdmin && (
          <>
            <li>
              <NavLink 
                to="/risk-prediction" 
                onClick={handleLinkClick} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title="AI Failure & Risk Prediction"
              >
                <AlertOctagon size={18} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">AI Risk Prediction</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/claim-generator" 
                onClick={handleLinkClick} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title="AI Legal & Warranty Claim Generator"
              >
                <FileText size={18} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">AI Claim Generator</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/advisor" 
                onClick={handleLinkClick} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title="Cost-Benefit Repair vs Replace Advisor"
              >
                <Scale size={18} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">Cost-Benefit Advisor</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/resale-estimator" 
                onClick={handleLinkClick} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title="Appliance Resale & Depreciation Estimator"
              >
                <TrendingUp size={18} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">Resale Estimator</span>
              </NavLink>
            </li>

            <div className="nav-section-title">Machine Learning</div>

            <li>
              <NavLink 
                to="/ai-training" 
                onClick={handleLinkClick} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title="AI Model Training & Benchmark Studio"
              >
                <Cpu size={18} style={{ flexShrink: 0 }} />
                <span className="nav-link-text">AI Training Studio</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="btn btn-secondary theme-engine-btn" 
          onClick={onOpenThemeModal}
          style={{ width: '100%', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}
          title="Pastel Theme Engine"
        >
          <Palette size={16} style={{ flexShrink: 0 }} />
          <span className="theme-engine-text">Pastel Theme Engine</span>
        </button>
      </div>
    </aside>
  );
};

