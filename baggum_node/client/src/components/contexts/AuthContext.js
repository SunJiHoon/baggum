import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../../config/dev'; // config import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/api/users/auth`, { withCredentials: true });
        setAuthState({
          isAuthenticated: response.data.isAuth,
          user: response.data,
          loading: false,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };
    checkAuth();
  }, []);




  return (
    <AuthContext.Provider value={{ ...authState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
