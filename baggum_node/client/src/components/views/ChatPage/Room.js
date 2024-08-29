import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import './Room.css';
import config from '../../../config/dev'; // config 파일 import
import { useAuth } from '../../contexts/AuthContext'; // 실제 경로로 수정

const socket = io('http://localhost:5000');
// const socket = io(`https://${config.baseUrl}`);
// const socket = io(`${config.baseUrl}`);

const Room = () => {
  const { roomId } = useParams(); // URL에서 roomId 추출
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const userName = 'User1'; // 임시 사용자 이름
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const { loading, user } = useAuth();
  // const { isAuthenticatedInChat, checkChatRoomAuth } = useChatAuth(); // ChatAuthContext에서 필요한 값과 함수 가져오기

  useEffect(() => {
    const authenticateUser = async () => {
      console.log("시작");
      try {
        const currentUserEmail = user.email;
        // const currentUserId = await axios.get(`${config.baseUrl}/api/users/getId`);
        const currentUserIdResponse = await axios.get(`${config.baseUrl}/api/users/getId`, {
          params: {
            email: currentUserEmail
          }
        });
        const currentUserId = currentUserIdResponse.data.userId;

        const response = await axios.get(`${config.baseUrl}/api/chat/auth/chat`, {
          params: { roomId, userId: currentUserId },
          withCredentials: true,
        });
        console.log(loading);
        console.log(response);

        if (!loading) {
          if (response.status === 200) {
            console.log("인증성공");
            socket.off('message');

            // 특정 방에 참가
            socket.emit('joinRoom', { roomId: roomId });

            // 메시지 수신
            socket.on('message', (message) => {
              setMessages((prevMessages) => [...prevMessages, message]);
            });
          } else {
            // console.log(isAuthenticatedInChat);
            console.log("인증실패");
            throw new Error('Unauthorized'); // 인증 실패 시 에러 발생
          }
        }
      } catch (error) {
        console.log(error);
        if (error.message === 'Unauthorized') {
          setError('You are not authorized to enter this chat room.');
        } else {
          setError('An unexpected error occurred.');
        }
        navigate('/');
      }
    };

    console.log(roomId);
    if (roomId && socket && user) {
      authenticateUser();
    }  
  }, [roomId, navigate, loading, user, socket]);

  // 메세지 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메세지 리스트의 맨 아래로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 시간을 문자열로 반환하는 함수
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (message.trim()) {
      const timestamp = formatTime(new Date());
      socket.emit('message', { roomId, message, userName, timestamp });
      setMessages([
        ...messages,
        { message, userName, timestamp, isOwnMessage: true },
      ]);
      setMessage('');
    }
  };

  // Enter 키를 눌렀을 때 메시지를 전송하는 함수
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <roomMain>
        <div className='chat-container'>
          {/* 채팅방 헤더 */}
          <div className='chat-header'>
            <span className='arrow-icon'></span>
            <span className='header-username'>{userName}</span>
          </div>
          {/* 채팅 메세지 */}
          <div className='chat-messages'>
            {messages.map((msg, index) => (
              // OwnMessage 판단 후 class 지정
              <div
                className={`${msg.isOwnMessage ? 'my-message-container' : 'your-message-container'}`}
                key={index}
              >
                {/* 상대방 채팅일 때 */}
                {!msg.isOwnMessage && (
                  <>
                    {/* 상대방 프로필 */}
                    <div className='chat-profile'>
                      {/* 임시 프로필 사진 */}
                      <img src='/profile.png' className='chat-profile-pic' />
                      <span className='chat-username'>{msg.userName}</span>
                    </div>
                    {/* 상대방 채팅 내용 및 시간 */}
                    <div className='chat-message'>{msg.message}</div>
                    <span className='chat-timestamp'>{msg.timestamp}</span>
                  </>
                )}
                {/* 내 채팅일 때 */}
                {msg.isOwnMessage && (
                  <>
                    {/* 내 채팅 내용 및 시간 */}
                    <span className='chat-timestamp'>{msg.timestamp}</span>
                    <div className='chat-message my-message'>{msg.message}</div>
                  </>
                )}
              </div>
            ))}
            {/* 채팅 스크롤 지점 확인 */}
            <div ref={messagesEndRef} /></div>
        </div>
        {/* 채팅 입력 컨테이너 */}
        <div className='sendMessage-container'>
          <span className='add-icon'></span>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </roomMain>
    </div>
  );
};

export default Room;
