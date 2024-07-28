import React from 'react'
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/chat">Chat</a></li>
        {isAuthenticated ? (
          <>
            <li><a href="/logout">Logout</a></li>
            <li><a href="/mypage">MyPage</a></li>
          </>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/mypage">MyPage</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;