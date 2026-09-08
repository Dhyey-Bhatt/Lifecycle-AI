import React, { createContext, useContext, useState, useEffect } from 'react';

const THEME_PRESETS = {
  lavender: {
    id: 'lavender',
    name: 'Lavender Breeze',
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    secondary: '#C4B5FD',
    accent: '#EDE9FE',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 50%, #EDE9FE 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#E9D5FF',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    textColor: '#1E1B4B'
  },
  mint: {
    id: 'mint',
    name: 'Mint Dew',
    primary: '#10B981',
    primaryHover: '#059669',
    secondary: '#6EE7B7',
    accent: '#D1FAE5',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #D1FAE5 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#A7F3D0',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    textColor: '#064E3B'
  },
  peach: {
    id: 'peach',
    name: 'Peach Sunset',
    primary: '#F97316',
    primaryHover: '#EA580C',
    secondary: '#FDBA74',
    accent: '#FFEDD5',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#FED7AA',
    glowColor: 'rgba(249, 115, 22, 0.15)',
    textColor: '#7C2D12'
  },
  sky: {
    id: 'sky',
    name: 'Ocean Sky',
    primary: '#0284C7',
    primaryHover: '#0369A1',
    secondary: '#7DD3FC',
    accent: '#E0F2FE',
    bgGradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#BAE6FD',
    glowColor: 'rgba(2, 132, 199, 0.15)',
    textColor: '#082F49'
  },
  rose: {
    id: 'rose',
    name: 'Rose Blossom',
    primary: '#DB2777',
    primaryHover: '#BE185D',
    secondary: '#F472B6',
    accent: '#FCE7F3',
    bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#FBCFE8',
    glowColor: 'rgba(219, 39, 119, 0.15)',
    textColor: '#831843'
  },
  amber: {
    id: 'amber',
    name: 'Soft Buttercup',
    primary: '#D97706',
    primaryHover: '#B45309',
    secondary: '#FCD34D',
    accent: '#FEF3C7',
    bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    borderSubtle: '#FDE68A',
    glowColor: 'rgba(217, 119, 6, 0.15)',
    textColor: '#78350F'
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentPreset, setCurrentPreset] = useState(() => {
    return localStorage.getItem('lifecycle_theme_preset') || 'lavender';
  });
  
  const [customPrimary, setCustomPrimary] = useState(() => {
    return localStorage.getItem('lifecycle_custom_primary') || '#8B5CF6';
  });

  const [isCustom, setIsCustom] = useState(() => {
    return localStorage.getItem('lifecycle_is_custom') === 'true';
  });

  useEffect(() => {
    const activeTheme = isCustom
      ? {
          primary: customPrimary,
          primaryHover: customPrimary,
          secondary: customPrimary + '88',
          accent: customPrimary + '20',
          bgGradient: `linear-gradient(135deg, #FAFAFA 0%, ${customPrimary}15 50%, ${customPrimary}25 100%)`,
          cardBg: 'rgba(255, 255, 255, 0.90)',
          borderSubtle: customPrimary + '40',
          glowColor: customPrimary + '30',
          textColor: '#1E293B'
        }
      : THEME_PRESETS[currentPreset] || THEME_PRESETS.lavender;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', activeTheme.primary);
    root.style.setProperty('--color-primary-hover', activeTheme.primaryHover);
    root.style.setProperty('--color-secondary', activeTheme.secondary);
    root.style.setProperty('--color-accent', activeTheme.accent);
    root.style.setProperty('--bg-gradient', activeTheme.bgGradient);
    root.style.setProperty('--card-bg', activeTheme.cardBg);
    root.style.setProperty('--border-subtle', activeTheme.borderSubtle);
    root.style.setProperty('--glow-color', activeTheme.glowColor);
    root.style.setProperty('--text-heading', activeTheme.textColor);

    localStorage.setItem('lifecycle_theme_preset', currentPreset);
    localStorage.setItem('lifecycle_custom_primary', customPrimary);
    localStorage.setItem('lifecycle_is_custom', isCustom ? 'true' : 'false');
  }, [currentPreset, customPrimary, isCustom]);

  const selectPreset = (presetKey) => {
    setIsCustom(false);
    setCurrentPreset(presetKey);
  };

  const setCustomColor = (hex) => {
    setCustomPrimary(hex);
    setIsCustom(true);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentPreset,
        customPrimary,
        isCustom,
        themePresets: THEME_PRESETS,
        selectPreset,
        setCustomColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
