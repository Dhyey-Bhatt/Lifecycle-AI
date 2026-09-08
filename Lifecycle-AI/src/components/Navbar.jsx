import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Palette, 
  ShieldCheck, 
  User, 
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  Heart,
  Wrench,
  RefreshCw
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export const Navbar = ({ onOpenThemeModal, onSearch, metrics }) => {
  const navigate = useNavigate();
  const { currentUser, loginAsRole, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const role = currentUser?.role || 'Househelp';
  const isAdmin = role === 'Admin';
  const isSenior = role === 'Senior';
  const isHousehelp = role === 'Househelp';

  const handleRoleSwitch = (roleKey) => {
    loginAsRole(roleKey);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Search Bar */}
      <div className="navbar-search">
        <Search size={16} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder={isHousehelp ? "Search appliance manuals & maintenance..." : "Global search products, warranties, serials, invoices..."}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {/* Active Vault Badge */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--color-accent)',
            padding: '0.4rem 0.85rem',
            borderRadius: '50px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-primary)'
          }}
        >
          <ShieldCheck size={14} />
          <span>Family Main Vault</span>
        </div>

        {/* Theme Picker Trigger */}
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={onOpenThemeModal}
          title="Customize Theme & Pastel Colors"
        >
          <Palette size={18} color="var(--color-primary)" />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-secondary btn-icon" title="Notifications">
            <Bell size={18} />
          </button>
          {metrics?.expiringSoonCount > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#EF4444',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}
            >
              {metrics.expiringSoonCount}
            </span>
          )}
        </div>

        {/* User Profile & Role Switcher Menu */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.75rem',
              background: 'white',
              borderRadius: '50px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} 
              alt={currentUser?.name || "User"} 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                {currentUser?.name || 'Guest User'}
              </span>
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  color: isAdmin ? '#16A34A' : isSenior ? '#DC2626' : '#D97706' 
                }}
              >
                {role}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {/* Role Switcher Dropdown */}
          {isDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem',
                width: '260px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Switch Active Persona
              </div>

              {/* Option 1: Admin */}
              <div 
                onClick={() => handleRoleSwitch('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isAdmin ? '#DCFCE7' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <img src={DEMO_USERS.admin.avatar} alt="Admin" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>Dhyey Bhatt</div>
                  <div style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700 }}>Admin (Master)</div>
                </div>
              </div>

              {/* Option 2: Househelp */}
              <div 
                onClick={() => handleRoleSwitch('househelp')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isHousehelp ? '#FEF3C7' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <img src={DEMO_USERS.househelp.avatar} alt="Househelp" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>Maria Santos</div>
                  <div style={{ fontSize: '0.68rem', color: '#D97706', fontWeight: 700 }}>Househelp (Care)</div>
                </div>
              </div>

              {/* Option 3: Senior */}
              <div 
                onClick={() => handleRoleSwitch('senior')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSenior ? '#FEE2E2' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <img src={DEMO_USERS.senior.avatar} alt="Senior" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>Robert Vance</div>
                  <div style={{ fontSize: '0.68rem', color: '#DC2626', fontWeight: 700 }}>Senior Citizen</div>
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.25rem 0' }} />

              {/* Logout */}
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                <span>Switch Portal / Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
