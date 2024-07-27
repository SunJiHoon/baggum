import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatRoom = ({ userId }) => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    // 컴포넌트 언마운트 시 socket.off('message') 호출
    return () => {
      socket.off('message');
    };
  }, []);

  const createRoom = async () => {
    const response = await axios.post('http://localhost:5000/api/chat/create-room');
    navigate(`/chat/room/${response.data.roomId}`); // 리디렉션
  };

  const handleJoinRoom = () => {
    if (inputRoomId.trim()) {
      navigate(`/chat/room/${inputRoomId}`);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { roomId: inputRoomId, message });
      setMessage('');
    }
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <input
        type="text"
        placeholder="Enter room ID"
        value={inputRoomId}
        onChange={(e) => setInputRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
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
  );
};

export default ChatRoom;