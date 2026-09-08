import React, { createContext, useContext, useState, useEffect } from 'react';

// Predefined Demo Personas
export const DEMO_USERS = {
  admin: {
    id: 'user_admin',
    name: 'Dhyey Bhatt',
    email: 'dhyey@lifecycle.ai',
    role: 'Admin',
    roleLabel: 'Household Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    description: 'Full master access: upload receipts, manage family vault, ML training, dispute claims, and device health.',
    allowedRoutes: [
      '/',
      '/documents',
      '/family-vault',
      '/risk-prediction',
      '/claim-generator',
      '/advisor',
      '/resale-estimator',
      '/chat',
      '/ai-training',
      '/senior-health'
    ]
  },
  househelp: {
    id: 'user_househelp',
    name: 'Maria Santos',
    email: 'maria.care@lifecycle.ai',
    role: 'Househelp',
    roleLabel: 'Home Care & Maintenance Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    description: 'View-only access to household appliances and devices with AI Assistant for cleaning guides, manual lookups, and maintenance queries.',
    allowedRoutes: [
      '/',
      '/documents',
      '/chat'
    ]
  },
  senior: {
    id: 'user_senior',
    name: 'Robert Vance',
    email: 'robert.vance@lifecycle.ai',
    role: 'Senior',
    roleLabel: 'Senior Citizen / Family Elder',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    description: 'Access to household product safety & warranties, plus personal Senior Health Vitals, Medication Schedules, and AI Health Precautions.',
    allowedRoutes: [
      '/',
      '/documents',
      '/senior-health',
      '/chat',
      '/family-vault'
    ]
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lifecycle_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    // Default to Admin persona
    return DEMO_USERS.admin;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('lifecycle_auth_token') || true;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lifecycle_user', JSON.stringify(currentUser));
      localStorage.setItem('lifecycle_auth_token', 'mock_jwt_token_' + currentUser.id);
    } else {
      localStorage.removeItem('lifecycle_user');
      localStorage.removeItem('lifecycle_auth_token');
    }
  }, [currentUser]);

  const loginAsRole = (roleKey) => {
    const user = DEMO_USERS[roleKey.toLowerCase()] || DEMO_USERS.admin;
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const loginWithCredentials = async (email, password) => {
    // Check if matching any demo role email
    const foundRole = Object.values(DEMO_USERS).find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (foundRole) {
      setCurrentUser(foundRole);
      setIsAuthenticated(true);
      return { success: true, user: foundRole };
    }

    // Default fallback mock login as Admin
    const fallbackUser = {
      ...DEMO_USERS.admin,
      name: email.split('@')[0] || 'Dhyey Bhatt',
      email: email
    };
    setCurrentUser(fallbackUser);
    setIsAuthenticated(true);
    return { success: true, user: fallbackUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lifecycle_user');
    localStorage.removeItem('lifecycle_auth_token');
  };

  const hasRouteAccess = (path) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    return (currentUser.allowedRoutes || []).includes(path);
  };

  const isRole = (roleName) => {
    return currentUser?.role?.toLowerCase() === roleName.toLowerCase();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginAsRole,
        loginWithCredentials,
        logout,
        hasRouteAccess,
        isRole,
        DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
