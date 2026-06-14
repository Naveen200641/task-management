import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          initiateSocketConnection();
          const res = await API.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
    return () => disconnectSocket();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, ...userData } = res.data;
        const finalUser = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUser));
        setUser(finalUser);
        initiateSocketConnection();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { token, ...userData } = res.data;
        const finalUser = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUser));
        setUser(finalUser);
        initiateSocketConnection();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
