// import logo from './logo.svg';
// import './App.css';

import React from "react";
import {
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import ChatPage from "./components/views/ChatPage/ChatPage";
import ChatRoom from "./components/views/ChatPage/ChatRoom";
import Room from "./components/views/ChatPage/Room";
import SetChatRoom from './components/views/ChatPage/SetChatRoom';


function App() {
  //https://velog.io/@fe1/React-React-Router-v6-HOC-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
  // const AuthLandingPage = Auth(LandingPage, null);
  // const newLoginPage = Auth(LoginPage, false);
  // const newRegisterPage = Auth(RegisterPage, false);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/chat" element={<ChatPage />} />
          
          <Route exact path="/chat/room" element={<ChatRoom />} />
          <Route exact path="/chat/room/:roomId" element={<Room />} />

          <Route exact path="/admin/setChatRoom" element={<SetChatRoom  />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}



export default App;
