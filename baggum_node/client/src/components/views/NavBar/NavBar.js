import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import axios from "axios";

const NavBar = () => {
  const { isAuthenticated } = useAuth();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const onClickHandler = () => {
    axios.get(`${baseUrl}/api/users/logout`, { withCredentials: true })
    .then(response => {
      console.log(response.data);
      if (response.data.success === true){
        window.location.reload();
        //navigate("/");
      }
    })
    .catch(error => {
      console.error('There was an error logging out!', error);
    });
  }
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/chat">Chat</a></li>
        {isAuthenticated ? (
          <>
            <li>
              <button onClick={onClickHandler}>
                로그아웃
              </button>
            </li>
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