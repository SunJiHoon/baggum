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
import TestRoom from "./components/views/ChatPage/TestRoom";
import SetChatRoom from './components/views/ChatPage/SetChatRoom';
import MyChatRoom from "./components/views/ChatPage/MyChatPage";
import ItemsPage from './components/views/ItemPage/ItemPage';
import ItemDetail from './components/views/ItemPage/ItemDetail';
import NewItem from './components/views/ItemPage/NewItem';


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
          {/* <Route exact path="/chat" element={<ChatPage />} /> */}
          
          <Route exact path="/chat/room" element={<ChatRoom />} />
          <Route exact path="/chat/room/:roomId" element={<Room />} />

          <Route exact path="/chat/test/room/:roomId" element={<TestRoom />} />
          <Route exact path="/chat" element={<MyChatRoom />} />

          <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/new" element={<NewItem />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}



export default App;
