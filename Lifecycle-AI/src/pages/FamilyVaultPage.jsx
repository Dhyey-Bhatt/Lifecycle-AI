import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Key, 
  Check, 
  X, 
  FolderLock, 
  User, 
  Mail,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api';

export const FamilyVaultPage = () => {
  const [members, setMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Editor'
  });

  const fetchMembers = async () => {
    try {
      const data = await api.vault.getMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    try {
      const saved = await api.vault.createMember(newMember);
      setMembers(prev => [...prev, saved]);
      setIsAddModalOpen(false);
      setNewMember({ name: '', email: '', role: 'Editor' });
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-valid">
              <Users size={14} /> Feature 8: Secure Multi-User RBAC
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Family Vault & Role-Based Access Control
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Allows multiple family members to securely manage and share important warranties, AMC contracts, and invoices with granular permissions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={16} />
          Invite Family Member
        </button>
      </div>

      {/* Security Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, white, var(--color-accent))', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-icon" style={{ width: '42px', height: '42px' }}>
            <FolderLock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              End-to-End Encrypted Household Vault
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              All documents are tagged with role permissions. Viewers can inspect invoices and warranties, Editors can upload receipts and generate claims, and Admins control model retraining exports.
            </p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
        Family Vault Members & Permissions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {members.map(member => (
          <div key={member.id} className="card" style={{ background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img 
                src={member.avatar} 
                alt={member.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-secondary)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Mail size={12} />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Role Assignment</span>
              <span className={`badge ${member.role.includes('Admin') ? 'badge-valid' : member.role.includes('Editor') ? 'badge-renewed' : 'badge-claim'}`}>
                {member.role}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Granted Permissions:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                {member.permissions?.map((perm, i) => (
                  <span 
                    key={i} 
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'var(--color-accent)',
                      color: 'var(--color-primary)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Invite Family Vault Member
              </h2>
              <button className="btn btn-secondary btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Sarah Bhatt"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. sarah@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vault Role & Privileges</label>
                <select 
                  className="form-select"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="Editor">Editor (Upload, Edit, Generate Claims)</option>
                  <option value="Viewer">Viewer (View & Download Invoices only)</option>
                  <option value="Admin (Owner)">Admin (Full Access + Model Training Controls)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
