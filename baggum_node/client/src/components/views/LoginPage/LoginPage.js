import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    let body={
      email: Email,
      password: Password
    }
    // const baseUrl = process.env.REACT_APP_BASE_URL;
    // const request = axios.post(`${baseUrl}/api/users/login`, body, { withCredentials: true })
    // .then(response =>  response.data )

    dispatch(loginUser(body))
    .then(response => {
      if(response.payload.loginSuccess){
        // props.history.push("/login");
        navigate("/");
      }else{
        alert("Failed to login");
      }
    })

  }

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/'); // 로그인된 사용자를 리디렉션할 페이지
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 상태 처리
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{display:'flex', flexDirection:'column'}}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type='email' value={Email} onChange={onEmailHandler}/>
        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler}/>
        <br/>
        <button type='submit'>
          Login
        </button>


      </form>
    </div>
  )
}

export default LoginPage
