import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import axios from "axios";
import config from '../../../config/dev'; // config import
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated } = useAuth();

  const onClickHandler = () => {
    axios.get(`${config.baseUrl}/api/users/logout`, { withCredentials: true })
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
        <div className="left-icons">
          <li><a href="#icon0"><img src="/images/alarm.png" alt="Icon 0" class="img-small"></img></a></li>
          <li><a href="#iconA"><img src="/images/baggumLogo_1.png" alt="Icon A" class="img-small"></img></a></li>
          <li><a href="#iconB"><img src="images/baggumLogo_2.png" alt="Icon B" class="img-small"></img></a></li>
        </div>
        <div className="right-links">
          <li><a href="/">Home</a></li>
          <li><a href="/items">Items</a></li>
          <li><a href="/chat">Chat</a></li>
          {isAuthenticated ? (
            <>
              <li>
                <button onClick={onClickHandler}>
                  Logout
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
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;