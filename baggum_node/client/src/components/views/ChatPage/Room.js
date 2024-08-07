import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Room = () => {
  const { roomNum } = useParams(); // URL에서 roomId 추출
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const baseURL = process.env.REACT_APP_BASE_URL;

        const response = await axios.get(`${baseURL}/api/chat/auth/chat`, {
          params: { roomId: roomNum }
        });

        if (response.status === 200) {
          // 특정 방에 참가
          socket.emit('joinRoom', { roomId: roomNum });

          // 메시지 수신
          socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });
        }
      } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 400)) {
          setError('You are not authorized to enter this chat room.');
        } else {
          setError('An unexpected error occurred.');
        }
        navigate('/');
      }
    };

    authenticateUser();

    return () => {
      socket.off('message');
    };
  }, [roomNum, navigate]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { roomNum, message });
      setMessage('');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <div>
      <h2>Room ID: {roomNum}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
    // <div>
    //     hi
    // </div>
  );
};

export default Room;
