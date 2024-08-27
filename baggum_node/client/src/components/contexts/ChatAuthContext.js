import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/dev'; // config import
import { useAuth } from './AuthContext'; // AuthContext import

const ChatAuthContext = createContext();

export const ChatAuthProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // AuthContext에서 사용자 정보를 가져옴
  const [chatAuthState, setChatAuthState] = useState({
    isAuthenticatedInChat: false,
    loading: false,
  });

  const checkChatRoomAuth = async (roomId) => {
    if (!user || !isAuthenticated) return;

    setChatAuthState({ ...chatAuthState, loading: true });

    try {

        const currentUserEmail = user.email;
        // const currentUserId = await axios.get(`${config.baseUrl}/api/users/getId`);
        const currentUserIdResponse = await axios.get(`${config.baseUrl}/api/users/getId`, {
          params: {
            email: currentUserEmail
          }
        });
        const currentUserId = currentUserIdResponse.data.userId;

      const response = await axios.get(`${config.baseUrl}/api/chat/auth/chat`, {
        params: { roomId, userId: currentUserId },
        withCredentials: true,
      });

      setChatAuthState({
        isAuthenticatedInChat: response.status === 200,
        loading: false,
      });
    } catch (error) {
      setChatAuthState({
        isAuthenticatedInChat: false,
        loading: false,
      });
    }
  };

  return (
    // <ChatAuthContext.Provider value={{ ...chatAuthState, checkChatRoomAuth }}>
    <ChatAuthContext.Provider value={{ ...chatAuthState }}>
    {children}
    </ChatAuthContext.Provider>
  );
};

export const useChatAuth = () => {
  return useContext(ChatAuthContext);
};