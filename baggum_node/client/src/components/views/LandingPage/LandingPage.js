import React, { useEffect} from 'react';
import axios from "axios";
// import { response } from 'express';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../NavBar/NavBar';
import config from '../../../config/dev'; // config import

function LandingPage() {
  // window.location.reload()

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/login");
    // } else {
    //   // axios.get("http://localhost:5000/api/hello")
    //   // axios.get("/api/hello")
    //   // .then(response => console.log(response.data));
    // }
  }, [isAuthenticated, navigate]);



  const baseUrl = process.env.REACT_APP_BASE_URL;
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
    <div>
      <NavBar />
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh'
      }}>
        <h2>시작 페이지</h2>
        {isAuthenticated && (
          <button onClick={onClickHandler}>
            로그아웃
          </button>
        )}
      </div>
    </div>
  )

}

export default LandingPage
// export default Auth(LandingPage, null);
