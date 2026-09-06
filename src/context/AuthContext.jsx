import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user_profile');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const profile = storedUser ? JSON.parse(storedUser) : null;
        setUser({
          id: payload.userId || profile?.id || 'user',
          name: payload.name || profile?.name || 'User',
          email: payload.sub,
          role: payload.role,
          licenseNo: profile?.licenseNo,
          phone: profile?.phone
        });
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_profile');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const newToken = response.data.access_token;
      const userData = response.data.user;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user_profile', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      // Redirect based on SRS specifications: REQ-04, REQ-05, REQ-06
      if (userData.role === 'Admin') {
        navigate('/admin');
      } else if (userData.role === 'Driver') {
        navigate('/driver');
      } else {
        navigate('/search');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Invalid login credentials' };
    }
  };

  const demoLogin = async (role) => {
    let email = 'passenger1@ptms.com';
    let password = 'pass123';

    if (role === 'Admin') {
      email = 'admin@ptms.com';
      password = 'admin123';
    } else if (role === 'Driver') {
      email = 'driver@ptms.com';
      password = 'driver123';
    }

    return await login(email, password);
  };

  const register = async (name, email, password, role = 'Passenger', phone = '', licenseNo = '') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, phone, licenseNo });
      const newToken = response.data.access_token;
      const userData = response.data.user;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user_profile', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      if (userData.role === 'Admin') {
        navigate('/admin');
      } else if (userData.role === 'Driver') {
        navigate('/driver');
      } else {
        navigate('/search');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
