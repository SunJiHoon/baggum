import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../../config/dev'; // config import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    isAuthenticatedInChat: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/api/users/auth`, { withCredentials: true });
        setAuthState({
          isAuthenticated: response.data.isAuth,
          user: response.data,
          loading: false,
          isAuthenticatedInChat: authState.isAuthenticatedInChat
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          isAuthenticatedInChat: authState.isAuthenticatedInChat
        });
      }
    };
    // checkChatRoomAuth();
    checkAuth();
  }, []);

  const checkChatRoomAuth = async (roomId, userId) => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/chat/auth/chat`, { params: { roomId, userId }, withCredentials: true });
      console.log(response);
      console.log(response.status === 200);
      
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticatedInChat: response.status === 200
      }));
    } catch (error) {
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticatedInChat: false
      }));
    }
  };



  return (
    <AuthContext.Provider value={{ ...authState, checkChatRoomAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
