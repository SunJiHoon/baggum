// ChatRoom.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import NavBar from '../NavBar/NavBar';

const socket = io('http://localhost:5000');

const ChatRoom = ({ userId }) => {
  const [myId, setMyId] = useState(userId || ''); // 내 ID 상태 변수
  const [otherId, setOtherId] = useState(''); // 상대방의 ID 상태 변수
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
    try {
      const baseURL = process.env.REACT_APP_BASE_URL;

      const response = await axios.post(`${baseURL}/api/chat/create-room`);
      const roomId = response.data.roomId;
      
      // UserRoomMapping 테이블에 저장 요청
      await axios.post(`${baseURL}/api/chat/admin/setChatRoom`, {
        userId1: myId,
        userId2: otherId,
        roomName: roomId
      });

      navigate(`/chat/room/${roomId}`); // 리디렉션
    } catch (error) {
      console.error('Failed to create room:', error);
    }
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
      <NavBar />
      <div>
        <label>
          My ID:
          <input
            type="text"
            value={myId}
            onChange={(e) => setMyId(e.target.value)}
          />
        </label>
        <label>
          Other User ID:
          <input
            type="text"
            value={otherId}
            onChange={(e) => setOtherId(e.target.value)}
          />
        </label>
        <button onClick={createRoom}>Create Room</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter room ID"
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
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
