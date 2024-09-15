import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../NavBar/NavBar';
import './LoginPage.css';

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
      password: Password,
    }
    // const baseUrl = process.env.REACT_APP_BASE_URL;
    // const request = axios.post(`${baseUrl}/api/users/login`, body, { withCredentials: true })
    // .then(response =>  response.data )

    dispatch(loginUser(body))
    .then(response => {
      if(response.payload.loginSuccess){
        window.location.reload();
        // props.history.push("/login");
        //navigate("/");
      }else{
        alert("Failed to login");
      }
    })
    .catch((err)=>{
      console.error(err, 'dispatch 에러')
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
    <div>
      <NavBar />
      <loginMain>
        <div id='login'>Log in</div>
        <form onSubmit={onSubmitHandler}>
        <div className='login-container'>
          {/* 이메일 입력 컨테이너 */}
          <div className='input-container'>
            <div><span className="email-icon"></span>Email</div>
            <input type='email' value={Email} onChange={onEmailHandler}/>
          </div>
          {/* 비밀번호 입력 컨테이너 */}
          <div className='input-container'>
            <div><span class="password-icon"></span>Password</div>
            <input type='password' value={Password} onChange={onPasswordHandler}/>
            {/* 비밀번호 잊었을 시 페이지 이동 */}
            <div id='forgot-password'>
              <a href='/password/forgot'>Forgot password?</a>
            </div>
          </div>
          {/* 로그인 버튼 컨테이너*/}
          <div className='sign-in-container'>
            <button type='submit'>Sign in</button>
          </div>
        </div>
        </form>
        {/* 회원가입 페이지 이동 컨테이너 */}
        <div className='navigate-register-container'>
          <a href='/register'>Don’t have an account?</a>
        </div>
      </loginMain>
    </div>
  )
}

export default LoginPage
