import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate로 변경
import axios from 'axios';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();  // useNavigate 훅 사용
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);

      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leaveRoom', roomId);
        socket.off('message');
      };
    }
  }, [roomId]);

  const sendMessage = () => {
    if (input && roomId) {
      socket.emit('message', { roomId, message: input });
      setInput('');
    }
  };

  const createRoom = async () => {
    const response = await axios.post('http://localhost:5000/api/chat/create-room');
    const newRoomId = response.data.roomId;
    navigate(`/chat/${newRoomId}`);  // navigate 훅 사용
  };

  return (
    <div>
      {roomId ? (
        <div>
          <div>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : (
        <button onClick={createRoom}>Create Room</button>
      )}
    </div>
  );
};

export default ChatPage;