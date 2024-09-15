import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_actions/user_action'
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");


  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if (Password !== ConfirmPassword){
      return alert("비밀번호와 비밀번호 확인은 같아야합니다.");
    }
    let body={
      email: Email,
      name: Name,
      password: Password
    }
    dispatch(registerUser(body))
    .then(response => {
      if(response.payload.success){
        // props.history.push("/login");
        navigate("/login");
      }else{
        alert("Failed to sign up");
      }
    })
  }
  return (
    <div>
      <NavBar />
      <registerMain>
        <div id='register'>Create Account</div>
        <form onSubmit={onSubmitHandler}>
        <div className='register-container'>
          {/* 사용자이름 입력 컨테이너 */}
          <div className='input-container'>
            <div><span className="username-icon"></span>Username</div>
            <input type='text' value={Name} onChange={onNameHandler}/>
          </div>
          {/* 이메일 입력 컨테이너 */}
          <div className='input-container'>
            <div><span className="email-icon"></span>Email</div>
            <input type='email' value={Email} onChange={onEmailHandler}/>
          </div>
          {/* 비밀번호 입력 컨테이너 */}
          <div className='input-container'>
            <div><span className="password-icon"></span>Password</div>
            <input type='password' value={Password} onChange={onPasswordHandler}/>
          </div>
          {/* 비밀번호 재확인 입력 컨테이너 */}
          <div className='input-container'>
            <div><span className="password-icon"></span>Confirm Password</div>
            <input type='password' value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
          </div>
          {/* 회원가입 버튼 컨테이너 */}
          <div className='sign-up-container'>
            <button id='sign-up-button' type='submit'>Sign up</button>
          </div>
        </div>
        </form>
        {/* 로그인 페이지 이동 컨테이너 */}
        <div className='navigate-login-container'>
          <a href='/login'>Already have an account?</a>
        </div>
      </registerMain>
    </div>
  )
}

export default RegisterPage