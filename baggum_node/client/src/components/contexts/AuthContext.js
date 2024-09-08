import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import apis from './api';
import config from '../../config/dev';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  const requestInProgress = useRef(false);

  useEffect(()=>{
    const checkAuth = async() =>{

      if(requestInProgress.current) return;
      requestInProgress.current = true;

      try{
        const response = await apis.api.get('/auth')
        if(response.data.error==='로그인 만료'){
          alert('로그인 만료')
        }
        setAuthState({
          isAuthenticated: response.data.isAuth,
          user: response.data,
          loading: false,
        })
      } catch(err){
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
      } finally{
        requestInProgress.current = false;
      }
    };

    checkAuth();
    
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};