import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Room = () => {
  const { roomId } = useParams(); // URL에서 roomId 추출
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      // 특정 방에 참가
      socket.emit('joinRoom', { roomId });

      // 메시지 수신
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { roomId, message });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
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
