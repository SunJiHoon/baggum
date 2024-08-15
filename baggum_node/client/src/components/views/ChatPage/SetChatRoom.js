// SetChatRoom.js
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config'; // config import

const SetChatRoom = () => {
  const [userId1, setUserId1] = useState('');
  const [userId2, setUserId2] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId1 || !userId2 || !roomId) {
      setMessage('All fields are required');
      return;
    }

    try {
      //const baseURL = process.env.REACT_APP_BASE_URL;

      //const response = await axios.post(`${baseURL}/admin/setChatRoom`, { userId1, userId2, roomId });
      const response = await axios.post(`${config.baseUrl}/admin/setChatRoom`, { userId1, userId2, roomId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to set chat room');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Set Chat Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID 1:</label>
          <input 
            type="text" 
            value={userId1} 
            onChange={(e) => setUserId1(e.target.value)} 
          />
        </div>
        <div>
          <label>User ID 2:</label>
          <input 
            type="text" 
            value={userId2} 
            onChange={(e) => setUserId2(e.target.value)} 
          />
        </div>
        <div>
          <label>Room ID:</label>
          <input 
            type="text" 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)} 
          />
        </div>
        <button type="submit">Set Chat Room</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetChatRoom;