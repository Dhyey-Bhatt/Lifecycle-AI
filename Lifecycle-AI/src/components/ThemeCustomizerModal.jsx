import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, Sparkles, X } from 'lucide-react';

export const ThemeCustomizerModal = ({ isOpen, onClose }) => {
  const { currentPreset, customPrimary, isCustom, themePresets, selectPreset, setCustomColor } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Palette size={18} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Theme & Aesthetic Studio
            </h2>
          </div>
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={onClose}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Select a curated pastel palette with smooth light gradients or pick your own primary brand color.
        </p>

        {/* Curated Pastel Palettes */}
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Curated Pastel Gradient Themes
        </h3>

        <div className="theme-palette-grid">
          {Object.entries(themePresets).map(([key, preset]) => {
            const isSelected = !isCustom && currentPreset === key;
            return (
              <div 
                key={key} 
                className={`theme-card-option ${isSelected ? 'selected' : ''}`}
                onClick={() => selectPreset(key)}
              >
                <div className="palette-swatches">
                  <div className="palette-swatch-item" style={{ background: preset.primary }} />
                  <div className="palette-swatch-item" style={{ background: preset.secondary }} />
                  <div className="palette-swatch-item" style={{ background: preset.accent }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {preset.name}
                  </span>
                  {isSelected && <Check size={14} color={preset.primary} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Primary Color Picker */}
        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                Custom Primary Color (Hex)
              </span>
            </div>
            {isCustom && (
              <span className="badge badge-valid" style={{ fontSize: '0.7rem' }}>
                Active Custom Hex
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input 
              type="color" 
              value={customPrimary}
              onChange={(e) => setCustomColor(e.target.value)}
              style={{
                width: '44px',
                height: '40px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <input 
              type="text" 
              className="form-input" 
              value={customPrimary}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#8B5CF6"
              style={{ fontFamily: 'monospace', fontWeight: 600 }}
            />
            <button 
              className="btn btn-primary"
              onClick={() => setCustomColor(customPrimary)}
              style={{ whiteSpace: 'nowrap' }}
            >
              Apply Color
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ minWidth: '120px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
