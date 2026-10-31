import React, { createContext, useContext, useState, useEffect } from 'react';
import { startupApi, investorApi, adminApi, authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('venturelens_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Re-verify token on mount and refresh profile
  useEffect(() => {
    const token = localStorage.getItem('venturelens_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.getMe()
      .then((res) => {
        const currentUser = {
          ...res.data,
          token,
        };
        setUser(currentUser);
        localStorage.setItem('venturelens_user', JSON.stringify(currentUser));
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem('venturelens_token');
        localStorage.removeItem('venturelens_user');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (role, credentials) => {
    let res;
    if (role === 'STARTUP') {
      res = await startupApi.login(credentials);
    } else if (role === 'INVESTOR') {
      res = await investorApi.login(credentials);
    } else if (role === 'ADMIN') {
      res = await adminApi.login(credentials);
    } else {
      throw new Error('Invalid user role specified');
    }

    const authData = res.data;
    localStorage.setItem('venturelens_token', authData.token);
    localStorage.setItem('venturelens_user', JSON.stringify(authData));
    setUser(authData);
    return authData;
  };

  const register = async (role, registrationData) => {
    let res;
    if (role === 'STARTUP') {
      res = await startupApi.register(registrationData);
    } else if (role === 'INVESTOR') {
      res = await investorApi.register(registrationData);
    } else {
      throw new Error('Registration is only available for Startups and Investors');
    }

    const authData = res.data;
    localStorage.setItem('venturelens_token', authData.token);
    localStorage.setItem('venturelens_user', JSON.stringify(authData));
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('venturelens_token');
    localStorage.removeItem('venturelens_user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = (newProfile) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, profile: newProfile };
      localStorage.setItem('venturelens_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isStartup: user?.role === 'STARTUP',
    isInvestor: user?.role === 'INVESTOR',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
